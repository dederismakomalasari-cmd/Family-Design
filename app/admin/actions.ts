'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SIZES } from '@/lib/site'
import { slugify } from '@/lib/utils'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/** Pastikan yang memanggil adalah admin. (RLS di database juga menolak non-admin.) */
async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/admin')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  return supabase
}

const text = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim()
const link = (fd: FormData, key: string) => {
  const v = text(fd, key)
  return /^https?:\/\//i.test(v) ? v : null
}

export async function saveProduct(formData: FormData) {
  const supabase = await requireAdmin()

  const id = text(formData, 'id')
  const name = text(formData, 'name')
  if (!name) throw new Error('Nama produk wajib diisi.')

  const payload = {
    name,
    price: Math.max(0, parseInt(text(formData, 'price').replace(/\D/g, '') || '0', 10)),
    description: text(formData, 'description') || null,
    details: text(formData, 'details') || null,
    category_id: text(formData, 'category_id') || null,
    collection_id: text(formData, 'collection_id') || null,
    is_new: formData.get('is_new') === 'on',
    is_bestseller: formData.get('is_bestseller') === 'on',
    shopee_url: link(formData, 'shopee_url'),
    tokopedia_url: link(formData, 'tokopedia_url'),
    tiktok_url: link(formData, 'tiktok_url'),
  }

  // 1) Simpan data produk
  let productId = id
  if (id) {
    const { error } = await supabase.from('products').update(payload).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const base = slugify(name) || 'produk'
    let res = await supabase.from('products').insert({ ...payload, slug: base }).select('id').single()
    if (res.error?.code === '23505') {
      // slug sudah dipakai → tambahkan akhiran acak
      res = await supabase
        .from('products')
        .insert({ ...payload, slug: `${base}-${randomUUID().slice(0, 4)}` })
        .select('id')
        .single()
    }
    if (res.error) throw new Error(res.error.message)
    productId = res.data.id
  }

  // 2) Warna — satu per baris, format "Nama:#HEX"
  await supabase.from('product_colors').delete().eq('product_id', productId)
  const colors = text(formData, 'colors')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [n, h] = l.split(':').map((s) => s.trim())
      return { product_id: productId, name: n, hex: /^#[0-9a-f]{3,8}$/i.test(h ?? '') ? h : '#CCCCCC' }
    })
  if (colors.length) await supabase.from('product_colors').insert(colors)

  // 3) Ukuran — '' = tidak ada, 'in' = tersedia, 'out' = habis
  await supabase.from('product_sizes').delete().eq('product_id', productId)
  const sizes = SIZES.flatMap((s) => {
    const v = text(formData, `size_${s}`)
    return v ? [{ product_id: productId, size: s, in_stock: v === 'in' }] : []
  })
  if (sizes.length) await supabase.from('product_sizes').insert(sizes)

  // 4) Hapus foto yang dicentang
  const toDelete = formData.getAll('delete_image').map(String)
  if (toDelete.length) {
    const { data: imgs } = await supabase.from('product_images').select('id, path').in('id', toDelete)
    const paths = ((imgs ?? []) as { path: string }[]).map((i) => i.path).filter(Boolean)
    if (paths.length) await supabase.storage.from('products').remove(paths)
    await supabase.from('product_images').delete().in('id', toDelete)
  }

  // 5) Upload foto baru
  const files = formData
    .getAll('images')
    .filter((f): f is File => f instanceof File && f.size > 0 && f.type.startsWith('image/'))

  if (files.length) {
    const { data: last } = await supabase
      .from('product_images')
      .select('position')
      .eq('product_id', productId)
      .order('position', { ascending: false })
      .limit(1)
    let position = ((last?.[0]?.position as number | undefined) ?? -1) + 1

    for (const file of files) {
      if (file.size > MAX_IMAGE_BYTES) throw new Error(`Foto "${file.name}" lebih dari 5 MB.`)

      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${productId}/${randomUUID()}.${ext}`

      const { error: upErr } = await supabase.storage
        .from('products')
        .upload(path, file, { contentType: file.type, upsert: false })
      if (upErr) throw new Error(upErr.message)

      const { data: pub } = supabase.storage.from('products').getPublicUrl(path)
      await supabase
        .from('product_images')
        .insert({ product_id: productId, url: pub.publicUrl, path, position: position++ })
    }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function deleteProduct(formData: FormData) {
  const supabase = await requireAdmin()
  const id = text(formData, 'id')
  if (!id) return

  const { data: imgs } = await supabase.from('product_images').select('path').eq('product_id', id)
  const paths = ((imgs ?? []) as { path: string }[]).map((i) => i.path).filter(Boolean)
  if (paths.length) await supabase.storage.from('products').remove(paths)

  await supabase.from('products').delete().eq('id', id)

  revalidatePath('/', 'layout')
  redirect('/admin')
}

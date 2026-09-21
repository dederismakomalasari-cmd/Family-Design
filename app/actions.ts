'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function subscribeNewsletter(
  _prev: { message: string },
  formData: FormData
): Promise<{ message: string }> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!/^\S+@\S+\.\S+$/.test(email)) return { message: 'Format email belum benar.' }

  const supabase = await createClient()
  const { error } = await supabase.from('newsletter_subscribers').insert({ email })

  // 23505 = email sudah terdaftar → anggap berhasil
  if (error && error.code !== '23505') return { message: 'Gagal berlangganan. Coba lagi nanti.' }
  return { message: 'Terima kasih, Anda sudah berlangganan.' }
}

export async function toggleWishlist(productId: string, path: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=${encodeURIComponent(path)}`)

  const { data: existing } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (existing) {
    await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', productId)
  } else {
    await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId })
  }
}

import Image from 'next/image'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import { createClient } from '@/lib/supabase/server'
import { deleteProduct } from './actions'
import { firstImage, formatRupiah } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, product_images(id, url, position), categories(name, slug)')
    .order('created_at', { ascending: false })

  const products = (data ?? []) as Product[]

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl">Belum ada produk</p>
        <p className="mt-2 text-sm text-muted">Tambahkan produk pertama Anda beserta foto dan link marketplace.</p>
        <Link href="/admin/products/new" className="btn-solid mt-6">Tambah produk</Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-line text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          <tr>
            <th className="py-3 pr-4">Produk</th>
            <th className="py-3 pr-4">Kategori</th>
            <th className="py-3 pr-4">Harga</th>
            <th className="py-3 pr-4">Link</th>
            <th className="py-3 pr-4">Klik</th>
            <th className="py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const img = firstImage(p)
            const linkCount = [p.shopee_url, p.tokopedia_url, p.tiktok_url].filter(Boolean).length
            return (
              <tr key={p.id} className="border-b border-line/70">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-sand">
                      {img && <Image src={img} alt="" fill sizes="48px" className="object-cover" />}
                    </div>
                    <div>
                      <Link href={`/product/${p.slug}`} className="font-serif text-base hover:underline">
                        {p.name}
                      </Link>
                      <div className="mt-1 flex gap-2 text-[10px] uppercase tracking-wider text-gold">
                        {p.is_new && <span>New</span>}
                        {p.is_bestseller && <span>Bestseller</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-muted">{p.categories?.name ?? '—'}</td>
                <td className="py-3 pr-4">{formatRupiah(p.price)}</td>
                <td className="py-3 pr-4 text-muted">{linkCount}/3</td>
                <td className="py-3 pr-4 text-muted">{p.click_count}</td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-5">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-xs underline underline-offset-4">
                      Ubah
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

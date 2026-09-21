import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'

export const metadata: Metadata = { title: 'Wishlist' }

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/wishlist')

  const { data } = await supabase
    .from('wishlists')
    .select('created_at, products(*, product_images(id, url, position))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const products = ((data ?? []) as unknown as { products: Product | null }[])
    .map((r) => r.products)
    .filter((p): p is Product => Boolean(p))

  return (
    <section className="container-page py-12 md:py-16">
      <h1 className="font-serif text-5xl md:text-6xl">WISHLIST</h1>

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-2xl">Wishlist Anda masih kosong</p>
          <p className="mt-2 text-sm text-muted">Tekan ikon hati pada produk untuk menyimpannya di sini.</p>
          <Link href="/shop" className="btn mt-6">
            Lihat koleksi
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} wishlisted />
          ))}
        </div>
      )}
    </section>
  )
}

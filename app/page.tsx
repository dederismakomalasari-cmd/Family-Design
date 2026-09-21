import Link from 'next/link'
import CollectionGrid from '@/components/CollectionGrid'
import ProductCard from '@/components/ProductCard'
import ShopYourWay from '@/components/ShopYourWay'
import { createClient } from '@/lib/supabase/server'
import { getCollectionsWithCover, getWishlistIds } from '@/lib/data'
import type { Product } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()

  const [collections, wishlist, { data }] = await Promise.all([
    getCollectionsWithCover(),
    getWishlistIds(),
    supabase
      .from('products')
      .select('*, product_images(id, url, position)')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(4),
  ])
  const newArrivals = (data ?? []) as Product[]

  return (
    <>
      {/* Hero — letakkan foto di public/images/hero.jpg */}
      <section className="container-page pt-6">
        <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden bg-sand bg-[url('/images/hero.jpg')] bg-cover bg-center md:min-h-[600px]">
          <div className="absolute inset-0 bg-black/25" />
          <div className="relative px-6 text-center text-white">
            <h1 className="mx-auto max-w-2xl font-serif text-4xl leading-tight md:text-6xl">
              Elegance for Every Special Moment
            </h1>
            <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-white/90 md:text-sm">
              Discover our curated collection of beautiful dresses designed to make your most cherished
              occasions unforgettable.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="inline-flex items-center border border-black bg-black px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black">
                Shop Collection
              </Link>
              <Link href="/about" className="inline-flex items-center border border-white/80 px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black">
                Explore Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      {collections.length > 0 && (
        <section className="container-page pt-20">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl">Curated Collections</h2>
            <div className="mx-auto mt-3 h-px w-12 bg-ink/60" />
          </div>
          <CollectionGrid collections={collections} />
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container-page pt-20">
          <div className="mb-8 flex items-end justify-between border-b border-line pb-4">
            <h2 className="font-serif text-3xl">New Arrivals</h2>
            <Link href="/shop?sort=newest" className="border-b border-gold text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} wishlisted={wishlist.has(p.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Cerita brand — letakkan foto di public/images/story.jpg */}
      <section className="container-page grid items-center gap-10 pt-24 md:grid-cols-2 md:gap-16">
        <div className="aspect-[4/3] bg-sand bg-[url('/images/story.jpg')] bg-cover bg-center" role="img" aria-label="Penjahit menyulam detail gaun" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Crafted for your special moments
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-snug md:text-4xl">
            Gaun-gaun indah untuk acara-acara khusus.
          </h2>
          <p className="mt-5 text-sm leading-7 text-ink/80">
            Di Family Design, kami percaya bahwa setiap momen istimewa layak dirayakan dengan keanggunan yang tak
            lekang oleh waktu. Koleksi kami dirancang dengan penuh dedikasi, memadukan keahlian tangan yang presisi
            dengan material berkualitas tinggi.
          </p>
          <p className="mt-4 text-sm leading-7 text-ink/80">
            Dari desain minimalis yang elegan hingga gaun pesta yang memukau, setiap jahitan menceritakan kisah
            tentang keindahan dan kepercayaan diri. Kami hadir untuk melengkapi penampilan Anda di hari-hari yang
            paling berarti.
          </p>
          <Link href="/about" className="btn mt-8">
            Read our full story
          </Link>
        </div>
      </section>

      <ShopYourWay />
    </>
  )
}

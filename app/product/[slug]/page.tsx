import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Accordion from '@/components/Accordion'
import ProductCard from '@/components/ProductCard'
import ProductGallery from '@/components/ProductGallery'
import VariantPicker from '@/components/VariantPicker'
import WishlistButton from '@/components/WishlistButton'
import { createClient } from '@/lib/supabase/server'
import { getWishlistIds } from '@/lib/data'
import { DEFAULT_DELIVERY, PLATFORMS, SIZES } from '@/lib/site'
import { firstImage, formatRupiah, sortedImages } from '@/lib/utils'
import type { Product } from '@/lib/types'

type Params = { params: Promise<{ slug: string }> }

const SELECT =
  '*, product_images(id, url, position), product_colors(id, name, hex), product_sizes(id, size, in_stock), categories(name, slug)'

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select(SELECT).eq('slug', slug).maybeSingle()
  const p = data as Product | null
  if (!p) return { title: 'Produk tidak ditemukan' }

  const image = firstImage(p)
  return {
    title: p.name,
    description: p.description ?? `${p.name} — ${formatRupiah(p.price)}`,
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase.from('products').select(SELECT).eq('slug', slug).maybeSingle()
  const product = data as Product | null
  if (!product) notFound()

  const wishlist = await getWishlistIds()

  // Produk terkait: kategori yang sama
  let related: Product[] = []
  if (product.category_id) {
    const { data: rel } = await supabase
      .from('products')
      .select('*, product_images(id, url, position)')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(4)
    related = (rel ?? []) as Product[]
  }

  const images = sortedImages(product)
  const sizes = [...(product.product_sizes ?? [])].sort(
    (a, b) => SIZES.indexOf(a.size as (typeof SIZES)[number]) - SIZES.indexOf(b.size as (typeof SIZES)[number])
  )
  const colors = product.product_colors ?? []
  const links = PLATFORMS.filter((p) => product[`${p.key}_url` as const])

  return (
    <section className="container-page py-8 md:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        {product.categories && (
          <>
            <span className="mx-2">›</span>
            <Link href={`/shop?category=${product.categories.slug}`} className="hover:text-ink">
              {product.categories.name}
            </Link>
          </>
        )}
        <span className="mx-2">›</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <ProductGallery images={images} name={product.name} />

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl">{product.name}</h1>
              <p className="mt-2 text-sm text-muted">{formatRupiah(product.price)}</p>
            </div>
            <WishlistButton productId={product.id} initial={wishlist.has(product.id)} className="border border-line" />
          </div>

          {product.description && (
            <p className="mt-5 text-sm leading-7 text-ink/80">{product.description}</p>
          )}

          <div className="mt-8 border-t border-line pt-8">
            <VariantPicker colors={colors} sizes={sizes} />
          </div>

          {/* Pilihan marketplace */}
          <div className="mt-8 bg-sand p-6">
            <p className="label mb-4 text-center">Where would you like to shop?</p>
            {links.length > 0 ? (
              <div className="space-y-3">
                {links.map((p) => (
                  <a
                    key={p.key}
                    href={`/out/${product.id}/${p.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full !border-ink/70 bg-cream"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted">
                Produk ini belum tersedia di marketplace. Hubungi kami lewat WhatsApp untuk info pemesanan.
              </p>
            )}
          </div>

          <div className="mt-8">
            <Accordion title="Details">{product.details ?? 'Detail produk belum ditambahkan.'}</Accordion>
            <Accordion title="Delivery & Returns">{DEFAULT_DELIVERY}</Accordion>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="mb-8 border-b border-line pb-4 font-serif text-2xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} wishlisted={wishlist.has(p.id)} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import WishlistButton from '@/components/WishlistButton'
import { firstImage, formatRupiah } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function ProductCard({
  product,
  wishlisted = false,
}: {
  product: Product
  wishlisted?: boolean
}) {
  const img = firstImage(product)

  return (
    <article className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-sand">
          {img && (
            <Image
              src={img}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
          {(product.is_new || product.is_bestseller) && (
            <span className="absolute left-3 top-3 border border-line bg-cream/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]">
              {product.is_new ? 'New Arrival' : 'Bestseller'}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-center font-serif text-[15px]">{product.name}</h3>
        <p className="mt-0.5 text-center text-xs text-muted">{formatRupiah(product.price)}</p>
      </Link>

      <WishlistButton productId={product.id} initial={wishlisted} className="absolute right-2 top-2" />
    </article>
  )
}

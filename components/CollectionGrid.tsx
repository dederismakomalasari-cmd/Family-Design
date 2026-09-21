import Image from 'next/image'
import Link from 'next/link'
import type { CollectionWithCover } from '@/lib/data'

export default function CollectionGrid({ collections }: { collections: CollectionWithCover[] }) {
  if (collections.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {collections.map((c) => (
        <Link
          key={c.id}
          href={`/shop?collection=${c.slug}`}
          className="group relative block aspect-[4/5] overflow-hidden bg-sand"
        >
          {c.cover && (
            <Image
              src={c.cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-16">
            <span className="font-serif text-lg text-white">{c.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

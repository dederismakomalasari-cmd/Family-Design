'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function ProductGallery({
  images,
  name,
}: {
  images: { url: string }[]
  name: string
}) {
  const [index, setIndex] = useState(0)

  if (images.length === 0) return <div className="aspect-[3/4] bg-sand" />

  return (
    <div className="flex gap-3">
      {images.length > 1 && (
        <div className="flex w-16 shrink-0 flex-col gap-3 sm:w-20">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Lihat foto ${i + 1}`}
              className={cn(
                'relative aspect-[3/4] overflow-hidden border transition-opacity',
                i === index ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-sand">
        <Image
          src={images[index].url}
          alt={`${name} — foto ${index + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 80vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}

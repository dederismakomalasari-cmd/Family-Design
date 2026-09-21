'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ProductColor, ProductSize } from '@/lib/types'

/**
 * Pilihan warna & ukuran bersifat informasi saja — link Shopee/Tokopedia/TikTok Shop
 * berlaku per produk, jadi pembeli memilih varian lagi di marketplace.
 */
export default function VariantPicker({
  colors,
  sizes,
}: {
  colors: ProductColor[]
  sizes: ProductSize[]
}) {
  const [color, setColor] = useState(colors[0]?.name ?? '')
  const [size, setSize] = useState(sizes.find((s) => s.in_stock)?.size ?? '')

  return (
    <div className="space-y-7">
      {colors.length > 0 && (
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label">Color</span>
            <span className="text-xs text-muted">{color}</span>
          </div>
          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                aria-label={c.name}
                aria-pressed={c.name === color}
                title={c.name}
                className={cn(
                  'h-8 w-8 rounded-full border border-black/10 ring-offset-2 ring-offset-cream',
                  c.name === color && 'ring-1 ring-ink'
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label">Size</span>
            <Link href="/info/size-guide" className="border-b border-gold text-[10px] uppercase tracking-widest text-gold">
              Size Guide
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s.size}
                type="button"
                disabled={!s.in_stock}
                onClick={() => setSize(s.size)}
                aria-pressed={s.size === size}
                className={cn(
                  'h-10 min-w-12 border px-3 text-xs transition-colors',
                  s.size === size ? 'border-ink bg-sand' : 'border-line hover:border-ink',
                  !s.in_stock && 'cursor-not-allowed text-muted/50 line-through hover:border-line'
                )}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

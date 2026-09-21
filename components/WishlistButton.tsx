'use client'

import { useState, useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { Heart } from 'lucide-react'
import { toggleWishlist } from '@/app/actions'
import { cn } from '@/lib/utils'

export default function WishlistButton({
  productId,
  initial,
  className,
}: {
  productId: string
  initial: boolean
  className?: string
}) {
  const [active, setActive] = useState(initial)
  const [pending, startTransition] = useTransition()
  const pathname = usePathname()

  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={active}
      aria-label={active ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
      onClick={() => {
        setActive((a) => !a)
        startTransition(async () => {
          await toggleWishlist(productId, pathname)
        })
      }}
      className={cn('flex h-9 w-9 items-center justify-center bg-cream/90 hover:bg-cream', className)}
    >
      <Heart size={16} className={active ? 'fill-ink' : ''} />
    </button>
  )
}

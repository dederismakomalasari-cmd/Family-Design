import { createClient } from '@/lib/supabase/server'
import type { Collection } from '@/lib/types'

/** User yang sedang login + apakah dia admin */
export async function getSessionInfo() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    isAdmin = data?.role === 'admin'
  }
  return { supabase, user, isAdmin }
}

/** Kumpulan id produk yang ada di wishlist user (kosong jika belum login) */
export async function getWishlistIds(): Promise<Set<string>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Set<string>()

  const { data } = await supabase.from('wishlists').select('product_id').eq('user_id', user.id)
  return new Set(((data ?? []) as { product_id: string }[]).map((r) => r.product_id))
}

export type CollectionWithCover = Collection & { cover: string | null }

/** Koleksi + foto sampul (image_url, atau foto produk pertama di koleksi itu) */
export async function getCollectionsWithCover(): Promise<CollectionWithCover[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collections')
    .select('id, name, slug, image_url, products(product_images(url, position))')
    .order('sort_order')

  type Row = Collection & {
    products?: { product_images?: { url: string; position: number }[] }[]
  }

  return ((data ?? []) as Row[]).map((c) => {
    const firstProductImage = (c.products ?? [])
      .flatMap((p) => p.product_images ?? [])
      .sort((a, b) => a.position - b.position)[0]?.url
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      image_url: c.image_url,
      cover: c.image_url ?? firstProductImage ?? null,
    }
  })
}

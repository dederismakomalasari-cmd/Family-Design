import Link from 'next/link'
import type { Metadata } from 'next'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { getWishlistIds } from '@/lib/data'
import { SIZES } from '@/lib/site'
import { cn, shopUrl } from '@/lib/utils'
import type { Category, Product } from '@/lib/types'

export const metadata: Metadata = { title: 'Shop' }

type SP = {
  category?: string
  collection?: string
  size?: string
  color?: string
  sort?: string
  q?: string
}

const SORTS = [
  { key: 'newest', label: 'Newest' },
  { key: 'price', label: 'Price' },
  { key: 'popular', label: 'Popular' },
]

export default async function ShopPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const sort = SORTS.some((s) => s.key === sp.sort) ? sp.sort! : 'newest'
  const supabase = await createClient()

  // Gunakan !inner hanya bila filternya aktif, supaya produk tanpa relasi tetap tampil
  const select = [
    '*',
    'product_images(id, url, position)',
    sp.category ? 'categories!inner(name, slug)' : 'categories(name, slug)',
    sp.collection ? 'collections!inner(name, slug)' : 'collections(name, slug)',
    sp.size ? 'product_sizes!inner(size, in_stock)' : 'product_sizes(size, in_stock)',
    sp.color ? 'product_colors!inner(name, hex)' : 'product_colors(name, hex)',
  ].join(', ')

  let query = supabase.from('products').select(select)
  if (sp.category) query = query.eq('categories.slug', sp.category)
  if (sp.collection) query = query.eq('collections.slug', sp.collection)
  if (sp.size) query = query.eq('product_sizes.size', sp.size).eq('product_sizes.in_stock', true)
  if (sp.color) query = query.eq('product_colors.name', sp.color)
  if (sp.q) query = query.ilike('name', `%${sp.q.replace(/[%_,()]/g, ' ')}%`)

  if (sort === 'price') query = query.order('price', { ascending: true })
  else if (sort === 'popular') query = query.order('click_count', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const [{ data }, { data: cats }, { data: colorRows }, wishlist] = await Promise.all([
    query,
    supabase.from('categories').select('id, name, slug').order('sort_order'),
    supabase.from('product_colors').select('name, hex'),
    getWishlistIds(),
  ])

  const products = (data ?? []) as unknown as Product[]
  const categories = (cats ?? []) as Category[]
  const colors = [
    ...new Map(((colorRows ?? []) as { name: string; hex: string }[]).map((c) => [c.name, c])).values(),
  ]

  const current = {
    category: sp.category,
    collection: sp.collection,
    size: sp.size,
    color: sp.color,
    sort: sp.sort,
    q: sp.q,
  }
  const hasFilter = Boolean(sp.category || sp.collection || sp.size || sp.color || sp.q)
  const activeCollection = products[0]?.collections?.name

  return (
    <section className="container-page py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl md:text-6xl">SHOP</h1>
          <p className="mt-2 text-xs text-muted">Beautiful dresses for special occasions</p>
        </div>

        <div className="flex items-center gap-5 text-[11px]">
          <span className="label text-muted">Sort by</span>
          {SORTS.map((s) => (
            <Link
              key={s.key}
              href={shopUrl(current, { sort: s.key })}
              className={cn(
                'pb-0.5 text-muted hover:text-ink',
                sort === s.key && 'border-b border-ink text-ink'
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Filter aktif */}
      {hasFilter && (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          {sp.q && <span className="border border-line px-3 py-1">Pencarian: “{sp.q}”</span>}
          {sp.collection && <span className="border border-line px-3 py-1">Koleksi: {activeCollection ?? sp.collection}</span>}
          <Link href="/shop" className="underline underline-offset-4">
            Reset filter
          </Link>
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-14">
        {/* Sidebar filter */}
        <aside className="space-y-8">
          <div>
            <h2 className="label mb-4">Category</h2>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href={shopUrl(current, { category: undefined })}
                  className={cn(!sp.category ? 'font-semibold' : 'text-muted hover:text-ink')}
                >
                  All Dresses
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={shopUrl(current, { category: sp.category === c.slug ? undefined : c.slug })}
                    className={cn(sp.category === c.slug ? 'font-semibold' : 'text-muted hover:text-ink')}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label mb-4">Size</h2>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <Link
                  key={s}
                  href={shopUrl(current, { size: sp.size === s ? undefined : s })}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center border text-[11px]',
                    sp.size === s ? 'border-ink bg-sand' : 'border-line hover:border-ink'
                  )}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {colors.length > 0 && (
            <div>
              <h2 className="label mb-4">Color</h2>
              <ul className="space-y-2.5 text-xs">
                {colors.map((c) => (
                  <li key={c.name}>
                    <Link
                      href={shopUrl(current, { color: sp.color === c.name ? undefined : c.name })}
                      className={cn(
                        'flex items-center gap-3',
                        sp.color === c.name ? 'font-semibold' : 'text-muted hover:text-ink'
                      )}
                    >
                      <span
                        className={cn(
                          'h-3.5 w-3.5 rounded-full border border-black/10',
                          sp.color === c.name && 'ring-1 ring-ink ring-offset-2 ring-offset-cream'
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Grid produk */}
        <div>
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl">Belum ada produk yang cocok</p>
              <p className="mt-2 text-sm text-muted">Coba ubah atau hapus sebagian filter.</p>
              <Link href="/shop" className="btn mt-6">
                Reset filter
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} wishlisted={wishlist.has(p.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

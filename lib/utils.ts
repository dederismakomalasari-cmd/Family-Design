import type { Product } from '@/lib/types'

export function formatRupiah(n: number) {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(n)
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/** Foto utama produk = foto dengan position terkecil */
export function sortedImages(p: Product) {
  return [...(p.product_images ?? [])].sort((a, b) => a.position - b.position)
}
export function firstImage(p: Product): string | null {
  return sortedImages(p)[0]?.url ?? null
}

/** Bangun URL /shop?... dengan menggabungkan parameter saat ini + perubahan */
export function shopUrl(
  current: Record<string, string | undefined>,
  patch: Record<string, string | undefined> = {}
) {
  const params = new URLSearchParams()
  const merged = { ...current, ...patch }
  for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v)
  const qs = params.toString()
  return qs ? `/shop?${qs}` : '/shop'
}

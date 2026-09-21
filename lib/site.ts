export const site = {
  name: 'Family Design',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.familydesign.com',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? '6282174052214',
  whatsappLabel: '+62 821 7405 2214',
  shopee: process.env.NEXT_PUBLIC_SHOPEE_STORE_URL ?? '#',
  tokopedia: process.env.NEXT_PUBLIC_TOKOPEDIA_STORE_URL ?? '#',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_STORE_URL ?? '#',
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const

export const PLATFORMS = [
  { key: 'shopee', label: 'Shopee' },
  { key: 'tokopedia', label: 'Tokopedia' },
  { key: 'tiktok', label: 'TikTok Shop' },
] as const

export const DEFAULT_DELIVERY =
  'Pesanan diproses melalui marketplace pilihan Anda (Shopee, Tokopedia, atau TikTok Shop), ' +
  'sehingga pengiriman, pembayaran, dan pengembalian mengikuti kebijakan masing-masing platform.\n\n' +
  'Ada pertanyaan soal ukuran atau pesanan khusus? Hubungi kami lewat WhatsApp.'

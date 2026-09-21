import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Isi halaman informasi. Ganti teks placeholder dengan kebijakan toko Anda.
const PAGES: Record<string, { title: string; body: string[] }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    body: [
      'Kami hanya menyimpan data yang diperlukan, yaitu email dan kata sandi (terenkripsi) untuk akun, serta email untuk newsletter.',
      'Data Anda tidak dijual atau dibagikan kepada pihak ketiga.',
    ],
  },
  'terms-of-service': {
    title: 'Terms of Service',
    body: [
      'Dengan menggunakan website ini Anda menyetujui ketentuan penggunaan Family Design.',
      'Pembelian dilakukan melalui marketplace (Shopee, Tokopedia, TikTok Shop) dan tunduk pada ketentuan masing-masing platform.',
    ],
  },
  'shipping-returns': {
    title: 'Shipping & Returns',
    body: [
      'Pengiriman dan pengembalian barang mengikuti kebijakan marketplace tempat Anda berbelanja.',
      'Untuk pertanyaan lebih lanjut, hubungi kami melalui WhatsApp.',
    ],
  },
  wholesale: {
    title: 'Wholesale',
    body: ['Tertarik menjadi reseller atau membeli dalam jumlah besar? Hubungi kami melalui WhatsApp untuk daftar harga grosir.'],
  },
  'size-guide': {
    title: 'Size Guide',
    body: ['Tambahkan tabel ukuran (lingkar dada, pinggang, panjang) di sini.'],
  },
}

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: PAGES[slug]?.title ?? 'Informasi' }
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = PAGES[slug]
  if (!page) notFound()

  return (
    <section className="container-page mx-auto max-w-2xl py-16">
      <h1 className="font-serif text-4xl md:text-5xl">{page.title}</h1>
      <div className="mt-8 space-y-5 text-sm leading-7 text-ink/80">
        {page.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}

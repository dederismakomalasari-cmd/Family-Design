import type { Metadata } from 'next'
import { MessageCircle } from 'lucide-react'
import ShopYourWay from '@/components/ShopYourWay'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <>
      <section className="container-page pt-14 text-center md:pt-20">
        <h1 className="font-serif text-5xl md:text-6xl">CONTACT</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted">
          Ada pertanyaan soal ukuran, bahan, atau pesanan khusus? Kami senang membantu.
        </p>
        <a
          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Halo Family Design, saya ingin bertanya tentang produk.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-solid mt-8 gap-2"
        >
          <MessageCircle size={14} />
          Chat WhatsApp {site.whatsappLabel}
        </a>
      </section>
      <ShopYourWay />
    </>
  )
}

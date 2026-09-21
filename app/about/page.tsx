import type { Metadata } from 'next'
import ShopYourWay from '@/components/ShopYourWay'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <>
      <section className="container-page pt-14 text-center md:pt-20">
        <h1 className="mx-auto max-w-3xl font-serif text-4xl uppercase leading-tight md:text-6xl">
          The story behind Family Design
        </h1>
      </section>

      {/* Letakkan foto di public/images/about.jpg */}
      <section className="container-page mt-12">
        <div
          className="aspect-[16/8] bg-sand bg-[url('/images/about.jpg')] bg-cover bg-center"
          role="img"
          aria-label="Model mengenakan gaun hijau zamrud"
        />
      </section>

      <section className="container-page mx-auto mt-14 max-w-2xl space-y-5 text-sm leading-7 text-ink/80">
        {/* Ganti dengan cerita asli Family Design */}
        <p>
          Di Family Design, kami percaya bahwa setiap momen istimewa layak dirayakan dengan keanggunan yang tak
          lekang oleh waktu. Koleksi kami dirancang dengan penuh dedikasi, memadukan keahlian tangan yang presisi
          dengan material berkualitas tinggi.
        </p>
        <p>
          Dari desain minimalis yang elegan hingga gaun pesta yang memukau, setiap jahitan menceritakan kisah
          tentang keindahan dan kepercayaan diri. Kami hadir untuk melengkapi penampilan Anda di hari-hari yang
          paling berarti.
        </p>
      </section>

      <ShopYourWay />
    </>
  )
}

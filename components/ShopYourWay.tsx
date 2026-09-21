import { ShoppingCart, Store, PlayCircle, MessageCircle } from 'lucide-react'
import { site } from '@/lib/site'

const channels = [
  { label: 'Shopee', href: site.shopee, Icon: ShoppingCart },
  { label: 'Tokopedia', href: site.tokopedia, Icon: Store },
  { label: 'TikTok Shop', href: site.tiktok, Icon: PlayCircle },
]

export default function ShopYourWay() {
  return (
    <section className="container-page py-20 text-center">
      <h2 className="font-serif text-3xl">Shop Your Way</h2>
      <p className="mx-auto mt-3 max-w-md text-xs text-muted">
        Temukan koleksi kami di platform favorit Anda atau hubungi kami langsung.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {channels.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-line bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] hover:border-ink"
          >
            <Icon size={14} />
            {label}
          </a>
        ))}
      </div>

      <a
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 text-xs"
      >
        <MessageCircle size={14} className="text-gold" />
        WA {site.whatsappLabel}
      </a>
      <p className="mt-2 text-xs text-muted">{site.url.replace(/^https?:\/\//, '')}</p>
    </section>
  )
}

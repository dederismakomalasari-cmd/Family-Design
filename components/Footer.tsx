import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'
import { site } from '@/lib/site'

const shopLinks = [
  { label: 'Dresses', href: '/shop?category=dresses' },
  { label: 'Modest Wear', href: '/shop?collection=muslim-modest-wear' },
  { label: 'Formal Wear', href: '/shop?collection=formal-wear' },
  { label: 'Accessories', href: '/shop?category=accessories' },
]
const infoLinks = [
  { label: 'Privacy Policy', href: '/info/privacy-policy' },
  { label: 'Terms of Service', href: '/info/terms-of-service' },
  { label: 'Shipping & Returns', href: '/info/shipping-returns' },
  { label: 'Wholesale', href: '/info/wholesale' },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
        <div>
          <p className="font-serif text-lg tracking-[0.12em]">{site.name}</p>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            © {new Date().getFullYear()} {site.name}.
            <br />
            All rights reserved.
          </p>
        </div>

        <div>
          <h3 className="label mb-4">Shop</h3>
          <ul className="space-y-2.5 text-[11px] text-muted">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-ink">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label mb-4">Information</h3>
          <ul className="space-y-2.5 text-[11px] text-muted">
            {infoLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-ink">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label mb-4">Newsletter</h3>
          <p className="mb-4 text-[11px] leading-relaxed text-muted">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </footer>
  )
}

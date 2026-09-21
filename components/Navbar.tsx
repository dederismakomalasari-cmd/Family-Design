import Link from 'next/link'
import { Search, Heart, MessageCircle, Menu } from 'lucide-react'
import { getSessionInfo } from '@/lib/data'
import { site } from '@/lib/site'
import { logout } from '@/app/login/actions'

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default async function Navbar() {
  const { user, isAdmin } = await getSessionInfo()

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/95 backdrop-blur">
      <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        {/* Kiri: menu */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Menu utama">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[11px] tracking-wide text-ink/80 hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <details className="relative md:hidden">
          <summary className="flex h-9 w-9 cursor-pointer list-none items-center" aria-label="Buka menu">
            <Menu size={20} />
          </summary>
          <div className="absolute left-0 top-11 flex w-52 flex-col gap-4 border border-line bg-cream p-5 shadow-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm">
                {l.label}
              </Link>
            ))}
          </div>
        </details>

        {/* Tengah: logo */}
        <Link href="/" className="font-serif text-xl tracking-[0.14em] md:text-2xl">
          Family Design
        </Link>

        {/* Kanan: ikon */}
        <div className="flex items-center justify-end gap-4">
          <details className="relative">
            <summary className="flex h-9 w-6 cursor-pointer list-none items-center" aria-label="Cari produk">
              <Search size={17} />
            </summary>
            <form
              action="/shop"
              className="absolute right-0 top-11 w-64 border border-line bg-cream p-2 shadow-sm"
            >
              <input
                name="q"
                type="search"
                placeholder="Cari produk…"
                aria-label="Cari produk"
                className="w-full bg-transparent px-2 py-1.5 text-sm outline-none"
              />
            </form>
          </details>

          <Link href="/wishlist" aria-label="Wishlist" className="flex h-9 w-6 items-center">
            <Heart size={17} />
          </Link>

          {/* Pengganti ikon keranjang: pembelian dilakukan di marketplace, jadi diarahkan ke WhatsApp */}
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat WhatsApp"
            className="flex h-9 w-6 items-center"
          >
            <MessageCircle size={17} />
          </a>

          {isAdmin && (
            <Link href="/admin" className="hidden text-[11px] underline underline-offset-4 md:block">
              Admin
            </Link>
          )}
          {user ? (
            <form action={logout} className="hidden md:block">
              <button type="submit" className="text-[11px] text-ink/80 hover:text-ink">
                Keluar
              </button>
            </form>
          ) : (
            <Link href="/login" className="hidden text-[11px] text-ink/80 hover:text-ink md:block">
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

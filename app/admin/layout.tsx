import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionInfo } from '@/lib/data'

export const metadata = { title: 'Admin' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getSessionInfo()

  if (!user) redirect('/login?next=/admin')
  if (!isAdmin) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="font-serif text-4xl">Akses ditolak</h1>
        <p className="mt-3 text-sm text-muted">Akun ini bukan admin.</p>
        <Link href="/" className="btn mt-8">Kembali ke beranda</Link>
      </section>
    )
  }

  return (
    <section className="container-page py-10">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <h1 className="font-serif text-3xl">Admin</h1>
        <nav className="flex items-center gap-6 text-xs">
          <Link href="/admin" className="hover:underline">Semua produk</Link>
          <Link href="/admin/products/new" className="btn-solid !px-4 !py-2">Tambah produk</Link>
        </nav>
      </div>
      {children}
    </section>
  )
}

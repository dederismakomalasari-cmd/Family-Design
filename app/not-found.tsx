import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-page py-32 text-center">
      <h1 className="font-serif text-5xl">Halaman tidak ditemukan</h1>
      <p className="mt-4 text-sm text-muted">Halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
      <Link href="/shop" className="btn mt-8">
        Lihat koleksi
      </Link>
    </section>
  )
}

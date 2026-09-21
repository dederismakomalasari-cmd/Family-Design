import type { Metadata } from 'next'
import CollectionGrid from '@/components/CollectionGrid'
import { getCollectionsWithCover } from '@/lib/data'

export const metadata: Metadata = { title: 'Collections' }

export default async function CollectionsPage() {
  const collections = await getCollectionsWithCover()

  return (
    <section className="container-page py-12 md:py-16">
      <h1 className="font-serif text-5xl md:text-6xl">COLLECTIONS</h1>
      <p className="mt-2 mb-10 text-xs text-muted">Koleksi pilihan untuk setiap acara</p>
      <CollectionGrid collections={collections} />
    </section>
  )
}

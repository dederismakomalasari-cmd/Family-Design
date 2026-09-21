import ProductForm from '@/components/ProductForm'
import { createClient } from '@/lib/supabase/server'
import type { Category, Collection } from '@/lib/types'

export default async function NewProductPage() {
  const supabase = await createClient()
  const [{ data: cats }, { data: cols }] = await Promise.all([
    supabase.from('categories').select('id, name, slug').order('sort_order'),
    supabase.from('collections').select('id, name, slug, image_url').order('sort_order'),
  ])

  return (
    <>
      <h2 className="mb-8 text-center font-serif text-2xl">Tambah produk</h2>
      <ProductForm categories={(cats ?? []) as Category[]} collections={(cols ?? []) as Collection[]} />
    </>
  )
}

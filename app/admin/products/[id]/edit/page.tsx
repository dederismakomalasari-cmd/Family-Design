import { notFound } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import { createClient } from '@/lib/supabase/server'
import type { Category, Collection, Product } from '@/lib/types'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data }, { data: cats }, { data: cols }] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_images(id, url, path, position), product_colors(id, name, hex), product_sizes(id, size, in_stock)')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('categories').select('id, name, slug').order('sort_order'),
    supabase.from('collections').select('id, name, slug, image_url').order('sort_order'),
  ])

  const product = data as Product | null
  if (!product) notFound()

  return (
    <>
      <h2 className="mb-8 text-center font-serif text-2xl">Ubah produk</h2>
      <ProductForm
        product={product}
        categories={(cats ?? []) as Category[]}
        collections={(cols ?? []) as Collection[]}
      />
    </>
  )
}

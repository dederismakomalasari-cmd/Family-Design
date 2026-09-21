export type Platform = 'shopee' | 'tokopedia' | 'tiktok'

export interface ProductImage {
  id: string
  url: string
  path?: string
  position: number
}
export interface ProductColor {
  id?: string
  name: string
  hex: string
}
export interface ProductSize {
  id?: string
  size: string
  in_stock: boolean
}
export interface Category {
  id: string
  name: string
  slug: string
}
export interface Collection {
  id: string
  name: string
  slug: string
  image_url: string | null
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  description: string | null
  details: string | null
  category_id: string | null
  collection_id: string | null
  is_new: boolean
  is_bestseller: boolean
  click_count: number
  shopee_url: string | null
  tokopedia_url: string | null
  tiktok_url: string | null
  created_at: string
  product_images?: ProductImage[]
  product_colors?: ProductColor[]
  product_sizes?: ProductSize[]
  categories?: { name: string; slug: string } | null
  collections?: { name: string; slug: string } | null
}

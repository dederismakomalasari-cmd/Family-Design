import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Klik "Shopee / Tokopedia / TikTok Shop" lewat sini: dicatat dulu, lalu diarahkan ke link asli.
// Data klik dipakai untuk urutan "Popular" di halaman Shop.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; platform: string }> }
) {
  const { id, platform } = await params
  const home = new URL('/', request.url)

  if (!['shopee', 'tokopedia', 'tiktok'].includes(platform)) return NextResponse.redirect(home)

  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('shopee_url, tokopedia_url, tiktok_url')
    .eq('id', id)
    .maybeSingle()

  const target = (data as Record<string, string | null> | null)?.[`${platform}_url`]
  if (!target || !/^https?:\/\//i.test(target)) return NextResponse.redirect(home)

  await supabase.rpc('track_click', { p_product_id: id, p_platform: platform })
  return NextResponse.redirect(target)
}

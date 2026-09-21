/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Foto produk disimpan di Supabase Storage (bucket "products", public)
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  experimental: {
    // Upload beberapa foto sekaligus dari form admin
    serverActions: { bodySizeLimit: '10mb' },
  },
}

export default nextConfig

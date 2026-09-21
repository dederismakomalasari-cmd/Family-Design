# Family Design — Website Katalog Butik

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (database, login, storage foto)

Pengunjung melihat katalog dan klik tombol **Shopee / Tokopedia / TikTok Shop**.
Admin mengelola produk (foto + link marketplace) lewat `/admin`.

## 1. Siapkan Supabase
1. Buat project gratis di https://supabase.com
2. Buka **SQL Editor → New query**, tempel seluruh isi `supabase/schema.sql`, lalu **Run**.
   (Membuat tabel, aturan keamanan admin/user, bucket foto `products`, dan data kategori/koleksi awal.)
3. **Authentication → Providers → Email**: untuk tahap pengembangan, matikan *Confirm email*
   agar bisa langsung login setelah daftar.
4. **Project Settings → API**: salin *Project URL* dan *anon public key*.

## 2. Jalankan di komputer
```bash
npm install
cp .env.local.example .env.local   # lalu isi nilainya
npm run dev
```
Buka http://localhost:3000

## 3. Jadikan akun Anda admin
1. Buka `/login?mode=register` dan daftar dengan email Anda.
2. Di Supabase SQL Editor jalankan:
```sql
update public.profiles set role = 'admin' where email = 'email-anda@contoh.com';
```
3. Muat ulang website → menu **Admin** muncul di navbar → `/admin`.

## 4. Tambahkan foto desain
Ekspor dari Figma lalu simpan di `public/images/`:
- `hero.jpg` — foto hero beranda
- `story.jpg` — foto bagian "Crafted for your special moments"
- `about.jpg` — foto halaman About

## Struktur folder
```
app/
  page.tsx                  Beranda
  shop/page.tsx             Daftar produk + filter + sort
  product/[slug]/page.tsx   Detail produk + tombol marketplace
  collections/ about/ contact/ wishlist/ info/[slug]/
  login/                    Masuk & daftar
  out/[id]/[platform]/      Catat klik → redirect ke marketplace
  admin/                    Panel admin (hanya role admin)
components/                 Navbar, Footer, ProductCard, dll.
lib/                        Klien Supabase, helper, tipe
supabase/schema.sql         Skema database + RLS + storage
middleware.ts               Refresh sesi & proteksi /admin, /wishlist
```

## Keamanan (ringkas)
- Role disimpan di tabel `profiles`; user biasa **tidak punya** hak mengubahnya.
- Hanya admin yang boleh menulis ke tabel produk & upload foto — dijaga oleh Row Level Security
  di database, bukan hanya oleh tampilan.
- Deploy: Vercel. Isi environment variables yang sama dengan `.env.local`.

## Yang perlu Anda sesuaikan
- Isi halaman `app/info/[slug]/page.tsx` (kebijakan, size guide) dan cerita di `app/about/page.tsx`.
- Kategori & koleksi diubah lewat **Supabase → Table Editor** (tabel `categories`, `collections`).

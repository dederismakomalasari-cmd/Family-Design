-- =====================================================================
-- Family Design — skema database Supabase
-- Jalankan seluruh file ini di: Supabase Dashboard → SQL Editor → New query
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- TABEL ----------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,                 -- opsional; jika kosong dipakai foto produk pertama
  sort_order int not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price integer not null default 0,           -- Rupiah, tanpa desimal
  description text,
  details text,
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  shopee_url text,
  tokopedia_url text,
  tiktok_url text,
  click_count integer not null default 0,     -- dipakai untuk urutan "Popular"
  created_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  path text not null,             -- path di Storage, untuk penghapusan
  position int not null default 0
);

create table public.product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  hex text not null default '#CCCCCC'
);

create table public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  in_stock boolean not null default true,
  unique (product_id, size)
);

create table public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.link_clicks (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  platform text not null check (platform in ('shopee', 'tokopedia', 'tiktok')),
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create index on public.products (category_id);
create index on public.products (collection_id);
create index on public.products (created_at desc);
create index on public.product_images (product_id);

-- ---------- FUNGSI ----------

-- Apakah user yang sedang login adalah admin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Otomatis buat baris profiles (role 'user') setiap ada akun baru
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Catat klik ke marketplace + tambah counter (dipanggil dari /out/[id]/[platform])
create or replace function public.track_click(p_product_id uuid, p_platform text)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.link_clicks (product_id, platform) values (p_product_id, p_platform);
  update public.products set click_count = click_count + 1 where id = p_product_id;
end;
$$;

grant execute on function public.track_click(uuid, text) to anon, authenticated;

-- ---------- ROW LEVEL SECURITY ----------

alter table public.profiles enable row level security;
alter table public.wishlists enable row level security;
alter table public.link_clicks enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- profiles: user hanya bisa membaca miliknya; admin bisa membaca semua.
-- Tidak ada policy UPDATE → user tidak bisa menaikkan role dirinya sendiri.
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- Katalog: semua orang boleh membaca, hanya admin yang boleh menulis
do $$
declare t text;
begin
  foreach t in array array[
    'categories', 'collections', 'products',
    'product_images', 'product_colors', 'product_sizes'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format(
      'create policy "admin write" on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end $$;

-- wishlists: milik masing-masing user
create policy "own wishlist" on public.wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- link_clicks: hanya admin yang boleh melihat (insert lewat fungsi track_click)
create policy "admin read clicks" on public.link_clicks
  for select using (public.is_admin());

-- newsletter: siapa pun boleh mendaftar, hanya admin yang boleh melihat daftar
create policy "anyone can subscribe" on public.newsletter_subscribers
  for insert with check (true);
create policy "admin read subscribers" on public.newsletter_subscribers
  for select using (public.is_admin());

-- ---------- STORAGE (foto produk) ----------

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects
  for select using (bucket_id = 'products');
create policy "admin upload product images" on storage.objects
  for insert with check (bucket_id = 'products' and public.is_admin());
create policy "admin update product images" on storage.objects
  for update using (bucket_id = 'products' and public.is_admin());
create policy "admin delete product images" on storage.objects
  for delete using (bucket_id = 'products' and public.is_admin());

-- ---------- DATA AWAL ----------

insert into public.categories (name, slug, sort_order) values
  ('Dresses',          'dresses',          1),
  ('Evening Gowns',    'evening-gowns',    2),
  ('Cocktail Dresses', 'cocktail-dresses', 3),
  ('Bridal Collection','bridal-collection',4),
  ('Accessories',      'accessories',      5);

insert into public.collections (name, slug, sort_order) values
  ('Dresses',              'dresses',              1),
  ('Muslim / Modest Wear', 'muslim-modest-wear',   2),
  ('Formal Wear',          'formal-wear',          3),
  ('Special Occasion',     'special-occasion',     4);

-- =====================================================================
-- LANGKAH TERAKHIR (manual): jadikan akun Anda admin.
-- 1) Daftar dulu lewat halaman /login di website.
-- 2) Jalankan (ganti emailnya):
--
--    update public.profiles set role = 'admin' where email = 'email-anda@contoh.com';
-- =====================================================================

import Image from 'next/image'
import Link from 'next/link'
import { saveProduct } from '@/app/admin/actions'
import { SIZES } from '@/lib/site'
import { sortedImages } from '@/lib/utils'
import type { Category, Collection, Product } from '@/lib/types'

export default function ProductForm({
  product,
  categories,
  collections,
}: {
  product?: Product
  categories: Category[]
  collections: Collection[]
}) {
  const images = product ? sortedImages(product) : []
  const colorsText = (product?.product_colors ?? []).map((c) => `${c.name}:${c.hex}`).join('\n')
  const sizeState = (size: string) => {
    const s = product?.product_sizes?.find((x) => x.size === size)
    return s ? (s.in_stock ? 'in' : 'out') : ''
  }

  return (
    <form action={saveProduct} className="mx-auto max-w-3xl space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div>
        <label htmlFor="name" className="label mb-2 block">Nama produk</label>
        <input id="name" name="name" required defaultValue={product?.name} className="field" placeholder="Alyssa Dress" />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className="label mb-2 block">Harga (Rp)</label>
          <input id="price" name="price" inputMode="numeric" required defaultValue={product?.price} className="field" placeholder="1250000" />
        </div>
        <div>
          <label htmlFor="category_id" className="label mb-2 block">Kategori</label>
          <select id="category_id" name="category_id" defaultValue={product?.category_id ?? ''} className="field">
            <option value="">— Tanpa kategori —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="collection_id" className="label mb-2 block">Koleksi</label>
          <select id="collection_id" name="collection_id" defaultValue={product?.collection_id ?? ''} className="field">
            <option value="">— Tanpa koleksi —</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="label mb-2 block">Deskripsi singkat</label>
        <textarea id="description" name="description" rows={3} defaultValue={product?.description ?? ''} className="field" />
      </div>
      <div>
        <label htmlFor="details" className="label mb-2 block">Detail (bahan, potongan, perawatan)</label>
        <textarea id="details" name="details" rows={4} defaultValue={product?.details ?? ''} className="field" />
      </div>

      <div className="flex gap-8 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_new" defaultChecked={product?.is_new} /> Tandai “New Arrival”
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_bestseller" defaultChecked={product?.is_bestseller} /> Tandai “Bestseller”
        </label>
      </div>

      {/* Link marketplace */}
      <fieldset className="space-y-4 border border-line p-5">
        <legend className="label px-2">Link marketplace</legend>
        {(
          [
            ['shopee_url', 'Shopee', product?.shopee_url],
            ['tokopedia_url', 'Tokopedia', product?.tokopedia_url],
            ['tiktok_url', 'TikTok Shop', product?.tiktok_url],
          ] as const
        ).map(([name, label, value]) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-xs text-muted">{label}</label>
            <input id={name} name={name} type="url" defaultValue={value ?? ''} placeholder="https://" className="field" />
          </div>
        ))}
        <p className="text-xs text-muted">Kosongkan jika produk tidak dijual di platform tersebut — tombolnya tidak akan tampil.</p>
      </fieldset>

      {/* Warna & ukuran */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="colors" className="label mb-2 block">Warna</label>
          <textarea
            id="colors"
            name="colors"
            rows={5}
            defaultValue={colorsText}
            placeholder={'Champagne:#F3E5C8\nGrey:#8A8A8A\nBlush:#EBCFC8'}
            className="field font-mono text-xs"
          />
          <p className="mt-1 text-xs text-muted">Satu warna per baris, format Nama:#KodeHex</p>
        </div>
        <div>
          <span className="label mb-2 block">Ukuran</span>
          <div className="space-y-2">
            {SIZES.map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-8 text-sm">{s}</span>
                <select name={`size_${s}`} defaultValue={sizeState(s)} aria-label={`Ukuran ${s}`} className="field !py-1.5">
                  <option value="">Tidak dijual</option>
                  <option value="in">Tersedia</option>
                  <option value="out">Habis</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Foto */}
      <div>
        <span className="label mb-2 block">Foto produk</span>
        {images.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((img, i) => (
              <label key={img.id} className="block text-[11px]">
                <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                  <Image src={img.url} alt={`Foto ${i + 1}`} fill sizes="120px" className="object-cover" />
                </div>
                <span className="mt-1 flex items-center gap-1.5">
                  <input type="checkbox" name="delete_image" value={img.id} /> Hapus{i === 0 ? ' (utama)' : ''}
                </span>
              </label>
            ))}
          </div>
        )}
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="block w-full text-sm file:mr-4 file:border file:border-ink file:bg-transparent file:px-4 file:py-2 file:text-xs"
        />
        <p className="mt-1 text-xs text-muted">
          Foto pertama menjadi foto utama. Maksimal 5 MB per foto. Foto baru ditambahkan di urutan terakhir.
        </p>
      </div>

      <div className="flex gap-3 border-t border-line pt-6">
        <button type="submit" className="btn-solid">{product ? 'Simpan perubahan' : 'Simpan produk'}</button>
        <Link href="/admin" className="btn">Batal</Link>
      </div>
    </form>
  )
}

'use client'

export default function DeleteButton({ label = 'Hapus' }: { label?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm('Hapus produk ini beserta semua fotonya? Tindakan ini tidak bisa dibatalkan.')) {
          e.preventDefault()
        }
      }}
      className="text-xs text-red-700 underline underline-offset-4 hover:text-red-900"
    >
      {label}
    </button>
  )
}

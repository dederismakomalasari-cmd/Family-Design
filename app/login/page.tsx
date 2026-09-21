import Link from 'next/link'
import type { Metadata } from 'next'
import { login, register } from './actions'

export const metadata: Metadata = { title: 'Masuk' }

type SP = { next?: string; mode?: string; message?: string; error?: string }

export default async function LoginPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const isRegister = sp.mode === 'register'
  const next = sp.next ?? '/'

  return (
    <section className="container-page flex justify-center py-20">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-serif text-4xl">{isRegister ? 'Buat akun' : 'Masuk'}</h1>
        <p className="mt-2 text-center text-sm text-muted">
          {isRegister
            ? 'Daftar untuk menyimpan produk favorit Anda.'
            : 'Masuk untuk melihat wishlist Anda.'}
        </p>

        {sp.error && (
          <p role="alert" className="mt-6 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {sp.error}
          </p>
        )}
        {sp.message && (
          <p role="status" className="mt-6 border border-line bg-sand px-3 py-2 text-sm">
            {sp.message}
          </p>
        )}

        <form action={isRegister ? register : login} className="mt-8 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="email" className="label mb-2 block">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="field" />
          </div>
          <div>
            <label htmlFor="password" className="label mb-2 block">Kata sandi</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              className="field"
            />
          </div>
          <button type="submit" className="btn-solid w-full">
            {isRegister ? 'Daftar' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {isRegister ? (
            <>
              Sudah punya akun?{' '}
              <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-ink underline">
                Masuk
              </Link>
            </>
          ) : (
            <>
              Belum punya akun?{' '}
              <Link href={`/login?mode=register&next=${encodeURIComponent(next)}`} className="text-ink underline">
                Daftar
              </Link>
            </>
          )}
        </p>
      </div>
    </section>
  )
}

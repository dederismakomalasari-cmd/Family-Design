'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Hanya izinkan redirect ke path internal
function safeNext(value: FormDataEntryValue | null) {
  const s = String(value ?? '/')
  return s.startsWith('/') && !s.startsWith('//') ? s : '/'
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const next = safeNext(formData.get('next'))

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent('Email atau kata sandi salah.')}&next=${encodeURIComponent(next)}`)
  }
  redirect(next)
}

export async function register(formData: FormData) {
  const supabase = await createClient()
  const next = safeNext(formData.get('next'))
  const password = String(formData.get('password') ?? '')

  if (password.length < 6) {
    redirect(`/login?mode=register&error=${encodeURIComponent('Kata sandi minimal 6 karakter.')}&next=${encodeURIComponent(next)}`)
  }

  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get('email') ?? '').trim(),
    password,
  })

  if (error) {
    redirect(`/login?mode=register&error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`)
  }

  // Jika konfirmasi email aktif di Supabase, sesi belum ada sampai email dikonfirmasi
  if (data.session) redirect(next)
  redirect(`/login?message=${encodeURIComponent('Akun dibuat. Cek email Anda untuk konfirmasi, lalu masuk.')}`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

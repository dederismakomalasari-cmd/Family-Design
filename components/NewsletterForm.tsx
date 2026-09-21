'use client'

import { useActionState } from 'react'
import { ArrowRight } from 'lucide-react'
import { subscribeNewsletter } from '@/app/actions'

export default function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, { message: '' })

  return (
    <form action={action}>
      <div className="flex items-center border-b border-ink/40">
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email address"
          aria-label="Alamat email"
          className="w-full bg-transparent py-2 text-xs outline-none placeholder:text-muted/70"
        />
        <button type="submit" disabled={pending} aria-label="Berlangganan" className="p-1 disabled:opacity-40">
          <ArrowRight size={14} />
        </button>
      </div>
      {state.message && (
        <p role="status" className="mt-2 text-xs text-muted">
          {state.message}
        </p>
      )}
    </form>
  )
}

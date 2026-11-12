'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { clearDraft } from '@/lib/ticket-draft'

/**
 * Sign-out as an icon button: it sits in the tight right-hand corner of the
 * portal bar, where a text label wrapped on phones. The label stays available
 * to screen readers (aria-label) and as a tooltip (title).
 */
export default function SignOutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function signOut() {
    setPending(true)
    clearDraft()
    await authClient.signOut()
    // replace: the private page should not be one "back" press away.
    router.replace('/connexion')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      aria-label="Se déconnecter"
      title="Se déconnecter"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slatebody transition hover:bg-soft hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={pending ? 'animate-pulse' : undefined}
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
    </button>
  )
}

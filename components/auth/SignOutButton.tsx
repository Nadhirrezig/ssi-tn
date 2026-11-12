'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { clearDraft } from '@/lib/ticket-draft'

export default function SignOutButton() {
  const [pending, setPending] = useState(false)

  async function signOut() {
    setPending(true)
    clearDraft()
    await authClient.signOut()
    // Full navigation, not router.push: no cached page from the signed-in
    // session survives in the client router.
    window.location.assign('/connexion')
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="font-heading text-sm font-bold text-primary underline-offset-2 hover:underline disabled:opacity-60"
    >
      {pending ? 'Déconnexion…' : 'Se déconnecter'}
    </button>
  )
}

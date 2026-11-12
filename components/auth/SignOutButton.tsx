'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { clearDraft } from '@/lib/ticket-draft'

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
      className="font-heading text-sm font-bold text-primary underline-offset-2 hover:underline disabled:opacity-60"
    >
      {pending ? 'Déconnexion…' : 'Se déconnecter'}
    </button>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { clearDraft } from '@/lib/ticket-draft'

/** Signs out, forgets any ticket draft, and leaves the private area for good. */
export function useSignOut() {
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

  return { signOut, pending }
}

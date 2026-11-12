'use client'

import { useEffect } from 'react'
import { clearDraft } from '@/lib/ticket-draft'

/**
 * Rendered on the welcome page after email verification: by then the request
 * written on /ticket has been submitted server-side, so the local copy would
 * only resurface later as a duplicate in the "new ticket" form.
 */
export default function ClearDraft() {
  useEffect(() => {
    clearDraft()
  }, [])
  return null
}

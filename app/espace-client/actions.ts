'use server'

import { after } from 'next/server'
import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/session'
import { addClientReply, createTicket, TicketError } from '@/lib/tickets'
import { notifyAdminClientReply, notifyAdminNewTicket } from '@/lib/notifications'
import { normalizeMessage, validateMessage } from '@/lib/ticket-status'

export type FormState = { error?: string; sentAt?: number } | undefined

const GENERIC_ERROR = 'Une erreur est survenue. Réessayez dans un instant.'

/** A signed-in client opens a ticket from their space. */
export async function createTicketAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireUser()

  const message = normalizeMessage(formData.get('message'))
  const invalid = validateMessage(message)
  if (invalid) return { error: invalid }

  let ref: string
  try {
    const ticket = await createTicket(user.id, message)
    ref = ticket.ref
    after(() => notifyAdminNewTicket(ticket, user))
  } catch (error) {
    if (error instanceof TicketError) return { error: error.message }
    console.error('[tickets] createTicket failed:', error)
    return { error: GENERIC_ERROR }
  }

  // Outside the try: redirect() works by throwing.
  redirect(`/espace-client/tickets/${ref}?envoye=1`)
}

/**
 * A client answers on one of their tickets. `ticketId` is bound on the server
 * page; ownership is checked again in addClientReply, never trusted.
 */
export async function replyToTicketAction(
  ticketId: string,
  prev: FormState,
  formData: FormData
): Promise<FormState> {
  const { user } = await requireUser()
  // Errors carry the previous sentAt forward: the composer is keyed on it,
  // and a changed key would wipe the text the client is trying to send.
  const keep = { sentAt: prev?.sentAt }

  const body = normalizeMessage(formData.get('body'))
  const invalid = validateMessage(body, 1)
  if (invalid) return { ...keep, error: invalid }

  try {
    const { ticket } = await addClientReply(user.id, ticketId, body)
    after(() => notifyAdminClientReply(ticket, user, body))
  } catch (error) {
    if (error instanceof TicketError) return { ...keep, error: error.message }
    console.error('[tickets] addClientReply failed:', error)
    return { ...keep, error: GENERIC_ERROR }
  }

  refresh()
  // sentAt changes on every success, which the composer uses to reset itself.
  return { sentAt: Date.now() }
}

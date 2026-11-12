'use server'

import { after } from 'next/server'
import { refresh } from 'next/cache'
import { requireAdmin } from '@/lib/session'
import { addAdminReply, changeTicketStatus } from '@/lib/admin-tickets'
import { notifyClientStatusChange, notifyClientTeamReply } from '@/lib/notifications'
import { TicketError } from '@/lib/tickets'
import { normalizeMessage, STATUS_META, validateMessage, type TicketStatus } from '@/lib/ticket-status'
import type { FormState } from '@/app/espace-client/actions'

const GENERIC_ERROR = 'Une erreur est survenue. Réessayez dans un instant.'

/** Accepts a status from form data only if it is one of ours. */
function parseStatus(value: FormDataEntryValue | null): TicketStatus | null {
  // hasOwn, not `in`: "toString" is "in" every object.
  return typeof value === 'string' && Object.hasOwn(STATUS_META, value) ? (value as TicketStatus) : null
}

/**
 * The team replies; the optional `nextStatus` field moves the ticket in the
 * same step and the client gets a single email covering both.
 * `ticketId` is bound on the page; the role is checked here, again.
 */
export async function adminReplyAction(
  ticketId: string,
  prev: FormState,
  formData: FormData
): Promise<FormState> {
  const { user: admin } = await requireAdmin()
  // See replyToTicketAction: errors keep sentAt so the composer keeps its text.
  const keep = { sentAt: prev?.sentAt }

  const body = normalizeMessage(formData.get('body'))
  const invalid = validateMessage(body, 1)
  if (invalid) return { ...keep, error: invalid }

  const rawStatus = formData.get('nextStatus')
  const nextStatus = parseStatus(rawStatus)
  if (rawStatus && !nextStatus) return { ...keep, error: 'Statut inconnu.' }

  try {
    const { ticket, newStatus } = await addAdminReply(admin.id, ticketId, body, nextStatus)
    after(() => notifyClientTeamReply(ticket, ticket.user, body, newStatus))
  } catch (error) {
    if (error instanceof TicketError) return { ...keep, error: error.message }
    console.error('[admin] addAdminReply failed:', error)
    return { ...keep, error: GENERIC_ERROR }
  }

  refresh()
  return { sentAt: Date.now() }
}

/** Status change without a message (side-panel buttons). */
export async function adminStatusAction(
  ticketId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const { user: admin } = await requireAdmin()

  const to = parseStatus(formData.get('to'))
  if (!to) return { error: 'Statut inconnu.' }

  try {
    const { ticket, newStatus } = await changeTicketStatus(admin.id, ticketId, to)
    after(() => notifyClientStatusChange(ticket, ticket.user, newStatus))
  } catch (error) {
    if (error instanceof TicketError) return { error: error.message }
    console.error('[admin] changeTicketStatus failed:', error)
    return { error: GENERIC_ERROR }
  }

  refresh()
  return { sentAt: Date.now() }
}

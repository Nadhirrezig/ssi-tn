import 'server-only'

import { sendMail } from '@/lib/mail'
import {
  clientReplyAdminMessage,
  newTicketAdminMessage,
  statusChangeClientMessage,
  teamReplyClientMessage,
} from '@/lib/emails/tickets'
import type { TicketStatus } from '@/lib/ticket-status'

/**
 * Ticket notifications. Callers schedule these with `after()` so nobody's
 * page waits on SMTP; failures are logged by sendMail.
 */

type Person = { name: string; email: string }
type TicketRef = { ref: string; message: string }

// ─── To the team ────────────────────────────────────────────────────────────

function adminInbox(): string | null {
  const to = process.env.ADMIN_NOTIFY_EMAIL
  if (!to) console.error('[notify] ADMIN_NOTIFY_EMAIL is not set — team notification skipped.')
  return to || null
}

export async function notifyAdminNewTicket(ticket: TicketRef, client: Person) {
  const to = adminInbox()
  if (to) await sendMail(newTicketAdminMessage(to, ticket, client))
}

export async function notifyAdminClientReply(ticket: TicketRef, client: Person, reply: string) {
  const to = adminInbox()
  if (to) await sendMail(clientReplyAdminMessage(to, ticket, client, reply))
}

// ─── To the client ──────────────────────────────────────────────────────────

/** One email for a reply, even when it also changed the status. */
export async function notifyClientTeamReply(
  ticket: TicketRef,
  client: Person,
  reply: string,
  newStatus: TicketStatus | null
) {
  await sendMail(teamReplyClientMessage(client, ticket, reply, newStatus))
}

export async function notifyClientStatusChange(ticket: TicketRef, client: Person, newStatus: TicketStatus) {
  await sendMail(statusChangeClientMessage(client, ticket, newStatus))
}

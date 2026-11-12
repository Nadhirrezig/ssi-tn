import 'server-only'

import { sendMail } from '@/lib/mail'
import { clientReplyAdminMessage, newTicketAdminMessage } from '@/lib/emails/tickets'

/**
 * Team-facing notifications. Callers schedule these with `after()` so the
 * client's page never waits on SMTP; failures are logged by sendMail.
 */

type Client = { name: string; email: string }
type TicketRef = { ref: string; message: string }

function adminInbox(): string | null {
  const to = process.env.ADMIN_NOTIFY_EMAIL
  if (!to) console.error('[notify] ADMIN_NOTIFY_EMAIL is not set — team notification skipped.')
  return to || null
}

export async function notifyAdminNewTicket(ticket: TicketRef, client: Client) {
  const to = adminInbox()
  if (to) await sendMail(newTicketAdminMessage(to, ticket, client))
}

export async function notifyAdminClientReply(ticket: TicketRef, client: Client, reply: string) {
  const to = adminInbox()
  if (to) await sendMail(clientReplyAdminMessage(to, ticket, client, reply))
}

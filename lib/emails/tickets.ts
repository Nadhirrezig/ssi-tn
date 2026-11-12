import 'server-only'

import type { MailMessage } from '@/lib/mail'
import { renderEmail } from '@/lib/emails/layout'
import { SITE_URL } from '@/lib/site'
import { ticketTitle } from '@/lib/ticket-status'

type Client = { name: string; email: string }
type TicketRef = { ref: string; message: string }

/** Long messages are cut in emails; the full text is one click away. */
function excerpt(text: string, max = 1200): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

const adminUrl = (ref: string) => `${SITE_URL}/admin/tickets/${ref}`

export function newTicketAdminMessage(to: string, ticket: TicketRef, client: Client): MailMessage {
  return {
    to,
    subject: `[${ticket.ref}] Nouvelle demande — ${ticketTitle(ticket.message, 60)}`,
    ...renderEmail({
      preheader: `${client.name} a ouvert une demande.`,
      heading: `Nouvelle demande ${ticket.ref}`,
      paragraphs: [`De : ${client.name} <${client.email}>`, excerpt(ticket.message)],
      action: { label: 'Ouvrir la demande', url: adminUrl(ticket.ref) },
    }),
  }
}

export function clientReplyAdminMessage(
  to: string,
  ticket: TicketRef,
  client: Client,
  reply: string
): MailMessage {
  return {
    to,
    subject: `[${ticket.ref}] Nouvelle réponse du client — ${ticketTitle(ticket.message, 60)}`,
    ...renderEmail({
      preheader: `${client.name} a répondu sur ${ticket.ref}.`,
      heading: `Réponse sur ${ticket.ref}`,
      paragraphs: [`De : ${client.name} <${client.email}>`, excerpt(reply)],
      action: { label: 'Ouvrir la demande', url: adminUrl(ticket.ref) },
    }),
  }
}

import 'server-only'

import type { MailMessage } from '@/lib/mail'
import { renderEmail } from '@/lib/emails/layout'
import { SITE_URL } from '@/lib/site'
import { STATUS_META, ticketTitle, type TicketStatus } from '@/lib/ticket-status'

type Client = { name: string; email: string }
type TicketRef = { ref: string; message: string }

/** Long messages are cut in emails; the full text is one click away. */
function excerpt(text: string, max = 1200): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

const adminUrl = (ref: string) => `${SITE_URL}/admin/tickets/${ref}`
const clientUrl = (ref: string) => `${SITE_URL}/espace-client/tickets/${ref}`

const REPLY_IN_PORTAL =
  'Pour répondre, utilisez votre espace client : l’historique complet de la demande y est conservé.'

// ─── To the client ──────────────────────────────────────────────────────────

/** The team replied — with the new status when the reply also moved it. */
export function teamReplyClientMessage(
  client: Client,
  ticket: TicketRef,
  reply: string,
  newStatus: TicketStatus | null
): MailMessage {
  return {
    to: client.email,
    subject: `[${ticket.ref}] Nouvelle réponse de l’équipe SSI`,
    ...renderEmail({
      preheader: excerpt(reply, 120),
      heading: `Bonjour ${client.name},`,
      paragraphs: [
        `Notre équipe a répondu à votre demande ${ticket.ref} « ${ticketTitle(ticket.message, 70)} » :`,
        excerpt(reply),
        ...(newStatus
          ? [`Statut de la demande : ${STATUS_META[newStatus].label}. ${STATUS_META[newStatus].description}`]
          : []),
      ],
      action: { label: 'Voir la demande', url: clientUrl(ticket.ref) },
      footnote: REPLY_IN_PORTAL,
    }),
  }
}

/** Status moved without a message. */
export function statusChangeClientMessage(
  client: Client,
  ticket: TicketRef,
  newStatus: TicketStatus
): MailMessage {
  const { label, description } = STATUS_META[newStatus]
  return {
    to: client.email,
    subject: `[${ticket.ref}] Votre demande est maintenant « ${label} »`,
    ...renderEmail({
      preheader: description,
      heading: `Bonjour ${client.name},`,
      paragraphs: [
        `Le statut de votre demande ${ticket.ref} « ${ticketTitle(ticket.message, 70)} » est passé à « ${label} ».`,
        description,
      ],
      action: { label: 'Voir la demande', url: clientUrl(ticket.ref) },
      footnote: REPLY_IN_PORTAL,
    }),
  }
}

// ─── To the team ────────────────────────────────────────────────────────────

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

import 'server-only'

import type { MailMessage } from '@/lib/mail'
import { renderEmail, type DetailRow, type PillTone } from '@/lib/emails/layout'
import { SITE_URL } from '@/lib/site'
import {
  categoryOf,
  formatDateAt,
  STATUS_META,
  TICKET_CATEGORIES,
  ticketTitle,
  type TicketStatus,
} from '@/lib/ticket-status'

type Person = { name: string; email: string }
/** `status` is the ticket's status before the change being announced. */
type TicketRef = {
  ref: string
  message: string
  createdAt: Date
  category?: string | null
  status?: TicketStatus
}

/*
 * Ticket emails say what happened and link to the ticket; they never carry
 * the conversation itself. The client reads and answers in the client area,
 * behind their login — the full history stays in one place, and nothing
 * sensitive sits in an inbox.
 */

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name
const adminUrl = (ref: string) => `${SITE_URL}/admin/tickets/${ref}`
const clientUrl = (ref: string) => `${SITE_URL}/espace-client/tickets/${ref}`

/** "demande", or "demande de devis" / "demande de démo" for tagged tickets. */
function kindOf(ticket: TicketRef): string {
  const category = categoryOf(ticket.category)
  return category ? `demande de ${TICKET_CATEGORIES[category].tag.toLowerCase()}` : 'demande'
}

const title = (ticket: TicketRef) => `« ${ticketTitle(ticket.message, 70)} »`
const quoted = (label: string) => `« ${label} »`

/** Same colour per status as the badges on the site. */
const STATUS_PILL: Record<TicketStatus, PillTone> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  IN_PROGRESS: 'blue',
  DONE: 'navy',
  REJECTED: 'coral',
}

/** The details card: number, (client), creation date, current status. */
function detailsOf(ticket: TicketRef, status: TicketStatus, client?: Person): DetailRow[] {
  return [
    { icon: 'ticket', label: 'Numéro de ticket', value: ticket.ref },
    ...(client ? [{ icon: 'user' as const, label: 'Client', value: `${client.name} · ${client.email}` }] : []),
    { icon: 'calendar', label: 'Date de création', value: formatDateAt(ticket.createdAt) },
    { pill: STATUS_PILL[status], label: 'Statut actuel', value: STATUS_META[status].label },
  ]
}

/** Headline per status: each step forward reads as good news. */
const STATUS_HEADING: Record<TicketStatus, string> = {
  PENDING: 'Votre demande a bien été enregistrée',
  CONFIRMED: 'Votre demande est prise en charge',
  IN_PROGRESS: 'Nos équipes sont à pied d’œuvre',
  DONE: 'C’est fait : votre demande est traitée',
  REJECTED: 'Votre demande a été annulée',
}

// ─── To the client ──────────────────────────────────────────────────────────

/** The team replied — with the new status when the reply also moved it. */
export function teamReplyClientMessage(
  client: Person,
  ticket: TicketRef,
  newStatus: TicketStatus | null
): MailMessage {
  const status = newStatus ?? ticket.status ?? 'PENDING'
  return {
    to: client.email,
    subject: `[${ticket.ref}] L’équipe SSI vous a répondu`,
    ...renderEmail({
      preheader: 'Une nouvelle réponse vous attend dans votre espace client.',
      tone: 'info',
      heading: 'Notre équipe vous a répondu',
      greeting: `Bonjour ${firstName(client.name)},`,
      paragraphs: [
        `Notre équipe a répondu à votre ${kindOf(ticket)} ${title(ticket)}.${
          newStatus ? ` Elle est désormais ${quoted(STATUS_META[newStatus].label)}.` : ''
        } Pour lire sa réponse et y donner suite, rendez-vous dans votre espace client.`,
      ],
      details: detailsOf(ticket, status),
      action: { label: 'Voir ma demande', url: clientUrl(ticket.ref) },
    }),
  }
}

/** Status moved without a message. */
export function statusChangeClientMessage(
  client: Person,
  ticket: TicketRef,
  newStatus: TicketStatus
): MailMessage {
  const { label, description } = STATUS_META[newStatus]
  return {
    to: client.email,
    subject: `[${ticket.ref}] Votre demande est maintenant ${quoted(label)}`,
    ...renderEmail({
      preheader: description,
      tone: newStatus === 'REJECTED' ? 'neutral' : 'success',
      heading: STATUS_HEADING[newStatus],
      greeting: `Bonjour ${firstName(client.name)},`,
      paragraphs: [`Le statut de votre ${kindOf(ticket)} ${title(ticket)} est passé à ${quoted(label)}. ${description}`],
      details: detailsOf(ticket, newStatus),
      action: { label: 'Voir ma demande', url: clientUrl(ticket.ref) },
    }),
  }
}

// ─── To the team ────────────────────────────────────────────────────────────

export function newTicketAdminMessage(to: string, ticket: TicketRef, client: Person): MailMessage {
  const kind = kindOf(ticket)
  return {
    to,
    subject: `[${ticket.ref}] Nouvelle ${kind} — ${ticketTitle(ticket.message, 60)}`,
    ...renderEmail({
      preheader: `${client.name} a ouvert une ${kind}.`,
      tone: 'info',
      heading: `Nouvelle ${kind}`,
      greeting: 'Bonjour,',
      paragraphs: [`${client.name} vient d’ouvrir une ${kind} : ${title(ticket)}. Elle attend sa prise en charge.`],
      details: detailsOf(ticket, ticket.status ?? 'PENDING', client),
      action: { label: 'Ouvrir la demande', url: adminUrl(ticket.ref) },
    }),
  }
}

export function clientReplyAdminMessage(to: string, ticket: TicketRef, client: Person): MailMessage {
  return {
    to,
    subject: `[${ticket.ref}] Nouvelle réponse du client — ${ticketTitle(ticket.message, 60)}`,
    ...renderEmail({
      preheader: `${client.name} a répondu sur ${ticket.ref}.`,
      tone: 'info',
      heading: `${firstName(client.name)} a répondu`,
      greeting: 'Bonjour,',
      paragraphs: [`${client.name} a ajouté un message à la ${kindOf(ticket)} ${title(ticket)}.`],
      details: detailsOf(ticket, ticket.status ?? 'PENDING', client),
      action: { label: 'Ouvrir la demande', url: adminUrl(ticket.ref) },
    }),
  }
}

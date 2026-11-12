/**
 * Ticket vocabulary shared by server and client code: status labels, the
 * lifecycle, public references and message rules. No server-only imports.
 *
 * Colours live in components/tickets/StatusBadge.tsx — Tailwind only scans
 * app/ and components/, so class names written here would never be generated.
 */
import type { TicketStatus } from '@/lib/generated/prisma/enums'

export type { TicketStatus }

export const STATUS_META: Record<TicketStatus, { label: string; description: string }> = {
  PENDING: {
    label: 'En attente',
    description: 'Votre demande a bien été reçue. Notre équipe va l’examiner et revenir vers vous.',
  },
  CONFIRMED: {
    label: 'Confirmé',
    description: 'Votre demande est prise en charge : elle va être confiée à un technicien.',
  },
  IN_PROGRESS: {
    label: 'En cours',
    description: 'Nos équipes travaillent sur votre demande. Vous serez informé ici et par e-mail.',
  },
  DONE: {
    label: 'Terminé',
    description: 'Votre demande a été traitée. Pour un nouveau besoin, ouvrez une nouvelle demande.',
  },
  REJECTED: {
    label: 'Annulé',
    description:
      'Cette demande a été annulée par notre équipe. Pour toute question, ouvrez une nouvelle demande ou appelez-nous.',
  },
}

/** The main line, in order. REJECTED sits outside it and can end any open step. */
export const STATUS_STEPS: readonly TicketStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'DONE']

export const OPEN_STATUSES: readonly TicketStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS']

export function isFinalStatus(status: TicketStatus): boolean {
  return status === 'DONE' || status === 'REJECTED'
}

/** Transitions an admin may make from each status (enforced in Phase 3). */
export const NEXT_STATUSES: Record<TicketStatus, readonly TicketStatus[]> = {
  PENDING: ['CONFIRMED', 'REJECTED'],
  CONFIRMED: ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['DONE', 'REJECTED'],
  DONE: [],
  REJECTED: [],
}

// ─── Dates ──────────────────────────────────────────────────────────────────
// Servers run in UTC; clients and the team are in Tunisia. Every date shown is
// formatted in Africa/Tunis so the server-rendered time matches the wall clock.

const TIME_ZONE = 'Africa/Tunis'

const DATE = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeZone: TIME_ZONE })
const DATE_TIME = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: TIME_ZONE,
})
const YEAR = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: TIME_ZONE })

export const formatDate = (date: Date) => DATE.format(date)
export const formatDateTime = (date: Date) => DATE_TIME.format(date)

// ─── References ─────────────────────────────────────────────────────────────

/** SSI-2026-0007: year of creation (Tunis time) + the ticket's serial number. */
export function formatTicketRef(ticket: { number: number; createdAt: Date }): string {
  return `SSI-${YEAR.format(ticket.createdAt)}-${String(ticket.number).padStart(4, '0')}`
}

/** Parses a reference from a URL. The caller checks the year against the row. */
export function parseTicketRef(ref: string): { year: string; number: number } | null {
  const match = /^SSI-(\d{4})-(\d{4,9})$/.exec(ref)
  if (!match) return null
  return { year: match[1], number: Number(match[2]) }
}

// ─── Messages ───────────────────────────────────────────────────────────────

/**
 * Extra field the public /ticket form adds to the Better Auth sign-up request.
 * Better Auth ignores unknown body fields; lib/auth.ts picks this one up.
 */
export const SIGN_UP_TICKET_FIELD = 'ticketMessage'

export const MESSAGE_MIN_LENGTH = 10
export const MESSAGE_MAX_LENGTH = 5000

/** Trims, unifies line endings and caps runs of blank lines at one. */
export function normalizeMessage(value: unknown): string {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Returns a French error for an invalid message, or null when it is fine. */
export function validateMessage(message: string, minLength = MESSAGE_MIN_LENGTH): string | null {
  if (message.length < minLength) {
    return minLength > 1
      ? `Décrivez votre demande en quelques mots (${minLength} caractères minimum).`
      : 'Le message est vide.'
  }
  if (message.length > MESSAGE_MAX_LENGTH) {
    return `Le message est trop long (${MESSAGE_MAX_LENGTH.toLocaleString('fr-FR')} caractères maximum).`
  }
  return null
}

/** A one-line title from the free-text message, for lists and email subjects. */
export function ticketTitle(message: string, max = 90): string {
  const firstLine = message.split('\n').find((line) => line.trim()) ?? message
  const flat = firstLine.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat
}

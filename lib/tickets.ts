import 'server-only'

import { db } from '@/lib/db'
import { formatTicketRef, isFinalStatus, parseTicketRef } from '@/lib/ticket-status'

/**
 * Ticket data access. Every function that reads or writes on behalf of a
 * client takes the client's user id and scopes the query to it, so ownership
 * is enforced here — not left to each page or action to remember.
 */

/** Per-user ceilings, a cheap guard against a runaway script or a stuck key. */
const MAX_TICKETS_PER_HOUR = 10
const MAX_REPLIES_PER_HOUR = 40

const HOUR = 60 * 60 * 1000

// ─── Reads ──────────────────────────────────────────────────────────────────

export async function listClientTickets(userId: string) {
  const tickets = await db.ticket.findMany({
    where: { userId, submittedAt: { not: null } },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      number: true,
      message: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { author: { select: { role: true } } },
      },
    },
  })

  return tickets.map(({ messages, _count, ...ticket }) => ({
    ...ticket,
    ref: formatTicketRef(ticket),
    replyCount: _count.messages,
    /** True when SSI spoke last — the client may want to read or answer. */
    lastReplyFromTeam: messages[0]?.author.role === 'ADMIN',
  }))
}

export type ClientTicketSummary = Awaited<ReturnType<typeof listClientTickets>>[number]

/** One ticket with its thread, or null if it does not exist or is not theirs. */
export async function getClientTicket(userId: string, ref: string) {
  const parsed = parseTicketRef(ref)
  if (!parsed) return null

  const ticket = await db.ticket.findFirst({
    where: { number: parsed.number, userId, submittedAt: { not: null } },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          body: true,
          createdAt: true,
          author: { select: { id: true, name: true, role: true } },
        },
      },
      events: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, fromStatus: true, toStatus: true, createdAt: true },
      },
    },
  })

  // A reference with the right number but the wrong year is not this ticket's
  // address; treating it as unknown keeps one canonical URL per ticket.
  if (!ticket || formatTicketRef(ticket) !== ref) return null
  return { ...ticket, ref }
}

export type ClientTicket = NonNullable<Awaited<ReturnType<typeof getClientTicket>>>

// ─── Writes ─────────────────────────────────────────────────────────────────

export class TicketError extends Error {}

/** A signed-in client opens a ticket: submitted immediately. */
export async function createTicket(userId: string, message: string) {
  const recent = await db.ticket.count({
    where: { userId, createdAt: { gte: new Date(Date.now() - HOUR) } },
  })
  if (recent >= MAX_TICKETS_PER_HOUR) {
    throw new TicketError('Vous avez ouvert beaucoup de demandes en peu de temps. Réessayez dans une heure, ou appelez-nous.')
  }

  return db.$transaction(async (tx) => {
    const ticket = await tx.ticket.create({
      data: { userId, message, submittedAt: new Date() },
    })
    await tx.ticketEvent.create({
      data: { ticketId: ticket.id, fromStatus: null, toStatus: 'PENDING', actorId: userId },
    })
    return { ...ticket, ref: formatTicketRef(ticket) }
  })
}

/**
 * A visitor wrote a ticket and signed up in the same step. The ticket waits,
 * unsubmitted and invisible to the team, until the address is confirmed.
 */
export async function createDraftTicket(userId: string, message: string) {
  return db.ticket.create({ data: { userId, message, submittedAt: null } })
}

/** Called once the email is verified: drafts become real, PENDING tickets. */
export async function submitDraftTickets(userId: string) {
  const drafts = await db.ticket.findMany({ where: { userId, submittedAt: null } })
  if (drafts.length === 0) return []

  const now = new Date()
  return db.$transaction(async (tx) => {
    const submitted = []
    for (const draft of drafts) {
      const ticket = await tx.ticket.update({
        where: { id: draft.id },
        data: { submittedAt: now },
      })
      await tx.ticketEvent.create({
        data: { ticketId: ticket.id, fromStatus: null, toStatus: 'PENDING', actorId: userId },
      })
      submitted.push({ ...ticket, ref: formatTicketRef(ticket) })
    }
    return submitted
  })
}

/** A client answers on their own, still-open ticket. */
export async function addClientReply(userId: string, ticketId: string, body: string) {
  const ticket = await db.ticket.findFirst({
    where: { id: ticketId, userId, submittedAt: { not: null } },
  })
  if (!ticket) throw new TicketError('Demande introuvable.')
  if (isFinalStatus(ticket.status)) {
    throw new TicketError('Cette demande est clôturée : ouvrez une nouvelle demande pour poursuivre.')
  }

  const recent = await db.ticketMessage.count({
    where: { authorId: userId, createdAt: { gte: new Date(Date.now() - HOUR) } },
  })
  if (recent >= MAX_REPLIES_PER_HOUR) {
    throw new TicketError('Trop de messages en peu de temps. Réessayez un peu plus tard.')
  }

  return db.$transaction(async (tx) => {
    const message = await tx.ticketMessage.create({
      data: { ticketId: ticket.id, authorId: userId, body },
    })
    // Bump the ticket so lists sorted by activity put it back on top.
    await tx.ticket.update({ where: { id: ticket.id }, data: { updatedAt: new Date() } })
    return { message, ticket: { ...ticket, ref: formatTicketRef(ticket) } }
  })
}

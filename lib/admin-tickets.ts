import 'server-only'

import { db } from '@/lib/db'
import type { Prisma } from '@/lib/generated/prisma/client'
import {
  formatTicketRef,
  isFinalStatus,
  NEXT_STATUSES,
  parseTicketRef,
  type TicketStatus,
} from '@/lib/ticket-status'
import { TicketError } from '@/lib/tickets'

/**
 * Ticket data access for the team. Callers must have checked the admin role
 * (requireAdmin) — nothing here is scoped to a user.
 */

export const ADMIN_PAGE_SIZE = 25

const CONFLICT =
  'Cette demande vient d’être modifiée par quelqu’un d’autre. Rechargez la page avant de continuer.'

// ─── Search ─────────────────────────────────────────────────────────────────

/**
 * Turns the search box into a filter: a reference (SSI-2026-0007), a bare
 * number (7 or 0007), or text matched against the client's name and email.
 */
function searchFilter(q: string | undefined): Prisma.TicketWhereInput {
  const query = q?.trim()
  if (!query) return {}

  const ref = parseTicketRef(query.toUpperCase())
  if (ref) return { number: ref.number }
  if (/^\d{1,9}$/.test(query)) return { number: Number(query) }

  return {
    user: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
  }
}

// ─── Inbox ──────────────────────────────────────────────────────────────────

export async function listAdminTickets({
  statuses,
  q,
  page,
}: {
  /** null = every status. */
  statuses: readonly TicketStatus[] | null
  q?: string
  page: number
}) {
  const base: Prisma.TicketWhereInput = { submittedAt: { not: null }, ...searchFilter(q) }
  const where: Prisma.TicketWhereInput = statuses ? { ...base, status: { in: [...statuses] } } : base

  const [rows, total, byStatus] = await Promise.all([
    db.ticket.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      select: {
        id: true,
        number: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { name: true, email: true } },
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { author: { select: { role: true } } },
        },
      },
    }),
    db.ticket.count({ where }),
    // Tab counts follow the search, so the tabs say where the matches are.
    db.ticket.groupBy({ by: ['status'], where: base, _count: { _all: true } }),
  ])

  const countByStatus = Object.fromEntries(byStatus.map((g) => [g.status, g._count._all])) as Partial<
    Record<TicketStatus, number>
  >

  return {
    tickets: rows.map(({ messages, _count, ...ticket }) => ({
      ...ticket,
      ref: formatTicketRef(ticket),
      replyCount: _count.messages,
      /** The client spoke last (or nobody answered yet) on an open ticket. */
      awaitingTeam: !isFinalStatus(ticket.status) && messages[0]?.author.role !== 'ADMIN',
    })),
    total,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
    countByStatus,
  }
}

export type AdminTicketRow = Awaited<ReturnType<typeof listAdminTickets>>['tickets'][number]

// ─── One ticket ─────────────────────────────────────────────────────────────

export async function getAdminTicket(ref: string) {
  const parsed = parseTicketRef(ref)
  if (!parsed) return null

  const ticket = await db.ticket.findFirst({
    where: { number: parsed.number, submittedAt: { not: null } },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: { select: { tickets: { where: { submittedAt: { not: null } } } } },
        },
      },
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
        select: {
          id: true,
          fromStatus: true,
          toStatus: true,
          createdAt: true,
          actor: { select: { name: true, role: true } },
        },
      },
    },
  })

  if (!ticket || formatTicketRef(ticket) !== ref) return null
  return { ...ticket, ref }
}

export type AdminTicket = NonNullable<Awaited<ReturnType<typeof getAdminTicket>>>

// ─── Writes ─────────────────────────────────────────────────────────────────

async function loadOpenTicket(ticketId: string) {
  const ticket = await db.ticket.findFirst({
    where: { id: ticketId, submittedAt: { not: null } },
    include: { user: { select: { name: true, email: true } } },
  })
  if (!ticket) throw new TicketError('Demande introuvable.')
  if (isFinalStatus(ticket.status)) {
    throw new TicketError('Cette demande est clôturée : elle ne peut plus être modifiée.')
  }
  return ticket
}

function assertTransition(from: TicketStatus, to: TicketStatus) {
  if (!NEXT_STATUSES[from].includes(to)) {
    throw new TicketError('Ce changement de statut n’est pas possible depuis le statut actuel.')
  }
}

/**
 * Moves the status inside a transaction, only if it is still `from` — two
 * admins acting on the same ticket cannot both win.
 */
async function moveStatus(
  tx: Prisma.TransactionClient,
  ticketId: string,
  from: TicketStatus,
  to: TicketStatus,
  actorId: string
) {
  const { count } = await tx.ticket.updateMany({
    where: { id: ticketId, status: from },
    data: { status: to, updatedAt: new Date() },
  })
  if (count === 0) throw new TicketError(CONFLICT)
  await tx.ticketEvent.create({ data: { ticketId, fromStatus: from, toStatus: to, actorId } })
}

/** The team answers, optionally moving the status in the same step. */
export async function addAdminReply(
  adminId: string,
  ticketId: string,
  body: string,
  nextStatus: TicketStatus | null
) {
  const ticket = await loadOpenTicket(ticketId)
  if (nextStatus) assertTransition(ticket.status, nextStatus)

  await db.$transaction(async (tx) => {
    // The reply comes first so, at the same instant, the timeline reads
    // "message, then status change".
    await tx.ticketMessage.create({ data: { ticketId, authorId: adminId, body } })
    if (nextStatus) await moveStatus(tx, ticketId, ticket.status, nextStatus, adminId)
    else await tx.ticket.update({ where: { id: ticketId }, data: { updatedAt: new Date() } })
  })

  return { ticket: { ...ticket, ref: formatTicketRef(ticket) }, newStatus: nextStatus }
}

/** Status change without a message (side-panel buttons). */
export async function changeTicketStatus(adminId: string, ticketId: string, to: TicketStatus) {
  const ticket = await loadOpenTicket(ticketId)
  assertTransition(ticket.status, to)

  await db.$transaction((tx) => moveStatus(tx, ticketId, ticket.status, to, adminId))

  return { ticket: { ...ticket, ref: formatTicketRef(ticket) }, newStatus: to }
}

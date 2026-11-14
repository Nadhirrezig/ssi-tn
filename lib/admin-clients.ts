import 'server-only'

import { randomUUID } from 'node:crypto'
import { hashPassword } from 'better-auth/crypto'
import { db } from '@/lib/db'
import { Prisma } from '@/lib/generated/prisma/client'
import { OPEN_STATUSES } from '@/lib/ticket-status'

/**
 * Client accounts, for the team. Callers must have checked the admin role
 * (requireAdmin) — nothing here is scoped to a user.
 */

export const CLIENTS_PAGE_SIZE = 25

/** Same bounds as Better Auth's sign-up (lib/auth.ts). */
export const PASSWORD_MIN = 8
const PASSWORD_MAX = 128

// ─── New client ─────────────────────────────────────────────────────────────

export type NewClient = {
  name: string
  email: string
  company: string | null
  phone: string | null
  password: string
}
export type NewClientField = keyof NewClient
export type NewClientErrors = Partial<Record<NewClientField, string>>

const text = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '')

/** Reads and checks the "Nouveau client" form. Every message is shown next to its field. */
export function parseNewClient(formData: FormData): { client: NewClient; errors: NewClientErrors } {
  const rawPassword = formData.get('password')
  const client: NewClient = {
    name: text(formData.get('name')),
    email: text(formData.get('email')).toLowerCase(),
    company: text(formData.get('company')) || null,
    phone: text(formData.get('phone')) || null,
    // Not trimmed: spaces are characters the client will type.
    password: typeof rawPassword === 'string' ? rawPassword : '',
  }

  const errors: NewClientErrors = {}
  if (client.name.length < 2) errors.name = 'Indiquez le nom du client.'
  else if (client.name.length > 100) errors.name = '100 caractères maximum.'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email) || client.email.length > 254) {
    errors.email = 'Adresse e-mail invalide.'
  }

  if (client.company && client.company.length > 120) errors.company = '120 caractères maximum.'

  if (client.phone) {
    const digits = client.phone.replace(/\D/g, '').length
    if (!/^[+()\d .-]+$/.test(client.phone) || digits < 6 || digits > 15) {
      errors.phone = 'Numéro invalide (ex. +216 28 290 350).'
    }
  }

  if (client.password.length < PASSWORD_MIN) errors.password = `${PASSWORD_MIN} caractères minimum.`
  else if (client.password.length > PASSWORD_MAX) errors.password = `${PASSWORD_MAX} caractères maximum.`

  return { client, errors }
}

export class ClientExistsError extends Error {}

/**
 * Creates a ready-to-use client account: verified address (the team vouches
 * for it), password hashed exactly as Better Auth does at sign-up, so the
 * client signs in on /connexion like everyone else.
 */
export async function createClientAccount(client: NewClient) {
  const id = randomUUID()
  const hash = await hashPassword(client.password)
  try {
    return await db.user.create({
      data: {
        id,
        name: client.name,
        email: client.email,
        company: client.company,
        phone: client.phone,
        role: 'CLIENT',
        emailVerified: true,
        accounts: {
          create: { id: randomUUID(), accountId: id, providerId: 'credential', password: hash },
        },
      },
      select: { id: true, name: true, email: true },
    })
  } catch (error) {
    // Unique email: someone already has an account with this address.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ClientExistsError()
    }
    throw error
  }
}

// ─── List ───────────────────────────────────────────────────────────────────

export async function listClients({ q, page }: { q?: string; page: number }) {
  const query = q?.trim()
  const where: Prisma.UserWhereInput = {
    role: 'CLIENT',
    ...(query
      ? {
          OR: (['name', 'email', 'company', 'phone'] as const).map((field) => ({
            [field]: { contains: query, mode: 'insensitive' as const },
          })),
        }
      : {}),
  }

  const [total, clients] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * CLIENTS_PAGE_SIZE,
      take: CLIENTS_PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { tickets: { where: { submittedAt: { not: null } } } } },
      },
    }),
  ])

  // Open tickets per client on this page, in one query.
  const open = clients.length
    ? await db.ticket.groupBy({
        by: ['userId'],
        where: {
          userId: { in: clients.map((c) => c.id) },
          submittedAt: { not: null },
          status: { in: [...OPEN_STATUSES] },
        },
        _count: { _all: true },
      })
    : []
  const openBy = new Map(open.map((row) => [row.userId, row._count._all]))

  return {
    clients: clients.map((c) => ({ ...c, tickets: c._count.tickets, openTickets: openBy.get(c.id) ?? 0 })),
    total,
    pageCount: Math.max(1, Math.ceil(total / CLIENTS_PAGE_SIZE)),
  }
}

export type ClientRow = Awaited<ReturnType<typeof listClients>>['clients'][number]

export async function getClientName(id: string) {
  return db.user.findFirst({ where: { id, role: 'CLIENT' }, select: { name: true, email: true } })
}

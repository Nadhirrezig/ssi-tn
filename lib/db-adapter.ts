import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaPg } from '@prisma/adapter-pg'

/**
 * Picks the Prisma driver for a connection string.
 *
 * - Neon (host ends in neon.tech): Neon's serverless driver, over WebSockets —
 *   what production on Vercel uses.
 * - Anything else (local Postgres, Docker, CI): the regular TCP driver. Neon's
 *   driver only speaks to Neon's own proxy and cannot reach a plain Postgres.
 *
 * No `server-only` here: scripts (scripts/create-admin.ts) share it.
 */
export function createDriverAdapter(connectionString: string | undefined) {
  const isNeon = !connectionString || /\.neon\.tech(?:[:/?]|$)/i.test(connectionString)
  return isNeon ? new PrismaNeon({ connectionString }) : new PrismaPg({ connectionString })
}

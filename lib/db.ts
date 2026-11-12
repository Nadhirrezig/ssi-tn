import 'server-only'

import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@/lib/generated/prisma/client'

/**
 * One Prisma client per server instance.
 *
 * Neon's serverless driver talks to the pooled endpoint over WebSockets, which
 * suits Vercel functions: no TCP connection to hold open between invocations.
 * It uses Node's global WebSocket (Node 22+, pinned in package.json engines).
 *
 * In development the client is parked on globalThis so hot reloads reuse it
 * instead of opening a new pool on every edit.
 */
const globalForDb = globalThis as unknown as { db?: PrismaClient }

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    // Not thrown: `next build` imports this module while collecting route
    // data, and a missing variable there should not fail pages that never
    // query. The first query will fail loudly instead.
    console.error('[db] DATABASE_URL is not set — database queries will fail.')
  }
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) })
}

export const db = globalForDb.db ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForDb.db = db

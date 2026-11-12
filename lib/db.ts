import 'server-only'

import { PrismaClient } from '@/lib/generated/prisma/client'
import { createDriverAdapter } from '@/lib/db-adapter'

/**
 * One Prisma client per server instance.
 *
 * In production the database is Neon, reached through Neon's serverless
 * driver over WebSockets — suited to Vercel functions, with no TCP connection
 * held open between invocations (Node's global WebSocket, Node 22+). A local
 * Postgres uses the TCP driver instead; see lib/db-adapter.ts.
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
  return new PrismaClient({ adapter: createDriverAdapter(connectionString) })
}

export const db = globalForDb.db ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForDb.db = db

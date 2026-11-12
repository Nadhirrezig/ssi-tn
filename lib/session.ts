import 'server-only'

import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

/**
 * Data access layer for authentication — every page, layout and Server Action
 * that needs a user goes through these, never through a cookie check alone.
 *
 * `cache` deduplicates the session lookup within one render pass; Server
 * Actions are not a render pass, so there each call hits the database.
 */
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
)

/** Signed-in client or admin; otherwise off to the login page. */
export async function requireUser() {
  const session = await getSession()
  if (!session) redirect('/connexion')
  return session
}

/**
 * Admins only. Anyone else gets a 404 rather than a "forbidden" page, so the
 * admin area does not advertise that it exists.
 */
export async function requireAdmin() {
  const session = await requireUser()
  if (session.user.role !== 'ADMIN') notFound()
  return session
}

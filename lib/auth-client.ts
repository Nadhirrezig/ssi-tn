import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import type { auth } from '@/lib/auth'

/**
 * Browser-side Better Auth client. Same origin, so no baseURL is needed: the
 * calls go to /api/auth/*, where rate limiting and origin checks apply.
 */
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})

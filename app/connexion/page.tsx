import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import SignInForm from '@/components/auth/SignInForm'
import { AUTH_LINK } from '@/components/auth/fields'
import { safeRedirectPath } from '@/lib/auth-ui'
import { getSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Connexion',
  robots: { index: false, follow: false },
}

/** Errors Better Auth appends when an email-verification link fails. */
const VERIFY_ERRORS = new Set(['INVALID_TOKEN', 'TOKEN_EXPIRED'])

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; error?: string }>
}) {
  const { next, error } = await searchParams
  const destination = safeRedirectPath(next)

  // Also where a verification link lands: on success the client is already
  // signed in, so they go straight on to their space.
  if (await getSession()) redirect(destination)

  const notice =
    error && VERIFY_ERRORS.has(error)
      ? {
          tone: 'error' as const,
          text: 'Ce lien de confirmation n’est plus valide. Connectez-vous : nous vous en enverrons un nouveau.',
        }
      : undefined

  return (
    <AuthShell
      eyebrow="Espace client"
      title="Connexion"
      lead="Accédez à vos tickets et suivez leur traitement par nos équipes."
      aside={
        <p>
          Pas encore de compte ?{' '}
          <Link href="/inscription" className={AUTH_LINK}>
            Créer un espace client
          </Link>
        </p>
      }
    >
      <SignInForm next={destination} notice={notice} />
    </AuthShell>
  )
}

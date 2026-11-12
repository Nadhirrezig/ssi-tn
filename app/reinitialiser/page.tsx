import type { Metadata } from 'next'
import Link from 'next/link'
import AuthShell from '@/components/auth/AuthShell'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import { AUTH_LINK, FormMessage } from '@/components/auth/fields'

export const metadata: Metadata = {
  title: 'Nouveau mot de passe',
  robots: { index: false, follow: false },
}

/**
 * Landing page of the reset link. Better Auth checks the token first and
 * redirects here with ?token=… when it is valid, or ?error=INVALID_TOKEN.
 */
export default async function ReinitialiserPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[]; error?: string }>
}) {
  const { token, error } = await searchParams
  const validToken = typeof token === 'string' && token.length > 0 && !error ? token : null

  return (
    <AuthShell
      eyebrow="Espace client"
      title="Nouveau mot de passe"
      aside={
        <p>
          <Link href="/connexion" className={AUTH_LINK}>
            Retour à la connexion
          </Link>
        </p>
      }
    >
      {validToken ? (
        <ResetPasswordForm token={validToken} />
      ) : (
        <div className="space-y-4">
          <FormMessage tone="error">
            Ce lien de réinitialisation n’est plus valide : il a expiré ou a déjà été utilisé.
          </FormMessage>
          <Link href="/mot-de-passe-oublie" className={AUTH_LINK}>
            Demander un nouveau lien
          </Link>
        </div>
      )}
    </AuthShell>
  )
}

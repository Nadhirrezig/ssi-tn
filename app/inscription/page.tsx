import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import SignUpForm from '@/components/auth/SignUpForm'
import { AUTH_LINK } from '@/components/auth/fields'
import { CLIENT_HOME } from '@/lib/auth-ui'
import { getSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Créer un espace client',
  robots: { index: false, follow: false },
}

export default async function InscriptionPage() {
  if (await getSession()) redirect(CLIENT_HOME)

  return (
    <AuthShell
      eyebrow="Espace client"
      title="Créer votre espace client"
      lead="Soumettez vos demandes à nos équipes et suivez leur avancement, au même endroit."
      aside={
        <p>
          Déjà client ?{' '}
          <Link href="/connexion" className={AUTH_LINK}>
            Se connecter
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthShell>
  )
}

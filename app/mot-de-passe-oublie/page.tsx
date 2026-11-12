import type { Metadata } from 'next'
import Link from 'next/link'
import AuthShell from '@/components/auth/AuthShell'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import { AUTH_LINK } from '@/components/auth/fields'

export const metadata: Metadata = {
  title: 'Mot de passe oublié',
  robots: { index: false, follow: false },
}

export default function MotDePasseOubliePage() {
  return (
    <AuthShell
      eyebrow="Espace client"
      title="Mot de passe oublié"
      lead="Indiquez l’adresse e-mail de votre compte : nous vous enverrons un lien pour en choisir un nouveau."
      aside={
        <p>
          <Link href="/connexion" className={AUTH_LINK}>
            Retour à la connexion
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}

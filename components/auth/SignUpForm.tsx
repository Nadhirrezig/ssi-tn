'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { authErrorMessage } from '@/lib/auth-ui'
import { AUTH_LINK, Field, FormMessage, SubmitButton } from './fields'

export default function SignUpForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') ?? '')

    if (password !== String(form.get('confirm') ?? '')) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setPending(true)
    setError(null)

    const email = String(form.get('email') ?? '').trim()
    const { error } = await authClient.signUp.email({
      name: String(form.get('name') ?? '').trim(),
      email,
      password,
      // The verification link signs the client in and lands on /connexion,
      // which forwards a signed-in visitor to their space — and shows a clear
      // message instead when the link has expired.
      callbackURL: '/connexion',
    })

    setPending(false)
    if (error) {
      setError(authErrorMessage(error))
      return
    }
    // Shown for existing addresses too: Better Auth answers identically so the
    // form cannot reveal who already has an account. The owner gets an email.
    setSentTo(email)
  }

  if (sentTo) {
    return (
      <div className="space-y-4" role="status">
        <h2 className="font-heading text-xl font-bold text-navy">Vérifiez votre boîte mail</h2>
        <p className="text-base leading-relaxed text-slatebody">
          Nous avons envoyé un lien de confirmation à{' '}
          <span className="font-semibold text-navy">{sentTo}</span>. Cliquez dessus pour activer
          votre espace client.
        </p>
        <p className="text-sm leading-relaxed text-slatebody">
          Rien reçu après quelques minutes ? Regardez dans vos courriers indésirables, ou{' '}
          <Link href="/connexion" className={AUTH_LINK}>
            connectez-vous
          </Link>{' '}
          : un nouveau lien vous sera envoyé.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field
        id="name"
        name="name"
        label="Nom et prénom"
        autoComplete="name"
        required
        maxLength={120}
        disabled={pending}
      />
      <Field
        id="email"
        name="email"
        type="email"
        label="Adresse e-mail"
        autoComplete="email"
        required
        disabled={pending}
      />
      <Field
        id="password"
        name="password"
        type="password"
        label="Mot de passe"
        hint="8 caractères minimum."
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
        required
        disabled={pending}
      />
      <Field
        id="confirm"
        name="confirm"
        type="password"
        label="Confirmer le mot de passe"
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
        required
        disabled={pending}
      />

      {error ? <FormMessage tone="error">{error}</FormMessage> : null}

      <SubmitButton pending={pending}>{pending ? 'Création…' : 'Créer mon espace client'}</SubmitButton>
    </form>
  )
}

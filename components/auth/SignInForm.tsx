'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { authErrorMessage } from '@/lib/auth-ui'
import { AUTH_LINK, Field, FormMessage, SubmitButton } from './fields'

type Message = { tone: 'error' | 'success'; text: string }

export default function SignInForm({ next, notice }: { next: string; notice?: Message }) {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<Message | null>(notice ?? null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setPending(true)
    setMessage(null)

    // callbackURL does double duty: where to go after a successful sign-in,
    // and where the link in a re-sent verification email leads.
    const { error } = await authClient.signIn.email({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
      callbackURL: next,
    })

    if (error) {
      // An unconfirmed address is not a mistake on the client's part — a new
      // link is already on its way — so it reads as information, not an error.
      setMessage({
        tone: error.code === 'EMAIL_NOT_VERIFIED' ? 'success' : 'error',
        text: authErrorMessage(error),
      })
      setPending(false)
    }
    // On success the auth client navigates to `next` with a full page load,
    // so the server renders with the new session. The button stays disabled.
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
        autoComplete="current-password"
        required
        disabled={pending}
      />
      <p className="-mt-2 text-right text-sm">
        <Link href="/mot-de-passe-oublie" className={AUTH_LINK}>
          Mot de passe oublié ?
        </Link>
      </p>

      {message ? <FormMessage tone={message.tone}>{message.text}</FormMessage> : null}

      <SubmitButton pending={pending}>{pending ? 'Connexion…' : 'Se connecter'}</SubmitButton>
    </form>
  )
}

'use client'

import { useState, type FormEvent } from 'react'
import { authClient } from '@/lib/auth-client'
import { authErrorMessage } from '@/lib/auth-ui'
import { Field, FormMessage, SubmitButton } from './fields'

export default function ForgotPasswordForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setPending(true)
    setError(null)

    const { error } = await authClient.requestPasswordReset({
      email: String(form.get('email') ?? '').trim(),
      // The emailed link checks the token, then lands here with ?token=…
      // (or ?error=INVALID_TOKEN when it is expired or already used).
      redirectTo: '/reinitialiser',
    })

    setPending(false)
    if (error) {
      setError(authErrorMessage(error))
      return
    }
    setDone(true)
  }

  if (done) {
    // Same answer whether or not the address has an account.
    return (
      <FormMessage tone="success">
        Si un compte existe pour cette adresse, un e-mail contenant un lien de réinitialisation
        vient de lui être envoyé. Le lien est valable 1 heure.
      </FormMessage>
    )
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

      {error ? <FormMessage tone="error">{error}</FormMessage> : null}

      <SubmitButton pending={pending}>{pending ? 'Envoi…' : 'Recevoir un lien'}</SubmitButton>
    </form>
  )
}

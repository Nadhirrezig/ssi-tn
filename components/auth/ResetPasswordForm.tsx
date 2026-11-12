'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { authErrorMessage } from '@/lib/auth-ui'
import { AUTH_LINK, Field, FormMessage, SubmitButton } from './fields'

export default function ResetPasswordForm({ token }: { token: string }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const newPassword = String(form.get('password') ?? '')

    if (newPassword !== String(form.get('confirm') ?? '')) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setPending(true)
    setError(null)
    const { error } = await authClient.resetPassword({ newPassword, token })
    setPending(false)

    if (error) {
      setError(authErrorMessage(error))
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="space-y-4" role="status">
        <FormMessage tone="success">
          Votre mot de passe a été modifié. Par sécurité, vos autres appareils ont été déconnectés.
        </FormMessage>
        <Link href="/connexion" className={AUTH_LINK}>
          Me connecter
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field
        id="password"
        name="password"
        type="password"
        label="Nouveau mot de passe"
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

      <SubmitButton pending={pending}>{pending ? 'Enregistrement…' : 'Enregistrer'}</SubmitButton>
    </form>
  )
}

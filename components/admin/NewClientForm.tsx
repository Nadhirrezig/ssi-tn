'use client'

import { startTransition, useActionState, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Field, FIELD_INPUT, FormMessage } from '@/components/auth/fields'
import type { NewClientState } from '@/app/admin/clients/actions'

/** No look-alikes (0/O, 1/l/I): the client may have to type it from a phone. */
const ALPHABET = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generatePassword(length = 14) {
  const bytes = crypto.getRandomValues(new Uint32Array(length))
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
}

/**
 * "Nouveau client": the team fills the account and its password; the client
 * gets both by email and can sign in at once.
 *
 * Submitted by hand rather than through <form action>: React resets a form
 * after an action, which would blank every field on a validation error.
 */
export default function NewClientForm({
  action,
}: {
  action: (prev: NewClientState, formData: FormData) => Promise<NewClientState>
}) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const errors = state?.errors ?? {}

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const formData = new FormData(event.currentTarget)
    startTransition(() => formAction(formData))
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-[24px] border border-black/5 bg-white p-5 sm:p-8">
      <h2 className="font-heading text-lg font-bold text-navy">Informations du client</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field id="name" name="name" label="Nom et prénom" autoComplete="off" required error={errors.name} disabled={pending} />
        <Field
          id="email"
          name="email"
          type="email"
          label="E-mail"
          autoComplete="off"
          required
          hint="Servira d’identifiant de connexion."
          error={errors.email}
          disabled={pending}
        />
        <Field id="company" name="company" label="Société" optional autoComplete="off" error={errors.company} disabled={pending} />
        <Field
          id="phone"
          name="phone"
          type="tel"
          label="Téléphone"
          optional
          placeholder="+216 …"
          autoComplete="off"
          error={errors.phone}
          disabled={pending}
        />
      </div>

      <div className="mt-8 border-t border-black/5 pt-6">
        <h2 className="font-heading text-lg font-bold text-navy">Accès</h2>
        <label htmlFor="password" className="mt-5 block font-heading text-sm font-bold text-navy">
          Mot de passe
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="relative flex-1">
            <input
              id="password"
              name="password"
              type={visible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              spellCheck={false}
              required
              disabled={pending}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby="password-note"
              className={`${FIELD_INPUT} pr-12 font-mono ${errors.password ? 'border-accentCoral' : 'border-black/10'}`}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              aria-pressed={visible}
              className="absolute right-1.5 top-[13px] grid h-10 w-10 place-items-center rounded-lg text-slatebody transition hover:text-primary"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
                {visible ? null : <path d="m3 3 18 18" />}
              </svg>
            </button>
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setPassword(generatePassword())
              setVisible(true)
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 font-heading text-sm font-bold text-navy transition hover:border-primary hover:text-primary sm:mt-2"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Générer
          </button>
        </div>
        <p
          id="password-note"
          className={`mt-1.5 text-xs ${errors.password ? 'font-semibold text-[#B4234A]' : 'text-slatebody'}`}
        >
          {errors.password ?? '8 caractères minimum. Envoyé au client par e-mail avec son identifiant.'}
        </p>

        <div className="mt-6 flex gap-3 rounded-2xl bg-primary-50 px-4 py-3.5 text-sm leading-relaxed text-navy">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-primary">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <p>
            Le client reçoit l’e-mail <strong>«&nbsp;Votre espace client SSI est prêt&nbsp;»</strong> avec son identifiant
            et ce mot de passe. Il peut se connecter immédiatement.
          </p>
        </div>
      </div>

      {state?.error ? (
        <div className="mt-5">
          <FormMessage tone="error">{state.error}</FormMessage>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/clients"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 font-heading text-sm font-bold text-slatebody transition hover:text-navy"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-heading text-sm font-bold text-white shadow-float transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Création…' : 'Créer le compte et envoyer les accès'}
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import MessageTextarea from './MessageTextarea'
import { AUTH_LINK, Field, FormMessage, SubmitButton } from '@/components/auth/fields'
import { authClient } from '@/lib/auth-client'
import { authErrorMessage, NEW_TICKET_PATH, VERIFY_CALLBACK_URL } from '@/lib/auth-ui'
import { loadDraft, saveDraft } from '@/lib/ticket-draft'
import { SIGN_UP_TICKET_FIELD, validateMessage } from '@/lib/ticket-status'
import { useIsClient } from '@/lib/use-is-client'

type Mode = 'new' | 'existing'
type Message = { tone: 'error' | 'success'; text: string }

const PLACEHOLDER =
  'Ex. : Nous souhaitons sécuriser l’accès à distance de nos 12 collaborateurs (VPN, double authentification). Pouvez-vous nous proposer une solution ?'

/**
 * Public ticket form: the request first, then who is sending it.
 *
 * - New client: the account is created and the request saved as a draft in
 *   the same call; it reaches the team once the email address is confirmed.
 * - Existing client: the request is kept in the browser, the client signs in
 *   and lands on the "new ticket" form with it filled in, ready to send.
 *
 * The text is saved locally as it is typed (lib/ticket-draft), so a detour —
 * password reset, closed tab — does not lose it.
 */
export default function TicketRequestForm() {
  const isClient = useIsClient()
  return isClient ? <RequestForm /> : <RequestFormPlaceholder />
}

function RequestForm() {
  const [message, setMessage] = useState(loadDraft)
  const [mode, setMode] = useState<Mode>('new')
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState<Message | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)

  function onMessageChange(value: string) {
    setMessage(value)
    saveDraft(value)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = new FormData(event.currentTarget)
    const text = message.trim()

    const invalid = validateMessage(text)
    if (invalid) {
      setNotice({ tone: 'error', text: invalid })
      return
    }

    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    if (mode === 'new' && password !== String(form.get('confirm') ?? '')) {
      setNotice({ tone: 'error', text: 'Les deux mots de passe ne correspondent pas.' })
      return
    }

    setPending(true)
    setNotice(null)
    saveDraft(text)

    if (mode === 'new') {
      // Better Auth ignores body fields it does not know; lib/auth.ts reads
      // this one in its user-creation hook and stores the draft ticket.
      const body = {
        name: String(form.get('name') ?? '').trim(),
        email,
        password,
        callbackURL: VERIFY_CALLBACK_URL,
        [SIGN_UP_TICKET_FIELD]: text,
      }
      const { error } = await authClient.signUp.email(body)
      setPending(false)
      if (error) {
        setNotice({ tone: 'error', text: authErrorMessage(error) })
        return
      }
      // The local copy stays until the welcome page: if the address already
      // had an account, no draft was stored and the client will need it.
      setSentTo(email)
      return
    }

    // Existing client: on success the auth client navigates to the
    // new-ticket form, which picks the saved text up.
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: NEW_TICKET_PATH,
    })
    if (error) {
      setNotice({
        tone: error.code === 'EMAIL_NOT_VERIFIED' ? 'success' : 'error',
        text: authErrorMessage(error),
      })
      setPending(false)
    }
  }

  if (sentTo) return <CheckInbox email={sentTo} />

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <fieldset className="space-y-4">
        <Step number={1} title="Votre demande" id="step-request" />
        <p id="message-help" className="text-sm text-slatebody">
          Décrivez le problème ou le besoin avec vos mots : ce qui se passe, depuis quand, qui est
          concerné.
        </p>
        <MessageTextarea
          id="message"
          name="message"
          rows={8}
          value={message}
          onValueChange={onMessageChange}
          placeholder={PLACEHOLDER}
          aria-labelledby="step-request"
          aria-describedby="message-help"
          required
          readOnly={pending}
        />
      </fieldset>

      <fieldset className="space-y-5">
        <Step number={2} title="Vos coordonnées" id="step-contact" />

        <div role="radiogroup" aria-labelledby="step-contact" className="grid grid-cols-2 gap-1 rounded-full bg-soft p-1">
          {(
            [
              { value: 'new', label: 'Nouveau client' },
              { value: 'existing', label: 'Déjà client' },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-2.5 text-center font-heading text-sm font-bold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
                mode === option.value ? 'bg-white text-navy shadow-card' : 'text-slatebody hover:text-navy'
              }`}
            >
              <input
                type="radio"
                name="mode"
                value={option.value}
                checked={mode === option.value}
                onChange={() => {
                  setMode(option.value)
                  setNotice(null)
                }}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>

        {mode === 'new' ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field id="name" name="name" label="Nom et prénom" autoComplete="name" required maxLength={120} disabled={pending} />
            </div>
            <div className="sm:col-span-2">
              <Field id="email" name="email" type="email" label="Adresse e-mail" autoComplete="email" required disabled={pending} />
            </div>
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
              label="Confirmation"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              disabled={pending}
            />
            <p className="text-sm text-slatebody sm:col-span-2">
              Un espace client est créé pour vous : vous y suivrez cette demande et les suivantes.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <Field id="email" name="email" type="email" label="Adresse e-mail" autoComplete="email" required disabled={pending} />
            <Field
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              autoComplete="current-password"
              required
              disabled={pending}
            />
            <p className="text-right text-sm">
              <Link href="/mot-de-passe-oublie" className={AUTH_LINK}>
                Mot de passe oublié ?
              </Link>
            </p>
          </div>
        )}
      </fieldset>

      <div className="space-y-4">
        {notice ? <FormMessage tone={notice.tone}>{notice.text}</FormMessage> : null}
        <SubmitButton pending={pending}>
          {pending
            ? 'Envoi…'
            : mode === 'new'
              ? 'Envoyer ma demande'
              : 'Me connecter et continuer'}
        </SubmitButton>
        <p className="text-center text-xs leading-relaxed text-slatebody">
          Vos données servent uniquement au traitement de votre demande.{' '}
          <Link href="/confidentialite" className={AUTH_LINK}>
            Politique de confidentialité
          </Link>
        </p>
      </div>
    </form>
  )
}

function Step({ number, title, id }: { number: number; title: string; id: string }) {
  return (
    <legend className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-primary">{String(number).padStart(2, '0')}</span>
      <span id={id} className="font-heading text-lg font-bold text-navy">
        {title}
      </span>
    </legend>
  )
}

function CheckInbox({ email }: { email: string }) {
  return (
    <div role="status" className="py-4 text-center">
      <span aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </span>
      <h2 className="mt-5 font-heading text-2xl font-bold text-navy">Dernière étape : confirmez votre adresse</h2>
      <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slatebody">
        Nous avons envoyé un lien à <span className="font-semibold text-navy">{email}</span>. Votre
        demande sera transmise à notre équipe dès que vous aurez cliqué dessus.
      </p>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slatebody">
        Rien reçu ? Vérifiez vos courriers indésirables. Si vous aviez déjà un espace client,{' '}
        <Link href={`/connexion?next=${encodeURIComponent(NEW_TICKET_PATH)}`} className={AUTH_LINK}>
          connectez-vous
        </Link>{' '}
        : votre demande vous y attendra.
      </p>
    </div>
  )
}

function RequestFormPlaceholder() {
  return (
    <div aria-hidden="true" className="space-y-10">
      <fieldset disabled className="space-y-4">
        <Step number={1} title="Votre demande" id="step-request-placeholder" />
        <div className="h-5 w-3/4 rounded-full bg-navy/5" />
        <div className="h-[13.75rem] rounded-xl border border-black/10 bg-white" />
      </fieldset>
      <fieldset disabled className="space-y-5">
        <Step number={2} title="Vos coordonnées" id="step-contact-placeholder" />
        <div className="h-11 rounded-full bg-soft" />
        <div className="h-48 rounded-xl bg-navy/[0.03]" />
      </fieldset>
    </div>
  )
}

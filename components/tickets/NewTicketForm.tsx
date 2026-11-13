'use client'

import { startTransition, useActionState, useState, type FormEvent } from 'react'
import MessageTextarea from './MessageTextarea'
import { FormMessage, SubmitButton } from '@/components/auth/fields'
import { createTicketAction } from '@/app/espace-client/actions'
import { clearDraft, loadDraft, saveDraft } from '@/lib/ticket-draft'
import { TICKET_CATEGORIES, validateMessage, type TicketCategory } from '@/lib/ticket-status'
import { useIsClient } from '@/lib/use-is-client'

const PLACEHOLDER =
  'Ex. : Depuis ce matin, trois postes du service comptable n’accèdent plus au serveur de fichiers. Le message affiché est « chemin réseau introuvable ». Nous avons déjà redémarré les postes.'

/**
 * New ticket for a signed-in client. Picks up a draft written on the public
 * /ticket page before logging in, and keeps saving as the client types.
 *
 * The draft lives in localStorage, which the server cannot see, so the editor
 * renders after hydration; a same-size placeholder holds its place until then.
 */
export default function NewTicketForm({ category = null }: { category?: TicketCategory | null }) {
  const isClient = useIsClient()
  return isClient ? <Editor category={category} /> : <EditorPlaceholder />
}

function Editor({ category }: { category: TicketCategory | null }) {
  const [state, formAction, pending] = useActionState(createTicketAction, undefined)
  const [initialDraft] = useState(loadDraft)
  const [message, setMessage] = useState(initialDraft)
  const [clientError, setClientError] = useState<string | null>(null)

  function onChange(value: string) {
    setMessage(value)
    setClientError(null)
    saveDraft(value)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const invalid = validateMessage(message.trim())
    if (invalid) {
      setClientError(invalid)
      return
    }
    const formData = new FormData(event.currentTarget)
    // On success the server redirects to the new ticket; the draft is done.
    // On an error the text is still in the box and is saved again on the next edit.
    clearDraft()
    startTransition(() => formAction(formData))
  }

  const error = clientError ?? state?.error

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Set by the quote / demo entry points (?objet=…); the server re-validates it. */}
      {category ? <input type="hidden" name="category" value={category} /> : null}
      <MessageLabel />
      <div>
        <MessageTextarea
          id="message"
          name="message"
          rows={9}
          value={message}
          onValueChange={onChange}
          placeholder={category ? TICKET_CATEGORIES[category].placeholder : PLACEHOLDER}
          aria-describedby="message-help"
          required
          readOnly={pending}
        />
        {initialDraft ? (
          <p className="mt-1 text-xs text-slatebody">
            Nous avons repris le texte que vous aviez commencé à écrire.
          </p>
        ) : null}
      </div>

      {error ? <FormMessage tone="error">{error}</FormMessage> : null}

      <SubmitButton pending={pending}>{pending ? 'Envoi…' : 'Envoyer ma demande'}</SubmitButton>
    </form>
  )
}

function MessageLabel() {
  return (
    <div>
      <label htmlFor="message" className="block font-heading text-sm font-bold text-navy">
        Votre demande
      </label>
      <p id="message-help" className="mt-1 text-sm text-slatebody">
        Décrivez le problème ou le besoin avec vos mots. Plus c’est précis, plus nous allons vite.
      </p>
    </div>
  )
}

function EditorPlaceholder() {
  return (
    <div aria-hidden="true" className="space-y-5">
      <MessageLabel />
      <div className="h-[15.5rem] rounded-xl border border-black/10 bg-white" />
      <div className="h-[3.25rem] rounded-full bg-primary/40" />
    </div>
  )
}

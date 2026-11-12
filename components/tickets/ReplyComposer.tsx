'use client'

import { startTransition, useActionState, useState, type FormEvent } from 'react'
import MessageTextarea from './MessageTextarea'
import { FormMessage } from '@/components/auth/fields'
import type { FormState } from '@/app/espace-client/actions'

/**
 * Reply box under the thread. The action arrives pre-bound to the ticket from
 * the server page. On success the server refreshes the page (the new message
 * appears in the thread) and returns a new `sentAt`; the field is keyed on it,
 * so it remounts empty. On error the key is unchanged and the text stays.
 */
export default function ReplyComposer({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
}) {
  const [state, formAction, pending] = useActionState(action, undefined)

  function submit(formData: FormData) {
    startTransition(() => formAction(formData))
  }

  return (
    <ReplyForm key={state?.sentAt ?? 0} onSend={submit} pending={pending} error={state?.error} />
  )
}

function ReplyForm({
  onSend,
  pending,
  error,
}: {
  onSend: (formData: FormData) => void
  pending: boolean
  error?: string
}) {
  const [body, setBody] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Submitted by hand rather than through <form action>: React resets a
    // form after an action, which would blank the text on a failed send.
    event.preventDefault()
    if (!body.trim() || pending) return
    onSend(new FormData(event.currentTarget))
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[20px] border border-black/5 bg-soft p-4 sm:p-5">
      <label htmlFor="reply" className="font-heading text-sm font-bold text-navy">
        Votre réponse
      </label>
      <div className="mt-3">
        <MessageTextarea
          id="reply"
          name="body"
          rows={4}
          value={body}
          onValueChange={setBody}
          placeholder="Ajoutez une précision, répondez à une question de notre équipe…"
          required
          readOnly={pending}
        />
      </div>

      {error ? (
        <div className="mt-3">
          <FormMessage tone="error">{error}</FormMessage>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slatebody">
          Notre équipe est prévenue par e-mail.
          <span className="hidden sm:inline"> ⌘/Ctrl + Entrée pour envoyer.</span>
        </p>
        <button
          type="submit"
          disabled={pending || !body.trim()}
          aria-busy={pending}
          className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-heading text-sm font-bold text-white transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
    </form>
  )
}

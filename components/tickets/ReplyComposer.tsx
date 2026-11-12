'use client'

import { startTransition, useActionState, useState, type FormEvent } from 'react'
import MessageTextarea from './MessageTextarea'
import { FormMessage } from '@/components/auth/fields'
import type { FormState } from '@/app/espace-client/actions'
import { STATUS_META, type TicketStatus } from '@/lib/ticket-status'

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  label?: string
  placeholder?: string
  hint?: string
  /**
   * Admin view: statuses the ticket may move to, offered as "Après envoi :"
   * so a reply and a status change go out as one step and one email.
   */
  nextStatuses?: readonly TicketStatus[]
  currentStatus?: TicketStatus
}

/**
 * Reply box under the thread. The action arrives pre-bound to the ticket from
 * the server page. On success the server refreshes the page (the new message
 * appears in the thread) and returns a new `sentAt`; the form is keyed on it,
 * so it remounts empty. On error the key is unchanged and the text stays.
 */
export default function ReplyComposer({ action, ...props }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)

  function submit(formData: FormData) {
    startTransition(() => formAction(formData))
  }

  return <ReplyForm key={state?.sentAt ?? 0} onSend={submit} pending={pending} error={state?.error} {...props} />
}

function ReplyForm({
  onSend,
  pending,
  error,
  label = 'Votre réponse',
  placeholder = 'Ajoutez une précision, répondez à une question de notre équipe…',
  hint = 'Notre équipe est prévenue par e-mail.',
  nextStatuses,
  currentStatus,
}: Omit<Props, 'action'> & {
  onSend: (formData: FormData) => void
  pending: boolean
  error?: string
}) {
  const [body, setBody] = useState('')
  const [nextStatus, setNextStatus] = useState<TicketStatus | ''>('')

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
        {label}
      </label>
      <div className="mt-3">
        <MessageTextarea
          id="reply"
          name="body"
          rows={5}
          value={body}
          onValueChange={setBody}
          placeholder={placeholder}
          required
          readOnly={pending}
        />
      </div>

      {error ? (
        <div className="mt-3">
          <FormMessage tone="error">{error}</FormMessage>
        </div>
      ) : null}

      {/* Phones: status select and button stack at full width; from sm up
          they share one line. */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        {nextStatuses?.length ? (
          <label className="flex flex-col gap-1.5 text-sm text-slatebody sm:flex-row sm:items-center sm:gap-2">
            <span className="font-heading font-bold text-navy">Après envoi :</span>
            <select
              name="nextStatus"
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value as TicketStatus | '')}
              disabled={pending}
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-4 pr-9 font-heading text-sm font-bold text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-auto sm:py-2"
            >
              <option value="">
                {currentStatus ? `Garder « ${STATUS_META[currentStatus].label} »` : 'Statut inchangé'}
              </option>
              {nextStatuses.map((status) => (
                <option key={status} value={status}>
                  Passer à « {STATUS_META[status].label} »
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-xs text-slatebody">
            {hint}
            <span className="hidden sm:inline"> ⌘/Ctrl + Entrée pour envoyer.</span>
          </p>
        )}
        <button
          type="submit"
          disabled={pending || !body.trim()}
          aria-busy={pending}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-3 font-heading text-sm font-bold text-white transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {pending ? 'Envoi…' : nextStatus ? `Envoyer · ${STATUS_META[nextStatus].label}` : 'Envoyer'}
        </button>
      </div>
      {nextStatuses?.length ? (
        <p className="mt-3 text-xs text-slatebody">
          {hint}
          <span className="hidden sm:inline"> ⌘/Ctrl + Entrée pour envoyer.</span>
        </p>
      ) : null}
    </form>
  )
}

'use client'

import { startTransition, useActionState, useState } from 'react'
import { FormMessage } from '@/components/auth/fields'
import type { FormState } from '@/app/espace-client/actions'
import { STATUS_META, type TicketStatus } from '@/lib/ticket-status'

/**
 * Side-panel status buttons: the next step on the main line as the primary
 * action, cancellation as a quiet secondary one behind an inline
 * confirmation — the client is emailed either way.
 */
export default function StatusActions({
  action,
  current,
  next,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  current: TicketStatus
  next: readonly TicketStatus[]
}) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const forward = next.filter((s) => s !== 'REJECTED')
  const canCancel = next.includes('REJECTED')

  function move(to: TicketStatus) {
    const formData = new FormData()
    formData.set('to', to)
    setConfirmCancel(false)
    startTransition(() => formAction(formData))
  }

  return (
    <section aria-labelledby="status-actions" className="rounded-[24px] border border-black/5 bg-white p-6">
      <h2
        id="status-actions"
        className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-slatebody"
      >
        Statut
      </h2>
      <p className="mt-3 text-sm text-slatebody">
        Actuellement <span className="font-semibold text-navy">« {STATUS_META[current].label} »</span>.
        Le client est prévenu par e-mail.
      </p>

      <div className="mt-4 space-y-2">
        {forward.map((to) => (
          <button
            key={to}
            type="button"
            onClick={() => move(to)}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          >
            Passer à « {STATUS_META[to].label} »
          </button>
        ))}

        {canCancel ? (
          confirmCancel ? (
            <div className="rounded-2xl bg-accentCoral/10 p-4">
              <p className="text-sm text-navy">
                Annuler cette demande ? Elle sera clôturée et ne pourra plus recevoir de réponse.
              </p>
              <p className="mt-1.5 text-xs text-slatebody">
                Pour en donner la raison au client, répondez plutôt avec « Après envoi : Annulé ».
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => move('REJECTED')}
                  disabled={pending}
                  className="rounded-full bg-navy px-4 py-2 font-heading text-sm font-bold text-white transition hover:bg-navy/90 disabled:opacity-60"
                >
                  Oui, annuler
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  disabled={pending}
                  className="rounded-full px-4 py-2 font-heading text-sm font-bold text-navy transition hover:bg-white"
                >
                  Non
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmCancel(true)}
              disabled={pending}
              className="w-full rounded-full px-5 py-2.5 font-heading text-sm font-bold text-slatebody transition hover:bg-accentCoral/10 hover:text-navy disabled:opacity-60"
            >
              Annuler la demande
            </button>
          )
        ) : null}
      </div>

      {pending ? (
        <p role="status" className="mt-3 text-center text-xs text-slatebody">
          Mise à jour…
        </p>
      ) : null}
      {state?.error ? (
        <div className="mt-3">
          <FormMessage tone="error">{state.error}</FormMessage>
        </div>
      ) : null}
    </section>
  )
}

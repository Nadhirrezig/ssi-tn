import { STATUS_META, STATUS_STEPS, type TicketStatus } from '@/lib/ticket-status'

/**
 * Segmented progress bar for the main lifecycle, with the sentence that
 * answers the client's real question: "what happens now?".
 *
 * A cancelled ticket keeps the segments it had reached, in coral, so the
 * client sees where it stopped.
 */
export default function StatusStepper({
  status,
  rejectedFrom,
}: {
  status: TicketStatus
  /** For REJECTED: the status it was cancelled from (from the event log). */
  rejectedFrom?: TicketStatus | null
}) {
  const rejected = status === 'REJECTED'
  const reachedIndex = rejected
    ? Math.max(0, STATUS_STEPS.indexOf(rejectedFrom ?? 'PENDING'))
    : STATUS_STEPS.indexOf(status)

  return (
    <div>
      <p className="sr-only">
        {rejected
          ? `Demande annulée à l’étape « ${STATUS_META[STATUS_STEPS[reachedIndex]].label} ».`
          : `Étape ${reachedIndex + 1} sur ${STATUS_STEPS.length} : ${STATUS_META[status].label}.`}
      </p>

      <div aria-hidden="true" className="grid grid-cols-4 gap-1.5">
        {STATUS_STEPS.map((step, i) => (
          <div
            key={step}
            className={`h-1.5 rounded-full ${
              i <= reachedIndex ? (rejected ? 'bg-accentCoral' : 'bg-primary') : 'bg-navy/10'
            }`}
          />
        ))}
      </div>
      <ol aria-hidden="true" className="mt-2.5 grid grid-cols-4 gap-1.5">
        {STATUS_STEPS.map((step, i) => (
          <li
            key={step}
            className={`font-heading text-[11px] sm:text-xs ${
              i === reachedIndex
                ? 'font-bold text-navy'
                : i < reachedIndex
                  ? 'font-semibold text-navy/70'
                  : 'font-semibold text-slatebody/70'
            }`}
          >
            {STATUS_META[step].label}
          </li>
        ))}
      </ol>

      <p className="mt-4 text-sm leading-relaxed text-slatebody">
        {STATUS_META[status].description}
      </p>
    </div>
  )
}

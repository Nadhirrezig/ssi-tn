import StatusBadge from './StatusBadge'
import { formatDateTime, type TicketStatus } from '@/lib/ticket-status'

/** Properties panel beside the conversation — client and admin views. */
export default function TicketDetails({
  ticket,
}: {
  ticket: {
    ref: string
    status: TicketStatus
    createdAt: Date
    updatedAt: Date
    submittedAt: Date | null
    messages: { createdAt: Date }[]
  }
}) {
  const lastActivity = ticket.messages.at(-1)?.createdAt ?? ticket.updatedAt

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Référence', value: <span className="font-mono text-[13px]">{ticket.ref}</span> },
    { label: 'Statut', value: <StatusBadge status={ticket.status} /> },
    { label: 'Ouverte le', value: formatDateTime(ticket.submittedAt ?? ticket.createdAt) },
    { label: 'Mise à jour', value: formatDateTime(lastActivity) },
    { label: 'Messages', value: String(ticket.messages.length + 1) },
  ]

  return (
    <section aria-labelledby="ticket-details" className="rounded-[24px] border border-black/5 bg-white p-5 sm:p-6">
      <h2
        id="ticket-details"
        className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-slatebody"
      >
        Détails
      </h2>
      <dl className="mt-4 divide-y divide-black/5 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="whitespace-nowrap text-slatebody">{row.label}</dt>
            <dd className="whitespace-nowrap text-right font-semibold text-navy">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

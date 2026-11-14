import Avatar from '@/components/tickets/Avatar'
import { formatDate } from '@/lib/ticket-status'

/** Who is asking — the first thing an agent wants beside the conversation. */
export default function ClientCard({
  client,
}: {
  client: {
    name: string
    email: string
    company: string | null
    phone: string | null
    createdAt: Date
    _count: { tickets: number }
  }
}) {
  const count = client._count.tickets
  return (
    <section aria-labelledby="client-card" className="rounded-[24px] border border-black/5 bg-white p-5 sm:p-6">
      <h2 id="client-card" className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-slatebody">
        Client
      </h2>
      <div className="mt-4 flex items-center gap-3">
        <Avatar name={client.name} />
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-bold text-navy">{client.name}</p>
          {client.company ? <p className="truncate text-sm text-navy">{client.company}</p> : null}
          <a
            href={`mailto:${client.email}`}
            className="block truncate text-sm text-primary underline-offset-2 hover:underline"
          >
            {client.email}
          </a>
        </div>
      </div>
      {client.phone ? (
        <a
          href={`tel:${client.phone.replace(/[^\d+]/g, '')}`}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-soft px-3.5 py-1.5 text-sm font-semibold text-navy transition hover:text-primary"
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
          </svg>
          {client.phone}
        </a>
      ) : null}
      <p className="mt-4 text-sm text-slatebody">
        Client depuis le {formatDate(client.createdAt)} · {count} demande{count > 1 ? 's' : ''}
      </p>
    </section>
  )
}

import Avatar from '@/components/tickets/Avatar'
import { formatDate } from '@/lib/ticket-status'

/** Who is asking — the first thing an agent wants beside the conversation. */
export default function ClientCard({
  client,
}: {
  client: { name: string; email: string; createdAt: Date; _count: { tickets: number } }
}) {
  const count = client._count.tickets
  return (
    <section aria-labelledby="client-card" className="rounded-[24px] border border-black/5 bg-white p-6">
      <h2 id="client-card" className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-slatebody">
        Client
      </h2>
      <div className="mt-4 flex items-center gap-3">
        <Avatar name={client.name} />
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-bold text-navy">{client.name}</p>
          <a
            href={`mailto:${client.email}`}
            className="block truncate text-sm text-primary underline-offset-2 hover:underline"
          >
            {client.email}
          </a>
        </div>
      </div>
      <p className="mt-4 text-sm text-slatebody">
        Client depuis le {formatDate(client.createdAt)} · {count} demande{count > 1 ? 's' : ''}
      </p>
    </section>
  )
}

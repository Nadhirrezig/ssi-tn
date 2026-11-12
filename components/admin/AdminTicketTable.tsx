import Link from 'next/link'
import StatusBadge from '@/components/tickets/StatusBadge'
import type { AdminTicketRow } from '@/lib/admin-tickets'
import { formatDate, formatDateTime, ticketTitle } from '@/lib/ticket-status'

const href = (ref: string) => `/admin/tickets/${ref}`

/** "À répondre": the client spoke last, or nobody has answered yet. */
function AwaitingTag() {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-heading text-xs font-bold text-primary">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
      À répondre
    </span>
  )
}

/**
 * The team's inbox. A real table from md up (scannable columns, the whole row
 * clickable through the title link); stacked rows on phones.
 */
export default function AdminTicketTable({ tickets }: { tickets: AdminTicketRow[] }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-black/5 bg-white">
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="bg-soft">
          <tr className="whitespace-nowrap font-heading text-xs font-bold uppercase tracking-[0.08em] text-slatebody">
            <th scope="col" className="px-5 py-3.5">Réf.</th>
            <th scope="col" className="px-5 py-3.5">Client</th>
            <th scope="col" className="px-5 py-3.5">Demande</th>
            <th scope="col" className="px-5 py-3.5">Statut</th>
            <th scope="col" className="px-5 py-3.5 text-right">Mise à jour</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {tickets.map((t) => (
            // The title link stretches over the row (after:inset-0), so the
            // whole row is clickable while staying one link for screen readers.
            <tr key={t.id} className="relative transition hover:bg-soft focus-within:bg-soft">
              <td className="whitespace-nowrap px-5 py-4 align-top font-mono text-xs text-primary">{t.ref}</td>
              <td className="max-w-[13rem] px-5 py-4 align-top">
                <p className="truncate font-semibold text-navy">{t.user.name}</p>
                <p className="truncate text-xs text-slatebody">{t.user.email}</p>
              </td>
              <td className="px-5 py-4 align-top">
                <Link
                  href={href(t.ref)}
                  className="line-clamp-1 font-heading font-bold text-navy after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:outline-none"
                >
                  {ticketTitle(t.message)}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slatebody">
                  <span>
                    {t.replyCount} réponse{t.replyCount > 1 ? 's' : ''}
                  </span>
                  {t.awaitingTeam ? <AwaitingTag /> : null}
                </p>
              </td>
              <td className="whitespace-nowrap px-5 py-4 align-top">
                <StatusBadge status={t.status} />
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-right align-top text-xs text-slatebody">
                <time dateTime={t.updatedAt.toISOString()} title={formatDateTime(t.updatedAt)}>
                  {formatDate(t.updatedAt)}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-black/5 md:hidden">
        {tickets.map((t) => (
          <li key={t.id}>
            <Link href={href(t.ref)} className="block px-5 py-4 transition hover:bg-soft">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-primary">{t.ref}</span>
                <StatusBadge status={t.status} />
              </div>
              <p className="mt-2 line-clamp-2 font-heading font-bold text-navy">{ticketTitle(t.message)}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slatebody">
                <span>{t.user.name}</span>
                <span>{formatDate(t.updatedAt)}</span>
                {t.awaitingTeam ? <AwaitingTag /> : null}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

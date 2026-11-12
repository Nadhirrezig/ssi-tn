import Link from 'next/link'
import StatusBadge from './StatusBadge'
import type { ClientTicketSummary } from '@/lib/tickets'
import { formatDate, isFinalStatus, ticketTitle } from '@/lib/ticket-status'

/** Shown in the meta line, at every size: one element, one place. */
function AwaitingReply() {
  return (
    <span className="inline-flex items-center gap-1.5 font-heading text-xs font-bold text-primary">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
      Réponse de SSI
    </span>
  )
}

/**
 * "Mes demandes": one row per ticket, newest activity first. Each row reads
 * like an inbox line — reference, title, status, last activity — and the
 * whole row is the link.
 */
export default function TicketList({ tickets }: { tickets: ClientTicketSummary[] }) {
  return (
    <ul className="divide-y divide-black/5 overflow-hidden rounded-[24px] border border-black/5 bg-white">
      {tickets.map((ticket) => {
        const awaitingClient = ticket.lastReplyFromTeam && !isFinalStatus(ticket.status)
        return (
          <li key={ticket.id}>
            <Link
              href={`/espace-client/tickets/${ticket.ref}`}
              className="group flex items-center gap-4 px-4 py-4 transition hover:bg-soft focus-visible:bg-soft focus-visible:outline-none sm:px-6 sm:py-5"
            >
              <div className="min-w-0 flex-1">
                {/* Phones: reference and status share the top line, so the
                    title below gets the full width instead of a few words. */}
                <div className="flex items-center justify-between gap-3 sm:justify-start">
                  <span className="font-mono text-xs text-primary">{ticket.ref}</span>
                  <span className="sm:hidden">
                    <StatusBadge status={ticket.status} />
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 font-heading text-base font-bold leading-snug text-navy group-hover:text-primary sm:line-clamp-1">
                  {ticketTitle(ticket.message)}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slatebody">
                  <span>
                    Ouverte le {formatDate(ticket.createdAt)}
                    {ticket.replyCount > 0
                      ? ` · ${ticket.replyCount} message${ticket.replyCount > 1 ? 's' : ''}`
                      : ''}
                  </span>
                  {awaitingClient ? <AwaitingReply /> : null}
                </p>
              </div>

              <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-slatebody">
                  Mise à jour le {formatDate(ticket.updatedAt)}
                </span>
              </div>

              <svg
                aria-hidden="true"
                className="hidden h-4 w-4 shrink-0 text-slatebody/60 transition group-hover:translate-x-0.5 group-hover:text-primary sm:block"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

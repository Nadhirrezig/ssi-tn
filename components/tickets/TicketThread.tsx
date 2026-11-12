import Avatar from './Avatar'
import StatusBadge from './StatusBadge'
import type { ClientTicket } from '@/lib/tickets'
import { formatDateTime, type TicketStatus } from '@/lib/ticket-status'

type Entry =
  | { kind: 'message'; id: string; at: Date; body: string; team: boolean; name: string }
  | { kind: 'event'; id: string; at: Date; toStatus: TicketStatus }

/**
 * The conversation as one chronological timeline: the original request,
 * every reply, and status changes as quiet system lines in between — so the
 * client can read the whole story top to bottom without a separate history tab.
 *
 * Written from the client's side: their messages read "Vous", the team's
 * "Équipe SSI". The admin view (Phase 3) will need the labels flipped.
 */
export default function TicketThread({
  ticket,
  clientName,
}: {
  ticket: ClientTicket
  clientName: string
}) {
  const entries: Entry[] = [
    {
      kind: 'message',
      id: 'request',
      at: ticket.submittedAt ?? ticket.createdAt,
      body: ticket.message,
      team: false,
      name: clientName,
    },
    ...ticket.messages.map(
      (m): Entry => ({
        kind: 'message',
        id: m.id,
        at: m.createdAt,
        body: m.body,
        team: m.author.role === 'ADMIN',
        name: m.author.name,
      })
    ),
    // The submission event (no "from") is the request itself, already shown.
    ...ticket.events
      .filter((e) => e.fromStatus !== null)
      .map((e): Entry => ({ kind: 'event', id: e.id, at: e.createdAt, toStatus: e.toStatus })),
  ].sort((a, b) => a.at.getTime() - b.at.getTime())

  return (
    <ol
      aria-label="Échanges"
      className="relative space-y-6 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-navy/10 before:content-['']"
    >
      {entries.map((entry) =>
        entry.kind === 'event' ? (
          <li key={entry.id} className="relative flex items-center gap-4">
            <span className="grid w-10 shrink-0 place-items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-navy/20 ring-4 ring-white" />
            </span>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slatebody">
              <span>Statut mis à jour</span>
              <StatusBadge status={entry.toStatus} />
              <time dateTime={entry.at.toISOString()} className="text-xs">
                {formatDateTime(entry.at)}
              </time>
            </p>
          </li>
        ) : (
          <li key={entry.id} className="relative flex gap-4">
            {/* self-start: as a flex item it would otherwise stretch to the
                card's height. The white ring cuts the timeline line. */}
            <span className="relative self-start rounded-full ring-4 ring-white">
              <Avatar name={entry.name} team={entry.team} />
            </span>
            <article
              className={`min-w-0 flex-1 rounded-[20px] border p-5 ${
                entry.team ? 'border-primary/15 bg-primary-50/60' : 'border-black/5 bg-white'
              }`}
            >
              <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="font-heading text-sm font-bold text-navy">
                  {entry.team ? 'Équipe SSI' : 'Vous'}
                  {entry.id === 'request' ? (
                    <span className="ml-2 font-body text-xs font-normal text-slatebody">
                      a ouvert la demande
                    </span>
                  ) : null}
                </p>
                <time dateTime={entry.at.toISOString()} className="text-xs text-slatebody">
                  {formatDateTime(entry.at)}
                </time>
              </header>
              <p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-navy/90">
                {entry.body}
              </p>
            </article>
          </li>
        )
      )}
    </ol>
  )
}

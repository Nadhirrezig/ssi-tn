import Avatar from './Avatar'
import StatusBadge from './StatusBadge'
import { formatDateTime, type TicketStatus } from '@/lib/ticket-status'

type Role = 'CLIENT' | 'ADMIN'

export type ThreadMessage = {
  id: string
  body: string
  createdAt: Date
  author: { id: string; name: string; role: Role }
}

export type ThreadEvent = {
  id: string
  fromStatus: TicketStatus | null
  toStatus: TicketStatus
  createdAt: Date
  actor?: { name: string; role: Role }
}

type MessageEntry = {
  kind: 'message'
  id: string
  at: Date
  body: string
  team: boolean
  /** Label shown: "Vous", "Équipe SSI" or a name. */
  author: string
  /** Real name, for the avatar's initials ("Vous" would read "VO"). */
  avatarName: string
  /** Small tag after the name, for the admin view. */
  tag?: string
  opened?: boolean
}
type EventEntry = { kind: 'event'; id: string; at: Date; toStatus: TicketStatus; actor?: string }
type Entry = MessageEntry | EventEntry

/**
 * The conversation as one chronological timeline: the original request,
 * every reply, and status changes as quiet system lines in between — so the
 * whole story reads top to bottom without a separate history tab.
 *
 * - perspective "client": their own messages read "Vous", the team's
 *   "Équipe SSI" (individual agents are not named to clients).
 * - perspective "admin": the client by name; teammates by name, the viewer as
 *   "Vous"; status lines say who made the change.
 */
export default function TicketThread({
  request,
  messages,
  events,
  perspective,
  viewerId,
}: {
  request: { body: string; at: Date; authorId: string; authorName: string }
  messages: ThreadMessage[]
  events: ThreadEvent[]
  perspective: 'client' | 'admin'
  viewerId: string
}) {
  const nameFor = (author: { id: string; name: string; role: Role }) => {
    if (author.id === viewerId) return 'Vous'
    if (author.role === 'ADMIN') return perspective === 'admin' ? author.name : 'Équipe SSI'
    return author.name
  }
  const tagFor = (role: Role) =>
    perspective === 'admin' ? (role === 'ADMIN' ? 'Équipe SSI' : 'Client') : undefined

  const entries: Entry[] = [
    {
      kind: 'message' as const,
      id: 'request',
      at: request.at,
      body: request.body,
      team: false,
      author: nameFor({ id: request.authorId, name: request.authorName, role: 'CLIENT' }),
      avatarName: request.authorName,
      tag: tagFor('CLIENT'),
      opened: true,
    },
    ...messages.map(
      (m): MessageEntry => ({
        kind: 'message',
        id: m.id,
        at: m.createdAt,
        body: m.body,
        team: m.author.role === 'ADMIN',
        author: nameFor(m.author),
        avatarName: m.author.name,
        tag: tagFor(m.author.role),
      })
    ),
    // The submission event (no "from") is the request itself, already shown.
    ...events
      .filter((e) => e.fromStatus !== null)
      .map(
        (e): EventEntry => ({
          kind: 'event',
          id: e.id,
          at: e.createdAt,
          toStatus: e.toStatus,
          actor: perspective === 'admin' && e.actor ? e.actor.name : undefined,
        })
      ),
  ].sort((a, b) => a.at.getTime() - b.at.getTime())

  // Phones: no avatar rail or timeline line — at 375px that column cost every
  // message a fifth of its width. The avatar moves into the message header.
  return (
    <ol
      aria-label="Échanges"
      className="relative space-y-4 sm:space-y-6 sm:before:absolute sm:before:bottom-6 sm:before:left-5 sm:before:top-6 sm:before:w-px sm:before:bg-navy/10 sm:before:content-['']"
    >
      {entries.map((entry) =>
        entry.kind === 'event' ? (
          <li key={entry.id} className="relative flex items-center gap-2.5 px-1 sm:gap-4 sm:px-0">
            <span className="grid shrink-0 place-items-center sm:w-10">
              <span className="h-2 w-2 rounded-full bg-navy/20 ring-4 ring-white sm:h-2.5 sm:w-2.5" />
            </span>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slatebody">
              <span>
                {entry.actor ? (
                  <>
                    <span className="font-semibold text-navy">{entry.actor}</span> a passé le statut à
                  </>
                ) : (
                  'Statut mis à jour'
                )}
              </span>
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
            <span className="relative hidden self-start rounded-full ring-4 ring-white sm:block">
              <Avatar name={entry.avatarName} team={entry.team} />
            </span>
            <article
              className={`min-w-0 flex-1 rounded-[18px] border p-4 sm:rounded-[20px] sm:p-5 ${
                entry.team ? 'border-primary/15 bg-primary-50/60' : 'border-black/5 bg-white'
              }`}
            >
              <header className="flex items-start gap-2.5 sm:block">
                <span className="sm:hidden">
                  <Avatar name={entry.avatarName} team={entry.team} size="sm" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-3 sm:gap-y-1">
                <p className="font-heading text-sm font-bold text-navy">
                  {entry.author}
                  {entry.tag ? (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 align-middle font-heading text-[10px] font-bold uppercase tracking-[0.08em] ${
                        entry.team ? 'bg-navy text-white' : 'bg-soft text-slatebody'
                      }`}
                    >
                      {entry.tag}
                    </span>
                  ) : null}
                  {entry.opened ? (
                    <span className="ml-2 whitespace-nowrap font-body text-xs font-normal text-slatebody">
                      a ouvert la demande
                    </span>
                  ) : null}
                </p>
                <time dateTime={entry.at.toISOString()} className="text-xs text-slatebody">
                  {formatDateTime(entry.at)}
                </time>
                </div>
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

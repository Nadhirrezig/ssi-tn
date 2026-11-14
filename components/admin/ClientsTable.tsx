import Link from 'next/link'
import Avatar from '@/components/tickets/Avatar'
import type { ClientRow } from '@/lib/admin-clients'
import { formatDate } from '@/lib/ticket-status'

/** Opens the inbox on every request from this client. */
const ticketsHref = (email: string) => `/admin/tickets?vue=toutes&q=${encodeURIComponent(email)}`

/** Self sign-ups stay "unconfirmed" until they click the link in their email. */
function AccountBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary-50 px-2.5 py-1 font-heading text-xs font-bold text-navy">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
      Actif
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accentYellow/25 px-2.5 py-1 font-heading text-xs font-bold text-navy">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accentYellow ring-1 ring-navy/15" />
      E-mail non confirmé
    </span>
  )
}

function Requests({ total, open }: { total: number; open: number }) {
  if (total === 0) return <span className="text-slatebody">Aucune</span>
  return (
    <span>
      <span className="font-semibold text-navy">{total}</span>
      {open > 0 ? <span className="text-slatebody"> · {open} en cours</span> : null}
    </span>
  )
}

/**
 * Client accounts. A table from md up — the name links to the client's
 * requests and stretches over the row; stacked cards on phones.
 */
export default function ClientsTable({ clients, highlight }: { clients: ClientRow[]; highlight?: string }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-black/5 bg-white">
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="bg-soft">
          <tr className="whitespace-nowrap font-heading text-xs font-bold uppercase tracking-[0.08em] text-slatebody">
            <th scope="col" className="px-5 py-3.5">Client</th>
            <th scope="col" className="px-5 py-3.5">Société</th>
            <th scope="col" className="px-5 py-3.5">Téléphone</th>
            <th scope="col" className="px-5 py-3.5">Demandes</th>
            <th scope="col" className="px-5 py-3.5">Compte</th>
            <th scope="col" className="px-5 py-3.5 text-right">Créé le</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {clients.map((c) => (
            <tr
              key={c.id}
              className={`relative transition hover:bg-soft focus-within:bg-soft ${c.id === highlight ? 'bg-primary-50/50' : ''}`}
            >
              <td className="max-w-[18rem] px-5 py-4 align-middle">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} size="sm" />
                  <div className="min-w-0">
                    <Link
                      href={ticketsHref(c.email)}
                      className="block truncate font-heading font-bold text-navy after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:outline-none"
                    >
                      {c.name}
                    </Link>
                    <p className="truncate text-xs text-slatebody">{c.email}</p>
                  </div>
                </div>
              </td>
              <td className="max-w-[12rem] truncate px-5 py-4 align-middle text-navy">
                {c.company ?? <span className="text-slatebody/60">—</span>}
              </td>
              <td className="whitespace-nowrap px-5 py-4 align-middle">
                {c.phone ? (
                  // Above the row link, so the number dials instead of opening the requests.
                  <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`} className="relative z-10 text-navy hover:text-primary">
                    {c.phone}
                  </a>
                ) : (
                  <span className="text-slatebody/60">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-5 py-4 align-middle">
                <Requests total={c.tickets} open={c.openTickets} />
              </td>
              <td className="px-5 py-4 align-middle">
                <AccountBadge verified={c.emailVerified} />
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-right align-middle text-xs text-slatebody">
                <time dateTime={c.createdAt.toISOString()}>{formatDate(c.createdAt)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-black/5 md:hidden">
        {clients.map((c) => (
          <li key={c.id} className={c.id === highlight ? 'bg-primary-50/50' : undefined}>
            <Link href={ticketsHref(c.email)} className="flex gap-3 px-5 py-4 transition hover:bg-soft">
              <Avatar name={c.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate font-heading font-bold text-navy">{c.name}</p>
                  <AccountBadge verified={c.emailVerified} />
                </div>
                <p className="truncate text-xs text-slatebody">{c.email}</p>
                {c.company || c.phone ? (
                  <p className="mt-1 truncate text-xs text-navy">{[c.company, c.phone].filter(Boolean).join(' · ')}</p>
                ) : null}
                <p className="mt-2 text-xs">
                  <Requests total={c.tickets} open={c.openTickets} />
                  <span className="text-slatebody"> · depuis le {formatDate(c.createdAt)}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

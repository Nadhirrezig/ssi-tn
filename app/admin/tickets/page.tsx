import type { Metadata } from 'next'
import Link from 'next/link'
import PageBand from '@/components/tickets/PageBand'
import AdminTicketTable from '@/components/admin/AdminTicketTable'
import { requireAdmin } from '@/lib/session'
import { listAdminTickets } from '@/lib/admin-tickets'
import { OPEN_STATUSES, type TicketStatus } from '@/lib/ticket-status'

export const metadata: Metadata = { title: 'Demandes clients' }

/** Inbox views. "Ouvertes" is the default: everything still needing work. */
const VIEWS: { id: string; label: string; statuses: readonly TicketStatus[] | null }[] = [
  { id: 'ouvertes', label: 'Ouvertes', statuses: OPEN_STATUSES },
  { id: 'nouvelles', label: 'Nouvelles', statuses: ['PENDING'] },
  { id: 'cloturees', label: 'Clôturées', statuses: ['DONE', 'REJECTED'] },
  { id: 'toutes', label: 'Toutes', statuses: null },
]

type SearchParams = { vue?: string; q?: string; page?: string }

function buildHref(params: SearchParams) {
  const query = new URLSearchParams()
  if (params.vue && params.vue !== 'ouvertes') query.set('vue', params.vue)
  if (params.q) query.set('q', params.q)
  if (params.page && params.page !== '1') query.set('page', params.page)
  const s = query.toString()
  return s ? `/admin/tickets?${s}` : '/admin/tickets'
}

export default async function AdminTicketsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin()
  const params = await searchParams

  const view = VIEWS.find((v) => v.id === params.vue) ?? VIEWS[0]
  const q = params.q?.trim().slice(0, 100) || undefined
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)

  const { tickets, total, pageCount, countByStatus } = await listAdminTickets({
    statuses: view.statuses,
    q,
    page,
  })

  const countFor = (statuses: readonly TicketStatus[] | null) =>
    (statuses ?? (Object.keys(countByStatus) as TicketStatus[])).reduce(
      (sum, s) => sum + (countByStatus[s] ?? 0),
      0
    )
  const newCount = countByStatus.PENDING ?? 0

  return (
    <>
      <PageBand
        eyebrow="Administration"
        title="Demandes clients"
        lead={
          newCount > 0
            ? `${newCount} nouvelle${newCount > 1 ? 's' : ''} demande${newCount > 1 ? 's' : ''} à prendre en charge.`
            : 'Aucune nouvelle demande en attente.'
        }
      />

      <div className="mx-auto max-w-content px-6 py-8 sm:py-14">
        <div className="mb-5 flex flex-col-reverse gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Vues" className="no-scrollbar -mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0">
            <ul className="inline-flex gap-1 rounded-full bg-soft p-1">
              {VIEWS.map((v) => {
                const isActive = v.id === view.id
                return (
                  <li key={v.id}>
                    <Link
                      href={buildHref({ vue: v.id, q })}
                      aria-current={isActive ? 'page' : undefined}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 font-heading text-sm font-bold transition ${
                        isActive ? 'bg-white text-navy shadow-card' : 'text-slatebody hover:text-navy'
                      }`}
                    >
                      {v.label}
                      <span className={`text-xs ${isActive ? 'text-primary' : 'text-slatebody/80'}`}>
                        {countFor(v.statuses)}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Plain GET form: the search lives in the URL, so it can be shared and survives reloads. */}
          <form role="search" action="/admin/tickets" className="relative w-full lg:w-80">
            {view.id !== 'ouvertes' ? <input type="hidden" name="vue" value={view.id} /> : null}
            <label htmlFor="q" className="sr-only">
              Rechercher une demande
            </label>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slatebody"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Réf., nom ou e-mail du client"
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-11 pr-4 text-sm text-navy placeholder:text-slatebody/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>
        </div>

        {q ? (
          <p className="mb-4 text-sm text-slatebody">
            {total} résultat{total > 1 ? 's' : ''} pour « <span className="font-semibold text-navy">{q}</span> » ·{' '}
            <Link href={buildHref({ vue: view.id })} className="font-semibold text-primary hover:underline">
              Effacer
            </Link>
          </p>
        ) : null}

        {tickets.length > 0 ? (
          <AdminTicketTable tickets={tickets} />
        ) : (
          <p className="rounded-[24px] border border-dashed border-black/10 px-6 py-14 text-center text-slatebody">
            {q ? 'Aucune demande ne correspond à cette recherche.' : 'Aucune demande dans cette vue.'}
          </p>
        )}

        {pageCount > 1 ? (
          <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
            <span className="text-slatebody">
              Page {page} sur {pageCount}
            </span>
            <span className="flex gap-2">
              {page > 1 ? (
                <Link
                  href={buildHref({ vue: view.id, q, page: String(page - 1) })}
                  className="rounded-full border border-black/10 px-4 py-2 font-heading font-bold text-navy transition hover:border-primary hover:text-primary"
                >
                  Précédente
                </Link>
              ) : null}
              {page < pageCount ? (
                <Link
                  href={buildHref({ vue: view.id, q, page: String(page + 1) })}
                  className="rounded-full border border-black/10 px-4 py-2 font-heading font-bold text-navy transition hover:border-primary hover:text-primary"
                >
                  Suivante
                </Link>
              ) : null}
            </span>
          </nav>
        ) : null}
      </div>
    </>
  )
}

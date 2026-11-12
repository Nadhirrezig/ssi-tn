import type { Metadata } from 'next'
import Link from 'next/link'
import PageBand, { PRIMARY_LINK } from '@/components/tickets/PageBand'
import TicketList from '@/components/tickets/TicketList'
import ClearDraft from '@/components/tickets/ClearDraft'
import { FormMessage } from '@/components/auth/fields'
import { NEW_TICKET_PATH } from '@/lib/auth-ui'
import { requireUser } from '@/lib/session'
import { isFinalStatus } from '@/lib/ticket-status'
import { listClientTickets } from '@/lib/tickets'

export const metadata: Metadata = { title: 'Mes demandes' }

const FILTERS = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'en-cours', label: 'En cours' },
  { id: 'cloturees', label: 'Clôturées' },
] as const

type FilterId = (typeof FILTERS)[number]['id']

export default async function MesDemandesPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string; bienvenue?: string }>
}) {
  const { user } = await requireUser()
  const { filtre, bienvenue } = await searchParams
  const tickets = await listClientTickets(user.id)

  const groups: Record<FilterId, typeof tickets> = {
    toutes: tickets,
    'en-cours': tickets.filter((t) => !isFinalStatus(t.status)),
    cloturees: tickets.filter((t) => isFinalStatus(t.status)),
  }
  const active: FilterId = FILTERS.some((f) => f.id === filtre) ? (filtre as FilterId) : 'toutes'
  const shown = groups[active]

  return (
    <>
      <PageBand
        eyebrow={`Bonjour ${user.name.split(' ')[0]}`}
        title="Mes demandes"
        lead="Suivez l’avancement de vos demandes et échangez avec notre équipe."
        actions={
          <Link href={NEW_TICKET_PATH} className={PRIMARY_LINK}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouvelle demande
          </Link>
        }
      />

      <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
        {bienvenue ? (
          <div className="mb-8">
            <ClearDraft />
            <FormMessage tone="success">
              Votre adresse e-mail est confirmée : bienvenue dans votre espace client.
              {tickets.length > 0 ? ' Votre demande a bien été transmise à notre équipe.' : ''}
            </FormMessage>
          </div>
        ) : null}

        {tickets.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <nav aria-label="Filtrer les demandes" className="mb-5 overflow-x-auto">
              <ul className="inline-flex gap-1 rounded-full bg-soft p-1">
                {FILTERS.map((filter) => {
                  const isActive = filter.id === active
                  return (
                    <li key={filter.id}>
                      <Link
                        href={filter.id === 'toutes' ? '/espace-client' : `/espace-client?filtre=${filter.id}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 font-heading text-sm font-bold transition ${
                          isActive ? 'bg-white text-navy shadow-card' : 'text-slatebody hover:text-navy'
                        }`}
                      >
                        {filter.label}
                        <span className={`text-xs ${isActive ? 'text-primary' : 'text-slatebody/80'}`}>
                          {groups[filter.id].length}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {shown.length > 0 ? (
              <TicketList tickets={shown} />
            ) : (
              <p className="rounded-[24px] border border-dashed border-black/10 px-6 py-12 text-center text-slatebody">
                {active === 'en-cours'
                  ? 'Aucune demande en cours : tout est traité.'
                  : 'Aucune demande clôturée pour le moment.'}
              </p>
            )}
          </>
        )}
      </div>
    </>
  )
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-black/5 px-6 py-16 text-center">
      <span aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 5h16v11H8l-4 4z" />
          <path d="M8 10h8M8 13h5" />
        </svg>
      </span>
      <h2 className="mt-5 font-heading text-xl font-bold text-navy">Aucune demande pour le moment</h2>
      <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-slatebody">
        Un problème, une question, un besoin ? Décrivez-le : notre équipe vous répond ici même.
      </p>
      <Link href={NEW_TICKET_PATH} className={`${PRIMARY_LINK} mt-7`}>
        Ouvrir ma première demande
      </Link>
    </div>
  )
}

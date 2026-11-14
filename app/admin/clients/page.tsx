import type { Metadata } from 'next'
import Link from 'next/link'
import PageBand, { PRIMARY_LINK } from '@/components/tickets/PageBand'
import ClientsTable from '@/components/admin/ClientsTable'
import Pagination from '@/components/admin/Pagination'
import SearchBox from '@/components/admin/SearchBox'
import { FormMessage } from '@/components/auth/fields'
import { requireAdmin } from '@/lib/session'
import { getClientName, listClients } from '@/lib/admin-clients'

export const metadata: Metadata = { title: 'Clients' }

type SearchParams = { q?: string; page?: string; nouveau?: string; email?: string }

function buildHref({ q, page }: { q?: string; page?: number }) {
  const query = new URLSearchParams()
  if (q) query.set('q', q)
  if (page && page > 1) query.set('page', String(page))
  const s = query.toString()
  return s ? `/admin/clients?${s}` : '/admin/clients'
}

export default async function AdminClientsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin()
  const params = await searchParams

  const q = params.q?.trim().slice(0, 100) || undefined
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)

  const [{ clients, total, pageCount }, created] = await Promise.all([
    listClients({ q, page }),
    // Set by createClientAction's redirect: confirm what just happened.
    params.nouveau ? getClientName(params.nouveau) : null,
  ])

  return (
    <>
      <PageBand
        eyebrow="Administration"
        title="Clients"
        lead={
          q
            ? 'Comptes clients correspondant à votre recherche.'
            : `${total} compte${total > 1 ? 's' : ''} client${total > 1 ? 's' : ''}.`
        }
        actions={
          <Link href="/admin/clients/nouveau" className={PRIMARY_LINK}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau client
          </Link>
        }
      />

      <div className="mx-auto max-w-content px-6 py-8 sm:py-14">
        {created ? (
          <div className="mb-6">
            {params.email === 'echec' ? (
              <FormMessage tone="error">
                Le compte de <strong>{created.name}</strong> est créé, mais l’e-mail n’a pas pu être envoyé à{' '}
                {created.email}. Communiquez-lui ses identifiants directement.
              </FormMessage>
            ) : (
              <FormMessage tone="success">
                Compte créé pour <strong>{created.name}</strong>. Ses identifiants ont été envoyés à{' '}
                <strong>{created.email}</strong>.
              </FormMessage>
            )}
          </div>
        ) : null}

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchBox
            action="/admin/clients"
            defaultValue={q}
            label="Rechercher un client"
            placeholder="Nom, e-mail, société ou téléphone"
          />
          {q ? (
            <p className="text-sm text-slatebody">
              {total} résultat{total > 1 ? 's' : ''} pour «&nbsp;<span className="font-semibold text-navy">{q}</span>&nbsp;» ·{' '}
              <Link href="/admin/clients" className="font-semibold text-primary hover:underline">
                Effacer
              </Link>
            </p>
          ) : null}
        </div>

        {clients.length > 0 ? (
          <ClientsTable clients={clients} highlight={created ? params.nouveau : undefined} />
        ) : (
          <div className="rounded-[24px] border border-dashed border-black/10 px-6 py-14 text-center">
            <p className="text-slatebody">
              {q ? 'Aucun client ne correspond à cette recherche.' : 'Aucun compte client pour le moment.'}
            </p>
            {q ? null : (
              <Link href="/admin/clients/nouveau" className={`${PRIMARY_LINK} mt-5`}>
                Créer le premier compte
              </Link>
            )}
          </div>
        )}

        <Pagination page={page} pageCount={pageCount} hrefFor={(p) => buildHref({ q, page: p })} />
      </div>
    </>
  )
}

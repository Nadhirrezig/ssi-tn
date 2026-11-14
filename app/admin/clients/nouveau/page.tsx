import type { Metadata } from 'next'
import Link from 'next/link'
import PageBand from '@/components/tickets/PageBand'
import NewClientForm from '@/components/admin/NewClientForm'
import { requireAdmin } from '@/lib/session'
import { createClientAction } from '../actions'

export const metadata: Metadata = { title: 'Nouveau client' }

export default async function NewClientPage() {
  await requireAdmin()

  return (
    <>
      <PageBand
        eyebrow={
          <Link href="/admin/clients" className="inline-flex items-center gap-1.5 hover:underline">
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Clients
          </Link>
        }
        title="Nouveau client"
        lead="Créez le compte : le client reçoit ses identifiants par e-mail et peut suivre ses demandes aussitôt."
      />
      <div className="mx-auto max-w-3xl px-6 py-8 sm:py-14">
        <NewClientForm action={createClientAction} />
      </div>
    </>
  )
}

import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PortalNav from '@/components/tickets/PortalNav'
import { NEW_TICKET_PATH } from '@/lib/auth-ui'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = {
  title: { default: 'Espace client', template: '%s | Espace client SSI' },
  robots: { index: false, follow: false },
}

const TABS = [
  { href: '/espace-client', label: 'Mes demandes' },
  { href: NEW_TICKET_PATH, label: 'Nouvelle demande' },
]

/**
 * Frame of the client area. The session check here only feeds the nav bar:
 * layouts do not re-run on every navigation, so each page checks again.
 */
export default async function EspaceClientLayout({ children }: { children: ReactNode }) {
  const { user } = await requireUser()

  // The team works from the admin area; the header's "Espace client" link and
  // the default post-login page both lead here, so send them on.
  if (user.role === 'ADMIN') redirect('/admin/tickets')

  return (
    <>
      <Header solid />
      <main className="min-h-[70vh] pt-20">
        <PortalNav tabs={TABS} label="Espace client" name={user.name} detail={user.email} />
        {children}
      </main>
      <Footer />
    </>
  )
}

import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PortalNav from '@/components/tickets/PortalNav'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = {
  title: { default: 'Espace client', template: '%s | Espace client SSI' },
  robots: { index: false, follow: false },
}

/**
 * Frame of the client area. The session check here only feeds the nav bar:
 * layouts do not re-run on every navigation, so each page checks again.
 */
export default async function EspaceClientLayout({ children }: { children: ReactNode }) {
  const { user } = await requireUser()

  return (
    <>
      <Header solid />
      <main className="min-h-[70vh] pt-20">
        <PortalNav name={user.name} email={user.email} />
        {children}
      </main>
      <Footer />
    </>
  )
}

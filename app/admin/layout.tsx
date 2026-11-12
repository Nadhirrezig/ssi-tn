import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PortalNav from '@/components/tickets/PortalNav'
import { requireAdmin } from '@/lib/session'

export const metadata: Metadata = {
  title: { default: 'Administration', template: '%s | Admin SSI' },
  robots: { index: false, follow: false },
}

const TABS = [{ href: '/admin/tickets', label: 'Demandes clients' }]

/**
 * Frame of the admin area. Non-admins get a 404 here and on every page —
 * layouts do not re-run on navigation, so pages check again.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin()

  return (
    <>
      <Header solid />
      <main className="min-h-[70vh] pt-20">
        <PortalNav tabs={TABS} label="Administration" name={user.name} detail="Équipe SSI" />
        {children}
      </main>
      <Footer />
    </>
  )
}

import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import AppShell from '@/components/app/AppShell'
import type { AppTab } from '@/components/app/AppBar'
import { requireAdmin } from '@/lib/session'

export const metadata: Metadata = {
  title: { default: 'Administration', template: '%s | Admin SSI' },
  robots: { index: false, follow: false },
}

const TABS: AppTab[] = [
  { href: '/admin/tickets', label: 'Demandes', icon: 'inbox' },
  { href: '/admin/clients', label: 'Clients', icon: 'users' },
]

/**
 * Frame of the admin area. Non-admins get a 404 here and on every page —
 * layouts do not re-run on navigation, so pages check again.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin()

  return (
    <AppShell area="Administration" tabs={TABS} user={{ name: user.name, detail: `Équipe SSI · ${user.email}` }}>
      {children}
    </AppShell>
  )
}

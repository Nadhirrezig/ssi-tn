import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppShell from '@/components/app/AppShell'
import type { AppTab } from '@/components/app/AppBar'
import { NEW_TICKET_PATH } from '@/lib/auth-ui'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = {
  title: { default: 'Espace client', template: '%s | Espace client SSI' },
  robots: { index: false, follow: false },
}

const TABS: AppTab[] = [
  { href: '/espace-client', label: 'Mes demandes', icon: 'list' },
  { href: NEW_TICKET_PATH, label: 'Nouvelle demande', icon: 'plus' },
]

/**
 * Frame of the client area — an application, not a page of the site. The
 * session check here only feeds the bar: layouts do not re-run on every
 * navigation, so each page checks again.
 */
export default async function EspaceClientLayout({ children }: { children: ReactNode }) {
  const { user } = await requireUser()

  // The team works from the admin area; the header's "Espace client" link and
  // the default post-login page both lead here, so send them on.
  if (user.role === 'ADMIN') redirect('/admin/tickets')

  return (
    <AppShell area="Espace client" tabs={TABS} user={{ name: user.name, detail: user.email }}>
      {children}
    </AppShell>
  )
}

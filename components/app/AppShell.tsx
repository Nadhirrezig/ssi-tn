import type { ReactNode } from 'react'
import Link from 'next/link'
import { CookiePreferencesButton } from '@/components/CookieConsent'
import AppBar, { type AppTab } from './AppBar'

const FOOT_LINK = 'transition hover:text-primary'

/**
 * Frame of the signed-in areas (client space, admin): an application bar,
 * the page, and one line of small print — no marketing header or footer.
 */
export default function AppShell({
  area,
  tabs,
  user,
  children,
}: {
  area: string
  tabs: AppTab[]
  user: { name: string; detail: string }
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AppBar area={area} tabs={tabs} user={user} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-content flex-col gap-3 px-6 py-6 text-xs text-slatebody sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SSI — Sécurité &amp; Solutions Informatiques</p>
          <nav aria-label="Liens utiles" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="tel:+21628290350" className={FOOT_LINK}>
              Support&nbsp;: +216 28 290 350
            </a>
            <Link href="/confidentialite" className={FOOT_LINK}>
              Confidentialité
            </Link>
            <CookiePreferencesButton className={FOOT_LINK} />
          </nav>
        </div>
      </footer>
    </div>
  )
}

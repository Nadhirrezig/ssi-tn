'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Avatar from './Avatar'
import SignOutButton from '@/components/auth/SignOutButton'
import { NEW_TICKET_PATH } from '@/lib/auth-ui'

/**
 * The client area's own navigation bar, under the site header: sections on
 * the left, who is signed in on the right.
 */
export default function PortalNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname()
  const onNew = pathname === NEW_TICKET_PATH

  const tabs = [
    { href: '/espace-client', label: 'Mes demandes', active: !onNew },
    { href: NEW_TICKET_PATH, label: 'Nouvelle demande', active: onNew },
  ]

  return (
    <div className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-6">
        <nav aria-label="Espace client" className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              className={`whitespace-nowrap border-b-2 py-4 font-heading text-sm font-bold transition ${
                tab.active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-navy hover:text-primary'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={name} size="sm" />
          <div className="hidden min-w-0 leading-tight md:block">
            <p className="truncate font-heading text-sm font-bold text-navy">{name}</p>
            <p className="truncate text-xs text-slatebody">{email}</p>
          </div>
          <span aria-hidden="true" className="hidden h-6 w-px bg-black/10 sm:block" />
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}

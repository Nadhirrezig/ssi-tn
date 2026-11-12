'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Avatar from './Avatar'
import SignOutButton from '@/components/auth/SignOutButton'

type Tab = { href: string; label: string }

/**
 * Navigation bar of a signed-in area (client space, admin), under the site
 * header: sections on the left, who is signed in on the right.
 *
 * The active tab is the one whose href is the longest prefix of the current
 * path, so /espace-client/tickets/nouveau lights "Nouvelle demande" while a
 * ticket page lights "Mes demandes".
 */
export default function PortalNav({
  tabs,
  label,
  name,
  detail,
  team = false,
}: {
  tabs: Tab[]
  /** aria-label of the nav. */
  label: string
  name: string
  /** Second line under the name: the email, or the team. */
  detail: string
  team?: boolean
}) {
  const pathname = usePathname()
  const active = tabs
    .filter((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <div className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-6">
        <nav aria-label={label} className="-mb-px flex gap-6">
          {tabs.map((tab) => {
            const isActive = tab.href === active
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={`whitespace-nowrap border-b-2 py-4 font-heading text-sm font-bold transition ${
                  isActive ? 'border-primary text-primary' : 'border-transparent text-navy hover:text-primary'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={name} size="sm" team={team} />
          <div className="hidden min-w-0 leading-tight md:block">
            <p className="truncate font-heading text-sm font-bold text-navy">{name}</p>
            <p className="truncate text-xs text-slatebody">{detail}</p>
          </div>
          <span aria-hidden="true" className="hidden h-6 w-px bg-black/10 sm:block" />
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Avatar from './Avatar'
import SignOutButton from '@/components/auth/SignOutButton'

type Tab = {
  href: string
  label: string
  /** Shorter label for phones, where the full one would not fit. */
  short?: string
}

/**
 * Navigation bar of a signed-in area (client space, admin), under the site
 * header: sections on the left, who is signed in on the right.
 *
 * Phones: the tabs take the free width (and scroll if a very narrow screen
 * still cannot hold them), the avatar and name step aside, and sign-out is a
 * single icon — the bar must never be wider than the screen, or the whole
 * page scrolls sideways and the site header's menu button stops responding.
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
}: {
  tabs: Tab[]
  /** aria-label of the nav. */
  label: string
  name: string
  /** Second line under the name: the email, or the team. */
  detail: string
}) {
  const pathname = usePathname()
  const active = tabs
    .filter((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <div className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-content items-center gap-3 px-6">
        <nav aria-label={label} className="no-scrollbar -mb-px flex min-w-0 flex-1 gap-5 overflow-x-auto sm:gap-6">
          {tabs.map((tab) => {
            const isActive = tab.href === active
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={`shrink-0 whitespace-nowrap border-b-2 py-4 font-heading text-sm font-bold transition ${
                  isActive ? 'border-primary text-primary' : 'border-transparent text-navy hover:text-primary'
                }`}
              >
                {tab.short ? (
                  <>
                    <span className="sm:hidden">{tab.short}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </>
                ) : (
                  tab.label
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden sm:block">
            <Avatar name={name} size="sm" />
          </span>
          <div className="hidden max-w-[14rem] leading-tight md:block">
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

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Inbox, List, Plus, Users, type LucideIcon } from 'lucide-react'
import Logo from '@/components/Logo'
import UserMenu from './UserMenu'

const ICONS = { list: List, plus: Plus, inbox: Inbox, users: Users } satisfies Record<string, LucideIcon>

export type AppTab = {
  href: string
  label: string
  icon: keyof typeof ICONS
}

/**
 * The application bar of the signed-in areas — the marketing header stays on
 * the public site. Logo (back to the site) and the area's name, its sections,
 * then "Retour au site" and the account menu. Below md the sections move to a
 * second row, so the bar never grows wider than the screen.
 *
 * The active section is the one whose href is the longest prefix of the path,
 * so /espace-client/tickets/nouveau lights "Nouvelle demande" while a ticket
 * page lights "Mes demandes".
 */
export default function AppBar({
  area,
  tabs,
  user,
}: {
  /** "Espace client", "Administration" — tag beside the logo and nav label. */
  area: string
  tabs: AppTab[]
  user: { name: string; detail: string }
}) {
  const pathname = usePathname()
  const active = tabs
    .filter((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  const tabLinks = (variant: 'bar' | 'row') =>
    tabs.map((tab) => {
      const Icon = ICONS[tab.icon]
      const isActive = tab.href === active
      return (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={isActive ? 'page' : undefined}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 font-heading text-sm font-bold transition ${
            variant === 'bar' ? 'h-16 px-1' : 'py-3'
          } ${isActive ? 'border-primary text-primary' : 'border-transparent text-slatebody hover:text-navy'}`}
        >
          <Icon size={17} aria-hidden="true" />
          {tab.label}
        </Link>
      )
    })

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center gap-4 px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <Logo imgClassName="h-9 w-auto" />
          <span className="hidden rounded-full bg-soft px-2.5 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.08em] text-slatebody sm:inline">
            {area}
          </span>
        </div>

        <nav aria-label={area} className="ml-4 hidden items-stretch gap-6 md:flex">
          {tabLinks('bar')}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 font-heading text-sm font-bold text-slatebody transition hover:bg-soft hover:text-navy sm:inline-flex"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Retour au site
          </Link>
          <span aria-hidden="true" className="hidden h-6 w-px bg-black/10 sm:block" />
          <UserMenu name={user.name} detail={user.detail} />
        </div>
      </div>

      <nav aria-label={area} className="border-t border-black/5 md:hidden">
        <div className="no-scrollbar mx-auto flex max-w-content gap-6 overflow-x-auto px-4 sm:px-6">{tabLinks('row')}</div>
      </nav>
    </header>
  )
}

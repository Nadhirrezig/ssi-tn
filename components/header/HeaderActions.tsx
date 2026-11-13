'use client'

import Link from 'next/link'
import { Headset } from 'lucide-react'
import { MenuIcon, PhoneIcon, UserIcon } from './icons'

/**
 * Right side of the bar: phone (xl), client space (lg), ticket CTA — the full
 * pill from sm, a round headset button on phones — and the menu toggle below lg.
 */
export default function HeaderActions({
  chrome,
  solid,
  mobileOpen,
  onToggleMobile,
  onNavigate,
}: {
  /** Scrolled, or a page that forces the solid bar. */
  chrome: boolean
  /** White bar (chrome, or a mega panel open). */
  solid: boolean
  mobileOpen: boolean
  onToggleMobile: () => void
  onNavigate: () => void
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Keeps its space while hidden: toggling display shifted the centred nav
          ~77px the moment the page scrolled, sliding another item under the
          cursor and cutting the scroll to an anchor short. */}
      <a
        href="tel:+21628290350"
        className={`hidden items-center gap-2 font-heading text-[15px] font-bold text-navy transition hover:text-primary xl:flex ${
          chrome ? '' : 'xl:invisible'
        }`}
      >
        <PhoneIcon />
        +216 28 290 350
      </a>
      <Link
        href="/espace-client"
        onClick={onNavigate}
        className="hidden items-center gap-2 font-heading text-[15px] font-bold text-navy transition hover:text-primary lg:flex"
      >
        <UserIcon />
        Espace client
      </Link>
      <Link
        href="/ticket"
        onClick={onNavigate}
        className={`group hidden items-center gap-2 rounded-full px-6 py-2.5 font-heading text-[15px] font-bold shadow-float transition duration-200 hover:-translate-y-0.5 hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none sm:inline-flex ${
          solid
            ? 'bg-primary text-white hover:bg-primary-700'
            : 'bg-primary text-white hover:bg-primary-700 lg:bg-white lg:text-primary lg:hover:bg-white/90'
        }`}
      >
        <span className="inline-flex origin-center group-hover:animate-[headset-ring_0.6s_ease-in-out_infinite] motion-reduce:group-hover:animate-none">
          <Headset size={18} aria-hidden="true" />
        </span>
        Ouvrir un ticket
      </Link>
      <Link
        href="/ticket"
        onClick={onNavigate}
        aria-label="Ouvrir un ticket"
        className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white shadow-float transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
      >
        <Headset size={20} aria-hidden="true" />
      </Link>
      <button
        aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={mobileOpen}
        className="grid h-11 w-11 place-items-center rounded-full text-navy lg:hidden"
        onClick={onToggleMobile}
      >
        <MenuIcon open={mobileOpen} />
      </button>
    </div>
  )
}

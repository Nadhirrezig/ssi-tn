'use client'

import type { Dispatch, MouseEvent, SetStateAction } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import MegaPanel from './MegaPanel'
import { Chevron } from './icons'
import { EASE, NAV, type NavItem } from './nav-data'

/** Desktop menu (lg and up): plain links, and buttons that open a mega panel. */
export function DesktopNav({
  active,
  setActive,
  onLinkClick,
}: {
  active: string | null
  setActive: Dispatch<SetStateAction<string | null>>
  onLinkClick: (event: MouseEvent, href: string) => void
}) {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {NAV.map((item) =>
        item.panel ? (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => setActive(item.id)}
            onFocus={() => setActive(item.id)}
            onClick={() => setActive((a) => (a === item.id ? null : item.id))}
            aria-expanded={active === item.id}
            className={`flex items-center gap-1.5 font-heading text-[15px] font-semibold transition ${
              active === item.id ? 'text-primary' : 'text-navy hover:text-primary'
            }`}
          >
            {item.label}
            <Chevron open={active === item.id} />
          </button>
        ) : (
          <Link
            key={item.id}
            href={item.href}
            onMouseEnter={() => setActive(null)}
            onClick={(e) => onLinkClick(e, item.href)}
            className="font-heading text-[15px] font-semibold text-navy transition hover:text-primary"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  )
}

/** The open mega panel under the bar — persists while open, content crossfades on switch. */
export function DesktopMegaMenu({
  item,
  reduce,
  onNavigate,
}: {
  item: NavItem | null
  reduce: boolean | null
  onNavigate: () => void
}) {
  return (
    <AnimatePresence>
      {item?.panel && (
        <motion.div
          key="mega"
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.26, ease: EASE }}
          className="hidden overflow-hidden border-t border-black/5 bg-white lg:block"
        >
          <div className="mx-auto max-w-content px-6 pb-7 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: EASE }}
              >
                <MegaPanel panel={item.panel} onNavigate={onNavigate} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

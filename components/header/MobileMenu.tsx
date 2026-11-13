'use client'

import type { Dispatch, MouseEvent, SetStateAction } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Headset } from 'lucide-react'
import { Chevron, UserIcon } from './icons'
import { EASE, NAV, type PanelCard } from './nav-data'

const ROW = 'block border-b border-black/5 py-3.5 font-heading font-semibold text-navy'

/** Menu below lg: an accordion, panel items expand into compact cards. */
export default function MobileMenu({
  open,
  expanded,
  setExpanded,
  reduce,
  onLinkClick,
  onNavigate,
}: {
  open: boolean
  expanded: string | null
  setExpanded: Dispatch<SetStateAction<string | null>>
  reduce: boolean | null
  onLinkClick: (event: MouseEvent, href: string) => void
  onNavigate: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="overflow-hidden border-t border-black/5 bg-white lg:hidden"
        >
          <nav className="max-h-[70vh] overflow-y-auto px-6 pb-6 pt-2">
            {NAV.map((item) =>
              item.panel ? (
                <div key={item.id} className="border-b border-black/5">
                  <button
                    type="button"
                    onClick={() => setExpanded((x) => (x === item.id ? null : item.id))}
                    aria-expanded={expanded === item.id}
                    className="flex w-full items-center justify-between py-3.5 font-heading font-semibold text-navy"
                  >
                    {item.label}
                    <Chevron open={expanded === item.id} />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-3 pb-4">
                          {item.panel.cards.map((card) => (
                            <MobileCard key={card.title} card={card} onNavigate={onNavigate} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={item.id} href={item.href} onClick={(e) => onLinkClick(e, item.href)} className={ROW}>
                  {item.label}
                </Link>
              )
            )}
            {/* Same two actions as the desktop bar, with the same icons. */}
            <Link href="/espace-client" onClick={onNavigate} className={`${ROW} flex items-center gap-2`}>
              <UserIcon />
              Espace client
            </Link>
            <Link
              href="/ticket"
              onClick={onNavigate}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary py-3 font-heading font-bold text-white shadow-float transition hover:bg-primary-700"
            >
              <Headset size={18} aria-hidden="true" />
              Ouvrir un ticket
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MobileCard({ card, onNavigate }: { card: PanelCard; onNavigate: () => void }) {
  return (
    <Link href={card.href} onClick={onNavigate} className="flex gap-3 rounded-xl border border-black/5 p-3">
      {card.image && (
        <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-soft">
          <Image src={card.image} alt={card.imageAlt ?? ''} fill sizes="64px" className="object-cover" />
        </span>
      )}
      <span className="min-w-0">
        <span className="flex items-baseline gap-2">
          {card.price && (
            <span className="font-heading text-base font-bold text-navy">
              {card.price}
              {card.period && <span className="ml-1 text-xs font-normal text-slatebody">{card.period}</span>}
            </span>
          )}
          <span className="font-heading text-sm font-bold text-navy">{card.title}</span>
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slatebody">{card.desc}</span>
      </span>
    </Link>
  )
}

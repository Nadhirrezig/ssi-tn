'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Consent,
  PREFERENCES_EVENT,
  openCookiePreferences,
  readConsent,
  writeConsent,
} from '@/lib/consent'

/**
 * Consent banner for non-essential cookies.
 *
 * Sits bottom-left so it never covers the back-to-top button, and is not modal:
 * refusing is one click and the site stays usable either way.
 */
export default function CookieConsent() {
  // Closed on the first paint: the cookie is only readable in the browser, and
  // a banner that flashes for visitors who already answered is worse than one
  // that arrives a frame late.
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (readConsent() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(PREFERENCES_EVENT, reopen)
    return () => window.removeEventListener(PREFERENCES_EVENT, reopen)
  }, [])

  const answer = (value: Consent) => {
    writeConsent(value)
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-black/5 bg-white p-5 shadow-card sm:bottom-6 sm:left-6 sm:right-auto sm:w-[26rem]"
        >
          <p id="cookie-consent-title" className="font-heading text-base font-bold text-navy">
            Vos cookies, votre choix
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slatebody">
            Nous déposons uniquement les cookies nécessaires au fonctionnement du
            site. Les cookies de mesure d’audience, eux, ne seront déposés
            qu’avec votre accord — et jamais de cookies publicitaires.{' '}
            <Link
              href="/confidentialite#cookies"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              En savoir plus
            </Link>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => answer('accepted')}
              className="rounded-full bg-primary px-5 py-2.5 font-heading text-sm font-bold text-white transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Tout accepter
            </button>
            <button
              type="button"
              onClick={() => answer('rejected')}
              className="rounded-full border border-slatebody/25 px-5 py-2.5 font-heading text-sm font-bold text-navy transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Continuer sans accepter
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Reopens the banner — the visitor can change their mind at any time. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      Gérer mes cookies
    </button>
  )
}

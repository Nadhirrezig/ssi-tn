import type { MouseEvent } from 'react'

/**
 * Home links ("Accueil", the logo) point at "/" rather than "/#home", so the
 * address bar stays clean. Clicking one while already on the home page would
 * then do nothing; this scrolls back to the top instead — instantly for
 * visitors who asked for reduced motion.
 */
export function scrollToTopIfHome(event: MouseEvent, pathname: string, href: string) {
  if (href !== '/' || pathname !== '/') return
  event.preventDefault()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

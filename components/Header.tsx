'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Logo from './Logo'
import { DesktopMegaMenu, DesktopNav } from './header/DesktopNav'
import HeaderActions from './header/HeaderActions'
import MobileMenu from './header/MobileMenu'
import { EASE, NAV } from './header/nav-data'
import { NavPanelId, OPEN_PANEL_EVENT } from '@/lib/nav'
import { scrollToTopIfHome } from '@/lib/scroll'

/**
 * Site header: owns the state (scroll, open panel, mobile menu) and lays out
 * the pieces in components/header/. Menu content lives in header/nav-data.ts.
 */
export default function Header({
  solid: solidProp = false,
}: {
  /** Force the solid white bar from the start (pages without a light hero). */
  solid?: boolean
}) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const reduce = useReducedMotion()
  const pathname = usePathname()

  useEffect(() => {
    // Passive: the handler never calls preventDefault, and a non-passive scroll
    // listener makes the browser wait on it before compositing each frame.
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // A CTA elsewhere on the page can ask for a panel (see lib/nav). The header is
  // fixed, so the panel opens in view wherever the visitor happens to be —
  // below lg that panel is the mobile accordion, hence both states are set.
  useEffect(() => {
    const onOpenPanel = (e: Event) => {
      const panel = (e as CustomEvent<NavPanelId>).detail
      setActive(panel)
      setMobileOpen(true)
      setMobileExpanded(panel)
    }
    window.addEventListener(OPEN_PANEL_EVENT, onOpenPanel)
    return () => window.removeEventListener(OPEN_PANEL_EVENT, onOpenPanel)
  }, [])

  const activeItem = NAV.find((n) => n.id === active) ?? null
  // Chrome (phone + button styling) follows scroll or the page-level override;
  // the bar itself also turns white while a mega panel is open.
  const chrome = solidProp || scrolled
  const solid = chrome || activeItem !== null

  const closeAll = () => {
    setActive(null)
    setMobileOpen(false)
    setMobileExpanded(null)
  }

  /** Menu links: close everything; "Accueil" on the home page scrolls to the top. */
  const onLinkClick = (e: MouseEvent, href: string) => {
    scrollToTopIfHome(e, pathname, href)
    closeAll()
  }

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        onMouseLeave={() => setActive(null)}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? 'bg-white shadow-card' : ''}`}
      >
        <div className="mx-auto flex h-20 max-w-content items-center justify-between px-6">
          <Logo preload />
          <DesktopNav active={active} setActive={setActive} onLinkClick={onLinkClick} />
          <HeaderActions
            chrome={chrome}
            solid={solid}
            mobileOpen={mobileOpen}
            onToggleMobile={() => setMobileOpen((o) => !o)}
            onNavigate={closeAll}
          />
        </div>

        <DesktopMegaMenu item={activeItem} reduce={reduce} onNavigate={closeAll} />

        <MobileMenu
          open={mobileOpen}
          expanded={mobileExpanded}
          setExpanded={setMobileExpanded}
          reduce={reduce}
          onLinkClick={onLinkClick}
          onNavigate={closeAll}
        />
      </motion.header>

      {/* Scrim behind the open mega panel (click / tap to close) */}
      <AnimatePresence>
        {activeItem && (
          <motion.button
            aria-hidden
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-40 hidden cursor-default bg-navy/10 lg:block"
          />
        )}
      </AnimatePresence>
    </>
  )
}

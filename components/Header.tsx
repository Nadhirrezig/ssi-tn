'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Logo from './Logo'

const navLinks = [
  { href: '#home', label: 'Accueil' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'À propos' },
  { href: '#realisations', label: 'Réalisations' },
  { href: '#tarifs', label: 'Tarifs' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-card' : ''
      }`}
    >
      <div className="mx-auto flex h-20 max-w-content items-center justify-between px-6">
        <Logo priority />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-heading text-[15px] font-semibold transition hover:text-primary ${
                i === 0 ? 'text-navy' : 'text-slatebody'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <a
            href="tel:+21671000000"
            className="hidden items-center gap-2 font-heading text-[15px] font-bold text-navy transition hover:text-primary xl:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
            </svg>
            +216 71 000 000
          </a>
          <Link
            href="#contact"
            className="hidden rounded-full bg-primary px-6 py-2.5 font-heading text-[15px] font-bold text-white shadow-float transition hover:bg-primary-700 sm:inline-block"
          >
            Devis gratuit
          </Link>
          <button
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            className="grid h-11 w-11 place-items-center rounded-full text-navy lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              {mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black/5 bg-white lg:hidden"
          >
            <nav className="flex flex-col px-6 pb-6 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-black/5 py-3 font-heading font-semibold text-navy"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-4 rounded-full bg-primary py-3 text-center font-heading font-bold text-white"
              >
                Demander un devis
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

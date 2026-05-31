'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur shadow-card' : ''
      }`}
    >
      <div className="mx-auto flex h-20 max-w-content items-center justify-between px-6">
        {/* Logo */}
        <Link href="#home" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white shadow-float">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2 4.5 13.2c-.4.5 0 1.3.6 1.3H11l-1 7.5c-.1.7.8 1.1 1.2.5L19.5 11c.4-.5 0-1.3-.6-1.3H13l1-7.2c.1-.7-.8-1.1-1.2-.5Z" />
            </svg>
          </span>
          <span className="font-heading text-2xl font-bold text-navy">Base</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex">
          <Link href="#home" className="font-heading text-[15px] font-semibold text-navy transition hover:text-primary">Home</Link>
          <Link href="#why" className="font-heading text-[15px] font-semibold text-slatebody transition hover:text-primary">About</Link>
          <Link href="#features" className="font-heading text-[15px] font-semibold text-slatebody transition hover:text-primary">Features</Link>
          <Link href="#pricing" className="font-heading text-[15px] font-semibold text-slatebody transition hover:text-primary">Pricing</Link>
          <button className="flex items-center gap-1 font-heading text-[15px] font-semibold text-slatebody transition hover:text-primary">
            Pages
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <Link href="#faq" className="font-heading text-[15px] font-semibold text-slatebody transition hover:text-primary">Support</Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="grid h-11 w-11 place-items-center rounded-full bg-navy text-white transition hover:bg-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button aria-label="Toggle theme" className="hidden h-11 w-11 place-items-center rounded-full text-navy transition hover:text-primary sm:grid">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </button>
          <Link href="#" className="hidden font-heading text-[15px] font-bold text-navy transition hover:text-primary sm:inline">
            Sign In
          </Link>
          <Link href="#" className="hidden rounded-full bg-primary-50 px-6 py-2.5 font-heading text-[15px] font-bold text-primary transition hover:bg-primary hover:text-white sm:inline-block">
            Sign Up
          </Link>
          <button
            id="menu-btn"
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-full text-navy lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-black/5 bg-white px-6 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            <Link href="#home" onClick={() => setMobileOpen(false)} className="border-b border-black/5 py-3 font-heading font-semibold text-navy">Home</Link>
            <Link href="#why" onClick={() => setMobileOpen(false)} className="border-b border-black/5 py-3 font-heading font-semibold text-slatebody">About</Link>
            <Link href="#features" onClick={() => setMobileOpen(false)} className="border-b border-black/5 py-3 font-heading font-semibold text-slatebody">Features</Link>
            <Link href="#pricing" onClick={() => setMobileOpen(false)} className="border-b border-black/5 py-3 font-heading font-semibold text-slatebody">Pricing</Link>
            <Link href="#projects" onClick={() => setMobileOpen(false)} className="border-b border-black/5 py-3 font-heading font-semibold text-slatebody">Projects</Link>
            <Link href="#faq" onClick={() => setMobileOpen(false)} className="py-3 font-heading font-semibold text-slatebody">Support</Link>
            <div className="mt-4 flex gap-3">
              <Link href="#" className="flex-1 rounded-full border border-black/10 py-2.5 text-center font-heading font-bold text-navy">Sign In</Link>
              <Link href="#" className="flex-1 rounded-full bg-primary py-2.5 text-center font-heading font-bold text-white">Sign Up</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

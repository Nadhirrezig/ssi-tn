'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Logo from './Logo'
import { NavPanelId, OPEN_PANEL_EVENT } from '@/lib/nav'

const EASE = [0.22, 1, 0.36, 1] as const

type PanelLink = { label: string; href: string }

type PanelCard = {
  eyebrow?: string
  title: string
  desc: string
  href: string
  image?: string
  imageAlt?: string
  price?: string
  period?: string
  links?: PanelLink[]
  cta?: string
  /** Full-bleed image card with the copy overlaid on it. */
  hook?: boolean
}

type Panel = {
  cards: PanelCard[]
  note: string
  cta: PanelLink
  /** Slide the cards instead of laying them all out at once (3+ cards). */
  carousel?: boolean
}

/* Carousel geometry: cards in view at once, the gap between them (gap-4), and
   the sliver of the next card left showing — the panel is otherwise flush and
   nothing would suggest there is more to see. Widths are expressed against the
   clipping box, which the track matches, so a step lands card-on-card. */
const PER_VIEW = 2
const GAP = 16
const PEEK = 56

/** Delay between automatic steps. */
const AUTOPLAY_MS = 3000

const CARD_W = `calc(${100 / PER_VIEW}% - ${GAP + PEEK / PER_VIEW}px)`
/** One card plus its gap. */
const STEP = `(${100 / PER_VIEW}% - ${PEEK / PER_VIEW}px)`

/** How far the track can travel before the last card sits flush right. */
function maxOffset(count: number) {
  return `(${(count * 100) / PER_VIEW - 100}% - ${count * (GAP + PEEK / PER_VIEW) - (count - 1) * GAP}px)`
}

// An item is either a plain link, or a panel item — which may also carry an
// href, but does not need one: it opens the panel from a button.
type NavItem = { id: string; label: string } & (
  | { href: string; panel?: undefined }
  | { href?: string; panel: Panel }
)

const NAV: NavItem[] = [
  { id: 'accueil', label: 'Accueil', href: '/#home' },
  {
    id: 'solutions',
    label: 'Solutions',
    href: '/#contact',
    panel: {
      note: 'Un seul partenaire de confiance pour toute votre informatique.',
      cta: { label: 'Demander un devis', href: '/#contact' },
      carousel: true,
      cards: [
        {
          eyebrow: 'AltosPOS',
          title: 'Paiement et accès par bracelet NFC',
          desc: 'Un simple bracelet permet de payer, commander et ouvrir les chambres. Tout est instantané, sans cash, sans carte, sans friction.',
          href: '/solution/altospos',
          image: '/api/r2/pos-solution/p4-1-4.webp',
          imageAlt: 'Bracelet NFC AltosPOS présenté au-dessus d’un terminal de paiement',
          cta: 'Voir la solution',
          hook: true,
        },
        {
          eyebrow: 'AltosStock',
          title: 'Gestion de stock',
          desc: 'Inventaire, suivi des mouvements et réapprovisionnement, synchronisés avec AltosPOS.',
          href: '/solution/altosstock',
          image: '/api/r2/pos-solution/stockxpos.webp',
          imageAlt: 'AltosStock connecté à AltosPOS sur le poste de vente',
          links: [
            { label: 'Inventaire & suivi de stock', href: '/solution/altosstock' },
            { label: 'Fiche technique par article', href: '/solution/altosstock' },
            { label: 'Fournisseurs & réapprovisionnement', href: '/solution/altosstock' },
          ],
        },
        {
          eyebrow: 'Écosystème',
          title: 'Développement sur mesure',
          desc: 'Applications métier, intégrations et évolutions conçues autour de vos processus et de votre système d’information.',
          href: '/#contact',
          image: '/website-content/about-02.webp',
          imageAlt: 'Équipe SSI en atelier de développement sur mesure',
          links: [
            { label: 'Applications métier', href: '/#contact' },
            { label: 'Intégrations & API', href: '/#contact' },
            { label: 'Maintenance & évolutions', href: '/#contact' },
          ],
        },
      ],
    },
  },
  // À propos is a plain link (no mega panel) — it navigates to the about page.
  { id: 'about', label: 'À propos', href: '/#about' },
  {
    id: 'realisations',
    label: 'Réalisations',
    panel: {
      note: 'Des projets concrets, des résultats mesurables.',
      cta: { label: 'Voir toutes nos réalisations', href: '/#realisations' },
      cards: [
        {
          eyebrow: 'Étude de cas',
          title: 'Refonte d’infrastructure',
          desc: 'Réseau et serveurs redondés à haute disponibilité pour un groupe industriel.',
          href: '/#realisations',
          image: '/website-content/about-02.webp',
          imageAlt: 'Projet d’infrastructure réseau livré par SSI',
          links: [
            { label: 'Infrastructure & Réseaux', href: '/#realisations' },
            { label: 'Cloud & Infogérance', href: '/#realisations' },
          ],
        },
        {
          eyebrow: 'Étude de cas',
          title: 'Sécurité & conformité',
          desc: 'Audit complet, SOC managé et plan de remédiation pour des acteurs sensibles.',
          href: '/#realisations',
          image: '/website-content/about-03.webp',
          imageAlt: 'Supervision et sécurité des systèmes par SSI',
          links: [
            { label: 'Cybersécurité', href: '/#realisations' },
            { label: 'Supervision 24/7', href: '/#realisations' },
          ],
        },
      ],
    },
  },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function Caret({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      {dir === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  )
}

function Dot() {
  return <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary-50 text-primary">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </span>
}

/* One card inside a mega panel — image category card or a plan card. */
function MegaCard({ card, onNavigate }: { card: PanelCard; onNavigate: () => void }) {
  if (card.hook && card.image) {
    return (
      <Link
        href={card.href}
        onClick={onNavigate}
        className="group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl border border-black/5 transition hover:border-primary/30 hover:shadow-card"
      >
        <Image
          src={card.image}
          alt={card.imageAlt ?? ''}
          fill
          sizes="(max-width: 1024px) 90vw, 560px"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
        <div className="relative p-5 lg:p-6">
          {card.eyebrow && (
            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 font-heading text-xs font-bold text-primary backdrop-blur">
              {card.eyebrow}
            </span>
          )}
          <h3 className="mt-3 font-heading text-lg font-bold text-white">{card.title}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">{card.desc}</p>
          <span className="mt-4 flex items-center gap-1.5 font-heading text-sm font-bold text-white transition group-hover:gap-2.5">
            {card.cta ?? 'En savoir plus'} <Arrow />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={card.href}
      onClick={onNavigate}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:border-primary/30 hover:shadow-card"
    >
      {card.image ? (
        <div className="relative w-full overflow-hidden max-lg:aspect-[16/10] lg:flex-1">
          <Image
            src={card.image}
            alt={card.imageAlt ?? ''}
            fill
            sizes="(max-width: 1024px) 90vw, 340px"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          {card.eyebrow && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-heading text-xs font-bold text-primary backdrop-blur">
              {card.eyebrow}
            </span>
          )}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4 lg:p-5">
        {card.eyebrow && !card.image && (
          <span className="mb-2 inline-flex w-fit rounded-full bg-primary-50 px-3 py-1 font-heading text-xs font-bold text-primary">
            {card.eyebrow}
          </span>
        )}
        {card.price && (
          <p className="font-heading text-navy">
            <span className="text-3xl font-bold">{card.price}</span>
            {card.period && <span className="ml-1 text-sm text-slatebody">{card.period}</span>}
          </p>
        )}
        <h3 className="mt-1 font-heading text-lg font-bold text-navy transition group-hover:text-primary">
          {card.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slatebody">{card.desc}</p>

        {card.links && (
          <ul className="mt-4 space-y-2 border-t border-black/5 pt-4">
            {card.links.map((l) => (
              <li key={l.label} className="flex items-center gap-2.5 text-sm font-semibold text-navy">
                <Dot />
                {l.label}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-auto flex items-center gap-1.5 pt-4 font-heading text-sm font-bold text-primary opacity-0 transition group-hover:opacity-100">
          {card.cta ?? 'En savoir plus'} <Arrow />
        </span>
      </div>
    </Link>
  )
}

/* Full mega panel content for one nav item. */
function MegaPanel({ panel, onNavigate }: { panel: Panel; onNavigate: () => void }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const cols = panel.cards.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
  // Last reachable position: the track stops once the final card is in view.
  const last = Math.max(0, panel.cards.length - PER_VIEW)
  const sliding = panel.carousel === true && last > 0

  // Steps on its own, wrapping at the end. Keyed on `index`, so arriving by
  // arrow restarts the delay rather than being cut short by a pending tick.
  useEffect(() => {
    if (!sliding || paused || reduce) return
    const id = setTimeout(() => setIndex((i) => (i >= last ? 0 : i + 1)), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [index, sliding, paused, reduce, last])

  return (
    <div>
      {sliding ? (
        <div
          // Held still while the pointer is on the cards: a click target that
          // slides out from under the cursor is worse than a slow reveal.
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="overflow-hidden lg:h-[340px]"
        >
          <div
            className="flex gap-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:h-full"
            // Clamped so the last step stops flush right instead of running past
            // the final card and leaving the peek as dead space.
            style={{
              transform: `translateX(calc(-1 * min(${index} * ${STEP}, ${maxOffset(panel.cards.length)})))`,
            }}
          >
            {panel.cards.map((card, i) => {
              const inView = i >= index && i < index + PER_VIEW
              return (
                <div
                  key={card.title}
                  // The peeking card is a cue, not a target: dimmed so the crop
                  // reads as deliberate, and out of the tab order because
                  // focusing it would scroll the clipping box and leave the
                  // track misaligned.
                  ref={(node) => {
                    if (node) node.inert = !inView
                  }}
                  className={`shrink-0 transition-opacity duration-500 lg:h-full ${
                    inView ? '' : 'opacity-45'
                  }`}
                  style={{ width: CARD_W }}
                >
                  <MegaCard card={card} onNavigate={onNavigate} />
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className={`grid gap-4 sm:grid-cols-2 ${cols} lg:h-[340px]`}>
          {panel.cards.map((card) => (
            <MegaCard key={card.title} card={card} onNavigate={onNavigate} />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-soft px-5 py-4">
        <p className="text-sm text-slatebody">{panel.note}</p>
        <div className="flex items-center gap-4">
          {sliding && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIndex((i) => (i <= 0 ? last : i - 1))}
                aria-label="Solutions précédentes"
                className="grid h-9 w-9 place-items-center rounded-full border border-slatebody/25 text-navy transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Caret dir="left" />
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => (i >= last ? 0 : i + 1))}
                aria-label="Solutions suivantes"
                className="grid h-9 w-9 place-items-center rounded-full border border-slatebody/25 text-navy transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Caret dir="right" />
              </button>
            </div>
          )}
          <Link
            href={panel.cta.href}
            onClick={onNavigate}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-heading text-sm font-bold text-white shadow-float transition hover:bg-primary-700"
          >
            {panel.cta.label} <Arrow />
          </Link>
        </div>
      </div>
    </div>
  )
}

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

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        onMouseLeave={() => setActive(null)}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? 'bg-white shadow-card' : ''
        }`}
      >
        <div className="mx-auto flex h-20 max-w-content items-center justify-between px-6">
          <Logo priority />

          {/* Desktop nav */}
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
                  onClick={closeAll}
                  className="font-heading text-[15px] font-semibold text-navy transition hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+21628290350"
              className={`hidden items-center gap-2 font-heading text-[15px] font-bold text-navy transition hover:text-primary ${
                chrome ? 'xl:flex' : ''
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
              </svg>
              +216 28 290 350
            </a>
            <Link
              href="/#contact"
              onClick={closeAll}
              className={`hidden rounded-full px-6 py-2.5 font-heading text-[15px] font-bold shadow-float transition sm:inline-block ${
                solid
                  ? 'bg-primary text-white hover:bg-primary-700'
                  : 'bg-primary text-white hover:bg-primary-700 lg:bg-white lg:text-primary lg:hover:bg-white/90'
              }`}
            >
              Devis gratuit
            </Link>
            <button
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
              className="grid h-11 w-11 place-items-center rounded-full text-navy lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                {mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop mega panel — persists while open, content crossfades on switch */}
        <AnimatePresence>
          {activeItem?.panel && (
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
                    key={activeItem.id}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: EASE }}
                  >
                    <MegaPanel panel={activeItem.panel} onNavigate={closeAll} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu — accordion mega */}
        <AnimatePresence>
          {mobileOpen && (
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
                        onClick={() => setMobileExpanded((x) => (x === item.id ? null : item.id))}
                        aria-expanded={mobileExpanded === item.id}
                        className="flex w-full items-center justify-between py-3.5 font-heading font-semibold text-navy"
                      >
                        {item.label}
                        <Chevron open={mobileExpanded === item.id} />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileExpanded === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.24, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="grid gap-3 pb-4">
                              {item.panel.cards.map((card) => (
                                <Link
                                  key={card.title}
                                  href={card.href}
                                  onClick={closeAll}
                                  className="flex gap-3 rounded-xl border border-black/5 p-3"
                                >
                                  {card.image && (
                                    <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-soft">
                                      <Image
                                        src={card.image}
                                        alt={card.imageAlt ?? ''}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                      />
                                    </span>
                                  )}
                                  <span className="min-w-0">
                                    <span className="flex items-baseline gap-2">
                                      {card.price && (
                                        <span className="font-heading text-base font-bold text-navy">
                                          {card.price}
                                          {card.period && (
                                            <span className="ml-1 text-xs font-normal text-slatebody">{card.period}</span>
                                          )}
                                        </span>
                                      )}
                                      <span className="font-heading text-sm font-bold text-navy">{card.title}</span>
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-slatebody">{card.desc}</span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={closeAll}
                      className="block border-b border-black/5 py-3.5 font-heading font-semibold text-navy"
                    >
                      {item.label}
                    </Link>
                  )
                )}
                <Link
                  href="/#contact"
                  onClick={closeAll}
                  className="mt-4 block rounded-full bg-primary py-3 text-center font-heading font-bold text-white"
                >
                  Demander un devis
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
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

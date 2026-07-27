'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { secteurs, type Secteur, type SecteurCell } from '@/lib/content/secteurs'

const EASE = [0.22, 1, 0.36, 1] as const

// Intended asset sizes for each cell of the locked 1400×680 mosaic.
const HERO_RATIO = '868 × 680'
const SUPPORT_RATIO = '513 × 330'

// Rendered width of each cell, so the support column stops pulling a source
// sized for the hero cell.
const HERO_SIZES = '(max-width: 1024px) 100vw, 870px'
const SUPPORT_SIZES = '(max-width: 1024px) 45vw, 515px'

/** A single mosaic cell: image when `src` is set, otherwise the empty state. */
function Figure({
  cell,
  ratio,
  sizes,
  className,
}: {
  cell: SecteurCell
  ratio: string
  sizes: string
  className?: string
}) {
  if (cell.src) {
    return (
      <figure className={`relative overflow-hidden ${className ?? ''}`}>
        <Image
          src={cell.src}
          alt={cell.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </figure>
    )
  }
  // Empty state: subtle inset border + centered mono ratio label. No box, no icon.
  return (
    <div
      role="img"
      aria-label={cell.alt}
      className={`grid place-items-center bg-soft ring-1 ring-inset ring-slatebody/15 ${className ?? ''}`}
    >
      <span className="font-mono text-sm tracking-wide text-slatebody/70">{ratio}</span>
    </div>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  )
}

export default function Secteurs({
  items = secteurs,
  ariaLabel = 'Secteurs d’activité',
}: {
  /** Slides to render — defaults to the placeholder content. */
  items?: readonly Secteur[]
  ariaLabel?: string
}) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const count = items.length
  const active = items[index]

  const go = (i: number) => setIndex(Math.max(0, Math.min(count - 1, i)))

  const fade = {
    initial: reduce ? false : { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reduce ? 0 : 0.4, ease: EASE },
  }

  return (
    <section
      aria-roledescription="carrousel"
      aria-label={ariaLabel}
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-content px-6">
        {/* Mosaic — aspect-locked so it reserves space (zero CLS). Slides are
            stacked and cross-fade; inactive slides are inert.

            Every slide occupies the same box, so the browser counts all of them
            as on-screen and lazy-loading buys nothing: the images of all four
            slides would download at once. Only the current slide and its
            neighbours are mounted — a slide reached by a jump of two or more
            loads as it is selected. */}
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[1400/680]">
          {items.map((s, i) => {
            const on = i === index
            const near = Math.abs(i - index) <= 1
            return (
              <div
                key={i}
                ref={(node) => {
                  if (node) node.inert = !on
                }}
                role="group"
                aria-roledescription="diapositive"
                aria-label={`Secteur ${i + 1} sur ${count} : ${s.title}`}
                aria-hidden={!on || undefined}
                className={`absolute inset-0 flex flex-col gap-3 transition-opacity duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:flex-row lg:gap-5 ${
                  on ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                {near && (
                  <>
                    <Figure
                      cell={s.hero}
                      ratio={HERO_RATIO}
                      sizes={HERO_SIZES}
                      className={s.support.length > 0 ? 'flex-[1.6] lg:flex-[868]' : 'flex-1'}
                    />
                    {s.support.length > 0 && (
                      <div className="flex flex-1 gap-3 lg:flex-[513] lg:flex-col lg:gap-5">
                        {s.support.map((cell, j) => (
                          <Figure
                            key={j}
                            cell={cell}
                            ratio={SUPPORT_RATIO}
                            sizes={SUPPORT_SIZES}
                            className="flex-1"
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Text row: title (left) / body (middle) / controls (right). Stacks
            vertically under 1024px. */}
        <div className="mt-10 grid gap-8 lg:mt-14 lg:min-h-[128px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,520px)_auto] lg:items-center lg:gap-10">
          {/* Title */}
          <div className="relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h2
                key={index}
                {...fade}
                className="text-balance font-heading text-[clamp(1.5rem,2.6vw,2.375rem)] font-bold leading-[1.1] text-navy"
              >
                {active.title}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Body */}
          <div className="relative max-w-[580px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={index} {...fade} className="text-base leading-relaxed text-slatebody">
                {active.body}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 lg:justify-end">
            {/* Pagination indicators */}
            <div className="flex items-center gap-2" role="group" aria-label="Choisir un secteur">
              {items.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Aller au secteur ${i + 1} : ${s.title}`}
                  aria-current={i === index ? 'true' : undefined}
                  className="rounded-full py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? 'w-6 bg-primary' : 'w-1.5 bg-slatebody/30'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Prev / next */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                disabled={index === 0}
                aria-label="Secteur précédent"
                className="grid h-11 w-11 place-items-center rounded-full border border-slatebody/25 text-navy transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slatebody/25 disabled:hover:text-navy"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                disabled={index === count - 1}
                aria-label="Secteur suivant"
                className="grid h-11 w-11 place-items-center rounded-full border border-slatebody/25 text-navy transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slatebody/25 disabled:hover:text-navy"
              >
                <Chevron dir="right" />
              </button>
            </div>
          </div>
        </div>

        {/* Polite live region announcing the current slide. */}
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {`Secteur ${index + 1} sur ${count} : ${active.title}`}
        </p>
      </div>
    </section>
  )
}

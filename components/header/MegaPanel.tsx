'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import MegaCard from './MegaCard'
import { Arrow, Caret } from './icons'
import type { Panel } from './nav-data'

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

const ARROW_BUTTON =
  'grid h-9 w-9 place-items-center rounded-full border border-slatebody/25 text-navy transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

/* Full mega panel content for one nav item. */
export default function MegaPanel({ panel, onNavigate }: { panel: Panel; onNavigate: () => void }) {
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
                  className={`shrink-0 transition-opacity duration-500 lg:h-full ${inView ? '' : 'opacity-45'}`}
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
                className={ARROW_BUTTON}
              >
                <Caret dir="left" />
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => (i >= last ? 0 : i + 1))}
                aria-label="Solutions suivantes"
                className={ARROW_BUTTON}
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

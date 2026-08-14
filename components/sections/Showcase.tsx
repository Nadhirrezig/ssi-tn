'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import Reveal from '@/components/motion/Reveal'
import {
  showcase,
  type ShowcaseCard,
  type ShowcaseContent,
  type ShowcaseMedia,
} from '@/lib/content/showcase'

/**
 * Media showcase grid — fixed composition, in reading order:
 *   row 1: one full-width hero card
 *   row 2: two equal split cards
 *   row 3: one wide card (~70%) + one narrow card (~30%)
 * Text lives inside the cards (over the media); the section heading sits outside.
 * Cards are aspect-locked so the section reserves its space (zero CLS).
 */

// Intended asset size per slot of the 1400-wide composition (20px gutters).
const RATIOS = ['1400 × 720', '690 × 690', '690 × 690', '950 × 700', '430 × 700'] as const

// Rendered width of each slot inside the 1200px container, so next/image stops
// serving a full-width source to the half- and quarter-width cards.
const SIZES = [
  '(max-width: 1024px) 100vw, 1200px',
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 590px',
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 590px',
  '(max-width: 1024px) 100vw, 800px',
  '(max-width: 1024px) 100vw, 380px',
] as const

/** Empty state: subtle inset border + centered mono label. No box, no icon. */
function Placeholder({ media, ratio }: { media: ShowcaseMedia; ratio: string }) {
  return (
    <div
      role="img"
      aria-label={media.alt}
      className="absolute inset-0 grid place-items-center bg-soft ring-1 ring-inset ring-slatebody/15"
    >
      <span className="font-mono text-sm tracking-wide text-slatebody/70">
        {media.kind === 'video' ? 'vidéo' : 'image'} · {ratio}
      </span>
    </div>
  )
}

/** Video media: muted, looping, autoplay (unless reduced motion), replay control. */
function VideoMedia({ media }: { media: Extract<ShowcaseMedia, { kind: 'video' }> }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()

  // The card sits deep in the page, so the clip is neither fetched nor decoded
  // until it is about to be seen — `autoPlay` pulls it down on page load
  // instead, and a loop left running off-screen keeps decoding for nothing.
  useEffect(() => {
    const video = ref.current
    if (!video || reduce) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play()
        else video.pause()
      },
      { rootMargin: '200px' }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduce])

  const replay = () => {
    const v = ref.current
    if (!v) return
    v.currentTime = 0
    void v.play()
  }

  return (
    <>
      <video
        ref={ref}
        src={media.src ?? undefined}
        poster={media.poster}
        aria-label={media.alt}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={replay}
        aria-label="Lire la vidéo depuis le début"
        className="absolute bottom-5 right-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-navy shadow-card backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
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
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v6h-6" />
        </svg>
      </button>
    </>
  )
}

const ALIGN: Record<ShowcaseCard['align'], { box: string; scrim: string }> = {
  'top-left': {
    box: 'justify-start items-start text-left',
    scrim: 'bg-gradient-to-b from-navy/70 via-navy/25 to-transparent',
  },
  'top-center': {
    box: 'justify-start items-center text-center',
    scrim: 'bg-gradient-to-b from-navy/70 via-navy/25 to-transparent',
  },
  'bottom-left': {
    box: 'justify-end items-start text-left',
    scrim: 'bg-gradient-to-t from-navy/70 via-navy/25 to-transparent',
  },
  'bottom-center': {
    box: 'justify-end items-center text-center',
    scrim: 'bg-gradient-to-t from-navy/70 via-navy/25 to-transparent',
  },
}

function Card({
  card,
  ratio,
  sizes,
  className,
  large,
}: {
  card: ShowcaseCard
  ratio: string
  /** Rendered width of this slot, so the browser picks the right source. */
  sizes: string
  className?: string
  /** Larger inside-title (the full-width hero card). */
  large?: boolean
}) {
  const filled = card.media.src !== null
  const align = ALIGN[card.align]
  const hasText = Boolean(card.title || card.body || card.note)

  return (
    // The card is the flex container itself so the copy stays in normal flow.
    // Held in an absolute layer it was laid out against a box whose height the
    // aspect ratio had already fixed, and a title that needed one line more than
    // the ratio allowed — routine at 375px — was silently cut off by
    // `overflow-hidden`. In flow the ratio acts as a floor and the card grows.
    <article
      className={`relative flex flex-col overflow-hidden ${hasText ? align.box : ''} ${className ?? ''}`}
    >
      {/* Media layer */}
      {!filled ? (
        <Placeholder media={card.media} ratio={ratio} />
      ) : card.media.kind === 'image' ? (
        <Image
          src={card.media.src as string}
          alt={card.media.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <VideoMedia media={card.media} />
      )}

      {/* Text layer (over the media) */}
      {hasText && (
        <>
          {/* Scrim for contrast — only when real media sits behind the text */}
          {filled && <div aria-hidden className={`absolute inset-0 ${align.scrim}`} />}
          <div
            className={`relative max-w-xl p-5 sm:p-8 lg:p-10 ${
              filled ? 'text-white' : 'text-navy'
            }`}
          >
            {card.title && (
              <h3
                className={`text-balance font-heading font-bold ${
                  large
                    ? 'text-xl leading-snug sm:text-3xl lg:text-4xl'
                    : 'text-lg leading-snug sm:text-2xl lg:text-[28px]'
                }`}
              >
                {card.title}
              </h3>
            )}
            {card.body && (
              <p
                className={`mt-2.5 text-sm leading-relaxed sm:mt-3 sm:text-base ${
                  filled ? 'text-white/85' : 'text-slatebody'
                }`}
              >
                {card.body}
              </p>
            )}
            {card.note && (
              <p
                className={`mt-2.5 text-xs sm:mt-3 sm:text-sm ${
                  filled ? 'text-white/60' : 'text-slatebody/80'
                }`}
              >
                {card.note}
              </p>
            )}
          </div>
        </>
      )}
    </article>
  )
}

export default function Showcase({
  content = showcase,
}: {
  /** Section content — defaults to the placeholder content. */
  content?: ShowcaseContent
}) {
  const [hero, splitLeft, splitRight, wide, narrow] = content.cards

  return (
    <section aria-label={content.title} className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-content px-6">
        {/* Heading — outside the grid, like the reference */}
        <Reveal className="max-w-3xl">
          <p className="font-heading text-sm font-bold text-primary sm:text-base">{content.eyebrow}</p>
          <h2 className="mt-3 text-balance font-heading text-[28px] font-bold leading-tight text-navy sm:mt-4 sm:text-4xl lg:text-[44px]">
            {content.title}
          </h2>
        </Reveal>

        <div className="mt-8 space-y-4 sm:mt-12 sm:space-y-5">
          {/* Row 1 — full-width hero card */}
          <Reveal>
            <Card
              card={hero}
              ratio={RATIOS[0]}
              sizes={SIZES[0]}
              large
              className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[1400/720]"
            />
          </Reveal>

          {/* Row 2 — two equal split cards */}
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              <Card card={splitLeft} ratio={RATIOS[1]} sizes={SIZES[1]} className="aspect-[4/3] sm:aspect-square" />
              <Card card={splitRight} ratio={RATIOS[2]} sizes={SIZES[2]} className="aspect-[4/3] sm:aspect-square" />
            </div>
          </Reveal>

          {/* Row 3 — wide (~70%) + narrow (~30%) */}
          <Reveal>
            <div className="grid gap-4 sm:gap-5 lg:grid-cols-[950fr_430fr]">
              <Card card={wide} ratio={RATIOS[3]} sizes={SIZES[3]} className="aspect-[4/3] lg:aspect-[950/700]" />
              <Card card={narrow} ratio={RATIOS[4]} sizes={SIZES[4]} className="aspect-[4/3] lg:aspect-auto lg:h-full" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

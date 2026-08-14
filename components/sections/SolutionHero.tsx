'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import type { SolutionHeroContent } from '@/lib/content/solutions'

const EASE = [0.22, 1, 0.36, 1] as const

export default function SolutionHero({ content }: { content: SolutionHeroContent }) {
  const reduce = useReducedMotion()
  const filled = content.image.src !== null

  return (
    // `svh` rather than `vh`: on a phone the latter measures the viewport with
    // the browser chrome retracted, so the section overflows the screen it is
    // meant to fill. The vertical padding is what the copy falls back on when it
    // outgrows that height — without it a long title runs under the fixed header.
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-navy py-28 sm:py-32">
      {/* Media layer */}
      {filled ? (
        <Image
          src={content.image.src as string}
          alt={content.image.alt}
          fill
          priority
          // The frame is portrait on a phone and the photography is landscape,
          // so `object-cover` scales the source to the frame's *height* — it is
          // painted about twice as wide as the viewport. At a flat `100vw` the
          // browser picks a source for one viewport width and upscales it, which
          // is what makes the hero look soft on mobile. 150vw buys back most of
          // that without reaching for the 4K source on a high-DPR phone.
          sizes="(max-width: 768px) 150vw, 100vw"
          className="object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(79,91,255,0.45),transparent_60%)]" />
          <span className="absolute right-6 top-24 font-mono text-sm tracking-wide text-white/40 sm:top-28">
            image · 1920 × 1080
          </span>
        </>
      )}

      {/* Scrim */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/30"
      />

      {/* Centered Content */}
      <div className="relative mx-auto w-full max-w-3xl px-6 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          <p className="font-heading text-sm font-bold tracking-wide text-accentYellow sm:text-base">
            {content.eyebrow}
          </p>

          <h1 className="mt-3 text-balance font-heading text-3xl font-bold leading-tight text-white sm:mt-4 sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>

          <p className="mt-5 text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg">
            {content.subtitle}
          </p>

          {content.note && (
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {content.note}
            </p>
          )}

          {/* Stacked and full-width on a phone: side by side the two labels wrap
              into two ragged rows of different widths. */}
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/#contact"
              className="rounded-full bg-primary px-8 py-4 text-center font-heading text-base font-bold text-white shadow-float transition hover:bg-primary-700"
            >
              Demander une démo
            </Link>

            <a
              href="#fonctionnalites"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 font-heading text-base font-bold text-white transition hover:border-white hover:bg-white/10"
            >
              Découvrir les fonctionnalités
              <svg
                className="transition-transform group-hover:translate-y-0.5"
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
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
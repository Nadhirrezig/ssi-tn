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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy">
      {/* Media layer */}
      {filled ? (
        <Image
          src={content.image.src as string}
          alt={content.image.alt}
          fill
          priority
          sizes="100vw"
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

          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>

          <p className="mt-6 text-base leading-relaxed text-white/85 sm:text-lg">
            {content.subtitle}
          </p>

          {content.note && (
            <p className="mt-4 text-sm text-white/60">
              {content.note}
            </p>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-full bg-primary px-8 py-4 font-heading text-base font-bold text-white shadow-float transition hover:bg-primary-700"
            >
              Demander une démo
            </Link>

            <a
              href="#fonctionnalites"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 font-heading text-base font-bold text-white transition hover:border-white hover:bg-white/10"
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
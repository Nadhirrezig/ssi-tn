'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const stats = [
  { value: '10+', label: "ans d'expertise" },
  { value: '200+', label: 'projets livrés' },
  { value: '24/7', label: 'support & supervision' },
]

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="home" className="relative overflow-hidden pt-20">
      {/* Soft brand wash behind the whole hero */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[520px] w-[520px] translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-0 top-1/2 h-72 w-72 -translate-x-1/3 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-content items-center gap-12 px-6 lg:grid-cols-2 lg:gap-8">
        {/* Copy */}
        <motion.div
          variants={container}
          initial={reduce ? false : 'hidden'}
          animate="show"
          className="relative z-10 py-14 lg:py-24"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 font-heading text-sm font-bold text-primary"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            Sécurité &amp; Solutions Informatiques
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-heading text-[40px] font-bold leading-[1.08] text-navy sm:text-5xl lg:text-[58px]"
          >
            La digitalisation de votre entreprise,{' '}
            <span className="text-primary">sur mesure et sécurisée.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-md text-lg leading-relaxed text-slatebody"
          >
            SSI accompagne les entreprises tunisiennes dans leur transformation
            numérique : infrastructure, cybersécurité et solutions logicielles
            conçues pour vos besoins — fiables, performantes et protégées.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#contact"
              className="rounded-full bg-primary px-8 py-4 font-heading text-base font-bold text-white shadow-float transition hover:bg-primary-700"
            >
              Demander un devis
            </Link>
            <Link
              href="#services"
              className="group inline-flex items-center gap-2 rounded-full border border-black/10 px-7 py-4 font-heading text-base font-bold text-navy transition hover:border-primary hover:text-primary"
            >
              Découvrir nos services
              <svg
                className="transition-transform group-hover:translate-x-1"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.dl
            variants={item}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-4 divide-x divide-black/10"
          >
            {stats.map((s, i) => (
              <div key={s.label} className={i === 0 ? '' : 'pl-8'}>
                <dt className="font-heading text-3xl font-bold text-navy">{s.value}</dt>
                <dd className="mt-1 text-sm text-slatebody">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[520px] py-8 lg:py-0"
        >
          {/* Brand disc backdrop — contained, not overflowing */}
          <div className="absolute inset-x-4 top-6 -z-10 aspect-square rounded-full bg-primary/10" />
          <div className="absolute -right-3 top-12 -z-10 h-24 w-24 rounded-3xl bg-accentYellow/80" />

          {/* Main image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-soft shadow-float ring-1 ring-black/5">
            <Image
              src="/website-content/hero.webp"
              alt="Équipe SSI accompagnant la digitalisation et la sécurité informatique des entreprises"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 520px"
              className="object-cover"
            />
            {/* subtle gradient for text legibility on the badge */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/15 to-transparent" />
          </div>

          {/* Floating trust badge */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
            className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card sm:-left-6"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <div>
              <p className="font-heading text-lg font-bold leading-none text-navy">99,9%</p>
              <p className="mt-1 text-xs text-slatebody">Disponibilité garantie</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

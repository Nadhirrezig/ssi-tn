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

        {/* Visual — large brand sphere that reaches up under the navbar */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="relative mx-auto h-[420px] w-full max-w-[380px] sm:h-[560px] sm:max-w-[460px] lg:-mt-6 lg:h-[680px] lg:max-w-[520px]"
        >
          {/* The sphere — clips the cut-out portrait into a circle (overflow hidden) */}
          <div className="absolute left-1/2 top-0 aspect-square w-[124%] -translate-x-1/2 overflow-hidden rounded-full bg-primary shadow-[0_50px_90px_-40px_rgba(79,91,255,0.65)]">
            {/* glossy highlight for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_22%,rgba(255,255,255,0.32),transparent_55%)]" />
            {/* transparent portrait sits inside the sphere; the blue shows through */}
            <Image
              src="/website-content/hero.webp"
              alt="Collaboratrice SSI souriante travaillant sur son ordinateur portable"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 90vw, 640px"
              className="object-cover object-bottom"
            />
          </div>

          {/* Small accent square */}
          <div className="absolute right-0 top-[28%] h-16 w-16 rounded-2xl bg-accentYellow shadow-card" />

          {/* Floating trust badge */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
            className="absolute bottom-4 left-0 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card sm:-left-4"
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

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
        </motion.div>

        {/* Visual — large brand disc rising up under the navbar, like the Base landing */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="relative mx-auto h-[440px] w-full max-w-[440px] sm:h-[560px] sm:max-w-[560px] lg:mx-0 lg:h-[740px] lg:max-w-none lg:self-start"
        >
          {/* The disc — cut by the top of the page so it covers the navbar area; the
              transparent header sits on it until the white bar pops in on scroll */}
          <div className="absolute left-0 top-[-12px] aspect-square h-full rounded-full bg-primary lg:top-[-180px] lg:h-[128%]">
            {/* bright blue quarter over the disc's bottom-right edge */}
            <div className="absolute bottom-[1%] right-[7%] h-16 w-16 rounded-tl-[999px] bg-accentBlue sm:h-24 sm:w-24 lg:bottom-[-1%] lg:right-[24%]" />
            {/* cut-out portrait sits on the disc; its flat bottom edge drops past the curve */}
            <div className="absolute inset-x-[-14%] bottom-[-1%] aspect-[752/686] lg:left-[-9%] lg:right-[10%]">
              <Image
                src="/website-content/hero.webp"
                alt="Collaboratrice SSI souriante travaillant sur son ordinateur portable"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 90vw, 760px"
                className="object-contain object-bottom"
              />
            </div>
          </div>

          {/* Yellow quarter over the disc's left edge */}
          <div className="absolute left-[-5%] top-[34%] h-24 w-24 rounded-br-[999px] bg-accentYellow sm:h-32 sm:w-32 lg:left-[-20%] lg:top-[35%] lg:h-40 lg:w-40" />

          {/* Coral waves near the disc's lower-left edge */}
          <svg
            className="absolute bottom-[20%] left-[6%] w-20 text-accentCoral sm:w-24 lg:bottom-[7%] lg:left-[20%]"
            viewBox="0 0 80 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M2 10c8-8 14 8 22 0M2 22c8-8 14 8 22 0M2 34c8-8 14 8 22 0" />
            <path d="M30 10c8-8 14 8 22 0M30 22c8-8 14 8 22 0M30 34c8-8 14 8 22 0" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}

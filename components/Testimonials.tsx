'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Reveal from './motion/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

const testimonials = [
  {
    quote:
      'SSI a entièrement repensé notre infrastructure réseau. Fiabilité et sécurité au rendez-vous, avec une équipe disponible et réellement à l’écoute de nos contraintes métier.',
    name: 'Mohamed Trabelsi',
    role: 'DSI — Groupe Médifin',
    initials: 'MT',
  },
  {
    quote:
      'Leur audit de cybersécurité nous a permis d’identifier nos failles et de nous mettre en conformité rapidement. Un accompagnement clair, pédagogique et efficace.',
    name: 'Inès Bouaziz',
    role: 'Directrice — Cabinet Bouaziz & Associés',
    initials: 'IB',
  },
  {
    quote:
      'Une application métier livrée dans les délais et parfaitement adaptée à nos processus. SSI est devenu un vrai partenaire de confiance pour notre digitalisation.',
    name: 'Karim Hammami',
    role: 'Gérant — TunisLog',
    initials: 'KH',
  },
]

function Monogram({ initials }: { initials: string }) {
  return (
    <div className="grid aspect-square place-items-center rounded-2xl bg-primary-50">
      <span className="font-heading text-4xl font-bold text-primary">{initials}</span>
    </div>
  )
}

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIndex((i) => (i + 1) % testimonials.length)

  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-content px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-base font-bold text-primary">Témoignages</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-navy sm:text-[44px]">
            Ils nous font confiance
          </h2>
          <p className="mt-5 text-lg text-slatebody">
            Des entreprises de tous secteurs s’appuient sur SSI pour digitaliser
            et sécuriser leur activité au quotidien.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${index * 100}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
            >
              {testimonials.map((t) => (
                <div key={t.name} className="w-full shrink-0 px-1">
                  <div className="relative grid items-center gap-8 overflow-hidden rounded-3xl bg-white p-8 shadow-card sm:grid-cols-[220px_1fr] sm:p-10">
                    <Monogram initials={t.initials} />
                    <div>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary/15">
                        <path d="M10 7H6a4 4 0 0 0-4 4v6h6v-6H5a3 3 0 0 1 3-3V7Zm12 0h-4a4 4 0 0 0-4 4v6h6v-6h-3a3 3 0 0 1 3-3V7Z" transform="scale(-1,1) translate(-24,0)" />
                      </svg>
                      <p className="mt-2 text-xl italic leading-relaxed text-slatebody">{t.quote}</p>
                      <div className="mt-7">
                        <p className="font-heading text-lg font-bold text-navy">{t.name}</p>
                        <p className="text-sm text-slatebody">{t.role}</p>
                      </div>
                    </div>
                    <span className="absolute inset-y-0 right-0 w-1.5 bg-primary" />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Témoignage précédent"
              className="grid h-12 w-12 place-items-center rounded-full border border-black/10 text-primary transition hover:border-primary hover:bg-primary hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setIndex(i)}
                  aria-label={`Aller au témoignage ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-6 bg-primary' : 'w-2 bg-black/15 hover:bg-black/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Témoignage suivant"
              className="grid h-12 w-12 place-items-center rounded-full border border-black/10 text-primary transition hover:border-primary hover:bg-primary hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

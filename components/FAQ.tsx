'use client'

import { useState } from 'react'
import Reveal from './motion/Reveal'

const faqs = [
  {
    q: 'Quels services propose SSI ?',
    a: 'Nous couvrons l’ensemble de votre système d’information : cybersécurité, infrastructure et réseaux, développement d’applications sur mesure, cloud et infogérance, ainsi que l’audit et le conseil.',
  },
  {
    q: 'Intervenez-vous partout en Tunisie ?',
    a: 'Oui. Nos équipes interviennent sur site dans le Grand Tunis et à distance sur l’ensemble du territoire, avec un support réactif et des délais d’intervention contractualisés.',
  },
  {
    q: 'Comment garantissez-vous la sécurité de nos données ?',
    a: 'Nous appliquons une approche de sécurité par conception : audits réguliers, chiffrement, sauvegardes, supervision continue et plans de réponse aux incidents pour limiter les risques.',
  },
  {
    q: 'Proposez-vous un accompagnement après la mise en production ?',
    a: 'Absolument. Nos contrats de maintenance et d’infogérance assurent les mises à jour, la supervision et l’assistance dans la durée, pour garder votre informatique fiable et sécurisée.',
  },
  {
    q: 'Comment obtenir un devis ?',
    a: 'Contactez-nous via le bouton « Demander un devis » ou par téléphone. Après un échange sur vos besoins, nous vous remettons une proposition claire et détaillée, sans engagement.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-soft py-24">
      <div className="mx-auto max-w-content px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-base font-bold text-primary">FAQ</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-navy sm:text-[44px]">
            Questions fréquentes
          </h2>
          <p className="mt-5 text-lg text-slatebody">
            Tout ce qu’il faut savoir avant de démarrer. Une autre question ?
            Notre équipe vous répond rapidement.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.06}>
              <div className="overflow-hidden rounded-2xl bg-white shadow-card">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
                >
                  <span className="font-heading text-lg font-bold text-navy">{faq.q}</span>
                  <svg
                    className={`shrink-0 text-primary transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-7 pb-6 text-base leading-relaxed text-slatebody">{faq.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

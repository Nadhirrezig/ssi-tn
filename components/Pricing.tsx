import Link from 'next/link'
import Reveal from './motion/Reveal'

type Plan = {
  name: string
  priceLabel?: string
  price: string
  period?: string
  blurb: string
  featured: boolean
  cta: string
  features: string[]
}

const plans: Plan[] = [
  {
    name: 'Essentiel',
    priceLabel: 'À partir de',
    price: '290',
    period: 'DT / mois',
    blurb: 'Pour les TPE et petites structures.',
    featured: false,
    cta: 'Choisir Essentiel',
    features: [
      'Supervision des postes & serveurs',
      'Maintenance préventive',
      'Support en heures ouvrables',
      'Sauvegardes régulières',
    ],
  },
  {
    name: 'Professionnel',
    priceLabel: 'À partir de',
    price: '690',
    period: 'DT / mois',
    blurb: 'Pour les PME en croissance.',
    featured: true,
    cta: 'Demander un devis',
    features: [
      'Tout de l’offre Essentiel',
      'Cybersécurité managée',
      'Support prioritaire 7j/7',
      'Infogérance complète',
      'Reporting mensuel',
    ],
  },
  {
    name: 'Entreprise',
    price: 'Sur devis',
    blurb: 'Pour les organisations multi-sites.',
    featured: false,
    cta: 'Nous contacter',
    features: [
      'Tout de l’offre Professionnel',
      'Supervision 24/7 (SOC)',
      'Plan de reprise (PRA / PCA)',
      'Accompagnement dédié & SLA',
    ],
  },
]

function CheckIcon({ featured }: { featured: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      className={`shrink-0 ${featured ? 'text-accentYellow' : 'text-primary'}`}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export default function Pricing() {
  return (
    <section id="tarifs" className="py-24">
      <div className="mx-auto max-w-content px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-base font-bold text-primary">Tarifs</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-navy sm:text-[44px]">
            Des formules claires, adaptées à votre taille
          </h2>
          <p className="mt-5 text-lg text-slatebody">
            Choisissez le niveau d’accompagnement qui correspond à vos besoins.
            Sans engagement et évolutif à tout moment.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-8 transition duration-300 hover:-translate-y-1 ${
                  p.featured
                    ? 'border-primary bg-primary text-white shadow-float lg:-mt-4 lg:mb-4'
                    : 'border-black/10 bg-white shadow-card hover:shadow-float'
                }`}
              >
                {p.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-accentYellow px-3 py-1 font-heading text-xs font-bold text-navy">
                    Populaire
                  </span>
                )}
                <h3 className={`font-heading text-xl font-bold ${p.featured ? 'text-white' : 'text-navy'}`}>
                  {p.name}
                </h3>
                <p className={`mt-2 text-sm ${p.featured ? 'text-white/75' : 'text-slatebody'}`}>{p.blurb}</p>

                <div className="mt-6">
                  {p.priceLabel && (
                    <span className={`block text-xs font-semibold uppercase tracking-wide ${p.featured ? 'text-white/60' : 'text-slatebody'}`}>
                      {p.priceLabel}
                    </span>
                  )}
                  <div className="flex items-end gap-1">
                    <span className={`font-heading text-4xl font-bold ${p.featured ? 'text-white' : 'text-navy'}`}>
                      {p.price}
                    </span>
                    {p.period && (
                      <span className={`mb-1.5 text-sm ${p.featured ? 'text-white/70' : 'text-slatebody'}`}>
                        {p.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mt-7 space-y-3 text-[15px]">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-center gap-3 ${p.featured ? 'text-white/90' : 'text-slatebody'}`}>
                      <CheckIcon featured={p.featured} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="#contact"
                  className={`mt-8 rounded-full py-3.5 text-center font-heading font-bold transition ${
                    p.featured
                      ? 'bg-white text-primary hover:bg-accentYellow hover:text-navy'
                      : 'bg-primary-50 text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

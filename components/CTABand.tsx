import Link from 'next/link'
import Reveal from './motion/Reveal'

export default function CTABand() {
  return (
    <section id="contact" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-content px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-16 text-center sm:px-16">
            {/* Decorative circles */}
            <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 right-6 h-52 w-52 rounded-full bg-white/10" />
            <div className="absolute right-10 top-10 h-16 w-16 rounded-bl-[999px] bg-accentYellow" />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-heading text-4xl font-bold leading-tight text-white sm:text-[42px]">
                Prêt à digitaliser et sécuriser votre entreprise ?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
                Discutons de votre projet. Nos experts vous proposent une solution
                sur mesure, adaptée à vos enjeux et à votre budget.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:contact@ssi.tn?subject=Demande%20de%20devis"
                  className="rounded-full bg-white px-9 py-4 font-heading text-base font-bold text-primary transition hover:bg-accentYellow hover:text-navy"
                >
                  Demander un devis gratuit
                </a>
                <Link
                  href="#contact"
                  className="rounded-full border border-white/40 px-9 py-4 font-heading text-base font-bold text-white transition hover:bg-white/10"
                >
                  Voir nos services
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/80">
                <a href="tel:+21671000000" className="inline-flex items-center gap-2 transition hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
                  </svg>
                  +216 71 000 000
                </a>
                <a href="mailto:contact@ssi.tn" className="inline-flex items-center gap-2 transition hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  contact@ssi.tn
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

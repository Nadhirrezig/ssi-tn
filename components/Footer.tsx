import Link from 'next/link'
import Logo from './Logo'
import { CookiePreferencesButton } from './CookieConsent'

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white pb-10 pt-20">
      <div className="mx-auto max-w-content px-6">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Logo imgClassName="h-12 w-auto" />
            <p className="mt-6 max-w-xs text-base leading-relaxed text-slatebody">
              La digitalisation de votre entreprise, avec des solutions sur mesure
              et sécurisées. Cybersécurité, infrastructure, développement et infogérance.
            </p>
            <div className="mt-6 flex gap-3">
              {/* LinkedIn and Facebook return once their page URLs are known —
                  an icon linking to "#" goes nowhere. */}
              <SocialLink aria-label="Email" href="mailto:contact@ssi-tn.com">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-base font-bold text-navy">Services</h4>
            <ul className="mt-5 space-y-3 text-base">
              <li><Link href="/#services" className="transition hover:text-primary">Cybersécurité</Link></li>
              <li><Link href="/#services" className="transition hover:text-primary">Infrastructure & Réseaux</Link></li>
              <li><Link href="/#services" className="transition hover:text-primary">Développement</Link></li>
              <li><Link href="/#services" className="transition hover:text-primary">Cloud & Infogérance</Link></li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="font-heading text-base font-bold text-navy">Entreprise</h4>
            <ul className="mt-5 space-y-3 text-base">
              <li><Link href="/#about" className="transition hover:text-primary">À propos</Link></li>
              <li><Link href="/#faq" className="transition hover:text-primary">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-bold text-navy">Contact</h4>
            <ul className="mt-5 space-y-3 text-base text-slatebody">
              <li className="flex items-start gap-3">
                <svg className="mt-1 shrink-0 text-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Tunis, Tunisie
              </li>
              <li>
                <a href="tel:+21628290350" className="inline-flex items-center gap-3 transition hover:text-primary">
                  <svg className="shrink-0 text-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
                  </svg>
                  +216 28 290 350
                </a>
              </li>
              <li>
                <a href="mailto:contact@ssi-tn.com" className="inline-flex items-center gap-3 transition hover:text-primary">
                  <svg className="shrink-0 text-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  contact@ssi-tn.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 sm:flex-row">
          <p className="text-sm text-slatebody">
            © 2026 SSI — Sécurité &amp; Solutions Informatiques. Tous droits réservés.
          </p>
          <nav
            aria-label="Liens légaux"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slatebody"
          >
            <Link href="/confidentialite" className="transition hover:text-primary">
              Politique de confidentialité
            </Link>
            <CookiePreferencesButton className="transition hover:text-primary" />
            <span>Conçu en Tunisie.</span>
          </nav>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, children, 'aria-label': ariaLabel }: { href: string; children: React.ReactNode; 'aria-label': string }) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="grid h-10 w-10 place-items-center rounded-full bg-soft text-slatebody transition hover:bg-primary hover:text-white"
    >
      {children}
    </Link>
  )
}

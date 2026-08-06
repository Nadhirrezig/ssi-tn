import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

const SITEMAP_LINKS = [
  { href: "/services/cybersecurite", label: "Cybersécurité" },
  { href: "/services/solutions-informatiques", label: "Solutions Informatiques" },
  { href: "/a-propos", label: "À propos" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/ressources", label: "Ressources" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
];

const linkClass = cn(
  "text-ink text-[length:var(--text-small)]",
  "transition-opacity duration-[var(--dur-base)] [transition-timing-function:var(--ease-quart)]",
  "hover:opacity-60 focus-visible:opacity-60",
);

export function Footer() {
  return (
    <footer className="border-t border-line mt-[var(--space-7)]">
      <Container className="py-[var(--space-7)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--space-5)]">
          <div className="md:col-span-5">
            <p className="font-medium text-[length:var(--text-h3)] tracking-[-0.01em] text-ink">
              SSI
            </p>
            <p className="mt-[var(--space-2)] text-[length:var(--text-small)] text-muted prose-width">
              Sociétés Sécurités et Solutions Informatiques. Cybersécurité et
              exploitation des systèmes d&apos;information pour les entreprises
              tunisiennes.
            </p>
            <p className="mt-[var(--space-2)] font-mono text-[length:var(--text-mono)] text-faint">
              Tunis, Tunisie
            </p>
          </div>

          <div className="md:col-span-4">
            <Eyebrow>Plan du site</Eyebrow>
            <ul className="mt-[var(--space-2)] flex flex-col gap-[var(--space-1)]">
              {SITEMAP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <Eyebrow>Contact</Eyebrow>
            <ul className="mt-[var(--space-2)] flex flex-col gap-[var(--space-1)]">
              <li>
                <a href="mailto:contact@ssi-tn.com" className={linkClass}>
                  contact@ssi-tn.com
                </a>
              </li>
              <li>
                <a href="tel:+216000000000" className={linkClass}>
                  +216 XX XXX XXX
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="me noopener"
                  className={linkClass}
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={cn(
            "mt-[var(--space-6)] pt-[var(--space-4)] border-t border-line",
            "flex flex-col gap-[var(--space-2)] md:flex-row md:items-center md:justify-between",
          )}
        >
          <p className="font-mono text-[length:var(--text-mono)] text-faint">
            © 2026 SSI. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-[var(--space-3)]">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(linkClass, "text-faint")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

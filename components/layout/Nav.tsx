import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/services/cybersecurite", label: "Services" },
  { href: "/a-propos", label: "À propos" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/ressources", label: "Ressources" },
  { href: "/contact", label: "Contact" },
] as const;

export function Nav() {
  return (
    <header className="border-b border-line">
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only",
          "focus:absolute focus:left-[var(--side-pad)] focus:top-2 focus:z-50",
          "focus:bg-paper focus:text-ink",
          "focus:px-3 focus:py-2 focus:rounded-[2px]",
          "focus:border focus:border-line",
        )}
      >
        Aller au contenu principal
      </a>

      <Container as="div" className="flex items-center justify-between h-20">
        <Link
          href="/"
          aria-label="SSI — Accueil"
          className="inline-flex items-center transition-opacity duration-[var(--dur-base)] hover:opacity-80"
        >
          {/* TODO: optimize logo.png (134KB, 578×277) to SVG/WebP */}
          <Image
            src="/logo.png"
            alt="SSI — Sociétés Sécurités et Solutions Informatiques"
            width={104}
            height={50}
            priority
            sizes="104px"
            className="block"
          />
        </Link>

        <nav aria-label="Principal" className="hidden sm:block">
          <ul className="flex items-center gap-[var(--space-3)]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-ink text-[length:var(--text-body)]",
                    "transition-opacity duration-[var(--dur-base)] [transition-timing-function:var(--ease-quart)]",
                    "hover:opacity-60 focus-visible:opacity-60",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:hidden">
          <MobileMenu links={NAV_LINKS} />
        </div>
      </Container>
    </header>
  );
}

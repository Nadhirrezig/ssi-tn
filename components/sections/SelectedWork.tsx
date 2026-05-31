import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

export function SelectedWork() {
  return (
    <Section
      id="realisations"
      aria-labelledby="work-title"
      className="border-t border-line"
    >
      <Container>
        <div className="reveal flex flex-col gap-[var(--space-2)] md:flex-row md:items-baseline md:justify-between">
          <Eyebrow>04 — Réalisations</Eyebrow>
          <h2
            id="work-title"
            className="font-medium text-ink max-w-[22ch]"
            style={{
              fontSize: "var(--text-h2)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            Sélection de missions récentes.
          </h2>
        </div>

        <article
          className={cn(
            "reveal mt-[var(--space-6)]",
            "border border-line rounded-[2px]",
            "grid grid-cols-1 md:grid-cols-12",
            "overflow-hidden",
          )}
        >
          <div className="md:col-span-7 bg-surface relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
            {/* TODO: replace with real client documentary photography */}
            <Image
              src="/logo.png"
              alt=""
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-contain p-[var(--space-6)] opacity-60"
            />
          </div>

          <div className="md:col-span-5 p-[var(--space-5)] md:p-[var(--space-6)] flex flex-col gap-[var(--space-3)]">
            <p className="font-mono text-[length:var(--text-mono)] text-faint">
              Secteur industriel · 2025 · Audit + infogérance
            </p>
            <h3
              className="font-medium text-ink"
              style={{
                fontSize: "var(--text-h3)",
                lineHeight: 1.35,
              }}
            >
              Remise à plat de l&apos;exploitation et de la sécurité du SI
              pour un groupe industriel tunisien.
            </h3>
            <p className="text-muted">
              Audit complet, plan de remédiation chiffré sur 12 mois,
              infogérance opérée par SSI. Réduction mesurée du temps moyen de
              résolution et du nombre d&apos;incidents critiques.
            </p>
            <div>
              <Link
                href="/realisations/groupe-industriel"
                className={cn(
                  "text-ink font-medium",
                  "text-[length:var(--text-small)]",
                  "link-underline link-underline-grow",
                )}
              >
                Lire l&apos;étude de cas →
              </Link>
            </div>
          </div>
        </article>
      </Container>
    </Section>
  );
}

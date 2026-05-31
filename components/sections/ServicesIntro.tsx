import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

type Service = {
  index: string;
  title: string;
  description: string;
  href: string;
};

const SERVICES: ReadonlyArray<Service> = [
  {
    index: "01",
    title: "Cybersécurité",
    description:
      "Audit de sécurité, gouvernance, réponse à incident, formation des équipes. Nous identifions les risques réels et les traitons avec méthode — pas avec des outils empilés.",
    href: "/services/cybersecurite",
  },
  {
    index: "02",
    title: "Solutions Informatiques",
    description:
      "Infogérance, infrastructure, postes utilisateurs, conseil. Faire fonctionner ce qui doit fonctionner, et anticiper ce qui doit évoluer.",
    href: "/services/solutions-informatiques",
  },
];

export function ServicesIntro() {
  return (
    <Section
      id="services"
      aria-labelledby="services-title"
      className="border-t border-line"
    >
      <Container>
        <div className="reveal flex flex-col gap-[var(--space-2)] md:flex-row md:items-baseline md:justify-between">
          <Eyebrow>02 — Métiers</Eyebrow>
          <h2
            id="services-title"
            className="font-medium text-ink max-w-[20ch]"
            style={{
              fontSize: "var(--text-h2)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            Deux métiers, une exigence.
          </h2>
        </div>

        <ol className="mt-[var(--space-6)] border-y border-line">
          {SERVICES.map((service, i) => (
            <li
              key={service.index}
              className={cn(
                "reveal",
                i < SERVICES.length - 1 && "border-b border-line",
              )}
            >
              <article className="grid grid-cols-12 gap-[var(--space-3)] py-[var(--space-5)]">
                <div className="col-span-12 md:col-span-2">
                  <span className="font-mono text-[length:var(--text-mono)] text-faint">
                    {service.index} —
                  </span>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <h3
                    className="font-medium text-ink"
                    style={{
                      fontSize: "var(--text-h3)",
                      lineHeight: 1.35,
                    }}
                  >
                    {service.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-6 flex flex-col gap-[var(--space-3)]">
                  <p className="text-muted prose-width">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className={cn(
                      "self-start text-ink font-medium",
                      "text-[length:var(--text-small)]",
                      "link-underline link-underline-grow",
                    )}
                  >
                    En savoir plus →
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Principle = {
  label: string;
  body: string;
};

const PRINCIPLES: ReadonlyArray<Principle> = [
  {
    label: "Sans jargon",
    body: "Nous expliquons ce que nous faisons et pourquoi. À votre DG comme à votre DSI.",
  },
  {
    label: "Avec méthode",
    body: "Cadre, livrables, échéances. Pas d'improvisation déguisée en agilité.",
  },
  {
    label: "Avec preuves",
    body: "Indicateurs réels, rapports clairs, références vérifiables.",
  },
];

export function Approach() {
  return (
    <Section
      id="approche"
      aria-labelledby="approche-title"
      className="border-t border-line"
    >
      <Container>
        <div className="reveal flex flex-col gap-[var(--space-2)] md:flex-row md:items-baseline md:justify-between">
          <Eyebrow>03 — Approche</Eyebrow>
          <h2
            id="approche-title"
            className="font-medium text-ink max-w-[22ch]"
            style={{
              fontSize: "var(--text-h2)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            Le travail bien fait, expliqué simplement.
          </h2>
        </div>

        <div className="mt-[var(--space-6)] grid grid-cols-12 gap-[var(--space-5)]">
          <div className="reveal col-span-12 md:col-span-7">
            <p
              className="text-ink prose-width"
              style={{
                fontSize: "var(--text-body-lg)",
                lineHeight: 1.6,
              }}
            >
              Nous travaillons pour des dirigeants et des DSI qui veulent
              comprendre ce qui se passe dans leur SI sans que cela ne demande
              une traduction. Chaque mission commence par une lecture honnête
              du terrain — l&apos;existant, les contraintes, les vrais
              risques — et débouche sur un plan dont l&apos;avancement se
              mesure.
            </p>
            <p className="mt-[var(--space-3)] text-muted prose-width">
              C&apos;est moins spectaculaire qu&apos;un slogan. C&apos;est ce
              qui tient sur la durée.
            </p>
          </div>

          <div className="col-span-12 md:col-span-5 md:border-l md:border-line md:pl-[var(--space-4)]">
            <ul className="divide-y divide-line">
              {PRINCIPLES.map((p) => (
                <li
                  key={p.label}
                  className="reveal py-[var(--space-3)] first:pt-0 last:pb-0"
                >
                  <Eyebrow>{p.label}</Eyebrow>
                  <p className="mt-[var(--space-1)] text-muted text-[length:var(--text-small)]">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

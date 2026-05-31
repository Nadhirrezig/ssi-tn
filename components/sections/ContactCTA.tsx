import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function ContactCTA() {
  return (
    <Section
      id="contact"
      aria-labelledby="contact-title"
      className="border-t border-line"
      rhythm="default"
    >
      <Container>
        <div className="reveal">
          <Eyebrow>05 — Contact</Eyebrow>
          <h2
            id="contact-title"
            className="mt-[var(--space-3)] font-medium text-ink max-w-[20ch]"
            style={{
              fontSize: "var(--text-h1)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Discutons de votre projet.
          </h2>
          <p
            className="mt-[var(--space-4)] text-muted prose-width"
            style={{
              fontSize: "var(--text-body-lg)",
              lineHeight: 1.6,
            }}
          >
            Décrivez votre besoin en quelques lignes. Réponse sous 48 heures
            ouvrées.
          </p>

          <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-2)] sm:flex-row sm:items-center sm:gap-[var(--space-4)]">
            <Button href="mailto:contact@ssi.tn" variant="primary">
              Écrire à SSI
            </Button>
            <a
              href="mailto:contact@ssi.tn"
              className="font-mono text-[length:var(--text-mono)] text-muted link-underline link-underline-grow self-start sm:self-auto"
            >
              contact@ssi.tn
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section
      aria-label="Accueil"
      className="pt-[var(--space-9)] pb-[var(--space-8)]"
    >
      <Container>
        <Eyebrow>SSI — Tunis, Tunisie</Eyebrow>

        <h1
          className="reveal mt-[var(--space-4)] font-medium text-ink max-w-[18ch]"
          style={{
            fontSize: "var(--text-display)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          Sécuriser, structurer, opérer votre système d&apos;information.
        </h1>

        <p
          className="reveal mt-[var(--space-4)] text-muted prose-width"
          style={{
            fontSize: "var(--text-body-lg)",
            lineHeight: 1.6,
          }}
        >
          SSI accompagne les entreprises tunisiennes dans la cybersécurité et
          l&apos;exploitation de leurs solutions informatiques. Audit, conseil,
          infogérance — sans jargon, sans promesses creuses.
        </p>

        <div className="reveal mt-[var(--space-5)]">
          <Button href="/contact" variant="primary">
            Parler à un expert
          </Button>
        </div>
      </Container>
    </section>
  );
}

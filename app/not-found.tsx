import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center">
      <Container className="py-[var(--space-9)]">
        <Eyebrow>Erreur 404</Eyebrow>
        <h1
          className="mt-[var(--space-3)] font-medium text-ink max-w-[18ch]"
          style={{
            fontSize: "var(--text-h1)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Page en préparation.
        </h1>
        <p
          className="mt-[var(--space-4)] text-muted prose-width"
          style={{
            fontSize: "var(--text-body-lg)",
            lineHeight: 1.6,
          }}
        >
          Cette section sera bientôt disponible. Le site SSI est en cours de
          construction — nous publions progressivement.
        </p>
        <div className="mt-[var(--space-5)]">
          <Button href="/" variant="primary">
            Retour à l&apos;accueil
          </Button>
        </div>
      </Container>
    </main>
  );
}

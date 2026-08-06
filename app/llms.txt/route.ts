import { solutions } from '@/lib/content/solutions'
import { SITE_NAME, SITE_URL } from '@/lib/site'

/**
 * Served at /llms.txt — the llmstxt.org convention: one Markdown file telling an
 * assistant what this site is and which URLs actually answer a question about
 * it, without making it guess from the rendered pages.
 *
 * Built from the same solution registry as the pages and the sitemap, so a new
 * solution appears in all three at once.
 */

// Nothing here depends on the request: build it once at build time.
export const dynamic = 'force-static'

export function GET() {
  const solutionEntries = solutions
    .map(
      (solution) =>
        `- [${solution.name}](${SITE_URL}/solution/${solution.slug}) : ${solution.metaDescription}`
    )
    .join('\n')

  const body = `# ${SITE_NAME}

> SSI est une société tunisienne de sécurité et de solutions informatiques, basée à Tunis. Nous accompagnons les entreprises sur l'ensemble de leur système d'information : cybersécurité, infrastructure et réseaux, développement d'applications métier, cloud et infogérance — ainsi que nos propres solutions de point de vente et de gestion de stock pour l'hôtellerie et le commerce.

Langue du site : français. Zone d'intervention : Tunisie.
Contact : contact@ssi-tn.com — +216 28 290 350.

## Pages principales

- [Accueil](${SITE_URL}/) : présentation de SSI, métiers, réalisations et questions fréquentes.
${solutionEntries}

## Domaines d'expertise

- Cybersécurité : audit, sécurisation des systèmes, supervision et remédiation.
- Infrastructure et réseaux : conception, déploiement et haute disponibilité.
- Développement sur mesure : applications métier, intégrations et API.
- Cloud et infogérance : hébergement, exploitation et maintien en condition opérationnelle.

## Informations légales

- [Politique de confidentialité](${SITE_URL}/confidentialite) : données collectées, finalités, durées de conservation, cookies et exercice de vos droits.

## Notes

- Le site ne comporte pas de formulaire de contact : les demandes passent par e-mail ou par téléphone.
- Aucun cookie publicitaire n'est déposé ; les cookies de mesure d'audience sont soumis au consentement du visiteur.
- Les services de SSI s'adressent aux professionnels et aux personnes majeures.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

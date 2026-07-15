/**
 * Content for the "Secteurs" scenario carousel (components/sections/Secteurs.tsx).
 * All copy and images are placeholders — Nadhir fills these later.
 *
 * Slot API: a cell with `src: null` renders the empty-state placeholder
 * (inset border + mono ratio label). Set `src` to an image path to fill it.
 */

export type SecteurCell = {
  /** Image path, or `null` to render the placeholder empty state. */
  src: string | null
  /** Alt text for the image / accessible name for the placeholder. */
  alt: string
}

export type Secteur = {
  title: string
  body: string
  /** Large hero cell (left). */
  hero: SecteurCell
  /** Two stacked supporting cells (right column). */
  support: readonly [SecteurCell, SecteurCell]
}

export const secteurs: readonly Secteur[] = [
  {
    title: 'Secteur public & collectivités',
    body: 'Texte de démonstration : SSI sécurise et modernise les systèmes d’information des administrations, avec une exigence de continuité et de conformité au quotidien.',
    hero: { src: null, alt: 'Visuel à venir — secteur public (image principale)' },
    support: [
      { src: null, alt: 'Visuel à venir — secteur public (détail 1)' },
      { src: null, alt: 'Visuel à venir — secteur public (détail 2)' },
    ],
  },
  {
    title: 'Santé & établissements de soins',
    body: 'Texte de démonstration : protection des données patients, disponibilité des services et supervision continue pour les cliniques et établissements de soins.',
    hero: { src: null, alt: 'Visuel à venir — santé (image principale)' },
    support: [
      { src: null, alt: 'Visuel à venir — santé (détail 1)' },
      { src: null, alt: 'Visuel à venir — santé (détail 2)' },
    ],
  },
  {
    title: 'Finance, banque & assurance',
    body: 'Texte de démonstration : conformité, résilience et sécurité renforcée pour les banques, assurances et acteurs financiers soumis à de fortes exigences réglementaires.',
    hero: { src: null, alt: 'Visuel à venir — finance (image principale)' },
    support: [
      { src: null, alt: 'Visuel à venir — finance (détail 1)' },
      { src: null, alt: 'Visuel à venir — finance (détail 2)' },
    ],
  },
  {
    title: 'Industrie, énergie & logistique',
    body: 'Texte de démonstration : réseaux industriels fiables, supervision des sites et cybersécurité des environnements de production, d’énergie et de logistique.',
    hero: { src: null, alt: 'Visuel à venir — industrie (image principale)' },
    support: [
      { src: null, alt: 'Visuel à venir — industrie (détail 1)' },
      { src: null, alt: 'Visuel à venir — industrie (détail 2)' },
    ],
  },
]

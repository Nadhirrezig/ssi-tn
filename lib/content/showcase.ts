/**
 * Content for the media Showcase grid (components/sections/Showcase.tsx).
 * All copy and media are placeholders — Nadhir fills these later.
 *
 * Media slot API:
 *   { kind: 'image', src: '/path.webp', alt: '…' }
 *   { kind: 'video', src: '/path.mp4', poster?: '/path.webp', alt: '…' }
 *   src: null → renders the empty-state placeholder (inset border + mono label).
 *
 * The grid composition is fixed by the component and reads the cards in order:
 *   cards[0] → full-width hero row
 *   cards[1] → split row, left      cards[2] → split row, right
 *   cards[3] → wide (~70%)          cards[4] → narrow (~30%)
 */

export type ShowcaseMedia =
  | { kind: 'image'; src: string | null; alt: string }
  | { kind: 'video'; src: string | null; poster?: string; alt: string }

export type ShowcaseCard = {
  media: ShowcaseMedia
  /** Optional heading rendered inside the card, over the media. */
  title?: string
  /** Optional supporting copy inside the card. */
  body?: string
  /** Optional small footnote line (the "*…" style annotations). */
  note?: string
  /** Where the text block sits inside the card. */
  align: 'top-left' | 'top-center' | 'bottom-left' | 'bottom-center'
}

export type ShowcaseContent = {
  /** Small line above the section heading (outside the grid). */
  eyebrow: string
  /** Section heading (outside the grid), wraps on two lines. */
  title: string
  cards: readonly [ShowcaseCard, ShowcaseCard, ShowcaseCard, ShowcaseCard, ShowcaseCard]
}

export const showcase: ShowcaseContent = {
  eyebrow: 'Aperçu',
  title: 'Texte de démonstration : une solution complète, pensée pour votre activité.',
  cards: [
    // Full-width hero card — text inside, bottom-left.
    {
      media: { kind: 'image', src: null, alt: 'Visuel à venir — carte principale' },
      title: 'Texte de démonstration : un titre fort qui présente le produit en deux lignes.',
      align: 'bottom-left',
    },
    // Split row, left — title inside, top-center.
    {
      media: { kind: 'image', src: null, alt: 'Visuel à venir — carte gauche' },
      title: 'Texte de démonstration : un point clé mis en avant',
      align: 'top-center',
    },
    // Split row, right — title + body inside, bottom-center.
    {
      media: { kind: 'image', src: null, alt: 'Visuel à venir — carte droite' },
      title: 'Point clé',
      body: 'Texte de démonstration : une phrase courte qui précise la capacité présentée et son bénéfice concret.',
      align: 'bottom-center',
    },
    // Wide card (~70%) — video slot, text top-left, replay control bottom-right.
    {
      media: { kind: 'video', src: null, alt: 'Vidéo à venir — carte large' },
      title: 'Texte de démonstration : extensibilité.',
      body: 'Texte de démonstration : deux lignes qui expliquent le scénario montré dans la vidéo et ce qu’il permet.',
      note: '*Note de démonstration : précision ou variante disponible.',
      align: 'top-left',
    },
    // Narrow card (~30%) — text bottom-left.
    {
      media: { kind: 'image', src: null, alt: 'Visuel à venir — carte étroite' },
      title: 'Détail produit',
      note: '*Texte de démonstration : légende descriptive du visuel.',
      align: 'bottom-left',
    },
  ],
}

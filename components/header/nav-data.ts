import { QUOTE_HREF } from '@/lib/ticket-status'

/** Shared easing for the header's motion (ease-out-quart, see design.md). */
export const EASE = [0.22, 1, 0.36, 1] as const

export type PanelLink = { label: string; href: string }

export type PanelCard = {
  eyebrow?: string
  title: string
  desc: string
  href: string
  image?: string
  imageAlt?: string
  price?: string
  period?: string
  links?: PanelLink[]
  cta?: string
  /** Full-bleed image card with the copy overlaid on it. */
  hook?: boolean
}

export type Panel = {
  cards: PanelCard[]
  note: string
  cta: PanelLink
  /** Slide the cards instead of laying them all out at once (3+ cards). */
  carousel?: boolean
}

// An item is either a plain link, or a panel item — which may also carry an
// href, but does not need one: it opens the panel from a button.
export type NavItem = { id: string; label: string } & (
  | { href: string; panel?: undefined }
  | { href?: string; panel: Panel }
)

/** The site's main navigation — edit here to change the menu. */
export const NAV: NavItem[] = [
  { id: 'accueil', label: 'Accueil', href: '/' },
  {
    id: 'solutions',
    label: 'Solutions',
    panel: {
      note: 'Un seul partenaire de confiance pour toute votre informatique.',
      cta: { label: 'Demander un devis', href: QUOTE_HREF },
      carousel: true,
      cards: [
        {
          eyebrow: 'AltosPOS',
          title: 'Paiement et accès par bracelet NFC',
          desc: 'Un simple bracelet permet de payer, commander et ouvrir les chambres. Tout est instantané, sans cash, sans carte, sans friction.',
          href: '/solution/altospos',
          image: '/api/r2/pos-solution/p4-1-4.webp',
          imageAlt: 'Bracelet NFC AltosPOS présenté au-dessus d’un terminal de paiement',
          cta: 'Voir la solution',
          hook: true,
        },
        {
          eyebrow: 'AltosStock',
          title: 'Gestion de stock',
          desc: 'Inventaire, suivi des mouvements et réapprovisionnement, synchronisés avec AltosPOS.',
          href: '/solution/altosstock',
          image: '/api/r2/pos-solution/stockxpos.webp',
          imageAlt: 'AltosStock connecté à AltosPOS sur le poste de vente',
          links: [
            { label: 'Inventaire & suivi de stock', href: '/solution/altosstock' },
            { label: 'Fiche technique par article', href: '/solution/altosstock' },
            { label: 'Fournisseurs & réapprovisionnement', href: '/solution/altosstock' },
          ],
        },
        {
          eyebrow: 'Écosystème',
          title: 'Développement sur mesure',
          desc: 'Applications métier, intégrations et évolutions conçues autour de vos processus et de votre système d’information.',
          href: QUOTE_HREF,
          image: '/website-content/about-02.webp',
          imageAlt: 'Équipe SSI en atelier de développement sur mesure',
          links: [
            { label: 'Applications métier', href: QUOTE_HREF },
            { label: 'Intégrations & API', href: QUOTE_HREF },
            { label: 'Maintenance & évolutions', href: QUOTE_HREF },
          ],
        },
      ],
    },
  },
  { id: 'about', label: 'À propos', href: '/#about' },
  // « Réalisations » returns once real case studies are published: until then
  // its panel could only lead to a section that no longer exists.
]

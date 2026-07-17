import type { Secteur } from './secteurs'
import type { ShowcaseContent } from './showcase'

/**
 * Solutions registry — one entry per solution page (/solution/[slug]).
 * Each solution feeds the three sections of the page:
 *   hero      → full-screen video hero (video slot: src null → brand fallback)
 *   scenarios → the Secteurs carousel (4 slides)
 *   showcase  → the media Showcase grid (5 cards)
 * Media are placeholder slots (src: null) until real assets are added.
 */

export type SolutionHeroContent = {
  eyebrow: string
  title: string
  subtitle: string
  /** Small supporting line under the subtitle (availability, platforms…). */
  note?: string
  video: { src: string | null; poster?: string }
}

export type Solution = {
  slug: string
  name: string
  metaDescription: string
  hero: SolutionHeroContent
  scenarios: readonly Secteur[]
  showcase: ShowcaseContent
}

const altospos: Solution = {
  slug: 'altospos',
  name: 'AltosPOS',
  metaDescription:
    'AltosPOS — le point de vente unifié pour hôtels, resorts et clubs : multi-points de vente, commande mobile, paiement NFC via AltosTap, reporting en temps réel et intégration native avec AltosInventaire.',

  hero: {
    eyebrow: 'Solution AltosPOS',
    title: 'Le point de vente unifié de votre établissement.',
    subtitle:
      'Gestion multi-points de vente, transactions centralisées et synchronisation en temps réel entre tous vos terminaux. Un traitement rapide des commandes qui accélère le service et améliore la productivité de vos équipes — pensé pour les environnements à forte activité : hôtels, resorts, clubs.',
    note:
      'Accès multi-plateforme : application mobile pour le terrain, interface web pour le pilotage et les analyses, application desktop pour les postes fixes.',
    video: { src: null },
  },

  scenarios: [
    {
      title: 'Gestion des points de vente',
      body: 'Pilotez plusieurs points de vente au sein d’un même établissement : toutes les transactions sont centralisées et synchronisées en temps réel entre les terminaux.',
      hero: { src: null, alt: 'Visuel à venir — points de vente multiples (image principale)' },
      support: [
        { src: null, alt: 'Visuel à venir — centralisation des transactions' },
        { src: null, alt: 'Visuel à venir — synchronisation des terminaux' },
      ],
    },
    {
      title: 'Prise de commande mobile',
      body: 'Le personnel prend les commandes directement sur site — table, piscine, plage — avec transmission instantanée vers les postes de préparation et le POS. Moins de délais, moins d’erreurs.',
      hero: { src: null, alt: 'Visuel à venir — prise de commande mobile (image principale)' },
      support: [
        { src: null, alt: 'Visuel à venir — application mobile du personnel' },
        { src: null, alt: 'Visuel à venir — transmission en cuisine' },
      ],
    },
    {
      title: 'Paiement sans contact NFC',
      body: 'Via AltosTap, bracelets et cartes NFC identifient le client instantanément et encaissent la transaction en un seul geste, en intégration complète avec le système.',
      hero: { src: null, alt: 'Visuel à venir — paiement NFC AltosTap (image principale)' },
      support: [
        { src: null, alt: 'Visuel à venir — bracelet NFC' },
        { src: null, alt: 'Visuel à venir — encaissement en un geste' },
      ],
    },
    {
      title: 'Gestion des accès',
      body: 'AltosTap unifie l’identification du client dans tout l’établissement : ouverture des chambres via NFC, accès et interactions sécurisés de bout en bout.',
      hero: { src: null, alt: 'Visuel à venir — gestion des accès (image principale)' },
      support: [
        { src: null, alt: 'Visuel à venir — ouverture de chambre NFC' },
        { src: null, alt: 'Visuel à venir — identification unifiée' },
      ],
    },
  ],

  showcase: {
    eyebrow: 'Fonctionnalités',
    title: 'Des commandes au reporting, tout est connecté.',
    cards: [
      {
        media: { kind: 'image', src: null, alt: 'Visuel à venir — gestion des commandes' },
        title: 'Des commandes suivies automatiquement, sans ticket papier.',
        body: 'Statuts mis à jour en temps réel, suivi automatique de chaque commande — fini les pertes et les doublons.',
        align: 'bottom-left',
      },
      {
        media: { kind: 'image', src: null, alt: 'Visuel à venir — analyse et reporting' },
        title: 'Analyse et reporting : vos ventes en temps réel',
        body: 'Par employé, point de vente ou produit — avec rapports de fin de journée générés automatiquement.',
        align: 'top-center',
      },
      {
        media: { kind: 'image', src: null, alt: 'Visuel à venir — produits et prix' },
        title: 'Catalogue produits et prix dynamiques',
        body: 'Catalogues étendus, plusieurs prix par produit, organisation par catégories et tarification dynamique : happy hours et événements spécifiques.',
        align: 'bottom-center',
      },
      {
        media: { kind: 'video', src: null, alt: 'Vidéo à venir — intégration AltosInventaire' },
        title: 'Intégré nativement à AltosInventaire.',
        body: 'Les stocks sont déduits automatiquement à chaque vente, en synchronisation avec vos outils de gestion et d’analyse.',
        note: '*Export des données vers vos systèmes de gestion et de comptabilité.',
        align: 'top-left',
      },
      {
        media: { kind: 'image', src: null, alt: 'Visuel à venir — sécurité et contrôle' },
        title: 'Sécurité et contrôle',
        note: '*Permissions par utilisateur, traçabilité complète des opérations et transactions sécurisées — fiable en environnement critique.',
        align: 'bottom-left',
      },
    ],
  },
}

export const solutions: readonly Solution[] = [altospos]

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug)
}

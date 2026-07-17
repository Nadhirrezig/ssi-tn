import type { Secteur } from './secteurs'
import type { ShowcaseContent } from './showcase'

/**
 * Solutions registry — one entry per solution page (/solution/[slug]).
 * Each solution feeds the sections of the page:
 *   hero      → full-screen image hero (image slot: src null → brand fallback)
 *   video     → full-screen video section right after the hero
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
  image: { src: string | null; alt: string }
}

export type SolutionVideoContent = {
  src: string | null
  poster?: string
  /** Accessible label for the video. */
  alt: string
}

export type Solution = {
  slug: string
  name: string
  metaDescription: string
  hero: SolutionHeroContent
  video: SolutionVideoContent
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
      'Gestion multi-points de vente, transactions centralisées et synchronisation en temps réel entre tous vos terminaux.',
    note:
      'Accès multi-plateforme : application mobile pour le terrain, interface web pour le pilotage et les analyses, application desktop pour les postes fixes.',
    image: {
      src: '/Template/p1-bg.jpg.jpeg',
      alt: 'Terminaux AltosPOS — tablette avec imprimante intégrée et borne de comptoir',
    },
  },

  video: {
    src: '/Template/p2.mp4',
    alt: 'Présentation d’AltosPOS en fonctionnement',
  },

  scenarios: [
    {
      title: 'Gestion des points de vente',
      body: 'Pilotez plusieurs points de vente au sein d’un même établissement : toutes les transactions sont centralisées et synchronisées en temps réel entre les terminaux.',
      hero: {
        src: '/Template/p18-1.jpg.jpeg',
        alt: 'Terminaux AltosPOS synchronisés entre eux et pilotés depuis un poste central',
      },
      support: [
        {
          src: '/Template/p18-2.jpg.jpeg',
          alt: 'Gestion centralisée des terminaux depuis l’interface web, sur tous les appareils',
        },
      ],
    },
    {
      title: 'Prise de commande mobile',
      body: 'Le personnel prend les commandes directement sur site — table, piscine, plage — avec transmission instantanée vers les postes de préparation et le POS. Moins de délais, moins d’erreurs.',
      hero: {
        src: '/Template/p3-1-1.jpg.jpeg',
        alt: 'Serveur consultant un terminal mobile AltosPOS en salle de restaurant',
      },
      support: [
        {
          src: '/Template/p3-2-1.jpg.jpeg',
          alt: 'Vendeuse présentant le terminal mobile à une cliente en boutique',
        },
        {
          src: '/Template/p3-2-2.jpg.jpeg',
          alt: 'Prise de commande sur le terminal mobile au comptoir d’une bijouterie',
        },
        {
          src: '/Template/p3-2-3.jpg.jpeg',
          alt: 'Catalogue produits parcouru du bout du doigt sur le terminal mobile',
        },
      ],
    },
    {
      title: 'Paiement sans contact NFC',
      body: 'Via AltosTap, bracelets et cartes NFC identifient le client instantanément et encaissent la transaction en un seul geste, en intégration complète avec le système.',
      hero: {
        src: '/Template/p4-1-1.jpg.jpeg',
        alt: 'Terminal AltosPOS sur le comptoir d’un café, écran d’encaissement affiché',
      },
      support: [
        {
          src: '/Template/p4-1-2.jpg.jpeg',
          alt: 'Écran d’accueil du terminal AltosPOS avec ses applications',
        },
        {
          src: '/Template/p4-1-4.jpg.jpeg',
          alt: 'Lecteur de carte du terminal — paiement par carte bancaire',
        },
      ],
    },
    {
      title: 'Gestion des accès',
      body: 'AltosTap unifie l’identification du client dans tout l’établissement : ouverture des chambres via NFC, accès et interactions sécurisés de bout en bout.',
      hero: {
        src: '/Template/p3-3-1.jpg.jpeg',
        alt: 'Employée encaissant un client avec le terminal portable en magasin',
      },
      support: [
        {
          src: '/Template/p3-3-2.jpg.jpeg',
          alt: 'Scan d’un article sur le terminal portable dans les rayons',
        },
      ],
    },
  ],

  showcase: {
    eyebrow: 'Fonctionnalités',
    title: 'Des commandes au reporting, tout est connecté.',
    cards: [
      {
        media: { kind: 'image', src: '/Template/p4-2-4.jpg.jpeg', alt: 'Visuel à venir — gestion des commandes' },
        title: 'Des commandes suivies automatiquement, sans ticket papier.',
        body: 'Statuts mis à jour en temps réel, suivi automatique de chaque commande — fini les pertes et les doublons.',
        align: 'bottom-left',
      },
      {
        media: { kind: 'image', src: '/Template/rapporting.png', alt: 'Visuel à venir — analyse et reporting' },
        title: 'Analyse et reporting : vos ventes en temps réel',
        body: 'Par employé, point de vente ou produit — avec rapports de fin de journée générés automatiquement.',
        align: 'top-center',
      },
      {
        media: { kind: 'image', src: '/Template/v3plus-mix2.jpg', alt: 'Visuel à venir — application mobile AltosPOS' },
        title: 'AltosPOS mobile : application dédiée et interface pratique',
        body: 'Application mobile handy avec interface dédiée pour gérer catalogue, prix et commandes en déplacement.',
        align: 'bottom-center',
      },
      {
        media: { kind: 'video', src: '/Template/p3.mp4', alt: 'Vidéo à venir — intégration AltosInventaire' },
        title: 'AltosPOS pour une extensibilité renforcée.',
        body: 'Connectez AltosPOS à des solutions tierces et enrichissez vos flux opérationnels sans effort.',
        note: '.',
        align: 'top-left',
      },
      {
        media: { kind: 'image', src: '/Template/stockxpos.jpg', alt: 'Vidéo à venir — intégration AltosInventaire' },
        title: 'Intégré nativement à AltosInventaire.',
        body: '',
        note: '*Export des données vers vos systèmes de gestion et de comptabilité.',
        align: 'top-left',
      },
    ],
  },
}

export const solutions: readonly Solution[] = [altospos]

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug)
}

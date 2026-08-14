import type { Secteur } from './secteurs'
import type { ShowcaseContent } from './showcase'

/**
 * Solutions registry — one entry per solution page (/solution/[slug]).
 * Each solution feeds the sections of the page:
 *   hero      → full-screen image hero (image slot: src null → brand fallback)
 *   video     → full-screen video section right after the hero
 *   scenarios → the Secteurs carousel (4 slides) — omit it and the section is
 *               dropped from the page altogether
 *   showcase  → the media Showcase grid (5 cards)
 * Media are placeholder slots (image src: null, video sources: []) until real
 * assets are added.
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
  /**
   * Parts of the presentation, in playback order. They are played back-to-back
   * so the section reads as one continuous video. Empty → placeholder slot.
   */
  sources: readonly string[]
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
  scenarios?: readonly Secteur[]
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
      src: '/api/r2/pos-solution/p1-bg.webp',
      alt: 'Terminaux AltosPOS — tablette avec imprimante intégrée et borne de comptoir',
    },
  },

  video: {
    // Split into three parts to keep each file shippable; SolutionVideo plays
    // them back-to-back as one continuous video.
    sources: [
      '/Template/altosPOS-vid-1.mp4',
      '/Template/altosPOS-vid-2.mp4',
      '/Template/altosPOS-vid-3.mp4',
    ],
    alt: 'Présentation d’AltosPOS en fonctionnement',
  },

  scenarios: [
    {
      title: 'Gestion des points de vente',
      body: 'Pilotez plusieurs points de vente au sein d’un même établissement : toutes les transactions sont centralisées et synchronisées en temps réel entre les terminaux.',
      hero: {
        src: '/api/r2/pos-solution/p18-1.webp',
        alt: 'Terminaux AltosPOS synchronisés entre eux et pilotés depuis un poste central',
      },
      support: [
        {
          src: '/api/r2/pos-solution/p18-2.webp',
          alt: 'Gestion centralisée des terminaux depuis l’interface web, sur tous les appareils',
        },
      ],
    },
    {
      title: 'Prise de commande mobile',
      body: 'Le personnel prend les commandes directement sur site — table, piscine, plage — avec transmission instantanée vers les postes de préparation et le POS. Moins de délais, moins d’erreurs.',
      hero: {
        src: '/api/r2/pos-solution/p3-1-1.webp',
        alt: 'Serveur consultant un terminal mobile AltosPOS en salle de restaurant',
      },
      support: [
        {
          src: '/api/r2/pos-solution/p3-2-1.webp',
          alt: 'Vendeuse présentant le terminal mobile à une cliente en boutique',
        },
        {
          src: '/api/r2/pos-solution/p3-2-2.webp',
          alt: 'Prise de commande sur le terminal mobile au comptoir d’une bijouterie',
        },
        {
          src: '/api/r2/pos-solution/p3-2-3.webp',
          alt: 'Catalogue produits parcouru du bout du doigt sur le terminal mobile',
        },
      ],
    },
    {
      title: 'Paiement sans contact NFC',
      body: 'Via AltosTap, bracelets et cartes NFC identifient le client instantanément et encaissent la transaction en un seul geste, en intégration complète avec le système.',
      hero: {
        src: '/api/r2/pos-solution/p4-1-1.webp',
        alt: 'Terminal AltosPOS sur le comptoir d’un café, écran d’encaissement affiché',
      },
      support: [
        {
          src: '/api/r2/pos-solution/p4-1-2.webp',
          alt: 'Écran d’accueil du terminal AltosPOS avec ses applications',
        },
        {
          src: '/api/r2/pos-solution/p4-1-4.webp',
          alt: 'Lecteur de carte du terminal — paiement par carte bancaire',
        },
      ],
    },
    {
      title: 'Gestion des accès',
      body: 'AltosTap unifie l’identification du client dans tout l’établissement : ouverture des chambres via NFC, accès et interactions sécurisés de bout en bout.',
      hero: {
        src: '/api/r2/pos-solution/p3-3-1.webp',
        alt: 'Employée encaissant un client avec le terminal portable en magasin',
      },
      support: [
        {
          src: '/api/r2/pos-solution/p3-3-2.webp',
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
        media: { kind: 'image', src: '/api/r2/pos-solution/p4-2-4.webp', alt: 'Visuel à venir — gestion des commandes' },
        title: 'Des commandes suivies automatiquement, sans ticket papier.',
        body: 'Statuts mis à jour en temps réel, suivi automatique de chaque commande — fini les pertes et les doublons.',
        align: 'bottom-left',
      },
      {
        media: { kind: 'image', src: '/api/r2/pos-solution/rapporting.webp', alt: 'Visuel à venir — analyse et reporting' },
        title: 'Analyse et reporting : vos ventes en temps réel',
        body: 'Par employé, point de vente ou produit — avec rapports de fin de journée générés automatiquement.',
        align: 'top-center',
      },
      {
        media: { kind: 'image', src: '/api/r2/pos-solution/v3plus-mix2.webp', alt: 'Visuel à venir — application mobile AltosPOS' },
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
        media: { kind: 'image', src: '/api/r2/pos-solution/stockxpos.webp', alt: 'Vidéo à venir — intégration AltosInventaire' },
        title: 'Intégré nativement à AltosInventaire.',
        body: '',
        note: '*Export des données vers vos systèmes de gestion et de comptabilité.',
        align: 'top-left',
      },
    ],
  },
}

const altosstock: Solution = {
  slug: 'altosstock',
  name: 'AltosStock',
  metaDescription:
    'AltosStock — la gestion de stock connectée à AltosPOS : inventaire en temps réel, fiche technique par article, suivi des mouvements, gestion des fournisseurs, états de réapprovisionnement et reporting.',

  hero: {
    eyebrow: 'Solution AltosStock',
    title: 'Votre stock, juste à chaque instant.',
    subtitle:
      'Inventaire en temps réel, fiches techniques, suivi des mouvements et réapprovisionnement — chaque vente encaissée met les quantités à jour.',
    note:
      'Connecté nativement à AltosPOS : un seul catalogue, un seul stock, aucune double saisie.',
    image: {
      src: '/api/r2/pos-solution/p3-3-2.webp',
      alt: 'Employée consultant le stock d’un article sur son terminal, en rayon',
    },
  },

  video: {
    sources: ['/Template/AltosStock.mp4'],
    alt: 'Présentation d’AltosStock en fonctionnement',
  },

  showcase: {
    eyebrow: 'Fonctionnalités',
    title: 'De la réception à l’inventaire, tout votre stock au même endroit.',
    cards: [
      {
        media: {
          kind: 'image',
          src: '/Template/stock/scan.webp',
          alt: 'Article scanné au lecteur code-barres en entrepôt, quantités mises à jour sur la tablette',
        },
        title: 'Un stock à jour à la seconde, sans comptage manuel.',
        body: 'Réceptions, sorties et transferts sont scannés : les quantités se mettent à jour en temps réel, sur tous vos points de vente.',
        align: 'bottom-left',
      },
      {
        media: {
          kind: 'image',
          src: '/Template/stock/image1.webp',
          alt: 'Magasinier cochant sa liste d’articles devant des cartons empilés',
        },
        title: 'Seuils d’alerte et état de réapprovisionnement',
        body: 'Un seuil par article : les ruptures à venir sont signalées et la liste de ce qu’il faut recommander est prête.',
        align: 'top-center',
      },
      {
        media: {
          kind: 'image',
          src: '/Template/stock/fournisseur.webp',
          alt: 'Poignée de main entre deux responsables au-dessus des documents d’une commande fournisseur',
        },
        title: 'Fournisseurs',
        body: 'Prix, délais et historique des commandes par fournisseur — pour acheter au bon moment et au bon prix.',
        align: 'bottom-center',
      },
      {
        media: {
          kind: 'image',
          src: '/Template/stock/rapporting-gestion-stock.webp',
          alt: 'Tableau de bord de gestion de stock consulté sur tablette au milieu des rayonnages',
        },
        title: 'Reporting : valorisation, rotation et écarts.',
        body: 'Valeur du stock, articles dormants, produits en rupture — par point de vente ou pour tout l’établissement.',
        note: '*Export des données vers vos systèmes de gestion et de comptabilité.',
        align: 'top-left',
      },
      {
        media: {
          kind: 'image',
          src: '/Template/stock/transaction.webp',
          alt: 'Vue d’ensemble d’un entrepôt et de ses mouvements, pilotée depuis une tablette',
        },
        title: 'Connecté à AltosPOS',
        note: '*Chaque vente encaissée déduit le stock, sans intervention.',
        align: 'bottom-left',
      },
    ],
  },
}

export const solutions: readonly Solution[] = [altospos, altosstock]

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug)
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { CookiePreferencesButton } from '@/components/CookieConsent'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Comment SSI collecte, utilise, conserve et protège vos données personnelles, et quels cookies sont déposés sur ce site.',
  alternates: { canonical: '/confidentialite' },
}

/** Shown in the header and in the “dernière mise à jour” line. */
const UPDATED_AT = '6 août 2026'

const CONTACT_EMAIL = 'contact@ssi-tn.com'

/* Shared text styles — the project has no typography plugin, so the prose
   rhythm is set here once and reused by every section. */
const P = 'text-base leading-relaxed text-slatebody'
const UL = 'space-y-2.5 pl-5 text-base leading-relaxed text-slatebody marker:text-primary'
const STRONG = 'font-semibold text-navy'
const LINK = 'font-semibold text-primary underline-offset-2 hover:underline'

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead className="bg-soft">
          <tr>
            {head.map((cell) => (
              <th key={cell} className="px-4 py-3 font-heading font-bold text-navy">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-black/5 align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 leading-relaxed text-slatebody">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * The policy, section by section. Kept as data so the table of contents and the
 * body can never drift apart, and so the numbering is derived rather than typed.
 */
const SECTIONS: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'responsable',
    title: 'Qui traite vos données',
    body: (
      <>
        <p className={P}>
          <span className={STRONG}>SSI — Sécurité &amp; Solutions Informatiques</span> (« SSI »,
          « nous ») édite et exploite ce site. SSI agit en qualité de responsable
          du traitement pour les données personnelles décrites ci-dessous.
        </p>
        <ul className={`${UL} list-disc`}>
          <li>Adresse : Tunis, Tunisie</li>
          <li>
            E-mail :{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>
            Téléphone :{' '}
            <a href="tel:+21628290350" className={LINK}>
              +216 28 290 350
            </a>
          </li>
        </ul>
        <p className={P}>
          Pour toute question relative à cette politique ou à vos données, écrivez-nous
          en indiquant « Données personnelles » en objet.
        </p>
      </>
    ),
  },
  {
    id: 'donnees',
    title: 'Les données que nous collectons',
    body: (
      <>
        <p className={P}>
          <span className={STRONG}>Les données que vous nous transmettez.</span> Ce site
          ne comporte pas de formulaire : vous nous contactez depuis votre propre
          messagerie ou par téléphone. À cette occasion, nous recevons les
          informations que vous choisissez de nous communiquer — nom et prénom,
          entreprise et fonction, adresse e-mail, numéro de téléphone, ainsi que le
          contenu de votre demande (besoin, contexte technique, budget).
        </p>
        <p className={P}>
          <span className={STRONG}>Les données collectées automatiquement.</span> Comme
          tout site web, le nôtre génère des journaux techniques lors de votre
          visite : adresse IP, date et heure de la requête, pages consultées, type
          de navigateur et d’appareil, page de provenance. Ces journaux sont produits
          et conservés par notre hébergeur pour assurer la sécurité, la disponibilité
          et le diagnostic des incidents.
        </p>
        <p className={P}>
          <span className={STRONG}>Les cookies.</span> Voir la section « Cookies et
          traceurs » ci-dessous.
        </p>
        <p className={P}>
          Nous ne collectons aucune donnée sensible (santé, opinions politiques,
          convictions religieuses, données biométriques). Nous ne vous demanderons
          jamais un mot de passe ni des coordonnées bancaires par e-mail.
        </p>
      </>
    ),
  },
  {
    id: 'finalites',
    title: 'Pourquoi nous les traitons',
    body: (
      <>
        <p className={P}>
          Chaque traitement poursuit une finalité déterminée et repose sur une base
          légale précise :
        </p>
        <Table
          head={['Finalité', 'Données concernées', 'Base légale']}
          rows={[
            [
              'Répondre à votre demande, établir un devis ou une proposition',
              'Identité, coordonnées, contenu de la demande',
              'Mesures précontractuelles prises à votre demande',
            ],
            [
              'Gérer la relation client et le suivi de nos prestations',
              'Identité, coordonnées, historique des échanges',
              'Exécution du contrat',
            ],
            [
              'Assurer la sécurité, la disponibilité et le bon fonctionnement du site',
              'Journaux techniques',
              'Intérêt légitime à protéger notre infrastructure',
            ],
            [
              'Mesurer l’audience du site et améliorer son contenu',
              'Cookies de mesure',
              'Votre consentement, révocable à tout moment',
            ],
            [
              'Respecter nos obligations comptables, fiscales et légales',
              'Documents contractuels et de facturation',
              'Obligation légale',
            ],
          ]}
        />
        <p className={P}>
          Nous n’utilisons vos données ni pour de la publicité ciblée, ni pour de la
          prospection non sollicitée, ni pour une décision entièrement automatisée
          produisant des effets juridiques à votre égard. Nous ne vendons ni ne
          louons vos données.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies et traceurs',
    body: (
      <>
        <p className={P}>
          Un cookie est un petit fichier déposé sur votre terminal lors de la visite
          d’un site. Nous en distinguons deux catégories, et une seule est déposée
          sans vous demander votre avis.
        </p>

        <p className={P}>
          <span className={STRONG}>Cookies strictement nécessaires.</span> Ils
          permettent au site de fonctionner et de rester sûr. Ils ne servent à aucune
          mesure ni à aucun ciblage, et ne peuvent pas être désactivés depuis le site.
        </p>
        <Table
          head={['Nom', 'Finalité', 'Durée', 'Émetteur']}
          rows={[
            [
              <code key="c" className="font-mono text-[13px] text-navy">
                ssi_cookie_consent
              </code>,
              'Mémorise votre choix en matière de cookies, pour ne pas vous le redemander à chaque page',
              '6 mois',
              'Ce site (cookie interne)',
            ],
            [
              'Cookies techniques de session',
              'Répartition de charge, continuité et sécurité du service',
              'Le temps de la session',
              'Notre hébergeur',
            ],
          ]}
        />

        <p className={P}>
          <span className={STRONG}>Cookies de mesure d’audience.</span> Ils servent à
          comprendre la fréquentation du site (pages vues, provenance, appareils) afin
          d’en améliorer le contenu. Ils ne sont déposés qu’après votre acceptation.
          À la date de cette politique,{' '}
          <span className={STRONG}>
            aucun cookie de mesure d’audience n’est actif sur le site
          </span>{' '}
          ; si nous en mettons un en place, il ne sera déposé qu’avec votre accord et
          la présente politique sera mise à jour.
        </p>

        <p className={P}>
          <span className={STRONG}>Ce que nous n’utilisons pas :</span> aucun cookie
          publicitaire, aucun pixel de réseau social, aucun traceur de profilage
          revendu à des tiers. Les polices de caractères du site sont hébergées sur
          notre propre serveur : leur affichage ne déclenche aucune requête vers un
          service tiers.
        </p>

        <div className="rounded-2xl bg-soft p-5">
          <p className="font-heading text-base font-bold text-navy">
            Modifier votre choix
          </p>
          <p className={`mt-2 ${P}`}>
            Votre décision est conservée 6 mois, puis la question vous est reposée.
            Vous pouvez la changer à tout moment — refuser n’a aucun effet sur
            l’accès au site ni sur son contenu.
          </p>
          <CookiePreferencesButton className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 font-heading text-sm font-bold text-white transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
        </div>

        <p className={P}>
          Vous pouvez également configurer votre navigateur (Chrome, Firefox, Safari,
          Edge) pour bloquer ou supprimer les cookies déjà déposés. Le blocage des
          cookies strictement nécessaires peut dégrader le fonctionnement du site.
        </p>
      </>
    ),
  },
  {
    id: 'destinataires',
    title: 'Qui a accès à vos données',
    body: (
      <>
        <ul className={`${UL} list-disc`}>
          <li>
            <span className={STRONG}>Nos équipes</span>, limitées aux collaborateurs
            qui en ont besoin pour traiter votre demande ou exécuter la prestation.
          </li>
          <li>
            <span className={STRONG}>Nos prestataires techniques</span>, qui agissent
            sur nos seules instructions et ne peuvent utiliser vos données à d’autres
            fins : l’hébergeur du site, Cloudflare (stockage et diffusion des images
            du site), et notre fournisseur de messagerie professionnelle.
          </li>
          <li>
            <span className={STRONG}>Les autorités administratives ou judiciaires</span>
            , lorsque la loi nous oblige à répondre à une réquisition régulière.
          </li>
        </ul>
        <p className={P}>
          Aucune donnée n’est transmise à un tiers à des fins commerciales.
        </p>
      </>
    ),
  },
  {
    id: 'transferts',
    title: 'Transferts hors de Tunisie',
    body: (
      <p className={P}>
        Certains de nos prestataires (hébergement, stockage des images, messagerie)
        exploitent des serveurs situés hors de Tunisie, notamment dans l’Union
        européenne et aux États-Unis. Nous retenons des prestataires offrant des
        garanties appropriées — engagements contractuels de confidentialité,
        chiffrement des données en transit et au repos, sous-traitance encadrée.
        Vous pouvez nous demander des précisions sur ces transferts à tout moment.
      </p>
    ),
  },
  {
    id: 'conservation',
    title: 'Combien de temps nous les conservons',
    body: (
      <ul className={`${UL} list-disc`}>
        <li>
          <span className={STRONG}>Demande de contact ou de devis restée sans
          suite :</span> 3 ans à compter du dernier échange.
        </li>
        <li>
          <span className={STRONG}>Données clients :</span> toute la durée de la
          relation contractuelle, puis archivage pour la durée des obligations
          légales (10 ans pour les pièces comptables).
        </li>
        <li>
          <span className={STRONG}>Journaux techniques :</span> 12 mois au maximum.
        </li>
        <li>
          <span className={STRONG}>Cookie de consentement :</span> 6 mois.
        </li>
        <li>
          <span className={STRONG}>Candidature spontanée :</span> 2 ans après le
          dernier contact, sauf demande de suppression de votre part.
        </li>
      </ul>
    ),
  },
  {
    id: 'securite',
    title: 'Comment nous les protégeons',
    body: (
      <>
        <p className={P}>
          La sécurité des systèmes d’information est notre métier, et nous
          l’appliquons d’abord à nous-mêmes : chiffrement des échanges (HTTPS/TLS),
          accès nominatifs et restreints au strict nécessaire, cloisonnement des
          environnements, sauvegardes régulières, journalisation des accès et
          maintien en condition de sécurité des composants.
        </p>
        <p className={P}>
          En cas de violation de données susceptible d’engendrer un risque élevé pour
          vos droits, nous en informons l’autorité compétente et les personnes
          concernées dans les meilleurs délais.
        </p>
      </>
    ),
  },
  {
    id: 'droits',
    title: 'Vos droits',
    body: (
      <>
        <p className={P}>
          Conformément à la loi organique n° 2004-63 du 27 juillet 2004 portant sur la
          protection des données à caractère personnel et, si vous résidez dans
          l’Union européenne, au Règlement général sur la protection des données
          (RGPD), vous disposez des droits suivants :
        </p>
        <ul className={`${UL} list-disc`}>
          <li>
            <span className={STRONG}>Accès :</span> savoir quelles données nous
            détenons sur vous et en obtenir une copie.
          </li>
          <li>
            <span className={STRONG}>Rectification :</span> corriger une donnée
            inexacte ou incomplète.
          </li>
          <li>
            <span className={STRONG}>Effacement :</span> demander la suppression de
            vos données, sous réserve de nos obligations légales de conservation.
          </li>
          <li>
            <span className={STRONG}>Opposition et limitation :</span> vous opposer à
            un traitement fondé sur notre intérêt légitime, ou en demander le gel.
          </li>
          <li>
            <span className={STRONG}>Portabilité :</span> recevoir les données que
            vous nous avez fournies dans un format structuré et lisible par machine.
          </li>
          <li>
            <span className={STRONG}>Retrait du consentement :</span> à tout moment,
            pour les traitements qui en dépendent — les cookies de mesure notamment —
            sans que cela remette en cause la licéité du traitement déjà effectué.
          </li>
        </ul>
        <p className={P}>
          Pour exercer ces droits, écrivez à{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
            {CONTACT_EMAIL}
          </a>{' '}
          avec « Données personnelles » en objet. Nous répondons dans un délai de 30
          jours. En cas de doute raisonnable sur votre identité, un justificatif peut
          vous être demandé ; il n’est pas conservé au-delà de la vérification.
        </p>
        <p className={P}>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir
          l’Instance nationale de protection des données à caractère personnel
          (INPDP) en Tunisie ou, dans l’Union européenne, l’autorité de contrôle de
          votre pays de résidence.
        </p>
      </>
    ),
  },
  {
    id: 'mineurs',
    title: 'Mineurs',
    body: (
      <>
        <p className={P}>
          Ce site et nos services s’adressent à des professionnels et à des personnes
          majeures. Ils ne sont ni conçus ni destinés aux enfants de moins de 13 ans :
          aucun contenu, aucune offre et aucune communication de notre part ne vise
          cette tranche d’âge, et nous ne collectons pas sciemment de données
          personnelles les concernant.
        </p>
        <p className={P}>
          Si vous êtes parent ou tuteur et pensez qu’un enfant de moins de 13 ans nous
          a transmis des données personnelles, écrivez-nous à{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
            {CONTACT_EMAIL}
          </a>{' '}
          : nous les supprimerons sans délai.
        </p>
      </>
    ),
  },
  {
    id: 'liens',
    title: 'Liens et sites tiers',
    body: (
      <p className={P}>
        Le site peut renvoyer vers des sites tiers (réseaux sociaux, partenaires,
        éditeurs de solutions). Dès que vous les rejoignez, leurs propres politiques
        de confidentialité et leurs propres traceurs s’appliquent : nous n’en
        maîtrisons ni le contenu ni les pratiques, et nous vous invitons à les
        consulter.
      </p>
    ),
  },
  {
    id: 'modifications',
    title: 'Modifications de cette politique',
    body: (
      <p className={P}>
        Cette politique peut évoluer avec le site, nos prestataires ou la
        réglementation. La date de dernière mise à jour figure en tête de page. En cas
        de changement substantiel affectant vos droits ou les cookies déposés, nous
        vous en informerons sur le site et votre consentement vous sera de nouveau
        demandé.
      </p>
    ),
  },
]

function TableOfContents() {
  return (
    <nav aria-label="Sommaire" className="lg:sticky lg:top-28">
      <p className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
        Sommaire
      </p>
      <ol className="mt-4 space-y-2.5">
        {SECTIONS.map((section, i) => (
          <li key={section.id} className="flex gap-3 text-sm">
            <span className="font-mono text-xs leading-6 text-slatebody/60">
              {String(i + 1).padStart(2, '0')}
            </span>
            <a
              href={`#${section.id}`}
              className="leading-6 text-slatebody transition hover:text-primary"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function ConfidentialitePage() {
  return (
    <>
      <Header solid />
      <main className="pt-20">
        <div className="bg-soft py-16 sm:py-20">
          <div className="mx-auto max-w-content px-6">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Confidentialité
            </p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-navy sm:text-[44px]">
              Politique de confidentialité
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slatebody">
              Nous protégeons les systèmes d’information de nos clients ; il serait
              incohérent de traiter les vôtres avec légèreté. Cette page décrit
              exactement quelles données nous collectons, pourquoi, combien de temps
              nous les gardons et comment reprendre la main dessus.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.08em] text-slatebody/70">
              Dernière mise à jour : {UPDATED_AT}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-content px-6 py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
            <aside className="lg:self-start">
              <TableOfContents />
            </aside>

            <div className="min-w-0 space-y-14">
              {SECTIONS.map((section, i) => (
                <section key={section.id} id={section.id}>
                  <p className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-navy">
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-5">{section.body}</div>
                </section>
              ))}

              <section id="contact" className="rounded-[28px] bg-navy p-8 sm:p-10">
                <h2 className="font-heading text-2xl font-bold text-white">
                  Une question sur vos données ?
                </h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
                  Une demande d’accès, de rectification ou de suppression, un doute
                  sur un cookie : une seule adresse, une réponse sous 30 jours.
                </p>
                <div className="mt-7 flex flex-wrap gap-4">
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Donn%C3%A9es%20personnelles`}
                    className="rounded-full bg-primary px-7 py-3.5 font-heading text-sm font-bold text-white transition hover:bg-primary-700"
                  >
                    Nous écrire
                  </a>
                  <Link
                    href="/#contact"
                    className="rounded-full border border-white/25 px-7 py-3.5 font-heading text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Contacter SSI
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

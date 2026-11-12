import type { Metadata } from 'next'
import PageBand from '@/components/tickets/PageBand'
import NewTicketForm from '@/components/tickets/NewTicketForm'
import HelpCard from '@/components/tickets/HelpCard'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = { title: 'Nouvelle demande' }

/** What helps the team qualify a request on first read — numbered, not carded. */
const TIPS = [
  { title: 'Ce qui se passe', text: 'Le symptôme et, s’il y en a un, le message d’erreur exact.' },
  { title: 'Depuis quand', text: 'Le moment où le problème est apparu, ou la date souhaitée pour un besoin.' },
  { title: 'L’impact', text: 'Les personnes ou services concernés, et ce qui est bloqué.' },
  { title: 'Ce qui a été tenté', text: 'Redémarrage, autre poste, autre connexion… tout nous fait gagner du temps.' },
]

export default async function NouvelleDemandePage() {
  await requireUser()

  return (
    <>
      <PageBand
        eyebrow="Nouvelle demande"
        title="Décrivez votre besoin"
        lead="Un incident, une question ou un projet : notre équipe qualifie votre demande et vous répond dans votre espace client."
      />

      <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-card sm:p-8">
            <NewTicketForm />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <section aria-labelledby="tips" className="rounded-[24px] border border-black/5 bg-white p-6">
              <h2 id="tips" className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-slatebody">
                Pour un traitement rapide
              </h2>
              <ol className="mt-4 space-y-4">
                {TIPS.map((tip, i) => (
                  <li key={tip.title} className="flex gap-3">
                    <span className="font-mono text-xs leading-6 text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm leading-relaxed text-slatebody">
                      <span className="font-heading font-bold text-navy">{tip.title}.</span> {tip.text}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
            <HelpCard />
          </aside>
        </div>
      </div>
    </>
  )
}

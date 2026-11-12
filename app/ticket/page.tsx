import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HelpCard from '@/components/tickets/HelpCard'
import TicketRequestForm from '@/components/tickets/TicketRequestForm'
import { NEW_TICKET_PATH } from '@/lib/auth-ui'
import { getSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Soumettre une demande',
  description:
    'Un incident, une question ou un projet informatique ? Décrivez votre besoin : l’équipe SSI qualifie votre demande et vous répond dans votre espace client.',
  alternates: { canonical: '/ticket' },
}

/** What happens after sending — numbered, in the site's editorial style. */
const STEPS = [
  { title: 'Vous décrivez votre besoin', text: 'En quelques lignes, avec vos mots.' },
  {
    title: 'Vous confirmez votre adresse',
    text: 'Un clic dans l’e-mail reçu. Uniquement la première fois.',
  },
  {
    title: 'Notre équipe prend la main',
    text: 'Elle qualifie votre demande et vous répond dans votre espace client.',
  },
  {
    title: 'Vous suivez l’avancement',
    text: 'Statut, échanges et historique au même endroit, avec une notification à chaque réponse.',
  },
]

export default async function TicketPage() {
  // Signed-in clients have the same form in their space, with their account
  // already attached.
  if (await getSession()) redirect(NEW_TICKET_PATH)

  return (
    <>
      <Header solid />
      <main className="pt-20">
        <div className="bg-soft py-14 sm:py-20">
          <div className="mx-auto max-w-content px-6">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Assistance
            </p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-navy sm:text-[44px]">
              Soumettre une demande
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slatebody">
              Un incident, une question ou un projet : décrivez-le, notre équipe s’en charge et vous
              tient informé à chaque étape.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-content px-6 py-14 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-card sm:p-10">
              <TicketRequestForm />
            </div>

            <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
              <section aria-labelledby="how">
                <h2 id="how" className="font-heading text-xl font-bold text-navy">
                  Comment ça se passe
                </h2>
                <ol className="mt-6 space-y-6">
                  {STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="font-mono text-xs leading-6 text-primary">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-heading text-base font-bold text-navy">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slatebody">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
              <HelpCard />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

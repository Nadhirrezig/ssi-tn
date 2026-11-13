import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageBand from '@/components/tickets/PageBand'
import StatusBadge from '@/components/tickets/StatusBadge'
import CategoryTag from '@/components/tickets/CategoryTag'
import StatusStepper from '@/components/tickets/StatusStepper'
import TicketThread from '@/components/tickets/TicketThread'
import TicketDetails from '@/components/tickets/TicketDetails'
import ReplyComposer from '@/components/tickets/ReplyComposer'
import HelpCard from '@/components/tickets/HelpCard'
import { FormMessage } from '@/components/auth/fields'
import { replyToTicketAction } from '@/app/espace-client/actions'
import { NEW_TICKET_PATH } from '@/lib/auth-ui'
import { requireUser } from '@/lib/session'
import { formatDateTime, isFinalStatus, ticketTitle } from '@/lib/ticket-status'
import { getClientTicket } from '@/lib/tickets'

type Props = {
  params: Promise<{ ref: string }>
  searchParams: Promise<{ envoye?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // The reference alone: no lookup here, the page does the authorised one.
  return { title: (await params).ref }
}

export default async function DemandePage({ params, searchParams }: Props) {
  const { user } = await requireUser()
  const [{ ref }, { envoye }] = await Promise.all([params, searchParams])

  // Scoped to this client: someone else's reference is simply "not found".
  const ticket = await getClientTicket(user.id, ref)
  if (!ticket) notFound()

  const final = isFinalStatus(ticket.status)
  const rejectedFrom =
    ticket.status === 'REJECTED'
      ? ticket.events.findLast((e) => e.toStatus === 'REJECTED')?.fromStatus
      : null
  const reply = replyToTicketAction.bind(null, ticket.id)

  return (
    <>
      <PageBand
        eyebrow={
          <Link href="/espace-client" className="inline-flex items-center gap-1.5 hover:underline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Mes demandes
          </Link>
        }
        title={ticketTitle(ticket.message, 120)}
        lead={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-sm text-primary">{ticket.ref}</span>
            <CategoryTag category={ticket.category} />
            <StatusBadge status={ticket.status} />
            <span className="text-sm">
              Ouverte le {formatDateTime(ticket.submittedAt ?? ticket.createdAt)}
            </span>
          </span>
        }
      >
        <div className="mt-6 max-w-2xl rounded-[20px] bg-white p-4 sm:mt-8 sm:p-6">
          <StatusStepper status={ticket.status} rejectedFrom={rejectedFrom} />
        </div>
      </PageBand>

      <div className="mx-auto max-w-content px-6 py-8 sm:py-14">
        {envoye ? (
          <div className="mb-8">
            <FormMessage tone="success">
              Votre demande a bien été envoyée. Notre équipe a été prévenue et vous répondra ici.
            </FormMessage>
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <section aria-labelledby="exchanges" className="min-w-0">
            <h2 id="exchanges" className="sr-only">
              Échanges
            </h2>
            <TicketThread
              perspective="client"
              viewerId={user.id}
              request={{
                body: ticket.message,
                at: ticket.submittedAt ?? ticket.createdAt,
                authorId: user.id,
                authorName: user.name,
              }}
              messages={ticket.messages}
              events={ticket.events}
            />

            <div className="mt-8">
              {final ? (
                <div className="rounded-[20px] border border-dashed border-black/10 p-5 text-center sm:p-6">
                  <p className="text-base text-slatebody">
                    Cette demande est clôturée. Pour un nouveau besoin, ouvrez une nouvelle demande.
                  </p>
                  <Link
                    href={NEW_TICKET_PATH}
                    className="mt-3 inline-block font-heading text-sm font-bold text-primary underline-offset-2 hover:underline"
                  >
                    Nouvelle demande
                  </Link>
                </div>
              ) : (
                <ReplyComposer action={reply} />
              )}
            </div>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <TicketDetails ticket={ticket} />
            <HelpCard />
          </aside>
        </div>
      </div>
    </>
  )
}

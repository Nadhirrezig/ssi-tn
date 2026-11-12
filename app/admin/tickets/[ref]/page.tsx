import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageBand from '@/components/tickets/PageBand'
import StatusBadge from '@/components/tickets/StatusBadge'
import StatusStepper from '@/components/tickets/StatusStepper'
import TicketThread from '@/components/tickets/TicketThread'
import TicketDetails from '@/components/tickets/TicketDetails'
import ReplyComposer from '@/components/tickets/ReplyComposer'
import ClientCard from '@/components/admin/ClientCard'
import StatusActions from '@/components/admin/StatusActions'
import { adminReplyAction, adminStatusAction } from '@/app/admin/actions'
import { requireAdmin } from '@/lib/session'
import { getAdminTicket } from '@/lib/admin-tickets'
import { formatDateTime, isFinalStatus, NEXT_STATUSES, ticketTitle } from '@/lib/ticket-status'

type Props = { params: Promise<{ ref: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: (await params).ref }
}

export default async function AdminTicketPage({ params }: Props) {
  const { user: admin } = await requireAdmin()
  const { ref } = await params

  const ticket = await getAdminTicket(ref)
  if (!ticket) notFound()

  const final = isFinalStatus(ticket.status)
  const next = NEXT_STATUSES[ticket.status]
  const rejectedFrom =
    ticket.status === 'REJECTED'
      ? ticket.events.findLast((e) => e.toStatus === 'REJECTED')?.fromStatus
      : null

  return (
    <>
      <PageBand
        eyebrow={
          <Link href="/admin/tickets" className="inline-flex items-center gap-1.5 hover:underline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Demandes clients
          </Link>
        }
        title={ticketTitle(ticket.message, 120)}
        lead={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-sm text-primary">{ticket.ref}</span>
            <StatusBadge status={ticket.status} />
            <span className="text-sm">
              {ticket.user.name} · {formatDateTime(ticket.submittedAt ?? ticket.createdAt)}
            </span>
          </span>
        }
      >
        <div className="mt-8 max-w-2xl rounded-[20px] bg-white p-5 sm:p-6">
          <StatusStepper status={ticket.status} rejectedFrom={rejectedFrom} />
        </div>
      </PageBand>

      <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <section aria-labelledby="exchanges" className="min-w-0">
            <h2 id="exchanges" className="sr-only">
              Échanges
            </h2>
            <TicketThread
              perspective="admin"
              viewerId={admin.id}
              request={{
                body: ticket.message,
                at: ticket.submittedAt ?? ticket.createdAt,
                authorId: ticket.user.id,
                authorName: ticket.user.name,
              }}
              messages={ticket.messages}
              events={ticket.events}
            />

            <div className="mt-8">
              {final ? (
                <p className="rounded-[20px] border border-dashed border-black/10 p-6 text-center text-base text-slatebody">
                  Demande clôturée : elle ne peut plus recevoir de réponse.
                </p>
              ) : (
                <ReplyComposer
                  action={adminReplyAction.bind(null, ticket.id)}
                  label={`Répondre à ${ticket.user.name}`}
                  placeholder="Votre réponse au client…"
                  hint="Le client reçoit votre réponse par e-mail."
                  nextStatuses={next}
                  currentStatus={ticket.status}
                />
              )}
            </div>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <ClientCard client={ticket.user} />
            {!final ? (
              <StatusActions
                action={adminStatusAction.bind(null, ticket.id)}
                current={ticket.status}
                next={next}
              />
            ) : null}
            <TicketDetails ticket={ticket} />
          </aside>
        </div>
      </div>
    </>
  )
}

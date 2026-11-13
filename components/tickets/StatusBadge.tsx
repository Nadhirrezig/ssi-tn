import { STATUS_META, type TicketStatus } from '@/lib/ticket-status'

/**
 * One status, one colour, everywhere. Colours come from the site palette
 * (tailwind.config.ts) — no new hues. The label is always navy on a light
 * tint, so contrast holds (WCAG AA) whatever the tint; the dot carries the
 * colour and is decorative.
 */
const TONE: Record<TicketStatus, { tint: string; dot: string }> = {
  PENDING: { tint: 'bg-accentYellow/25', dot: 'bg-accentYellow ring-1 ring-navy/15' },
  CONFIRMED: { tint: 'bg-primary-50', dot: 'bg-primary' },
  IN_PROGRESS: { tint: 'bg-accentBlue/10', dot: 'bg-accentBlue' },
  DONE: { tint: 'bg-navy/[0.06]', dot: 'bg-navy' },
  REJECTED: { tint: 'bg-accentCoral/10', dot: 'bg-accentCoral' },
}

/** The status colour on its own — for menus and compact lists. Decorative. */
export function StatusDot({ status, size = 'sm' }: { status: TicketStatus; size?: 'sm' | 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 rounded-full ${size === 'md' ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5'} ${TONE[status].dot}`}
    />
  )
}

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const tone = TONE[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-heading text-xs font-bold text-navy ${tone.tint}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
      {STATUS_META[status].label}
    </span>
  )
}

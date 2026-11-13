import { categoryOf, TICKET_CATEGORIES } from '@/lib/ticket-status'

/**
 * "Devis" / "Démo" marker for tickets opened from a quote or demo button.
 * Outlined, unlike the filled status badges, so the two never read as the
 * same kind of information. Renders nothing for ordinary requests.
 */
export default function CategoryTag({ category }: { category: string | null | undefined }) {
  const key = categoryOf(category)
  if (!key) return null
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-primary/30 px-2 py-0.5 font-heading text-[11px] font-bold uppercase tracking-[0.06em] text-primary">
      {TICKET_CATEGORIES[key].tag}
    </span>
  )
}

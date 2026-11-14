import Link from 'next/link'

const PAGE_LINK =
  'rounded-full border border-black/10 px-4 py-2 font-heading font-bold text-navy transition hover:border-primary hover:text-primary'

/** "Page 2 sur 5 · Précédente · Suivante" — `hrefFor` builds the link for a page number. */
export default function Pagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number
  pageCount: number
  hrefFor: (page: number) => string
}) {
  if (pageCount <= 1) return null
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
      <span className="text-slatebody">
        Page {page} sur {pageCount}
      </span>
      <span className="flex gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className={PAGE_LINK}>
            Précédente
          </Link>
        ) : null}
        {page < pageCount ? (
          <Link href={hrefFor(page + 1)} className={PAGE_LINK}>
            Suivante
          </Link>
        ) : null}
      </span>
    </nav>
  )
}

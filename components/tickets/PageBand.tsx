import type { ReactNode } from 'react'

/**
 * The soft heading band used across the site (privacy page, account pages),
 * sized for the client area: eyebrow, title, optional lead and actions.
 */
export default function PageBand({
  eyebrow,
  title,
  lead,
  actions,
  children,
}: {
  eyebrow: ReactNode
  title: ReactNode
  lead?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="bg-soft py-8 sm:py-14">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-wrap items-end justify-between gap-5 sm:gap-6">
          <div className="min-w-0 max-w-3xl">
            <div className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
              {eyebrow}
            </div>
            <h1 className="mt-3 break-words font-heading text-[1.75rem] font-bold leading-tight text-navy sm:text-4xl">
              {title}
            </h1>
            {lead ? <div className="mt-3 text-base leading-relaxed text-slatebody">{lead}</div> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
        {children}
      </div>
    </div>
  )
}

/** Primary pill link, as used by the site's CTAs. */
export const PRIMARY_LINK =
  'inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-heading text-sm font-bold text-white shadow-float transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

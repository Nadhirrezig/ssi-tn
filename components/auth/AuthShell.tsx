import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/**
 * Page frame for the account pages: the same soft heading band as the privacy
 * page, then the form on a white card. Header and footer stay the site's own,
 * so signing in never feels like leaving SSI.
 */
export default function AuthShell({
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  eyebrow: string
  title: string
  lead?: ReactNode
  children: ReactNode
  /** Links under the card: "Pas encore de compte ?", etc. */
  aside?: ReactNode
}) {
  return (
    <>
      <Header solid />
      <main className="pt-20">
        <div className="bg-soft py-14 sm:py-20">
          <div className="mx-auto max-w-content px-6">
            <div className="mx-auto max-w-md">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
                {eyebrow}
              </p>
              <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-navy sm:text-4xl">
                {title}
              </h1>
              {lead ? (
                <p className="mt-4 text-base leading-relaxed text-slatebody">{lead}</p>
              ) : null}

              <div className="mt-8 rounded-[28px] bg-white p-6 shadow-card sm:p-8">{children}</div>

              {aside ? (
                <div className="mt-6 space-y-2 text-center text-sm text-slatebody">{aside}</div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

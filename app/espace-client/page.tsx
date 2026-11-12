import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SignOutButton from '@/components/auth/SignOutButton'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Espace client',
  robots: { index: false, follow: false },
}

/**
 * Phase 1 placeholder: proves sign-in works end to end. The ticket list and
 * the "new ticket" form arrive in Phase 2.
 */
export default async function EspaceClientPage() {
  const { user } = await requireUser()

  return (
    <>
      <Header solid />
      <main className="pt-20">
        <div className="bg-soft py-14 sm:py-20">
          <div className="mx-auto max-w-content px-6">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Espace client
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <h1 className="font-heading text-3xl font-bold leading-tight text-navy sm:text-4xl">
                Bonjour {user.name}
              </h1>
              <SignOutButton />
            </div>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slatebody">
              Connecté en tant que <span className="font-semibold text-navy">{user.email}</span>.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-content px-6 py-16">
          <div className="rounded-[28px] border border-black/5 p-8 text-center">
            <h2 className="font-heading text-xl font-bold text-navy">Vos tickets</h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slatebody">
              Vous pourrez bientôt soumettre vos demandes et suivre leur avancement ici.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

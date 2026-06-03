import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Page introuvable',
}

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-soft px-6 py-24 text-center">
      <div className="mx-auto max-w-md">
        <Logo href="/" />
        <p className="mt-12 font-heading text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold text-navy">
          Page introuvable
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slatebody">
          La page que vous recherchez n’existe pas ou a été déplacée. Revenons à
          l’essentiel — la digitalisation sécurisée de votre entreprise.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-primary px-8 py-4 font-heading text-base font-bold text-white shadow-float transition hover:bg-primary-700"
        >
          Retour à l’accueil
        </Link>
      </div>
    </main>
  )
}

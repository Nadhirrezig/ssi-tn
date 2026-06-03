import type { Metadata } from 'next'
import { Open_Sans, Quicksand } from 'next/font/google'
import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
})

export const metadata: Metadata = {
  title: {
    default: 'SSI — Sécurité & Solutions Informatiques',
    template: '%s | SSI',
  },
  description:
    "La digitalisation de votre entreprise, avec des solutions sur mesure et sécurisées. SSI accompagne les entreprises tunisiennes : cybersécurité, infrastructure & réseaux, développement, cloud et infogérance.",
  keywords: [
    'SSI',
    'sécurité informatique',
    'cybersécurité',
    'solutions informatiques',
    'infogérance',
    'digitalisation',
    'transformation numérique',
    'Tunisie',
  ],
  openGraph: {
    title: 'SSI — Sécurité & Solutions Informatiques',
    description:
      'La digitalisation de votre entreprise, avec des solutions sur mesure et sécurisées.',
    locale: 'fr_TN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${openSans.variable} ${quicksand.variable}`}>
      <body className="bg-white font-body text-slatebody antialiased">
        {children}
      </body>
    </html>
  )
}

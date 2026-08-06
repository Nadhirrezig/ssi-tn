import type { Metadata } from 'next'
import { Open_Sans, Quicksand } from 'next/font/google'
import CookieConsent from '@/components/CookieConsent'
import { SITE_NAME, SITE_URL } from '@/lib/site'
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

/**
 * Company identity for search engines. Only facts that appear on the site —
 * an invented address or rating is worse than none, and Google penalises
 * structured data that contradicts the page.
 */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: 'SSI',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: 'contact@ssi-tn.com',
  telephone: '+216 28 290 350',
  description:
    'Société tunisienne de cybersécurité et de solutions informatiques : infrastructure et réseaux, développement sur mesure, cloud et infogérance.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tunis',
    addressCountry: 'TN',
  },
  areaServed: { '@type': 'Country', name: 'Tunisie' },
}

export const metadata: Metadata = {
  // Resolves every relative URL below — and the canonical of each page — against
  // the deployed origin. Without it Next emits relative canonicals and warns.
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
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
    url: '/',
    siteName: 'SSI',
    locale: 'fr_TN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSI — Sécurité & Solutions Informatiques',
    description:
      'La digitalisation de votre entreprise, avec des solutions sur mesure et sécurisées.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Lets Google show full-size image thumbnails and longer snippets.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-white font-body text-slatebody antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}

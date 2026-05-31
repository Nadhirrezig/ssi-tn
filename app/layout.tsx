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
  title: 'Base — Next.js SaaS Landing Template',
  description: 'A production-ready Next.js SaaS boilerplate with everything you need to launch your next product.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${quicksand.variable}`}>
      <body className="bg-white font-body text-slatebody antialiased">
        {children}
      </body>
    </html>
  )
}

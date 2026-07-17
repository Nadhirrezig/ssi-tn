import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTABand from '@/components/CTABand'
import BackToTop from '@/components/BackToTop'
import Secteurs from '@/components/sections/Secteurs'
import Showcase from '@/components/sections/Showcase'
import SolutionHero from '@/components/sections/SolutionHero'
import SolutionVideo from '@/components/sections/SolutionVideo'
import { getSolution, solutions } from '@/lib/content/solutions'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const solution = getSolution(params.slug)
  if (!solution) return {}
  return {
    title: solution.name,
    description: solution.metaDescription,
    openGraph: { title: `${solution.name} | SSI`, description: solution.metaDescription },
  }
}

export default function SolutionPage({ params }: Props) {
  const solution = getSolution(params.slug)
  if (!solution) notFound()

  return (
    <>
      <Header solid />
      <main>
        <SolutionHero content={solution.hero} />
        <SolutionVideo content={solution.video} />
        <div id="fonctionnalites" className="scroll-mt-24">
          <Secteurs items={solution.scenarios} ariaLabel={`Scénarios ${solution.name}`} />
        </div>
        <Showcase content={solution.showcase} />
        <CTABand />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

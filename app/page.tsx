import Header from '@/components/Header'
import Hero from '@/components/Hero'
import WhyChooseUs from '@/components/WhyChooseUs'
// Features (the "Solutions" section) now lives in the navbar mega-menu.
// Kept in the codebase for rollback: import Features from '@/components/Features'
import Projects from '@/components/Projects'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import CTABand from '@/components/CTABand'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <Projects />
        <Pricing />
        <FAQ />
        <CTABand />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

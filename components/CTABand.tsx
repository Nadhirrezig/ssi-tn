import Link from 'next/link'

export default function CTABand() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-16 text-center sm:px-16">
          {/* Decorative circles */}
          <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 right-6 h-52 w-52 rounded-full bg-white/10" />
          {/* Yellow accent */}
          <div className="absolute right-10 top-10 h-16 w-16 rounded-bl-[999px] bg-accentYellow" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-heading text-4xl font-bold leading-tight text-white sm:text-[42px]">
              Start building your SaaS today
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
              Ship faster with a production-ready Next.js boilerplate. Auth, payments, and a polished landing page — all included.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#"
                className="rounded-full bg-white px-9 py-4 font-heading text-base font-bold text-primary transition hover:bg-accentYellow hover:text-navy"
              >
                Get Started Now
              </Link>
              <Link
                href="#pricing"
                className="rounded-full border border-white/40 px-9 py-4 font-heading text-base font-bold text-white transition hover:bg-white/10"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

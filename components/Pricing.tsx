import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: '0',
    blurb: 'For side projects and experiments.',
    featured: false,
    cta: 'Start Free',
    features: ['1 project', 'Community support', 'Basic analytics', 'MDX blog'],
  },
  {
    name: 'Pro',
    price: '29',
    blurb: 'For growing teams shipping fast.',
    featured: true,
    cta: 'Get Started',
    features: ['Unlimited projects', 'Auth + Payments', 'Priority support', 'Advanced analytics', 'Sanity CMS'],
  },
  {
    name: 'Enterprise',
    price: '99',
    blurb: 'For scale, security and SLAs.',
    featured: false,
    cta: 'Contact Sales',
    features: ['Everything in Pro', 'SSO & SAML', 'Dedicated manager', '99.9% uptime SLA'],
  },
]

function CheckIcon({ featured }: { featured: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      className={`shrink-0 ${featured ? 'text-accentYellow' : 'text-primary'}`}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-bold text-navy sm:text-[44px]">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-5 text-lg text-slatebody">
            Choose the plan that fits your stage. Upgrade, downgrade, or cancel anytime — no surprises.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-3xl border p-8 transition ${
                p.featured
                  ? 'border-primary bg-primary text-white shadow-float lg:-mt-4 lg:mb-4'
                  : 'border-black/10 bg-white shadow-card'
              }`}
            >
              {p.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-accentYellow px-3 py-1 font-heading text-xs font-bold text-navy">
                  Popular
                </span>
              )}
              <h3 className={`font-heading text-xl font-bold ${p.featured ? 'text-white' : 'text-navy'}`}>
                {p.name}
              </h3>
              <p className={`mt-2 text-sm ${p.featured ? 'text-white/75' : 'text-slatebody'}`}>{p.blurb}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className={`font-heading text-5xl font-bold ${p.featured ? 'text-white' : 'text-navy'}`}>
                  ${p.price}
                </span>
                <span className={`mb-2 text-sm ${p.featured ? 'text-white/70' : 'text-slatebody'}`}>/mo</span>
              </div>
              <ul className="mt-7 space-y-3 text-[15px]">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-center gap-3 ${p.featured ? 'text-white/90' : 'text-slatebody'}`}>
                    <CheckIcon featured={p.featured} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="#"
                className={`mt-8 rounded-full py-3.5 text-center font-heading font-bold transition ${
                  p.featured
                    ? 'bg-white text-primary hover:bg-accentYellow hover:text-navy'
                    : 'bg-primary-50 text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

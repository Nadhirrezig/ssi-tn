const features = [
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="12" width="4" height="8" rx="1" />
        <rect x="10" y="7" width="4" height="13" rx="1" opacity=".55" />
        <rect x="17" y="3" width="4" height="17" rx="1" />
      </svg>
    ),
    title: 'Crafted for Startups',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" opacity=".55" />
        <path d="m3 17 9 5 9-5" opacity=".3" />
      </svg>
    ),
    title: 'Pre-built Pages',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" stroke="white" strokeWidth="1.5" opacity=".6" />
      </svg>
    ),
    title: 'All Essential Sections',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 13l4-4" stroke="white" strokeWidth="1.6" />
      </svg>
    ),
    title: 'Speed Optimized',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" opacity=".55" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" opacity=".55" />
      </svg>
    ),
    title: 'Fully Customizable',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" stroke="white" strokeWidth="1.5" opacity=".6" />
      </svg>
    ),
    title: 'Regular Updates',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor.',
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-soft py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-bold text-navy sm:text-[44px]">
            An Amazing Next.js Boilerplate
          </h2>
          <p className="mt-5 text-lg text-slatebody">
            With All Essential Integrations — DB, Auth, Payment, Sanity, MDX, and more
          </p>
        </div>
        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group">
              <div className="grid h-14 w-14 place-items-center rounded-xl text-primary transition group-hover:-translate-y-1">
                {f.icon}
              </div>
              <h3 className="mt-6 font-heading text-2xl font-bold text-navy">{f.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slatebody">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

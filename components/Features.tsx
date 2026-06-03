import Reveal from './motion/Reveal'

const services = [
  {
    title: 'Cybersécurité',
    body: 'Audits, pare-feu, supervision et réponse aux incidents pour une posture de sécurité maîtrisée et conforme.',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Infrastructure & Réseaux',
    body: 'Conception et administration de réseaux et serveurs robustes, pensés pour la performance et la continuité d’activité.',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="6" rx="1.5" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" />
        <path d="M7 7h.01M7 17h.01" />
      </svg>
    ),
  },
  {
    title: 'Développement sur mesure',
    body: 'Applications web et logiciels métiers adaptés à vos processus, du cahier des charges à la mise en production.',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 9-3 3 3 3M16 9l3 3-3 3M13.5 7l-3 10" />
      </svg>
    ),
  },
  {
    title: 'Cloud & Infogérance',
    body: 'Migration, hébergement et gestion cloud sécurisés pour gagner en agilité et en disponibilité au quotidien.',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6 19Z" />
      </svg>
    ),
  },
  {
    title: 'Audit & Conseil',
    body: 'Diagnostic de votre système d’information et feuille de route claire pour aligner technologie et objectifs métiers.',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m7 14 3-3 3 3 5-6" />
      </svg>
    ),
  },
  {
    title: 'Support & Maintenance',
    body: 'Assistance réactive et maintenance proactive pour garder votre informatique disponible, à jour et sécurisée.',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a1.4 1.4 0 0 0 2 2l6-6a4 4 0 0 0 5.4-5.4l-2.5 2.5L11 13l-1-3 2.2-1.2Z" />
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section id="services" className="bg-soft py-24">
      <div className="mx-auto max-w-content px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-base font-bold text-primary">Nos services</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-navy sm:text-[44px]">
            Des solutions informatiques complètes et sécurisées
          </h2>
          <p className="mt-5 text-lg text-slatebody">
            De l’infrastructure à la cybersécurité, nous couvrons l’ensemble de
            votre système d’information — avec un seul interlocuteur de confiance.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 0.08}>
              <div className="group h-full rounded-2xl p-2 transition">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-white text-primary shadow-card transition group-hover:-translate-y-1">
                  {service.icon}
                </div>
                <h3 className="mt-6 font-heading text-2xl font-bold text-navy">{service.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slatebody">{service.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

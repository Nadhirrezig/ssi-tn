import Image from 'next/image'
import NavPanelTrigger from './NavPanelTrigger'
import Reveal from './motion/Reveal'

const points = [
  'Expertise certifiée et pluridisciplinaire',
  'Solutions sur mesure, pensées pour votre métier',
  'Sécurité par conception, à chaque étape',
  'Proximité et réactivité, partout en Tunisie',
]

function AboutImage({
  src,
  alt,
  ratio,
  className = '',
}: {
  src: string
  alt: string
  ratio: string
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-soft ring-1 ring-black/5 ${ratio} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 45vw, 280px"
        className="object-cover"
      />
    </div>
  )
}

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto grid max-w-content items-center gap-14 px-6 lg:grid-cols-2">
        {/* Image collage */}
        <Reveal className="relative">
          <div className="grid grid-cols-[1fr_1.25fr] gap-5">
            <div className="flex flex-col gap-5 pt-10">
              <AboutImage
                src="/website-content/about-01.webp"
                alt="Ingénieurs SSI au travail sur une infrastructure informatique"
                ratio="aspect-[4/5]"
              />
              <AboutImage
                src="/website-content/about-02.webp"
                alt="Supervision et sécurité des systèmes par les équipes SSI"
                ratio="aspect-[4/5]"
              />
            </div>
            <AboutImage
              src="/website-content/about-03.webp"
              alt="Bureaux SSI — accompagnement des entreprises tunisiennes"
              ratio="aspect-[3/5]"
              className="self-center"
            />
          </div>
          {/* Quiet brand accents */}
          <div className="absolute -bottom-6 left-1/2 -z-10 h-28 w-28 -translate-x-1/2 rounded-full bg-primary/90" />
          <div className="absolute -top-4 right-6 h-16 w-16 rounded-bl-[999px] bg-accentYellow" />
        </Reveal>

        {/* Copy */}
        <Reveal className="lg:pl-6" delay={0.1}>
          <p className="font-heading text-base font-bold text-primary">À propos de SSI</p>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-navy sm:text-[44px]">
            Un partenaire de confiance pour votre transformation numérique
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slatebody">
            Depuis plus de dix ans, SSI conçoit, déploie et sécurise les systèmes
            d&apos;information des PME et grandes entreprises. Notre approche est
            simple : comprendre votre métier, proposer des solutions sur mesure
            et garantir leur sécurité dans la durée.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="text-[15px] font-semibold text-navy">{point}</span>
              </li>
            ))}
          </ul>

          {/* There is no réalisations page yet — the panel is where the real
              destinations live, so the CTA opens it rather than dead-ending. */}
          <NavPanelTrigger
            panel="solutions"
            className="group mt-10 inline-flex items-center gap-5"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-float transition group-hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
            <span className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-navy">
              Voir nos réalisations
            </span>
          </NavPanelTrigger>
        </Reveal>
      </div>
    </section>
  )
}

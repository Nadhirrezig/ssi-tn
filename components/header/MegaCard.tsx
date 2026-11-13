import Image from 'next/image'
import Link from 'next/link'
import { Arrow, CheckDot } from './icons'
import type { PanelCard } from './nav-data'

/* One card inside a mega panel — image category card or a plan card. */
export default function MegaCard({ card, onNavigate }: { card: PanelCard; onNavigate: () => void }) {
  if (card.hook && card.image) {
    return (
      <Link
        href={card.href}
        onClick={onNavigate}
        className="group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl border border-black/5 transition hover:border-primary/30 hover:shadow-card"
      >
        <Image
          src={card.image}
          alt={card.imageAlt ?? ''}
          fill
          sizes="(max-width: 1024px) 90vw, 560px"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
        <div className="relative p-5 lg:p-6">
          {card.eyebrow && (
            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 font-heading text-xs font-bold text-primary backdrop-blur">
              {card.eyebrow}
            </span>
          )}
          <h3 className="mt-3 font-heading text-lg font-bold text-white">{card.title}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">{card.desc}</p>
          <span className="mt-4 flex items-center gap-1.5 font-heading text-sm font-bold text-white transition group-hover:gap-2.5">
            {card.cta ?? 'En savoir plus'} <Arrow />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={card.href}
      onClick={onNavigate}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:border-primary/30 hover:shadow-card"
    >
      {card.image ? (
        <div className="relative w-full overflow-hidden max-lg:aspect-[16/10] lg:flex-1">
          <Image
            src={card.image}
            alt={card.imageAlt ?? ''}
            fill
            sizes="(max-width: 1024px) 90vw, 340px"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          {card.eyebrow && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-heading text-xs font-bold text-primary backdrop-blur">
              {card.eyebrow}
            </span>
          )}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4 lg:p-5">
        {card.eyebrow && !card.image && (
          <span className="mb-2 inline-flex w-fit rounded-full bg-primary-50 px-3 py-1 font-heading text-xs font-bold text-primary">
            {card.eyebrow}
          </span>
        )}
        {card.price && (
          <p className="font-heading text-navy">
            <span className="text-3xl font-bold">{card.price}</span>
            {card.period && <span className="ml-1 text-sm text-slatebody">{card.period}</span>}
          </p>
        )}
        <h3 className="mt-1 font-heading text-lg font-bold text-navy transition group-hover:text-primary">
          {card.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slatebody">{card.desc}</p>

        {card.links && (
          <ul className="mt-4 space-y-2 border-t border-black/5 pt-4">
            {card.links.map((l) => (
              <li key={l.label} className="flex items-center gap-2.5 text-sm font-semibold text-navy">
                <CheckDot />
                {l.label}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-auto flex items-center gap-1.5 pt-4 font-heading text-sm font-bold text-primary opacity-0 transition group-hover:opacity-100">
          {card.cta ?? 'En savoir plus'} <Arrow />
        </span>
      </div>
    </Link>
  )
}

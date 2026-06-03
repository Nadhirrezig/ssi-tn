'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Reveal from './motion/Reveal'

const EASE = [0.22, 1, 0.36, 1] as const

type Project = {
  title: string
  desc: string
  tag: string
  cat: string
}

const projects: Project[] = [
  {
    title: 'Refonte d’infrastructure réseau',
    desc: 'Réseau et serveurs redondés pour un groupe industriel, avec haute disponibilité.',
    tag: 'Infrastructure',
    cat: 'infra',
  },
  {
    title: 'Audit & mise en conformité',
    desc: 'Audit de sécurité complet et plan de remédiation pour un cabinet de services.',
    tag: 'Cybersécurité',
    cat: 'cyber',
  },
  {
    title: 'Plateforme de gestion métier',
    desc: 'Application web sur mesure pour digitaliser les processus d’une PME logistique.',
    tag: 'Développement',
    cat: 'dev',
  },
  {
    title: 'Migration cloud sécurisée',
    desc: 'Migration des services et messagerie vers le cloud, sans interruption d’activité.',
    tag: 'Cloud & Infogérance',
    cat: 'cloud',
  },
  {
    title: 'Supervision & SOC managé',
    desc: 'Surveillance 24/7 des systèmes et réponse aux incidents pour un acteur de la santé.',
    tag: 'Cybersécurité',
    cat: 'cyber',
  },
  {
    title: 'Portail client e-services',
    desc: 'Espace client sécurisé et automatisation des demandes pour un prestataire de services.',
    tag: 'Développement',
    cat: 'dev',
  },
]

const filters = [
  { id: 'all', label: 'Tous' },
  { id: 'cyber', label: 'Cybersécurité' },
  { id: 'infra', label: 'Infrastructure' },
  { id: 'dev', label: 'Développement' },
  { id: 'cloud', label: 'Cloud' },
]

function Card({ project }: { project: Project }) {
  return (
    <div className="group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl bg-white p-7 shadow-card ring-1 ring-black/5 transition hover:shadow-float">
      <span className="pointer-events-none absolute -right-2 -top-4 font-heading text-[110px] font-bold leading-none text-primary/5">
        {project.tag.charAt(0)}
      </span>
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 font-heading text-xs font-bold text-primary">
        {project.tag}
      </span>
      <h3 className="relative mt-5 font-heading text-xl font-bold text-navy">{project.title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-slatebody">{project.desc}</p>
      <span className="relative mt-auto inline-flex items-center gap-2 pt-6 font-heading text-sm font-bold text-primary">
        Voir l’étude de cas
        <svg
          className="transition-transform group-hover:translate-x-1"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  )
}

export default function Projects() {
  const [active, setActive] = useState('all')
  const reduce = useReducedMotion()

  const visible = projects.filter((p) => active === 'all' || p.cat === active)

  return (
    <section id="realisations" className="bg-soft py-24">
      <div className="mx-auto max-w-content px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-base font-bold text-primary">Réalisations</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-navy sm:text-[44px]">
            Des projets concrets, des résultats mesurables
          </h2>
          <p className="mt-5 text-lg text-slatebody">
            Un aperçu des missions menées pour nos clients, de la cybersécurité
            au développement d’applications métiers.
          </p>
        </Reveal>

        {/* Filter bar */}
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-full bg-white p-2 shadow-card">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              className={`rounded-full px-5 py-2.5 font-heading text-sm transition ${
                active === f.id
                  ? 'bg-primary font-bold text-white'
                  : 'font-semibold text-slatebody hover:text-navy'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.div
                key={project.title}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <Card project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

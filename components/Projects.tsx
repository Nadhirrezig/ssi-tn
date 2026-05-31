'use client'

import { useState } from 'react'

type Project = {
  title: string
  tag: string
  cat: string
  span: string
}

const projects: Project[] = [
  { title: 'Photo Retouching', tag: 'Branded Ecommerce', cat: 'ecommerce', span: '' },
  { title: 'Bottle Branding', tag: 'Branding Strategy', cat: 'branding', span: '' },
  { title: 'Mobile Showcase', tag: 'Digital Experiences', cat: 'digital', span: 'sm:row-span-2' },
  { title: 'Device Mockup', tag: 'Digital Experiences', cat: 'digital', span: 'sm:col-span-2' },
]

const filters = [
  { id: 'all', label: 'All' },
  { id: 'branding', label: 'Branding Strategy' },
  { id: 'digital', label: 'Digital Experiences' },
  { id: 'ecommerce', label: 'Ecommerce' },
]

export default function Projects() {
  const [active, setActive] = useState('all')

  const visible = projects.filter((p) => active === 'all' || p.cat === active)

  return (
    <section id="projects" className="bg-soft py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-bold text-navy sm:text-[44px]">Our Latest Projects</h2>
          <p className="mt-5 text-lg text-slatebody">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-full bg-white p-2 shadow-card">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              className={`rounded-full px-6 py-2.5 font-heading text-sm transition ${
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
          {visible.map((p) => (
            <div key={p.title} className={`group relative overflow-hidden rounded-2xl ${p.span}`}>
              <div className="ph h-full min-h-[240px] w-full" data-label={p.tag} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/0 text-center opacity-0 transition-all duration-300 group-hover:bg-white/55 group-hover:opacity-100">
                <p className="font-heading text-lg font-bold text-navy">{p.title}</p>
                <p className="text-sm text-slatebody">{p.tag}</p>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

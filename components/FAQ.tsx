'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'What is included in the template?',
    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. The template ships with authentication, payments, a CMS integration and a fully responsive landing page.',
  },
  {
    q: 'Do I need a license per project?',
    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fringilla magna mauris, nulla fermentum viverra sem.',
  },
  {
    q: 'Is it built with the App Router?',
    a: 'Yes — it uses the Next.js App Router, server components and Tailwind CSS out of the box, with sensible defaults you can override.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reach out to support within 14 days and we will sort it out.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-soft py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-bold text-navy sm:text-[44px]">
            Frequently Asked Questions
          </h2>
          <p className="mt-5 text-lg text-slatebody">
            Everything you need to know about the template. Can&apos;t find an answer? Reach out to support.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="overflow-hidden rounded-2xl bg-white shadow-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
              >
                <span className="font-heading text-lg font-bold text-navy">{faq.q}</span>
                <svg
                  className={`shrink-0 text-primary transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-7 pb-6 text-base leading-relaxed text-slatebody">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

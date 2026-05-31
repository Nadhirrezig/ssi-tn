'use client'

import { useState } from 'react'

const testimonials = [
  {
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dolor diam, feugiat quis enim sed, ullamcorper semper ligula. Mauris consequat justo volutpat.',
    name: 'Devid Smith',
    role: 'Founder @democompany',
    brand: 'dropcam',
  },
  {
    quote: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget.',
    name: 'Sarah Johnson',
    role: 'CEO @startuplab',
    brand: 'airbnb',
  },
  {
    quote: 'Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante.',
    name: 'Michael Lee',
    role: 'CTO @buildfast',
    brand: 'spotify',
  },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIndex((i) => (i + 1) % testimonials.length)

  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-bold text-navy sm:text-[44px]">
            Client&apos;s Testimonials
          </h2>
          <p className="mt-5 text-lg text-slatebody">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.name} className="w-full shrink-0 px-1">
                  <div className="relative grid items-center gap-8 overflow-hidden rounded-3xl bg-white p-8 shadow-card sm:grid-cols-[260px_1fr] sm:p-10">
                    <div className="ph aspect-square rounded-2xl" data-label="Portrait" />
                    <div>
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-primary/15"
                      >
                        <path
                          d="M10 7H6a4 4 0 0 0-4 4v6h6v-6H5a3 3 0 0 1 3-3V7Zm12 0h-4a4 4 0 0 0-4 4v6h6v-6h-3a3 3 0 0 1 3-3V7Z"
                          transform="scale(-1,1) translate(-24,0)"
                        />
                      </svg>
                      <p className="mt-2 text-xl italic leading-relaxed text-slatebody">{t.quote}</p>
                      <div className="mt-7 flex items-end justify-between">
                        <div>
                          <p className="font-heading text-lg font-bold text-navy">{t.name}</p>
                          <p className="text-sm text-slatebody">{t.role}</p>
                        </div>
                        <span className="font-heading text-xl font-bold lowercase text-navy/30">{t.brand}</span>
                      </div>
                    </div>
                    <span className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b from-primary to-accentCoral" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous"
              className="grid h-12 w-12 place-items-center rounded-full border border-black/10 text-primary transition hover:border-primary hover:bg-primary hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="grid h-12 w-12 place-items-center rounded-full border border-black/10 text-primary transition hover:border-primary hover:bg-primary hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

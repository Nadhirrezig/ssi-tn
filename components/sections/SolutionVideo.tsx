'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { SolutionVideoContent } from '@/lib/content/solutions'

/**
 * Full-screen video section shown right after the solution hero.
 *
 * The presentation ships as several files rather than one, so the parts are
 * stacked and played back-to-back to read as a single continuous video: when a
 * part ends the next one is revealed and started, and the last wraps back to
 * the first.
 *
 * The parts weigh tens of MB each, so fetching is kept on a tight leash:
 * nothing is requested until the section nears the viewport, and the following
 * part only starts buffering once the current one is half-way through. Two
 * parts on `preload="auto"` would otherwise race for bandwidth on page load,
 * for a section that sits below a full-screen hero.
 *
 * Autoplay is disabled under prefers-reduced-motion; the replay control returns
 * to the first part. While the slot is empty (sources: []) a brand gradient
 * fills the frame, with the usual mono slot label.
 */
export default function SolutionVideo({ content }: { content: SolutionVideoContent }) {
  const sectionRef = useRef<HTMLElement>(null)
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [bufferNext, setBufferNext] = useState(false)

  const { sources } = content
  const filled = sources.length > 0
  const next = filled ? (active + 1) % sources.length : 0

  // Nothing is fetched until the section is about to be seen.
  useEffect(() => {
    const node = sectionRef.current
    if (!node || !filled) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { rootMargin: '200px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [filled])

  // Drives playback whenever the active part changes, including the first one.
  useEffect(() => {
    if (!filled || reduce || !inView) return
    setBufferNext(false)
    const video = refs.current[active]
    if (!video) return
    video.currentTime = 0
    void video.play()
  }, [active, filled, reduce, inView])

  // Raising `preload` alone is not a reliable fetch trigger once an element has
  // settled on "none", so the hand-off target is loaded explicitly.
  useEffect(() => {
    if (!bufferNext || next === active) return
    refs.current[next]?.load()
  }, [bufferNext, next, active])

  const replay = () => {
    const current = refs.current[active]
    if (current) {
      current.pause()
      current.currentTime = 0
    }
    const first = refs.current[0]
    if (first) {
      first.currentTime = 0
      void first.play()
    }
    setActive(0)
  }

  return (
    <section
      ref={sectionRef}
      aria-label={content.alt}
      className="relative h-screen w-full overflow-hidden bg-navy"
    >
      {filled ? (
        <>
          {sources.map((src, index) => (
            <video
              key={src}
              ref={(el) => {
                refs.current[index] = el
              }}
              src={src}
              poster={index === 0 ? content.poster : undefined}
              aria-label={content.alt}
              aria-hidden={index !== active}
              muted
              playsInline
              // Off-screen: nothing. In view: the current part, plus the next
              // one once this one is half-way through so the hand-off does not
              // stall. The rest stay unfetched.
              preload={
                !inView
                  ? 'none'
                  : index === active || (index === next && bufferNext)
                    ? 'auto'
                    : 'none'
              }
              onTimeUpdate={
                index === active && !bufferNext
                  ? (e) => {
                      const v = e.currentTarget
                      if (v.duration && v.currentTime / v.duration > 0.5) {
                        setBufferNext(true)
                      }
                    }
                  : undefined
              }
              onEnded={() => setActive((index + 1) % sources.length)}
              className={`absolute inset-0 h-full w-full object-cover ${
                index === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <button
            type="button"
            onClick={replay}
            aria-label="Lire la vidéo depuis le début"
            className="absolute bottom-6 right-6 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-navy shadow-card backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
        </>
      ) : (
        <div
          role="img"
          aria-label={content.alt}
          className="absolute inset-0 grid place-items-center"
        >
          {/* Brand fallback while the video slot is empty */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_80%,rgba(79,91,255,0.4),transparent_60%)]" />
          <span className="relative font-mono text-sm tracking-wide text-white/40">
            vidéo · 1920 × 1080
          </span>
        </div>
      )}
    </section>
  )
}

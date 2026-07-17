'use client'

import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { SolutionVideoContent } from '@/lib/content/solutions'

/**
 * Full-screen video section shown right after the solution hero. The video
 * plays muted in a loop (autoplay disabled under prefers-reduced-motion) with
 * a replay control. While the slot is empty (src: null) a brand gradient
 * fills the frame, with the usual mono slot label.
 */
export default function SolutionVideo({ content }: { content: SolutionVideoContent }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const filled = content.src !== null

  const replay = () => {
    const v = ref.current
    if (!v) return
    v.currentTime = 0
    void v.play()
  }

  return (
    <section aria-label={content.alt} className="relative h-screen w-full overflow-hidden bg-navy">
      {filled ? (
        <>
          <video
            ref={ref}
            src={content.src as string}
            poster={content.poster}
            aria-label={content.alt}
            muted
            loop
            playsInline
            autoPlay={!reduce}
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
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

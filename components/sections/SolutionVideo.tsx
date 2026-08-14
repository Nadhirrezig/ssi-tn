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
 * That deliberate laziness means the frame has nothing to show for a while, so a
 * curtain holds it until the active part can actually play, then parts like a
 * pair of doors. It closes again only on a real stall.
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
  /**
   * Whether the active part holds enough data to show a frame — drives the
   * curtain. Deliberately *not* reset on every hand-off: the next part is
   * already buffered by then, so closing the doors between parts would slam
   * them shut and reopen them three times a loop for nothing. A hand-off that
   * genuinely has no data raises `waiting` instead, which does close them.
   */
  const [ready, setReady] = useState(false)

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
      // The clip is 16:9 and `object-cover` fills whatever frame it is given, so
      // a full-screen section on a portrait phone crops it to a vertical sliver
      // magnified about four times. Below the laptop breakpoint the frame takes
      // the clip's own ratio instead and nothing is cropped; `svh` keeps the
      // full-screen frame from growing under the mobile browser chrome.
      className="relative aspect-video w-full overflow-hidden bg-navy lg:aspect-auto lg:h-svh"
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
              // Only the active part may open the curtain — a background part
              // finishing its buffer must not uncover an empty frame.
              // `playing` matters as much as `canplay`: a part preloaded while
              // it was still in the background has already fired `canplay` by
              // the time it becomes active, so `playing` is what reports it.
              onCanPlay={index === active ? () => setReady(true) : undefined}
              onPlaying={index === active ? () => setReady(true) : undefined}
              // A real stall closes the curtain rather than freezing the frame.
              onWaiting={index === active ? () => setReady(false) : undefined}
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
          {/* Loading curtain. The parts weigh tens of MB and carry no poster,
              so the frame would otherwise sit black from the moment the section
              scrolls in until the first bytes decode. When the part can play,
              the two halves part like doors instead of fading — the reveal
              reads as intent rather than as an image that finally turned up.
              It covers the replay control too: there is nothing to replay yet. */}
          <div
            role="status"
            aria-hidden={ready || undefined}
            className={`absolute inset-0 z-20 ${ready ? 'pointer-events-none' : ''}`}
          >
            {/* The doors. Each carries its half of one continuous brand wash —
                the gradient is sized to the full frame and anchored to opposite
                edges — so closed they read as a single panel and only the seam
                gives them away.

                They travel on an ease-in-out: barely moving for the first
                fifth, which is the window the loader below fades out in. */}
            <div
              aria-hidden
              className={`absolute inset-y-0 left-0 w-1/2 border-r border-white/[0.06] bg-navy bg-[radial-gradient(circle_at_25%_80%,rgba(79,91,255,0.4),transparent_60%)] bg-[length:200%_100%] bg-left transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none ${
                ready ? '-translate-x-full' : 'translate-x-0'
              }`}
            />
            <div
              aria-hidden
              className={`absolute inset-y-0 right-0 w-1/2 bg-navy bg-[radial-gradient(circle_at_25%_80%,rgba(79,91,255,0.4),transparent_60%)] bg-[length:200%_100%] bg-right transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none ${
                ready ? 'translate-x-full' : 'translate-x-0'
              }`}
            />

            {/* Loader — clears well before the doors have travelled far enough
                to expose it, so it is never seen floating over the video. */}
            <div
              aria-hidden
              className={`absolute inset-0 grid place-items-center transition-opacity duration-200 ${
                ready ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="flex flex-col items-center gap-5">
                {/* The stage is deliberately small — it clips the dot's entry
                    and its exit through the floor. */}
                <div className="relative h-24 w-24 overflow-hidden">
                  <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  <span className="absolute bottom-0 left-1/2 -ml-[7px] h-3.5 w-3.5 origin-bottom animate-bounce-drop rounded-full bg-white shadow-[0_0_24px_4px_rgba(79,91,255,0.55)] motion-reduce:animate-none" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={replay}
            aria-label="Lire la vidéo depuis le début"
            className="absolute bottom-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-navy shadow-card backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
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

'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    // Passive: the handler never calls preventDefault, and a non-passive scroll
    // listener makes the browser wait on it before compositing each frame.
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduce ? undefined : { y: -2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
          aria-label="Revenir en haut"
          className="fixed bottom-7 right-7 z-40 grid h-12 w-12 place-items-center rounded-xl bg-primary text-white shadow-float transition-colors hover:bg-primary-700"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="m6 15 6-6 6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Quiet, on-scroll reveal: fade + small upward translate, fires once.
 * Easing is ease-out-quart (soft landing). Honours prefers-reduced-motion
 * by rendering the content immediately with no transform.
 */
const EASE = [0.22, 1, 0.36, 1] as const

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger helper — delay the reveal (seconds). */
  delay?: number
  /** Vertical travel in px. */
  y?: number
  /** Animation duration (seconds). */
  duration?: number
}

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  duration = 0.6,
}: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

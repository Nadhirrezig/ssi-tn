'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * false during server rendering and hydration, true afterwards. Lets a
 * component read browser-only state (localStorage) without a hydration
 * mismatch and without setting state inside an effect.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

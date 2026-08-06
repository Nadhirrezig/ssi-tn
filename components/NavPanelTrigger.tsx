'use client'

import type { ReactNode } from 'react'
import { NavPanelId, openNavPanel } from '@/lib/nav'

/**
 * A call to action that opens one of the header's mega panels instead of
 * navigating — for destinations the site does not have a page for yet.
 *
 * A button rather than a link: it opens a menu in place, so there is no URL to
 * copy, open in a new tab, or hand to a crawler.
 */
export default function NavPanelTrigger({
  panel,
  className,
  children,
}: {
  panel: NavPanelId
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => openNavPanel(panel)}
      aria-haspopup="true"
      className={className}
    >
      {children}
    </button>
  )
}

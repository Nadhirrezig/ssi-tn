/**
 * Opening a header mega panel from elsewhere on the page.
 *
 * The header owns which panel is open — local state inside a client component
 * that also drives its own hover and keyboard behaviour. A CTA further down the
 * page asks for a panel by dispatching an event rather than lifting that state
 * into a context for the sake of one button.
 */

/** The nav items that actually carry a panel (see `NAV` in Header). */
export type NavPanelId = 'solutions' | 'realisations'

export const OPEN_PANEL_EVENT = 'ssi:open-nav-panel'

export function openNavPanel(panel: NavPanelId) {
  window.dispatchEvent(new CustomEvent<NavPanelId>(OPEN_PANEL_EVENT, { detail: panel }))
}

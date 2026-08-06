/**
 * Cookie consent state.
 *
 * The visitor's answer is itself stored in a first-party cookie: it has to
 * outlive the tab, and — unlike localStorage — it is readable server-side if a
 * future feature has to know the answer before rendering. Nothing else is ever
 * written unless the answer is `accepted`.
 */

export type Consent = 'accepted' | 'rejected'

export const CONSENT_COOKIE = 'ssi_cookie_consent'

/** Six months, then the question is asked again. Mirrors the policy page. */
const MAX_AGE = 60 * 60 * 24 * 182

/** Dispatched by the footer and the policy page to reopen the banner. */
export const PREFERENCES_EVENT = 'ssi:cookie-preferences'

/** Browser only — `null` means the visitor has not answered yet. */
export function readConsent(): Consent | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=(accepted|rejected)`)
  )
  return (match?.[1] as Consent) ?? null
}

export function writeConsent(value: Consent) {
  const secure = location.protocol === 'https:' ? '; secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${MAX_AGE}; samesite=lax${secure}`
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(PREFERENCES_EVENT))
}

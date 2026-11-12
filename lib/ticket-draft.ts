/**
 * The ticket text a visitor is writing, kept in the browser so it survives a
 * detour: logging in, resetting a password, a closed tab. Browser-only.
 *
 * It expires after 24 hours and is cleared on submit and on sign-out, so a
 * request typed on a shared computer does not linger for the next person.
 * Every access is wrapped: storage can be disabled or full.
 */

const KEY = 'ssi:ticket-draft'
const TTL_MS = 24 * 60 * 60 * 1000

export function saveDraft(message: string): void {
  try {
    if (!message.trim()) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, JSON.stringify({ message, savedAt: Date.now() }))
  } catch {
    // Not fatal: the text is still in the textarea.
  }
}

export function loadDraft(): string {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return ''
    const draft = JSON.parse(raw) as { message?: unknown; savedAt?: unknown }
    if (
      typeof draft.message !== 'string' ||
      typeof draft.savedAt !== 'number' ||
      Date.now() - draft.savedAt > TTL_MS
    ) {
      localStorage.removeItem(KEY)
      return ''
    }
    return draft.message
  } catch {
    return ''
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing to clear.
  }
}

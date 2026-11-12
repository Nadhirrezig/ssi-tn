/**
 * Helpers shared by the auth forms (client) and pages (server). No server-only
 * imports here.
 */

/** Where a signed-in client lands by default. */
export const CLIENT_HOME = '/espace-client'

export const NEW_TICKET_PATH = '/espace-client/tickets/nouveau'

/**
 * Where an email-verification link leads. /connexion forwards a signed-in
 * visitor to `next` (the dashboard, with a welcome banner) and shows a clear
 * message instead when the link has expired.
 */
export const VERIFY_CALLBACK_URL = `/connexion?next=${encodeURIComponent(`${CLIENT_HOME}?bienvenue=1`)}`

/**
 * Better Auth error codes → French messages. Anything unmapped falls back to a
 * generic line rather than leaking an English library message into the UI.
 */
const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Adresse e-mail ou mot de passe incorrect.',
  INVALID_EMAIL: 'Cette adresse e-mail n’est pas valide.',
  INVALID_PASSWORD: 'Mot de passe incorrect.',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères.',
  PASSWORD_TOO_LONG: 'Le mot de passe est trop long (128 caractères maximum).',
  EMAIL_NOT_VERIFIED:
    'Votre adresse e-mail n’est pas encore confirmée. Nous venons de vous renvoyer un lien de confirmation.',
  INVALID_TOKEN: 'Ce lien n’est plus valide. Demandez-en un nouveau.',
  TOKEN_EXPIRED: 'Ce lien a expiré. Demandez-en un nouveau.',
  USER_ALREADY_EXISTS: 'Un compte existe déjà pour cette adresse e-mail.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Un compte existe déjà pour cette adresse e-mail.',
}

export function authErrorMessage(error: { code?: string; status?: number } | null | undefined): string {
  if (error?.status === 429) {
    return 'Trop de tentatives. Patientez quelques instants avant de réessayer.'
  }
  return (error?.code && MESSAGES[error.code]) || 'Une erreur est survenue. Réessayez dans un instant.'
}

/**
 * Accepts a post-login destination only if it is a path on this site.
 * "//evil.com" and "/\evil.com" are protocol-relative to browsers, so they are
 * rejected along with absolute URLs — otherwise ?next= is an open redirect.
 */
export function safeRedirectPath(value: string | string[] | undefined): string {
  const path = Array.isArray(value) ? value[0] : value
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) {
    return CLIENT_HOME
  }
  return path
}

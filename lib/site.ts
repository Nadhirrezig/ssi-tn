/**
 * Canonical origin of the deployed site.
 *
 * The metadata, the sitemap, robots.txt and llms.txt must all name the same
 * origin — a search engine reads a mismatch as two different sites and splits
 * the ranking signals between them. Set NEXT_PUBLIC_SITE_URL per environment
 * (no trailing slash); the fallback is the production domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ssi-tn.com'
).replace(/\/$/, '')

export const SITE_NAME = 'SSI — Sécurité & Solutions Informatiques'

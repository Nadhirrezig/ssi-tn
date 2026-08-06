import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Served at /robots.txt.
 *
 * One rule for every crawler: per-bot blocks that repeat the wildcard rule
 * verbatim only add ways for the two to drift apart. /api/r2 is the image proxy
 * — the pictures it returns are already indexable through the pages that embed
 * them, so crawling the proxy directly costs bandwidth and indexes nothing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

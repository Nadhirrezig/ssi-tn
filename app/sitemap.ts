import type { MetadataRoute } from 'next'
import { solutions } from '@/lib/content/solutions'
import { SITE_URL } from '@/lib/site'

/**
 * Served at /sitemap.xml as a real XML document (Content-Type
 * `application/xml`) — Next serialises this list itself, so there is no
 * hand-written markup to get wrong.
 *
 * Every route the site exposes belongs here; a page missing from the sitemap is
 * a page Google discovers late, or not at all. Solution pages are read from the
 * same registry that generates them, so adding one to the registry adds it here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      // No trailing slash — matches the canonical Next emits for the homepage.
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...solutions.map((solution) => ({
      url: `${SITE_URL}/solution/${solution.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]
}

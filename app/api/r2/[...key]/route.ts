import { presignR2GetUrl } from "@/lib/r2"

/**
 * Read-through proxy for the solution imagery in the private R2 bucket.
 *
 * /api/r2/pos-solution/foo.webp streams the object of the same key. The bucket
 * is not publicly reachable, so this route signs the upstream request instead of
 * exposing credentials or making the bucket public.
 *
 * Because the URL is same-origin, next/image optimises these sources as if they
 * were local files — no `images.remotePatterns` entry is needed.
 */

// node:crypto is used for SigV4 signing.
export const runtime = "nodejs"

/** The bucket is not a general file host — only the solution imagery is served. */
const ALLOWED_PREFIX = "pos-solution/"
const ALLOWED_EXTENSION = /\.(?:jpe?g|png|webp|avif|gif)$/i

/** Objects are content-addressed by name and replaced rather than edited. */
const CACHE_CONTROL = "public, max-age=31536000, immutable"

/**
 * A solution page asks for its whole gallery at once — the carousel mosaic plus
 * the showcase grid in one burst — and R2 drops a couple of those connections
 * under that load. The
 * failure is transient and per-connection, so a retry gets the object; without
 * one the fetch rejects, the handler throws, and the browser sees a 500 for an
 * image that is present in the bucket.
 *
 * Retries stay within the presigned URL's own expiry window, so the same URL
 * can safely be reused for each attempt.
 */
const UPSTREAM_ATTEMPTS = 3

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: unknown

  for (let attempt = 0; attempt < UPSTREAM_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, { cache: "no-store" })
      // 404 and other 4xx are real answers — only server-side faults are worth
      // another attempt.
      if (response.status < 500) return response
      lastError = new Error(`upstream responded ${response.status}`)
    } catch (error) {
      lastError = error
    }

    if (attempt < UPSTREAM_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, 150 * 2 ** attempt))
    }
  }

  throw lastError
}

export async function GET(
  _request: Request,
  { params }: { params: { key: string[] } }
) {
  const objectKey = params.key.join("/")

  if (
    !objectKey.startsWith(ALLOWED_PREFIX) ||
    objectKey.includes("..") ||
    !ALLOWED_EXTENSION.test(objectKey)
  ) {
    return new Response("Not found", { status: 404 })
  }

  let signedUrl: string
  try {
    signedUrl = presignR2GetUrl(objectKey)
  } catch (error) {
    console.error("[r2] cannot sign request:", error)
    return new Response("Image storage is not configured", { status: 500 })
  }

  let upstream: Response
  try {
    upstream = await fetchWithRetry(signedUrl)
  } catch (error) {
    console.error(`[r2] upstream unreachable for ${objectKey}:`, error)
    return new Response("Upstream unavailable", { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    // 404 is expected for assets that haven't been uploaded yet; anything else
    // is an upstream problem worth distinguishing in logs.
    if (upstream.status !== 404) {
      console.error(`[r2] upstream ${upstream.status} for ${objectKey}`)
    }
    return new Response("Not found", { status: upstream.status === 404 ? 404 : 502 })
  }

  const headers = new Headers({
    "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
    "Cache-Control": CACHE_CONTROL,
  })
  const contentLength = upstream.headers.get("content-length")
  if (contentLength) headers.set("Content-Length", contentLength)
  const etag = upstream.headers.get("etag")
  if (etag) headers.set("ETag", etag)

  return new Response(upstream.body, { status: 200, headers })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // WebP only, on purpose. AVIF compresses the photography a little further,
    // but encoding it costs ~16x the CPU of WebP for ~4% fewer bytes on these
    // sources — measured over the ten images of a solution page, sharp
    // installed: 9.4s of encoding for AVIF against 0.57s for WebP. The optimizer
    // encodes on the first request, so that cost lands on a real visitor.
    formats: ['image/webp'],

    // The default is 60 seconds, which is what made the "Next caches this for
    // me" assumption fail here: every optimized image went stale a minute after
    // it was built and got re-encoded on the next request. The sources live in
    // /public and only ever change with a deploy, so hold them for 31 days —
    // a deploy starts from an empty cache anyway.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
}

module.exports = nextConfig

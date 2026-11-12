import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // The photography ships as large JPEG/PNG; AVIF roughly halves those again
    // versus WebP, which stays as the fallback.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig

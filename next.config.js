/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The photography ships as large JPEG/PNG; AVIF roughly halves those again
    // versus WebP, which stays as the fallback.
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig

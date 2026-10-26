import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'armelleboussidan.com',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent*.cdninstagram.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/research',
        destination: '/consulting/publications',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/research',
        destination: '/:locale/consulting/publications',
        permanent: true,
      },
      // Series slug renamed 2025 -> 2025-2026 (Oct 2026); keep old links working.
      {
        source: '/art/paintings/2025/:path*',
        destination: '/art/paintings/2025-2026/:path*',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2025/:path*',
        destination: '/:locale/art/paintings/2025-2026/:path*',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)

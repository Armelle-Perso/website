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
    ]
  },
}

export default withNextIntl(nextConfig)

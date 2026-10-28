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
      // Short links to the Creative path page, for Instagram captions (Oct 2026).
      // Not permanent, so they can point elsewhere later.
      { source: '/path', destination: '/art/paintings/creative-path', permanent: false },
      { source: '/parcours', destination: '/fr/art/paintings/creative-path', permanent: false },
      { source: '/camino', destination: '/es/art/paintings/creative-path', permanent: false },
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
      // 2012-2014 split (Oct 2026): the 2012-2013 works first, then the rest
      // of the old series goes to 2014.
      {
        source: '/art/paintings/2012-2014/:slug(devil-s-dare|freedom-of-speech|innocence|ishtar|primordia|profil|signs|terra|terre-d-eau|you-can-fly)',
        destination: '/art/paintings/2012-2013/:slug',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2012-2014/:slug(devil-s-dare|freedom-of-speech|innocence|ishtar|primordia|profil|signs|terra|terre-d-eau|you-can-fly)',
        destination: '/:locale/art/paintings/2012-2013/:slug',
        permanent: true,
      },
      {
        source: '/art/paintings/2012-2014/:path*',
        destination: '/art/paintings/2014/:path*',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2012-2014/:path*',
        destination: '/:locale/art/paintings/2014/:path*',
        permanent: true,
      },
      // 2015-2016 split in two (Oct 2026): these works moved to Morphogenèse;
      // the rest stays at 2015-2016, now titled Émanation.
      {
        source: '/art/paintings/:old(2015-2016|2015-2017)/:artwork(experiment-on-dynamic-forms|back-to-basics|second-experiment-on-dynamic-forms|archaic-jolt|auto-emergence|timeless-inner-garden|mother-of-the-universe|triptych-order-and-disorder-in-chaos|third-eye-opening|spirit-dimension|natem)',
        destination: '/art/paintings/morphogenese-2015-2016/:artwork',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/:old(2015-2016|2015-2017)/:artwork(experiment-on-dynamic-forms|back-to-basics|second-experiment-on-dynamic-forms|archaic-jolt|auto-emergence|timeless-inner-garden|mother-of-the-universe|triptych-order-and-disorder-in-chaos|third-eye-opening|spirit-dimension|natem)',
        destination: '/:locale/art/paintings/morphogenese-2015-2016/:artwork',
        permanent: true,
      },
      // Raag Bihag moved from 2015-2017 to 2018-2019 (Oct 2026); before the
      // series rename below so it wins.
      {
        source: '/art/paintings/2015-2017/raag-bihag-album-cover',
        destination: '/art/paintings/2018-2019/raag-bihag-album-cover',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2015-2017/raag-bihag-album-cover',
        destination: '/:locale/art/paintings/2018-2019/raag-bihag-album-cover',
        permanent: true,
      },
      // Series slug renamed 2015-2017 -> 2015-2016 (Oct 2026)
      {
        source: '/art/paintings/2015-2017/:path*',
        destination: '/art/paintings/2015-2016/:path*',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2015-2017/:path*',
        destination: '/:locale/art/paintings/2015-2016/:path*',
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

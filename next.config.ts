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
      // Old address still known to Google (Search Console 404, Nov 2026).
      { source: '/art/collectives-studios', destination: '/art/collectives', permanent: true },
      { source: '/:locale(fr|es)/art/collectives-studios', destination: '/:locale/art/collectives', permanent: true },
      // Short links to the Creative path page, for Instagram captions (Oct 2026).
      // Not permanent, so they can point elsewhere later.
      // Nov 2026: these three pages moved from /art/paintings/... to /art/... (old links, Google, printed QR codes keep working)
      { source: '/art/paintings/creative-path', destination: '/art/creative-path', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/creative-path', destination: '/:locale/art/creative-path', permanent: true },
      { source: '/art/paintings/available', destination: '/art/available', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/available', destination: '/:locale/art/available', permanent: true },
      { source: '/art/paintings/people', destination: '/art/in-homes', permanent: true },
      { source: '/shop', destination: '/art/shop', permanent: true },
      { source: '/:locale(en|fr|es)/shop', destination: '/:locale/art/shop', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/people', destination: '/:locale/art/in-homes', permanent: true },
      // English shortcuts go through /en/ so French- or Spanish-speaking browsers are not switched to their language
      { source: '/path', destination: '/en/art/creative-path', permanent: false },
      { source: '/parcours', destination: '/fr/art/creative-path', permanent: false },
      { source: '/camino', destination: '/es/art/creative-path', permanent: false },
      // Same links with a trailing full stop, as when pasted at the end of a sentence
      // (a visitor hit /path. in Nov 2026).
      { source: '/path.', destination: '/en/art/creative-path', permanent: false },
      { source: '/parcours.', destination: '/fr/art/creative-path', permanent: false },
      { source: '/camino.', destination: '/es/art/creative-path', permanent: false },
      // Short links to the Serotiny series (2025-2026), for the Nov 2026 Instagram post
      { source: '/serotiny', destination: '/en/art/paintings/serotiny-2025-2026', permanent: false },
      { source: '/serotinie', destination: '/fr/art/paintings/serotiny-2025-2026', permanent: false },
      { source: '/serotinia', destination: '/es/art/paintings/serotiny-2025-2026', permanent: false },
      { source: '/serotiny.', destination: '/en/art/paintings/serotiny-2025-2026', permanent: false },
      { source: '/serotinie.', destination: '/fr/art/paintings/serotiny-2025-2026', permanent: false },
      { source: '/serotinia.', destination: '/es/art/paintings/serotiny-2025-2026', permanent: false },
      // Short link for the QR code on the Semillas de luz flyer (Batx, Dec 2026): Spanish page by default
      { source: '/semillas', destination: '/es/art/exhibitions/semillas-de-luz', permanent: false },
      // The jewellery page is no longer linked (Nov 2026); old links land on Art
      { source: '/art/jewelry', destination: '/art', permanent: true },
      { source: '/:locale(en|fr|es)/art/jewelry', destination: '/:locale/art', permanent: true },
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
        destination: '/art/paintings/axis-mundi-2012-2013/:slug',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2012-2014/:slug(devil-s-dare|freedom-of-speech|innocence|ishtar|primordia|profil|signs|terra|terre-d-eau|you-can-fly)',
        destination: '/:locale/art/paintings/axis-mundi-2012-2013/:slug',
        permanent: true,
      },
      {
        source: '/art/paintings/2012-2014/:path*',
        destination: '/art/paintings/nebula-2014/:path*',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2012-2014/:path*',
        destination: '/:locale/art/paintings/nebula-2014/:path*',
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
        destination: '/art/paintings/hidrocoria-2018-2019/raag-bihag-album-cover',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2015-2017/raag-bihag-album-cover',
        destination: '/:locale/art/paintings/hidrocoria-2018-2019/raag-bihag-album-cover',
        permanent: true,
      },
      // Series slug renamed 2015-2017 -> 2015-2016 (Oct 2026)
      {
        source: '/art/paintings/2015-2017/:path*',
        destination: '/art/paintings/emanation-2015-2016/:path*',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2015-2017/:path*',
        destination: '/:locale/art/paintings/emanation-2015-2016/:path*',
        permanent: true,
      },
      // Series slug renamed 2025 -> 2025-2026 (Oct 2026); keep old links working.
      {
        source: '/art/paintings/2025/:path*',
        destination: '/art/paintings/serotiny-2025-2026/:path*',
        permanent: true,
      },
      {
        source: '/:locale(en|fr|es)/art/paintings/2025/:path*',
        destination: '/:locale/art/paintings/serotiny-2025-2026/:path*',
        permanent: true,
      },
      // Series slugs now carry the series name, like the newer ones (17 Nov 2026):
      // 2011 -> prakriti-2011, 2012-2013 -> axis-mundi-2012-2013, 2014 -> nebula-2014,
      // 2015-2016 -> emanation-2015-2016, 2018-2019 -> hidrocoria-2018-2019,
      // 2022-2023 -> diffraction-2022-2023, 2025-2026 -> serotiny-2025-2026.
      { source: '/art/paintings/2011/:path*', destination: '/art/paintings/prakriti-2011/:path*', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/2011/:path*', destination: '/:locale/art/paintings/prakriti-2011/:path*', permanent: true },
      { source: '/art/paintings/2012-2013/:path*', destination: '/art/paintings/axis-mundi-2012-2013/:path*', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/2012-2013/:path*', destination: '/:locale/art/paintings/axis-mundi-2012-2013/:path*', permanent: true },
      { source: '/art/paintings/2014/:path*', destination: '/art/paintings/nebula-2014/:path*', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/2014/:path*', destination: '/:locale/art/paintings/nebula-2014/:path*', permanent: true },
      { source: '/art/paintings/2015-2016/:path*', destination: '/art/paintings/emanation-2015-2016/:path*', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/2015-2016/:path*', destination: '/:locale/art/paintings/emanation-2015-2016/:path*', permanent: true },
      { source: '/art/paintings/2018-2019/:path*', destination: '/art/paintings/hidrocoria-2018-2019/:path*', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/2018-2019/:path*', destination: '/:locale/art/paintings/hidrocoria-2018-2019/:path*', permanent: true },
      { source: '/art/paintings/2022-2023/:path*', destination: '/art/paintings/diffraction-2022-2023/:path*', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/2022-2023/:path*', destination: '/:locale/art/paintings/diffraction-2022-2023/:path*', permanent: true },
      { source: '/art/paintings/2025-2026/:path*', destination: '/art/paintings/serotiny-2025-2026/:path*', permanent: true },
      { source: '/:locale(en|fr|es)/art/paintings/2025-2026/:path*', destination: '/:locale/art/paintings/serotiny-2025-2026/:path*', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)

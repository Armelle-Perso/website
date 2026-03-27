import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { artworkBySlugQuery, paintingSeriesAllQuery, paintingSeriesBySlugQuery, availableNavQuery, allArtworkSlidesQuery } from '@/sanity/lib/queries'
import ArtworkNav from '@/components/ArtworkNav'
import FullscreenImage from '@/components/FullscreenImage'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const revalidate = 3600

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []
  try {
    const series = await safeFetch<any[]>(paintingSeriesAllQuery)
    if (!series) return []
    const params: { series: string; artwork: string }[] = []
    for (const s of series) {
      const full = await safeFetch<any>(paintingSeriesBySlugQuery, { slug: s.slug.current })
      for (const a of (full?.artworks || [])) {
        if (a.slug?.current) {
          params.push({ series: s.slug.current, artwork: a.slug.current })
        }
      }
    }
    return params
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; series: string; artwork: string }>
}): Promise<Metadata> {
  const { series: seriesSlug, artwork: artworkSlug } = await params
  const data = await safeFetch<any>(artworkBySlugQuery, { seriesSlug, artworkSlug })
  if (!data?.artwork) return { title: 'Artwork not found' }
  return {
    title: `${data.artwork.title} — ${data.title}`,
    description: [data.artwork.medium, !data.artwork.hideDimensions && data.artwork.dimensions, data.year].filter(Boolean).join(' · '),
  }
}

export default async function ArtworkPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; series: string; artwork: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const { locale, series: seriesSlug, artwork: artworkSlug } = await params
  const { from } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('artwork')
  const tNav = await getTranslations('nav')

  const data = await safeFetch<any>(artworkBySlugQuery, { seriesSlug, artworkSlug })

  if (!data?.artwork) notFound()

  const { artwork, title: seriesTitle, year: seriesYear, medium: seriesMedium, siblings } = data
  const medium = artwork.medium || seriesMedium

  // Build lightbox slides from ALL series for cross-series navigation
  const allSeries = await safeFetch<{ seriesSlug: string; items: { title: string; slug: { current: string }; image: any }[] }[]>(allArtworkSlidesQuery)
  const lightboxSlides: { src: string; alt: string }[] = []
  const lightboxHrefs: string[] = []
  let lightboxIndex = 0
  for (const s of (allSeries || [])) {
    for (const item of (s.items || [])) {
      lightboxSlides.push({ src: urlFor(item.image).url(), alt: item.title || '' })
      lightboxHrefs.push(`/art/paintings/${s.seriesSlug}/${item.slug.current}`)
      if (s.seriesSlug === seriesSlug && item.slug.current === artworkSlug) {
        lightboxIndex = lightboxSlides.length - 1
      }
    }
  }

  let prevHref: string | null = null
  let nextHref: string | null = null
  let prevTitle: string | null = null
  let nextTitle: string | null = null
  let navCount: { current: number; total: number } | null = null

  if (from === 'available') {
    // Navigate across all available artworks
    const navData = await safeFetch<any[]>(availableNavQuery)
    const flat: { title: string; seriesSlug: string; artworkSlug: string }[] = []
    for (const s of (navData || [])) {
      for (const item of (s.items || [])) {
        flat.push({ title: item.title, seriesSlug: s.slug.current, artworkSlug: item.slug.current })
      }
    }
    const idx = flat.findIndex(f => f.seriesSlug === seriesSlug && f.artworkSlug === artworkSlug)
    const prevItem = idx > 0 ? flat[idx - 1] : null
    const nextItem = idx < flat.length - 1 ? flat[idx + 1] : null
    prevHref = prevItem ? `/art/paintings/${prevItem.seriesSlug}/${prevItem.artworkSlug}?from=available` : null
    nextHref = nextItem ? `/art/paintings/${nextItem.seriesSlug}/${nextItem.artworkSlug}?from=available` : null
    prevTitle = prevItem?.title ?? null
    nextTitle = nextItem?.title ?? null
    navCount = idx >= 0 ? { current: idx + 1, total: flat.length } : null
  } else {
    // Navigate within series
    const siblingList: { title: string; slug: { current: string } }[] = siblings || []
    const currentIndex = siblingList.findIndex(s => s.slug?.current === artworkSlug)
    const prev = currentIndex > 0 ? siblingList[currentIndex - 1] : null
    const next = currentIndex < siblingList.length - 1 ? siblingList[currentIndex + 1] : null
    prevHref = prev ? `/art/paintings/${seriesSlug}/${prev.slug.current}` : null
    nextHref = next ? `/art/paintings/${seriesSlug}/${next.slug.current}` : null
    prevTitle = prev?.title ?? null
    nextTitle = next?.title ?? null
    navCount = currentIndex >= 0 ? { current: currentIndex + 1, total: siblingList.length } : null
  }

  return (
    <main className="min-h-screen">
      {/* Floating side navigation */}
      <ArtworkNav
        prevHref={prevHref}
        prevTitle={prevTitle}
        nextHref={nextHref}
        nextTitle={nextTitle}
      />

      {/* Breadcrumb + counter */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8 flex items-center justify-between gap-4">
        <nav className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-muted] flex items-center gap-3 min-w-0">
          <Link href="/art/paintings" className="hover:text-[--color-charcoal] transition-colors shrink-0">{tNav('paintings')}</Link>
          <span className="text-[--color-border]">/</span>
          <Link href={`/art/paintings/${seriesSlug}`} className="hover:text-[--color-charcoal] transition-colors truncate">{artwork.subseries ? `${seriesTitle} · ${artwork.subseries}` : seriesTitle}</Link>
          <span className="text-[--color-border] shrink-0">/</span>
          <span className="text-[--color-charcoal] truncate">{artwork.title}</span>
        </nav>
        {navCount && navCount.total > 1 && (
          <span className="text-[10px] font-sans text-[--color-border] tabular-nums shrink-0">
            {navCount.current} / {navCount.total}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Image */}
          <div className="bg-[--color-gold-light]">
            {artwork.image ? (
              <FullscreenImage slides={lightboxSlides} index={Math.max(0, lightboxIndex)} hrefs={lightboxHrefs}>
                <Image
                  src={urlFor(artwork.image).width(1400).url()}
                  alt={artwork.title || ''}
                  width={1400}
                  height={1100}
                  className="w-full h-auto object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </FullscreenImage>
            ) : (
              <div className="aspect-[4/3] flex items-center justify-center text-[--color-muted] font-serif text-2xl">
                {artwork.title}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-28">
            {seriesYear && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-6">
                {seriesYear}
              </p>
            )}

            <h1 className="font-serif text-4xl md:text-5xl font-light leading-[0.95] tracking-tight text-[--color-charcoal] mb-8">
              {artwork.title}
            </h1>

            <div className="w-8 h-px bg-[--color-gold] mb-8" />

            {/* Metadata */}
            <dl className="space-y-4 mb-10">
              {medium && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mb-1">{t('medium')}</dt>
                  <dd className="font-sans text-sm text-[--color-charcoal] font-light">{medium}</dd>
                </div>
              )}
              {artwork.dimensions && !artwork.hideDimensions && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mb-1">{t('dimensions')}</dt>
                  <dd className="font-sans text-sm text-[--color-charcoal] font-light">{artwork.dimensions}</dd>
                </div>
              )}
              {(artwork.year || seriesYear) && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mb-1">{t('year')}</dt>
                  <dd className="font-sans text-sm text-[--color-charcoal] font-light">{artwork.year || seriesYear}</dd>
                </div>
              )}
              {artwork.link && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mb-1">Listen</dt>
                  <dd>
                    <a href={artwork.link} target="_blank" rel="noopener noreferrer"
                      className="font-sans text-sm font-light text-[--color-gold] hover:text-[--color-charcoal] transition-colors duration-300">
                      {artwork.link.replace(/^https?:\/\//, '').replace(/\/$/, '')} →
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            {/* Availability */}
            <div className="border-t border-[--color-border] pt-8">
              {artwork.available === true ? (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] mb-5">
                    {t('available')}
                  </p>
                  <Link
                    href={`/contact?work=${encodeURIComponent(artwork.title)}&series=${encodeURIComponent(seriesTitle)}`}
                    className="inline-block text-[11px] uppercase tracking-[0.2em] font-sans text-[--color-charcoal] border-b border-[--color-charcoal] pb-0.5 hover:text-[--color-gold] hover:border-[--color-gold] transition-colors duration-300"
                  >
                    {t('inquireAbout')}
                  </Link>
                </div>
              ) : artwork.available === false ? (
                <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted]">
                  {t('notAvailable')}
                </p>
              ) : (
                <Link
                  href="/contact"
                  className="inline-block text-[11px] uppercase tracking-[0.2em] font-sans text-[--color-muted] border-b border-[--color-muted] pb-0.5 hover:text-[--color-charcoal] hover:border-[--color-charcoal] transition-colors duration-300"
                >
                  Inquire →
                </Link>
              )}
            </div>

            {/* Series context */}
            <div className="mt-10 pt-8 border-t border-[--color-border]">
              <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mb-3">{t('series')}</p>
              <Link
                href={`/art/paintings/${seriesSlug}`}
                className="font-serif text-lg font-light hover:text-[--color-muted] transition-colors duration-300"
              >
                {artwork.subseries ? `${seriesTitle} · ${artwork.subseries}` : seriesTitle}
              </Link>
              {seriesYear && (
                <span className="text-[--color-muted] font-sans text-xs ml-3">— {seriesYear}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: back link */}
      <div className="border-t border-[--color-border] max-w-7xl mx-auto px-6 py-12 pb-24 flex items-center justify-center">
        {from === 'available' ? (
          <Link
            href="/art/paintings/available"
            className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-muted] hover:text-[--color-charcoal] transition-colors duration-300"
          >
            {t('backToAvailable')}
          </Link>
        ) : (
          <Link
            href={`/art/paintings/${seriesSlug}`}
            className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-muted] hover:text-[--color-charcoal] transition-colors duration-300"
          >
            {t('allWorksIn', { series: seriesTitle })}
          </Link>
        )}
      </div>
    </main>
  )
}

import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor, imageDimensions } from '@/sanity/lib/image'
import { artworkBySlugQuery, paintingSeriesAllQuery, paintingSeriesBySlugQuery, availableNavQuery, allArtworkSlidesQuery, availableSlidesQuery } from '@/sanity/lib/queries'
import { ContextualArtworkNav, ContextualArtworkCounter, ContextualFullscreenImage, ContextualSwitch, type NavData, type CountData, type SlidesData } from '@/components/ArtworkContext'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cleanTitle } from '@/lib/title'

export const revalidate = 3600

// Works that carry a text from the 2014 Galerie Le point Fort monograph,
// keyed by "<series slug>/<artwork slug>" and mapping to a message key
const catalogueNotes: Record<string, string> = {
  '2012-2014/ishtar': 'note_ishtar',
}

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
    title: `${cleanTitle(data.artwork.title)} — ${data.title}`,
    description: [data.artwork.medium, !data.artwork.hideDimensions && data.artwork.dimensions, data.year].filter(Boolean).join(' · '),
  }
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ locale: string; series: string; artwork: string }>
}) {
  // No searchParams here: reading them would make every visit a fresh server
  // render. Both browsing contexts are built below and the client picks one.
  const { locale, series: seriesSlug, artwork: artworkSlug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('artwork')
  const tNav = await getTranslations('nav')

  const data = await safeFetch<any>(artworkBySlugQuery, { seriesSlug, artworkSlug })

  if (!data?.artwork) notFound()

  const { artwork, title: seriesTitle, year: seriesYear, medium: seriesMedium, siblings } = data
  const medium = artwork.medium || seriesMedium
  const imgDims = imageDimensions(artwork.image) || { width: 1400, height: 1100 }

  type SlideSeries = { seriesSlug: string; items: { title: string; slug: { current: string }; image: any }[] }[]
  const [allSlides, availableSlides, navData] = await Promise.all([
    safeFetch<SlideSeries>(allArtworkSlidesQuery),
    safeFetch<SlideSeries>(availableSlidesQuery),
    safeFetch<any[]>(availableNavQuery),
  ])

  // Lightbox slides. From the Available page, stay within the available works
  // only; otherwise browse across all series.
  function buildSlides(slideSeries: SlideSeries | null, fromAvailable: boolean): SlidesData {
    const suffix = fromAvailable ? '?from=available' : ''
    const slides: SlidesData['slides'] = []
    const hrefs: string[] = []
    let index = 0
    for (const s of (slideSeries || [])) {
      for (const item of (s.items || [])) {
        slides.push({ src: urlFor(item.image).url(), alt: cleanTitle(item.title) })
        hrefs.push(`/art/paintings/${s.seriesSlug}/${item.slug.current}${suffix}`)
        if (s.seriesSlug === seriesSlug && item.slug.current === artworkSlug) {
          index = slides.length - 1
        }
      }
    }
    // If the current work isn't in the available set (e.g. stale link), fall back
    // to showing just this image rather than opening on an unrelated one.
    if (fromAvailable && !hrefs.some(h => h.startsWith(`/art/paintings/${seriesSlug}/${artworkSlug}?`))) {
      if (!artwork.image) return { slides: [], hrefs: [], index: 0 }
      return {
        slides: [{ src: urlFor(artwork.image).url(), alt: cleanTitle(artwork.title) }],
        hrefs: [`/art/paintings/${seriesSlug}/${artworkSlug}?from=available`],
        index: 0,
      }
    }
    return { slides, hrefs, index: Math.max(0, index) }
  }

  // Navigate across all available artworks
  const flat: { title: string; seriesSlug: string; artworkSlug: string }[] = []
  for (const s of (navData || [])) {
    for (const item of (s.items || [])) {
      flat.push({ title: cleanTitle(item.title), seriesSlug: s.slug.current, artworkSlug: item.slug.current })
    }
  }
  const idx = flat.findIndex(f => f.seriesSlug === seriesSlug && f.artworkSlug === artworkSlug)
  const prevItem = idx > 0 ? flat[idx - 1] : null
  const nextItem = idx < flat.length - 1 ? flat[idx + 1] : null
  const availableNav: NavData = {
    prevHref: prevItem ? `/art/paintings/${prevItem.seriesSlug}/${prevItem.artworkSlug}?from=available` : null,
    nextHref: nextItem ? `/art/paintings/${nextItem.seriesSlug}/${nextItem.artworkSlug}?from=available` : null,
    prevTitle: cleanTitle(prevItem?.title) || null,
    nextTitle: cleanTitle(nextItem?.title) || null,
  }
  const availableCount: CountData | null = idx >= 0 ? { current: idx + 1, total: flat.length } : null

  // Navigate within the series, then straight on into the next one. The
  // global list is ordered series by series, so neighbours inside a series
  // are unchanged and only the boundaries now lead somewhere.
  const everyWork: { title: string; seriesSlug: string; artworkSlug: string }[] = []
  for (const s of (allSlides || [])) {
    for (const item of (s.items || [])) {
      everyWork.push({ title: item.title, seriesSlug: s.seriesSlug, artworkSlug: item.slug.current })
    }
  }
  const globalIndex = everyWork.findIndex(w => w.seriesSlug === seriesSlug && w.artworkSlug === artworkSlug)
  const prev = globalIndex > 0 ? everyWork[globalIndex - 1] : null
  const next = globalIndex >= 0 && globalIndex < everyWork.length - 1 ? everyWork[globalIndex + 1] : null
  const seriesNav: NavData = {
    prevHref: prev ? `/art/paintings/${prev.seriesSlug}/${prev.artworkSlug}` : null,
    nextHref: next ? `/art/paintings/${next.seriesSlug}/${next.artworkSlug}` : null,
    prevTitle: cleanTitle(prev?.title) || null,
    nextTitle: cleanTitle(next?.title) || null,
  }

  // The counter still reports the position inside this series
  const siblingList: { title: string; slug: { current: string } }[] = siblings || []
  const currentIndex = siblingList.findIndex(s => s.slug?.current === artworkSlug)
  const seriesCount: CountData | null = currentIndex >= 0 ? { current: currentIndex + 1, total: siblingList.length } : null

  const noteKey = catalogueNotes[`${seriesSlug}/${artworkSlug}`]
  const catalogueNote = noteKey ? t(noteKey).split('\n\n') : null

  return (
    <main className="min-h-screen">
      {/* Floating side navigation */}
      <ContextualArtworkNav series={seriesNav} available={availableNav} />

      {/* Breadcrumb + counter */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8 flex items-center justify-between gap-4">
        <nav className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-muted] flex items-center gap-3 min-w-0">
          <Link href="/art/paintings" className="hover:text-[--color-charcoal] transition-colors shrink-0">{tNav('paintings')}</Link>
          <span className="text-[--color-border]">/</span>
          <Link href={`/art/paintings/${seriesSlug}`} className="hover:text-[--color-charcoal] transition-colors truncate">{artwork.subseries ? `${seriesTitle} · ${artwork.subseries}` : seriesTitle}</Link>
          <span className="text-[--color-border] shrink-0">/</span>
          <span className="text-[--color-charcoal] truncate">{cleanTitle(artwork.title)}</span>
        </nav>
        <ContextualArtworkCounter series={seriesCount} available={availableCount} />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Image */}
          <div className="flex justify-center">
            {artwork.image ? (
              <ContextualFullscreenImage series={buildSlides(allSlides, false)} available={buildSlides(availableSlides, true)}>
                <Image
                  src={urlFor(artwork.image).width(1400).url()}
                  alt={cleanTitle(artwork.title)}
                  width={imgDims.width}
                  height={imgDims.height}
                  className="w-auto max-w-full max-h-[85vh] bg-[--color-gold-light]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </ContextualFullscreenImage>
            ) : (
              <div className="aspect-[4/3] flex items-center justify-center text-[--color-muted] font-serif text-2xl">
                {cleanTitle(artwork.title)}
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
              {cleanTitle(artwork.title)}
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
                    href={`/contact?work=${encodeURIComponent(cleanTitle(artwork.title))}&series=${encodeURIComponent(seriesTitle)}`}
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

      {/* Catalogue text, for the works written up in the 2014 monograph */}
      {catalogueNote && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <figure className="max-w-2xl border-t border-[--color-border] pt-10">
            <figcaption className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-gold] mb-6">
              {t('catalogueLabel')}
            </figcaption>
            <blockquote className="space-y-4 font-serif text-base md:text-lg font-light leading-relaxed text-[--color-charcoal]">
              {catalogueNote.map((para, i) => <p key={i}>{para}</p>)}
            </blockquote>
            <p className="mt-6 text-xs font-sans font-light italic text-[--color-muted]">
              {t('catalogueSource')}
            </p>
            {t('catalogueTranslated') && (
              <p className="mt-1 text-xs font-sans font-light text-[--color-muted]">{t('catalogueTranslated')}</p>
            )}
          </figure>
        </div>
      )}

      {/* Bottom: back link */}
      <div className="border-t border-[--color-border] max-w-7xl mx-auto px-6 py-12 pb-24 flex items-center justify-center">
        <ContextualSwitch
          available={
            <Link
              href="/art/paintings/available"
              className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-muted] hover:text-[--color-charcoal] transition-colors duration-300"
            >
              {t('backToAvailable')}
            </Link>
          }
          series={
            <Link
              href={`/art/paintings/${seriesSlug}`}
              className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-muted] hover:text-[--color-charcoal] transition-colors duration-300"
            >
              {t('allWorksIn', { series: seriesTitle })}
            </Link>
          }
        />
      </div>
    </main>
  )
}

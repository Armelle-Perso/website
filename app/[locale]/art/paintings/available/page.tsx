import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { availablePaintingsQuery } from '@/sanity/lib/queries'
import PageHeader from '@/components/PageHeader'
import { getMaxDiagonal, getScale } from '@/lib/dimensions'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('available')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function AvailablePaintingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('available')

  const seriesWithAvailable = await safeFetch<any[]>(availablePaintingsQuery)

  // Flatten all available artworks into a single list, keeping series context
  const allAvailable: Array<{
    image: any
    title: string
    slug: { current: string }
    medium?: string
    dimensions?: string
    hideDimensions?: boolean
    featured?: boolean
    year?: string
    seriesTitle: string
    seriesSlug: string
    seriesYear?: string
    seriesMedium?: string
  }> = []

  for (const s of (seriesWithAvailable || [])) {
    for (const a of (s.availableArtworks || [])) {
      if (a.slug?.current) {
        allAvailable.push({
          ...a,
          seriesTitle: s.title,
          seriesSlug: s.slug.current,
          seriesYear: s.year,
          seriesMedium: s.medium,
        })
      }
    }
  }

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />

      <section className="max-w-7xl mx-auto px-6 pb-32">
        {allAvailable.length > 0 ? (
          <>
            <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-[--color-gold] font-light mb-16">
              {t('worksAvailable', { count: allAvailable.length })}
            </p>

            {(() => {
              const regular = allAvailable.filter(a => !a.featured)
              const featured = allAvailable.filter(a => a.featured)
              const maxDiag = getMaxDiagonal(regular.map(a => a.dimensions))

              // Place featured artwork in the middle
              const featIdx = allAvailable.findIndex(a => a.featured)
              const before = featIdx >= 0 ? allAvailable.slice(0, featIdx).filter(a => !a.featured) : regular
              const after = featIdx >= 0 ? allAvailable.slice(featIdx + 1).filter(a => !a.featured) : []

              const renderCard = (artwork: typeof allAvailable[number], i: number) => {
                const medium = artwork.medium || artwork.seriesMedium
                const href = `/art/paintings/${artwork.seriesSlug}/${artwork.slug.current}?from=available`
                const scale = getScale(artwork.dimensions, maxDiag)

                return (
                  <div key={`${artwork.seriesSlug}-${artwork.slug.current}`} className="break-inside-avoid">
                    <div style={scale !== null && scale < 1 ? { maxWidth: `${Math.round(scale * 100)}%`, margin: '0 auto' } : undefined}>
                    <Link href={href} className="group block">
                      <div className="relative overflow-hidden bg-[--color-gold-light]">
                        {artwork.image ? (
                          <Image
                            src={urlFor(artwork.image).width(900).url()}
                            alt={artwork.title}
                            width={900}
                            height={700}
                            className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="aspect-[4/3] flex items-center justify-center text-[--color-muted] font-serif text-lg">
                            {artwork.title}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[--color-charcoal]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[--color-gold] font-sans mb-2">
                            {t('availableInquire')}
                          </span>
                          <p className="font-serif text-white text-lg leading-tight">{artwork.title}</p>
                          {((!artwork.hideDimensions && artwork.dimensions) || medium) && (
                            <p className="text-white/60 text-xs font-sans font-light mt-1.5">
                              {[!artwork.hideDimensions && artwork.dimensions, medium].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="pt-4 pb-1">
                        <p className="font-serif text-base font-light group-hover:text-[--color-muted] transition-colors duration-300">
                          {artwork.title}
                        </p>
                        <div className="flex items-baseline justify-between mt-1 gap-4">
                          <p className="text-[10px] uppercase tracking-[0.15em] font-sans text-[--color-muted] font-light">
                            {artwork.seriesTitle}{artwork.seriesYear ? ` · ${artwork.seriesYear}` : ''}
                          </p>
                          {artwork.dimensions && !artwork.hideDimensions && (
                            <p className="text-[10px] font-sans text-[--color-muted] font-light shrink-0">
                              {artwork.dimensions}
                            </p>
                          )}
                        </div>
                        {medium && (
                          <p className="text-[10px] font-sans text-[--color-muted] font-light mt-0.5 italic">
                            {medium}
                          </p>
                        )}
                      </div>
                    </Link>
                    </div>
                  </div>
                )
              }

              const renderFeatured = (artwork: typeof allAvailable[number]) => {
                const medium = artwork.medium || artwork.seriesMedium
                const href = `/art/paintings/${artwork.seriesSlug}/${artwork.slug.current}?from=available`

                return (
                  <div key={`${artwork.seriesSlug}-${artwork.slug.current}`} className="my-12">
                    <Link href={href} className="group block">
                      <div className="relative overflow-hidden bg-[--color-gold-light] group-hover:opacity-95 transition-opacity duration-300">
                        {artwork.image ? (
                          <Image
                            src={urlFor(artwork.image).width(1400).url()}
                            alt={artwork.title}
                            width={1400}
                            height={700}
                            className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                            sizes="100vw"
                          />
                        ) : (
                          <div className="w-full aspect-[16/9] flex items-center justify-center text-[--color-muted] font-serif text-lg">
                            {artwork.title}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[--color-charcoal]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                          <span className="text-[11px] uppercase tracking-[0.2em] text-[--color-gold] font-sans mb-2">
                            {t('availableInquire')}
                          </span>
                          <p className="font-serif text-white text-2xl leading-tight">{artwork.title}</p>
                          {((!artwork.hideDimensions && artwork.dimensions) || medium) && (
                            <p className="text-white/60 text-sm font-sans font-light mt-2">
                              {[!artwork.hideDimensions && artwork.dimensions, medium].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="pt-4 pb-1">
                        <p className="font-serif text-lg font-light group-hover:text-[--color-muted] transition-colors duration-300">
                          {artwork.title}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.15em] font-sans text-[--color-muted] font-light mt-1">
                          {artwork.seriesTitle}{artwork.seriesYear ? ` · ${artwork.seriesYear}` : ''}
                        </p>
                      </div>
                    </Link>
                  </div>
                )
              }

              return (
                <>
                  {before.length > 0 && (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                      {before.map(renderCard)}
                    </div>
                  )}
                  {featured.map(renderFeatured)}
                  {after.length > 0 && (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                      {after.map(renderCard)}
                    </div>
                  )}
                </>
              )
            })()}

            {/* Closing CTA */}
            <div className="mt-24 border-t border-[--color-border] pt-16 max-w-xl">
              <p className="font-serif text-xl font-light mb-6">
                {t('interestedTitle')}
              </p>
              <p className="text-sm font-sans font-light text-[--color-muted] leading-relaxed mb-10">
                {t('interestedDesc')}
              </p>
              <Link
                href="/contact"
                className="text-[11px] uppercase tracking-[0.2em] font-sans text-[--color-charcoal] border-b border-[--color-charcoal] pb-0.5 hover:text-[--color-gold] hover:border-[--color-gold] transition-colors duration-300"
              >
                {t('getInTouch')}
              </Link>
            </div>
          </>
        ) : (
          <p className="text-[--color-muted] font-sans font-light text-center py-32">
            {t('noneAvailable')} <Link href="/contact" className="border-b border-[--color-border]">{t('noneAvailableLink')}</Link>.
          </p>
        )}
      </section>
    </>
  )
}

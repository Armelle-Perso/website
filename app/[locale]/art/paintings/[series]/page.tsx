import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { paintingSeriesBySlugQuery, paintingSeriesAllQuery } from '@/sanity/lib/queries'
import PageHeader from '@/components/PageHeader'
import { PortableText } from 'next-sanity'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { localizedField } from '@/sanity/lib/localize'
import { getMaxDiagonal, getScale } from '@/lib/dimensions'

export const revalidate = 3600

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []
  try {
    const series = await safeFetch<any[]>(paintingSeriesAllQuery)
    return series?.map((s: any) => ({ series: s.slug.current })) ?? []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; series: string }> }): Promise<Metadata> {
  const { series: slug } = await params
  const data = await safeFetch<any>(paintingSeriesBySlugQuery, { slug })
  if (!data) return { title: 'Series not found' }
  return {
    title: data.title,
    description: `Painting series: ${data.title}${data.year ? ` (${data.year})` : ''}`,
  }
}

export default async function PaintingSeriesPage({ params }: { params: Promise<{ locale: string; series: string }> }) {
  const { locale, series: slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('paintings')

  const data = await safeFetch<any>(paintingSeriesBySlugQuery, { slug })
  if (!data) notFound()

  const artworks = data.artworks || []
  const availableCount = artworks.filter((a: any) => a.available === true).length

  return (
    <>
      <PageHeader
        title={data.title}
        subtitle={`Art / Paintings${data.year ? ` / ${data.year}` : ''}`}
        description={data.medium || undefined}
      />

      {localizedField(data, 'description', locale) && (
        <div className="max-w-3xl mx-auto px-6 pb-12">
          <div className="text-[--color-muted] font-sans font-light text-sm leading-relaxed space-y-4 [&_p]:mb-0">
            <PortableText value={localizedField(data, 'description', locale)} />
          </div>
          {availableCount > 0 && (
            <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-[--color-gold] font-sans font-light">
              {t('worksAvailable', { count: availableCount })}
            </p>
          )}
        </div>
      )}

      <section className="max-w-7xl mx-auto px-6 pb-32">
        {artworks.length > 0 ? (
          (() => {
            // Split artworks into segments separated by featured pieces
            const regular = artworks.filter((a: any) => !a.featured)
            const featured = artworks.filter((a: any) => a.featured)
            const maxDiag = getMaxDiagonal(regular.map((a: any) => a.dimensions))

            // Find the index of the first featured artwork to split regular ones around it
            const featIdx = artworks.findIndex((a: any) => a.featured)
            const before = featIdx >= 0 ? artworks.slice(0, featIdx).filter((a: any) => !a.featured) : regular
            const after = featIdx >= 0 ? artworks.slice(featIdx + 1).filter((a: any) => !a.featured) : []

            const renderCard = (artwork: any, i: number) => {
              const hasSlug = artwork.slug?.current
              const href = hasSlug ? `/art/paintings/${slug}/${artwork.slug.current}` : undefined
              const scale = getScale(artwork.dimensions, maxDiag)

              const inner = (
                <div className="relative overflow-hidden bg-[--color-gold-light] group-hover:opacity-95 transition-opacity duration-300">
                  {artwork.image ? (
                    <Image
                      src={urlFor(artwork.image).width(900).url()}
                      alt={artwork.title || ''}
                      width={900}
                      height={700}
                      className="w-full h-auto max-h-[75vh] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] flex items-center justify-center text-[--color-muted] font-serif text-lg">
                      {artwork.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[--color-charcoal]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <p className="font-serif text-white text-lg leading-tight">{artwork.title}</p>
                    {((!artwork.hideDimensions && artwork.dimensions) || artwork.medium) && (
                      <p className="text-white/60 text-xs font-sans font-light mt-1.5">
                        {[!artwork.hideDimensions && artwork.dimensions, artwork.medium].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      {artwork.available === true ? (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[--color-gold] font-sans">{t('available')}</span>
                      ) : artwork.available === false ? (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans">{t('notAvailable')}</span>
                      ) : null}
                      {href && (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-sans">{t('view')}</span>
                      )}
                    </div>
                  </div>
                </div>
              )

              return (
                <div key={artwork._key || i} className="break-inside-avoid">
                  <div style={scale !== null && scale < 1 ? { maxWidth: `${Math.round(scale * 100)}%`, margin: '0 auto' } : undefined}>
                    {href ? (
                      <Link href={href} className="group block">{inner}</Link>
                    ) : (
                      <div className="group">{inner}</div>
                    )}
                  </div>
                </div>
              )
            }

            const renderFeatured = (artwork: any) => {
              const hasSlug = artwork.slug?.current
              const href = hasSlug ? `/art/paintings/${slug}/${artwork.slug.current}` : undefined

              const inner = (
                <div className="relative overflow-hidden bg-[--color-gold-light] group-hover:opacity-95 transition-opacity duration-300">
                  {artwork.image ? (
                    <Image
                      src={urlFor(artwork.image).width(1400).url()}
                      alt={artwork.title || ''}
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
                    <p className="font-serif text-white text-2xl leading-tight">{artwork.title}</p>
                    {((!artwork.hideDimensions && artwork.dimensions) || artwork.medium) && (
                      <p className="text-white/60 text-sm font-sans font-light mt-2">
                        {[!artwork.hideDimensions && artwork.dimensions, artwork.medium].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {artwork.available === true ? (
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[--color-gold] font-sans">{t('available')}</span>
                      ) : artwork.available === false ? (
                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-sans">{t('notAvailable')}</span>
                      ) : null}
                      {href && (
                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-sans">{t('view')}</span>
                      )}
                    </div>
                  </div>
                </div>
              )

              return (
                <div key={artwork._key} className="my-12">
                  {href ? (
                    <Link href={href} className="group block">{inner}</Link>
                  ) : (
                    <div className="group">{inner}</div>
                  )}
                </div>
              )
            }

            // Group regular artworks by subseries for section dividers
            const renderGrid = (items: any[]) => {
              const groups: { subseries: string | null; items: any[] }[] = []
              for (const item of items) {
                const sub = item.subseries || null
                const last = groups[groups.length - 1]
                if (last && last.subseries === sub) {
                  last.items.push(item)
                } else {
                  groups.push({ subseries: sub, items: [item] })
                }
              }
              return groups.map((group, gi) => (
                <div key={gi}>
                  {group.subseries && (
                    <div className="flex items-center gap-4 my-12">
                      <div className="flex-1 h-px bg-[--color-gold] opacity-30" />
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light shrink-0">
                        {group.subseries}
                      </p>
                      <div className="flex-1 h-px bg-[--color-gold] opacity-30" />
                    </div>
                  )}
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {group.items.map(renderCard)}
                  </div>
                </div>
              ))
            }

            return (
              <>
                {before.length > 0 && renderGrid(before)}
                {featured.map(renderFeatured)}
                {after.length > 0 && renderGrid(after)}
              </>
            )
          })()
        ) : (
          <p className="text-[--color-muted] font-sans font-light text-center py-32">{t('noArtworks')}</p>
        )}
      </section>

      {/* Behind the series — Lightcodes */}
      {slug === 'lightcodes-2021' && (
        <section className="border-t border-[--color-border] max-w-5xl mx-auto px-6 py-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            Behind the series
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 mb-16">
            <div className="space-y-5">
              <p className="font-sans font-light text-sm leading-relaxed text-[--color-charcoal]">
                The &lsquo;lightcodes&rsquo; series was born in Egypt in 2021, under the stars of the Sinai desert. In this place of constellations, coral, salt, sand, and pure silence, the patterns found their flow and opened the gate for 12 paintings, continued in high energy places, such as Giza and Luxor.
              </p>
              <p className="font-sans font-light text-sm leading-relaxed text-[--color-charcoal]">
                The codes rewire my own energy field as I bring them in, carrying information from other times and dimensions.
              </p>
            </div>
            <div>
              <Image
                src="/images/paintings/lightcodes/st-catherine.jpg"
                alt="Painting in St Catherine"
                width={500}
                height={375}
                className="w-full h-auto object-cover"
              />
              <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mt-3">Painting in St Catherine</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Image
                src="/images/paintings/lightcodes/pyramids.jpg"
                alt="Painting at the Pyramids of Giza"
                width={700}
                height={525}
                className="w-full h-full object-cover"
              />
              <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mt-3">Painting at the Pyramids of Giza</p>
            </div>
            <div>
              <Image
                src="/images/paintings/lightcodes/hanging-lafab.jpg"
                alt="Hanging at La Fab"
                width={700}
                height={525}
                className="w-full h-full object-cover"
              />
              <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mt-3">Hanging at La Fab</p>
            </div>
          </div>
        </section>
      )}

      {/* Behind the series — Transforma */}
      {slug === 'transforma-2020' && (
        <section className="border-t border-[--color-border] max-w-5xl mx-auto px-6 py-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            Behind the series
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16">
            <div className="space-y-5">
              <p className="font-sans font-light text-sm leading-relaxed text-[--color-charcoal]">
                The series of paintings &lsquo;Transforma&rsquo; came to being on my return from Peru, at the end of 2019, where I engaged in healing work with the plants and healers of the Amazon. The connection with the world of plants was a source of wisdom, beauty and love. With plants, we enter other worlds. The series is an invitation to enter these invisible worlds, brimming with life. We are nature, we are world makers. We paint life as we please. While the planet is losing a huge proportion of natural life, I felt called to paint a world filled with flowers and colours, full of energy and wisdom. A world of light that is always part of us yet invisible, both powerful and fragile, familiar and foreign.
              </p>
              <div className="pt-4 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted]">
                  Inaugurated on Thank You Plant Medicine Day, February 22, 2020
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted]">
                  Ceramiq, Orgiva — one year alongside ceramics by Vicente Monfort
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted]">
                  Church of San Rom&aacute;n, Sevilla — six months, 2021
                </p>
              </div>
            </div>
            <Image
              src="/images/paintings/transforma/exhibition.jpg"
              alt="Transforma exhibition at Ceramiq, Orgiva"
              width={500}
              height={375}
              className="w-full h-auto object-cover"
            />
          </div>
        </section>
      )}
    </>
  )
}

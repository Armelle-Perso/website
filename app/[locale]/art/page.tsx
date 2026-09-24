import { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { paintingSeriesAllQuery, collectivesQuery, exhibitionsQuery } from '@/sanity/lib/queries'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('art')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ArtPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('art')

  // Cover images pulled from the real content, so each card shows the work itself
  const [allSeries, collectives, exhibitions] = await Promise.all([
    safeFetch<any[]>(paintingSeriesAllQuery),
    safeFetch<any[]>(collectivesQuery),
    safeFetch<any[]>(exhibitionsQuery),
  ])

  const paintingsCover = (allSeries || []).find((s: any) => s.slug?.current !== 'people' && s.coverImage)?.coverImage ?? null
  // Collectives and exhibitions aren't in Sanity yet, so fall back to the photos
  // already used on those pages
  const collectivesCover = (collectives || []).find((c: any) => c.image)?.image ?? null
  const exhibitionsCover = (exhibitions || []).find((e: any) => e.image)?.image ?? null
  const collectivesFallback = '/images/collectives/m33-facade.jpg'
  const exhibitionsFallback = '/images/paintings/transforma/exhibition.jpg'

  const artSections: { labelKey: 'paintingsLabel' | 'collectivesLabel' | 'exhibitionsLabel'; href: string; descKey: 'paintingsDesc' | 'collectivesDesc' | 'exhibitionsDesc'; image: any; fallbackSrc: string; objectPosition?: string }[] = [
    { labelKey: 'paintingsLabel' as const, href: '/art/paintings', descKey: 'paintingsDesc' as const, image: paintingsCover, fallbackSrc: '/images/available-cover.jpg' },
    { labelKey: 'collectivesLabel' as const, href: '/art/collectives', descKey: 'collectivesDesc' as const, image: collectivesCover, fallbackSrc: collectivesFallback },
    { labelKey: 'exhibitionsLabel' as const, href: '/art/exhibitions', descKey: 'exhibitionsDesc' as const, image: exhibitionsCover, fallbackSrc: exhibitionsFallback, objectPosition: '32% center' },
  ]

  return (
    <>
      {/* Hero — photo + title side by side, fits one screen */}
      <section className="min-h-[calc(100svh-3.5rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <Image
              src="/images/armelle-paola-guigou.jpg"
              alt="Armelle Boussidan — Photo by Paola Guigou, 2014"
              width={900}
              height={1200}
              className="w-full h-auto max-h-[calc(100svh-7rem)] object-contain"
              priority
            />
            <p className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-muted] mt-3 text-right">
              Photo by <a href="https://www.paolaguigou.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[--color-charcoal] transition-colors duration-300">Paola Guigou</a>, 2014
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-muted] font-sans font-light mb-4">
              {t('subtitle')}
            </p>
            <h1 className="font-serif text-6xl md:text-8xl font-light leading-[0.9] tracking-tight text-[--color-charcoal] mb-6">
              {t('title')}
            </h1>
            <div className="w-8 h-px bg-[--color-gold] mb-6" />
            <p className="text-sm text-[--color-muted] font-sans font-light leading-relaxed max-w-md">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* The catalogue's two voices, paired so the monograph is credited once */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="w-8 h-px bg-[--color-gold] mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {([['quote', 'quoteAuthor'], ['quote2', 'quote2Author']] as const).map(([q, author]) => (
              <figure key={q}>
                <blockquote className="font-serif text-lg md:text-xl font-light italic leading-snug text-[--color-charcoal]">
                  {t(q)}
                </blockquote>
                <figcaption className="mt-4 text-[10px] uppercase tracking-[0.2em] font-sans font-light text-[--color-muted]">
                  {t(author)}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-10 text-xs font-sans font-light italic text-[--color-muted] leading-relaxed">
            {t('quotesSource')}
          </p>
        </div>
      </section>

      {/* Category cards */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {artSections.map((section) => (
            <Link key={section.href} href={section.href} className="group block">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2 className="font-serif text-xl lg:text-2xl font-light leading-tight text-[--color-charcoal] group-hover:text-[--color-muted] transition-colors duration-300">
                  {t(section.labelKey)}
                </h2>
                <span className="text-xs tracking-widest text-[--color-gold] transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </div>
              <div className="relative overflow-hidden bg-[--color-gold-light] aspect-square">
                {section.image || section.fallbackSrc ? (
                  <Image
                    src={section.image
                      ? urlFor(section.image).width(700).height(700).fit('crop').crop('center').url()
                      : section.fallbackSrc}
                    alt={t(section.labelKey)}
                    width={700}
                    height={700}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    style={section.objectPosition ? { objectPosition: section.objectPosition } : undefined}
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[--color-muted] font-serif text-2xl">
                    {t(section.labelKey)}
                  </div>
                )}
              </div>
              {t(section.descKey) && (
                <p className="pt-4 text-xs font-sans font-light text-[--color-muted] leading-relaxed">
                  {t(section.descKey)}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

    </>
  )
}

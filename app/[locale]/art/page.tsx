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
  const exhibitionsFallback = '/images/collectives/m33-inaug.jpg'

  const artSections = [
    { labelKey: 'paintingsLabel' as const, href: '/art/paintings', descKey: 'paintingsDesc' as const, image: paintingsCover, fallbackSrc: '/images/available-cover.jpg' },
    { labelKey: 'collectivesLabel' as const, href: '/art/collectives', descKey: 'collectivesDesc' as const, image: collectivesCover, fallbackSrc: collectivesFallback },
    { labelKey: 'exhibitionsLabel' as const, href: '/art/exhibitions', descKey: 'exhibitionsDesc' as const, image: exhibitionsCover, fallbackSrc: exhibitionsFallback },
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

      {/* Category cards */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
          {artSections.map((section) => (
            <Link key={section.href} href={section.href} className="group block">
              <div className="relative overflow-hidden bg-[--color-gold-light] aspect-[3/4]">
                {section.image || section.fallbackSrc ? (
                  <Image
                    src={section.image
                      ? urlFor(section.image).width(800).height(1067).fit('crop').crop('center').url()
                      : section.fallbackSrc}
                    alt={t(section.labelKey)}
                    width={800}
                    height={1067}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[--color-muted] font-serif text-2xl">
                    {t(section.labelKey)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[--color-charcoal]/85 via-[--color-charcoal]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                  <span className="block h-px w-8 bg-[--color-gold] mb-4 transition-all duration-500 group-hover:w-16" />
                  <h2 className="font-serif text-2xl lg:text-[1.75rem] font-light text-white leading-tight">
                    {t(section.labelKey)}
                  </h2>
                </div>
              </div>
              <div className="pt-5">
                {t(section.descKey) && (
                  <p className="text-sm text-[--color-muted] font-sans font-light leading-relaxed">
                    {t(section.descKey)}
                  </p>
                )}
                <span className="inline-block mt-4 text-xs tracking-widest text-[--color-gold] transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </>
  )
}

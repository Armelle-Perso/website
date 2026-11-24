import { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { paintingSeriesAllQuery, collectivesQuery, exhibitionsQuery } from '@/sanity/lib/queries'
import ArtWordCloud from '@/components/ArtWordCloud'
import ArtQuotes from '@/components/ArtQuotes'

export const revalidate = 86400

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
  const tNav = await getTranslations('nav')

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

  const artSections: { label: string; href: string; image: any; fallbackSrc: string; objectPosition?: string }[] = [
    { label: t('paintingsLabel'), href: '/art/paintings', image: paintingsCover, fallbackSrc: '/images/available-cover.jpg' },
    { label: tNav('creativePath'), href: '/art/creative-path', image: null, fallbackSrc: '/images/paintings/creative-path/performance-le-point-fort-2014-gesture.jpg', objectPosition: 'center 30%' },
    { label: t('collectivesLabel'), href: '/art/collectives', image: collectivesCover, fallbackSrc: collectivesFallback },
    { label: t('exhibitionsLabel'), href: '/art/exhibitions', image: exhibitionsCover, fallbackSrc: exhibitionsFallback, objectPosition: '32% center' },
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
            <div className="flex flex-col items-start gap-3 mt-8">
              {[
                { href: '/art/paintings', label: t('paintingsLabel') },
                { href: '/art/creative-path', label: tNav('creativePath') },
              ].map(l => (
                <Link key={l.href} href={l.href} className="group inline-flex items-baseline gap-3">
                  <span className="font-serif text-2xl font-light text-[--color-charcoal] group-hover:text-[--color-muted] transition-colors duration-300">
                    {l.label}
                  </span>
                  <span className="text-xs tracking-widest text-[--color-gold] transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Word cloud of her painting style (approach, gesture, pictorial language, colour, matter) */}
      <section id="style" className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-16">
        <ArtWordCloud locale={locale} />
      </section>

      {/* The catalogue's two voices, each filling the screen in turn while scrolling */}
      <ArtQuotes
        quotes={locale === 'en'
          // EN: first quote only, its source under Arthur's name (her choice, 24 Nov 2026)
          ? [{ text: t('quote'), author: t('quoteAuthor'), note: t('quotesSource') }]
          : [{ text: t('quote'), author: t('quoteAuthor') }, { text: t('quote2'), author: t('quote2Author') }]}
        source={locale === 'en' ? undefined : t('quotesSource')}
      />

      {/* Category cards */}
      <section id="sections" className="max-w-7xl mx-auto px-6 pb-32 scroll-mt-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-4xl mx-auto">
          {artSections.map((section) => (
            <Link key={section.href} href={section.href} className="group block">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2 className="font-serif text-lg font-light leading-tight whitespace-nowrap text-[--color-charcoal] group-hover:text-[--color-muted] transition-colors duration-300">
                  {section.label}
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
                    alt={section.label}
                    width={700}
                    height={700}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    style={section.objectPosition ? { objectPosition: section.objectPosition } : undefined}
                    sizes="(max-width: 1024px) 50vw, 220px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[--color-muted] font-serif text-2xl">
                    {section.label}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

    </>
  )
}

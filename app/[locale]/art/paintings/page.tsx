import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { paintingSeriesAllQuery } from '@/sanity/lib/queries'
import PageHeader from '@/components/PageHeader'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('paintings')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function PaintingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('paintings')

  const allSeries = await safeFetch<any[]>(paintingSeriesAllQuery)

  // Separate "People with their painting" — slug is "people"
  const peopleSeries = allSeries?.find((s: any) => s.slug?.current === 'people') ?? null
  const regularSeries = allSeries?.filter((s: any) => s.slug?.current !== 'people') ?? []

  const totalAvailable = regularSeries.reduce((sum: number, s: any) => sum + (s.availableCount || 0), 0)

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />
      <section className="max-w-7xl mx-auto px-6 py-20 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">

          {/* ── Available Works — pinned first ── */}
          {totalAvailable > 0 && (
            <Link href="/art/paintings/available" className="group flex flex-col items-center text-center">
              <div className="w-full aspect-square overflow-hidden rounded-full bg-[--color-gold-light] mb-6 relative">
                {/* Cover image from first available painting */}
                <Image
                  src="/images/available-cover.jpg"
                  alt={t('availableWorks')}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gold overlay with count */}
                <div className="absolute inset-0 rounded-full bg-[--color-charcoal]/40 group-hover:bg-[--color-charcoal]/50 transition-colors duration-500 flex flex-col items-center justify-center gap-1">
                  <p className="font-serif text-white text-3xl font-light leading-none">{totalAvailable}</p>
                  <p className="text-[9px] uppercase tracking-[0.25em] font-sans text-white/80 font-light">{t('originals')}</p>
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[--color-gold] font-sans font-light mb-2">
                {t('forSale')}
              </p>
              <h2 className="font-serif text-xl font-light group-hover:text-[--color-muted] transition-colors duration-300">
                {t('availableWorks')}
              </h2>
              <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] font-sans text-[--color-gold] font-light">
                {t('inquire')}
              </p>
            </Link>
          )}

          {/* ── Regular series ── */}
          {regularSeries.map((s: any) => (
            <Link
              key={s._id}
              href={`/art/paintings/${s.slug.current}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square overflow-hidden rounded-full bg-[--color-gold-light] mb-6">
                {s.coverImage ? (
                  <Image
                    src={urlFor(s.coverImage).width(500).height(500).fit('crop').crop('center').url()}
                    alt={s.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[--color-muted] font-serif text-xl">
                    {s.title}
                  </div>
                )}
              </div>
              {s.year && !/^\d{4}/.test(s.title) && (
                <p className="text-[10px] uppercase tracking-[0.25em] text-[--color-gold] font-sans font-light mb-2">
                  {s.year}
                </p>
              )}
              <h2 className="font-serif text-xl font-light group-hover:text-[--color-muted] transition-colors duration-300">
                {s.title}
              </h2>
            </Link>
          ))}

          {/* ── People with their painting — pinned last ── */}
          {peopleSeries && (
            <Link
              href={`/art/paintings/${peopleSeries.slug.current}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square overflow-hidden rounded-full bg-[--color-gold-light] mb-6">
                {peopleSeries.coverImage ? (
                  <Image
                    src={urlFor(peopleSeries.coverImage).width(500).height(500).url()}
                    alt={peopleSeries.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[--color-muted] font-serif text-base px-4 text-center">
                    {peopleSeries.title}
                  </div>
                )}
              </div>
              <h2 className="font-serif text-xl font-light group-hover:text-[--color-muted] transition-colors duration-300">
                {t('peopleSection')}
              </h2>
            </Link>
          )}

        </div>
      </section>
    </>
  )
}

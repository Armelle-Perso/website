import { Metadata } from 'next'
import { safeFetch } from '@/sanity/lib/client'
import { exhibitionsQuery } from '@/sanity/lib/queries'
import PageHeader from '@/components/PageHeader'
import { PortableText } from 'next-sanity'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const revalidate = 3600

// Tag corrections applied on top of Sanity data, keyed by exhibition _id
const typeOverrides: Record<string, string> = {
  q7MxOP673O523e3BZ9d37d: 'Residency', // Anankha (Sanity still says "Performance")
}

// Solo show at Galerie Le point Fort, 2014 — the one exhibition with a printed
// monograph, so the entry carries a quote from it and the full reference
const CATALOGUE_EXHIBITION_ID = 'q7MxOP673O523e3BZ9d2Ek'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('exhibitions')
  return { title: t('title'), description: t('description') }
}

export default async function ExhibitionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('exhibitions')

  const catalogue = {
    quote: t('catalogueQuote'),
    author: t('catalogueAuthor'),
    source: t('catalogueSource'),
    translated: t('catalogueTranslated'),
  }

  const exhibitions = await safeFetch<any[]>(exhibitionsQuery)
  const upcoming = exhibitions?.filter((e: any) => e.upcoming) || []
  const past = exhibitions?.filter((e: any) => !e.upcoming) || []

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />
      <section className="max-w-5xl mx-auto px-6 py-16">
        {upcoming.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif text-3xl mb-8 pb-4 border-b border-[--color-border]">{t('upcoming')}</h2>
            <div className="space-y-8">
              {upcoming.map((ex: any) => <ExhibitionItem key={ex._id} ex={ex} locale={locale} moreInfo={t('moreInfo')} catalogue={ex._id === CATALOGUE_EXHIBITION_ID ? catalogue : null} />)}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl mb-8 pb-4 border-b border-[--color-border]">{t('past')}</h2>
            <div className="space-y-8">
              {past.map((ex: any) => <ExhibitionItem key={ex._id} ex={ex} locale={locale} moreInfo={t('moreInfo')} catalogue={ex._id === CATALOGUE_EXHIBITION_ID ? catalogue : null} />)}
            </div>
          </div>
        )}

        {!exhibitions?.length && (
          <p className="text-[--color-muted] font-sans text-center py-20">{t('comingSoon')}</p>
        )}
      </section>
    </>
  )
}

type Catalogue = { quote: string; author: string; source: string; translated: string }

function ExhibitionItem({ ex, locale, moreInfo, catalogue }: { ex: any; locale: string; moreInfo: string; catalogue?: Catalogue | null }) {
  const startYear = ex.startDate ? new Date(ex.startDate).getFullYear() : null
  const endYear = ex.endDate ? new Date(ex.endDate).getFullYear() : null
  const dateStr = startYear
    ? endYear && endYear !== startYear
      ? `${startYear}–${endYear}`
      : `${startYear}`
    : null

  return (
    <div className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-[--color-border] last:border-0">
      {dateStr && (
        <div className="sm:w-32 shrink-0 text-sm font-sans text-[--color-muted]">{dateStr}</div>
      )}
      <div className="flex-1">
        <div className="flex flex-wrap items-start gap-3 mb-2">
          <h3 className="font-serif text-xl">{ex.title}</h3>
          {(typeOverrides[ex._id] ?? ex.type) && (
            <span className="text-xs border border-[--color-gold] text-[--color-gold] px-2 py-0.5 font-sans">{typeOverrides[ex._id] ?? ex.type}</span>
          )}
        </div>
        {(ex.venue || ex.city) && (
          <p className="text-sm text-[--color-muted] font-sans mb-3">
            {[ex.venue, ex.city].filter(Boolean).join(' · ')}
          </p>
        )}
        {ex.description && (
          <div className="prose prose-sm font-sans text-[--color-muted]">
            <PortableText value={ex.description} />
          </div>
        )}
        {ex.collaborators?.length > 0 && (
          <p className="text-sm text-[--color-muted] font-sans mt-2">
            with{' '}
            {ex.collaborators.map((c: any, i: number) => (
              <span key={c._key || i}>
                {i > 0 && ', '}
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[--color-gold] hover:text-[--color-charcoal] transition-colors">
                    {c.name}
                  </a>
                ) : c.name}
              </span>
            ))}
          </p>
        )}
        {catalogue && (
          <figure className="mt-4 border-l border-[--color-gold] pl-4">
            <blockquote className="font-serif text-base font-light italic leading-snug text-[--color-charcoal]">
              {catalogue.quote}
            </blockquote>
            <figcaption className="mt-2 text-xs font-sans font-light text-[--color-muted] leading-relaxed">
              {catalogue.author}
              <span className="block italic">{catalogue.source}</span>
              {catalogue.translated && <span className="block">{catalogue.translated}</span>}
            </figcaption>
          </figure>
        )}
        {ex.link && (
          <a href={ex.link} target="_blank" rel="noopener noreferrer"
            className="inline-block mt-3 text-xs underline underline-offset-4 text-[--color-gold] hover:text-[--color-charcoal] transition-colors">
            {moreInfo}
          </a>
        )}
      </div>
    </div>
  )
}

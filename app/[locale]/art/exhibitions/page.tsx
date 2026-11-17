import { Metadata } from 'next'
import { safeFetch } from '@/sanity/lib/client'
import { exhibitionsQuery } from '@/sanity/lib/queries'
import PageHeader from '@/components/PageHeader'
import { PortableText } from 'next-sanity'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import LinkM33 from '@/components/LinkM33'

export const revalidate = 86400

// Tag corrections applied on top of Sanity data, keyed by exhibition _id
const typeOverrides: Record<string, string> = {
  q7MxOP673O523e3BZ9d37d: 'Residency', // Anankha (Sanity still says "Performance")
  Htvkf05gV4fJEoqSQ5BHqd: 'Duo Exhibition', // L'Atelier Restaurant 2017, with Corto Koller (side by side, not a collaboration)
  q7MxOP673O523e3BZ9d5GA: 'Duo Exhibition', // Entélékiss 2015, four-hands paintings with Jérôme Dupré la Tour
  Htvkf05gV4fJEoqSQ5BIWj: 'Group Exhibitions', // M33 collective 2014-2016, several shows
  '1y7ZVPKFp3J9IOAgPaRF47': 'Group Exhibitions', // Artists Network Alpujarra, several shows
  Htvkf05gV4fJEoqSQ5BJUF: 'Group Exhibitions', // The Lost Room collective 2011, several shows
}

// Solo show at Galerie Le point Fort, 2014 — the one exhibition with a printed
// monograph, so the entry carries a quote from it and the full reference
const CATALOGUE_EXHIBITION_ID = 'q7MxOP673O523e3BZ9d2Ek'

// Upcoming shows not (yet) in Sanity, added in code. Batx: café show, date of the opening to be announced.
const block = (text: string) => [{ _type: 'block', _key: 'b1', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's1', text, marks: [] }] }]
const BATX_TEXT: Record<string, string> = {
  en: 'Opening in December 2026, date to be announced.',
  fr: 'Vernissage en décembre 2026, date à venir.',
  es: 'Inauguración en diciembre de 2026, fecha por confirmar.',
}
// Past shows not in Sanity, added in code (17 Nov 2026)
const MIX_PREFIX: Record<string, string> = { en: 'Organised by ', fr: 'Organisées par ', es: 'Organizadas por ' }
const mixBlock = (locale: string) => [{ _type: 'block', _key: 'b1', style: 'normal', markDefs: [{ _type: 'link', _key: 'l1', href: 'https://www.mixamylo.com/' }],
  children: [
    { _type: 'span', _key: 's1', text: MIX_PREFIX[locale] || MIX_PREFIX.en, marks: [] },
    { _type: 'span', _key: 's2', text: 'Mix Amylo', marks: ['l1'] },
    { _type: 'span', _key: 's3', text: '.', marks: [] },
  ] }]
const extraPast = (locale: string) => [
  { _id: 'open-house-art-2023', title: 'Open House Art Exhibitions', type: 'Group Exhibitions', city: 'Orgiva, Spain',
    startDate: '2023-01-01', description: mixBlock(locale) },
]
const extraUpcoming = (locale: string) => [
  { _id: 'batx-2026', title: 'Semillas de luz', type: 'Solo café show', venue: 'Batx Santa Catalina', city: 'Palma de Mallorca, Spain',
    startDate: '2026-12-01', endDate: '2027-02-01', upcoming: true, venueUrl: 'https://batxcafe.com/', description: block(BATX_TEXT[locale] || BATX_TEXT.en) },
]

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

  const catalogue = { source: t('catalogueSource') }

  const exhibitions = await safeFetch<any[]>(exhibitionsQuery)
  const upcoming = [...extraUpcoming(locale), ...(exhibitions?.filter((e: any) => e.upcoming) || [])]
  const past = [...(exhibitions?.filter((e: any) => !e.upcoming) || []), ...extraPast(locale)]
    .sort((a: any, b: any) => String(b.startDate || '').localeCompare(String(a.startDate || '')))

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

type Catalogue = { source: string }

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
          <h3 className="font-serif text-xl"><LinkM33 text={ex.title} /></h3>
          {(typeOverrides[ex._id] ?? ex.type) && (
            <span className="text-xs border border-[--color-gold] text-[--color-gold] px-2 py-0.5 font-sans">{typeOverrides[ex._id] ?? ex.type}</span>
          )}
        </div>
        {(ex.venue || ex.city) && (
          <p className="text-sm text-[--color-muted] font-sans mb-3">
            {ex.venueUrl && ex.venue ? (
              <>
                <a href={ex.venueUrl} target="_blank" rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-[--color-gold] hover:text-[--color-charcoal] transition-colors">
                  {ex.venue}
                </a>
                {ex.city && <> · {ex.city}</>}
              </>
            ) : (
              <LinkM33 text={[ex.venue, ex.city].filter(Boolean).join(' · ')} />
            )}
          </p>
        )}
        {ex.description && (
          <div className="prose prose-sm font-sans text-[--color-muted]">
            <PortableText value={ex.description} components={{ marks: { link: ({ value, children }: any) => (
              <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-[--color-gold] hover:text-[--color-charcoal] transition-colors">{children}</a>
            ) } }} />
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
          <p className="mt-3 text-xs font-sans font-light italic text-[--color-muted] leading-relaxed">
            {catalogue.source}
          </p>
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

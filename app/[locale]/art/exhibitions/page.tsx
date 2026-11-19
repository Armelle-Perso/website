import { Metadata } from 'next'
import { safeFetch } from '@/sanity/lib/client'
import { exhibitionsQuery } from '@/sanity/lib/queries'
import PageHeader from '@/components/PageHeader'
import { PortableText } from 'next-sanity'
import { Link } from '@/i18n/navigation'
import AvailableWorksLink from '@/components/AvailableWorksLink'
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

// Sanity holds the exhibitions in English only: tags, countries, short
// descriptions and "with" are translated here for FR and ES (18 Nov 2026).
// The gallery's name is always written "Le point Fort".
const TYPE_L: Record<string, Record<string, string>> = {
  fr: { 'Solo Exhibition': 'Exposition personnelle', 'Group Exhibition': 'Exposition collective', 'Group Exhibitions': 'Expositions collectives',
    'Duo Exhibition': 'Exposition en duo', 'Art Fair': "Salon d'art", Charity: 'Caritatif', Residency: 'Résidence', 'Solo café show': 'Exposition personnelle en café' },
  es: { 'Solo Exhibition': 'Exposición individual', 'Group Exhibition': 'Exposición colectiva', 'Group Exhibitions': 'Exposiciones colectivas',
    'Duo Exhibition': 'Exposición a dúo', 'Art Fair': 'Feria de arte', Charity: 'Benéfico', Residency: 'Residencia', 'Solo café show': 'Exposición individual en café' },
}
const COUNTRY_L: Record<string, [RegExp, string][]> = {
  fr: [[/\bSpain\b/, 'Espagne'], [/\bCyprus\b/, 'Chypre'], [/\bUK\b/, 'Royaume-Uni'], [/^Sevilla\b/, 'Séville']],
  es: [[/\bSpain\b/, 'España'], [/\bFrance\b/, 'Francia'], [/\bCyprus\b/, 'Chipre'], [/\bUK\b/, 'Reino Unido'], [/^London\b/, 'Londres'], [/^Nice\b/, 'Niza'], [/^Strasbourg\b/, 'Estrasburgo'], [/^Lyon\b/, 'Lyon'], [/^Orgiva\b/, 'Órgiva']],
}
const DESC_L: Record<string, Record<string, string>> = {
  Gd6YsNZdRpmvsYg22dzYH2: { en: 'With Galerie Le point Fort.', fr: 'Avec la Galerie Le point Fort.', es: 'Con la Galerie Le point Fort.' },
  Htvkf05gV4fJEoqSQ5BK35: { en: 'With Galerie Le point Fort.', fr: 'Avec la Galerie Le point Fort.', es: 'Con la Galerie Le point Fort.' },
  q7MxOP673O523e3BZ9d5GA: { fr: 'Peintures à quatre mains avec Jérôme Dupré la Tour.', es: 'Pinturas a cuatro manos con Jérôme Dupré la Tour.' },
  Htvkf05gV4fJEoqSQ5BHqd: { fr: 'Avec Corto Koller.', es: 'Con Corto Koller.' },
  Gd6YsNZdRpmvsYg22dzVrU: { fr: 'Commissariat : Jo Holland.', es: 'Comisariada por Jo Holland.' },
  q7MxOP673O523e3BZ9d37d: { fr: 'Cérémonie prismatique en direct.', es: 'Ceremonia prismática en directo.' },
  Htvkf05gV4fJEoqSQ5BK8t: { fr: 'Association Ithaque.', es: 'Asociación Ithaque.' },
  Htvkf05gV4fJEoqSQ5BKbv: { fr: 'Recherche contre le cancer du sein.', es: 'Investigación contra el cáncer de mama.' },
  // From the 2018 CV (CREA\CV_bio-Portfolios\CVpeinture-ArmelleBoussidan2018.pdf), added 19 Nov 2026
  Gd6YsNZdRpmvsYg22dzX4G: { en: 'Member of the organising team (editorial design). Funded by the Cypriot Ministry of Culture, in partnership with the Institut français de Chypre.',
    fr: "Membre de l'équipe organisatrice (conception éditoriale). Financée par le ministère de la Culture chypriote, en partenariat avec l'Institut français de Chypre.",
    es: 'Miembro del equipo organizador (concepción editorial). Financiada por el Ministerio de Cultura de Chipre, en colaboración con el Institut français de Chypre.' },
  q7MxOP673O523e3BZ9d2Ek: { en: 'First artist exhibited in the new gallery.', fr: 'Première artiste exposée dans la nouvelle galerie.', es: 'Primera artista expuesta en la nueva galería.' },
}
const WITH_L: Record<string, string> = { en: 'with', fr: 'avec', es: 'con' }
const pointFort = (v?: string) => v?.replace(/Le Point Fort/g, 'Le point Fort')
const VENUE_L: Record<string, Record<string, string>> = {
  fr: { 'Various venues': 'Lieux divers' },
  es: { 'Various venues': 'Varios lugares' },
}
function localizeEx(ex: any, locale: string) {
  const type = typeOverrides[ex._id] ?? ex.type
  let city: string | undefined = ex.city
  for (const [re, to] of COUNTRY_L[locale] || []) city = city?.replace(re, to)
  const desc = DESC_L[ex._id]?.[locale]
  return {
    ...ex,
    title: pointFort(ex.title),
    venue: (VENUE_L[locale] || {})[ex.venue] ?? pointFort(ex.venue),
    city,
    type: (TYPE_L[locale] || {})[type] ?? type,
    description: desc ? block(desc) : ex.description,
  }
}

// Solo show at Galerie Le point Fort, 2014 — the one exhibition with a printed
// monograph, so the entry carries a quote from it and the full reference
const CATALOGUE_EXHIBITION_ID = 'q7MxOP673O523e3BZ9d2Ek'

// Upcoming shows not (yet) in Sanity, added in code. Batx: café show, opening Thu 3 Dec 2026 at 18:00 (confirmed by Jess 18 Nov).
const block = (text: string) => [{ _type: 'block', _key: 'b1', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's1', text, marks: [] }] }]
const BATX_TEXT: Record<string, string> = {
  en: 'Opening on Thursday 3 December 2026 at 6 pm.',
  fr: 'Vernissage le jeudi 3 décembre 2026 à 18 h.',
  es: 'Inauguración el jueves 3 de diciembre de 2026 a las 18:00 h.',
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
  // Art walk, 3 Aug 2019, 7 venues, 20+ artists (poster: CREA\EXPOS\EXPOS_Collectives\Poster POP-UP POLOPOS.png)
  { _id: 'pop-up-polopos-2019', title: 'Pop-Up Polopos, Paseo del Arte', type: 'Group Exhibition', city: 'Polopos, Spain',
    startDate: '2019-08-03' },
]
const extraUpcoming = (locale: string) => [
  { _id: 'batx-2026', title: 'Semillas de luz', type: 'Solo café show', venue: 'Batx Santa Catalina', city: 'Palma de Mallorca, Spain',
    startDate: '2026-12-03', endDate: '2027' /* year only: no fixed end date, up in 2027 */, upcoming: true, venueUrl: 'https://batxcafe.com/', pageUrl: '/art/exhibitions/semillas-de-luz', description: block(BATX_TEXT[locale] || BATX_TEXT.en) },
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
  const upcoming = [...extraUpcoming(locale), ...(exhibitions?.filter((e: any) => e.upcoming) || [])].map((e: any) => localizeEx(e, locale))
  const past = [...(exhibitions?.filter((e: any) => !e.upcoming) || []), ...extraPast(locale)]
    .sort((a: any, b: any) => String(b.startDate || '').localeCompare(String(a.startDate || '')))
    .map((e: any) => localizeEx(e, locale))

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />
      <section className="max-w-5xl mx-auto px-6 -mt-6 pb-16">
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

        <AvailableWorksLink className="mt-20" />
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
          <h3 className="font-serif text-xl">
            {ex.pageUrl ? (
              <Link href={ex.pageUrl} className="underline underline-offset-4 decoration-[--color-gold] hover:text-[--color-gold] transition-colors">{ex.title} <span className="text-sm text-[--color-gold]">→</span></Link>
            ) : <LinkM33 text={ex.title} />}
          </h3>
          {ex.type && (
            <span className="text-xs border border-[--color-gold] text-[--color-gold] px-2 py-0.5 font-sans">{ex.type}</span>
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
            {WITH_L[locale] || WITH_L.en}{' '}
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

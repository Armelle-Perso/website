import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CREATIVE_PATH } from '@/lib/creative-path'
import { JOURNEY_CAPTIONS, JOURNEY_IMAGES, JOURNEY_LABELS, JOURNEY_LAYOUT } from '@/lib/creative-path-journey'
import CreativePathJourney from '@/components/CreativePathJourney'

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('creativePath')
  const text = CREATIVE_PATH[locale] ?? CREATIVE_PATH.en
  return {
    title: `${t('label')}: ${text.title}`,
    description: text.intro[0],
  }
}

// The creative path as a journey: the paintings follow the reading.
// Previous static version (before Nov 2026): git history, or the local backup
// in C:\Github\armelle-boussidan-backups\creative-path-before-journey-2026-11-21
export default async function CreativePathPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('creativePath')
  const lang = CREATIVE_PATH[locale] ? locale : 'en'
  const text = CREATIVE_PATH[lang]

  return (
    <CreativePathJourney
      locale={lang}
      title={text.title}
      headings={text.sections.map(s => s.heading)}
      source={text.source}
      layout={JOURNEY_LAYOUT[lang]}
      images={JOURNEY_IMAGES}
      captions={JOURNEY_CAPTIONS[lang]}
      labels={{ label: t('label'), seeAvailable: t('seeAvailable'), ...JOURNEY_LABELS[lang] }}
    />
  )
}

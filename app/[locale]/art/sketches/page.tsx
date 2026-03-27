import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('nav')
  return { title: t('sketches') }
}

export default async function SketchesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('nav')

  return (
    <>
      <PageHeader
        title={t('sketches')}
        subtitle="Art / Sketches"
      />
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-[--color-muted] font-sans text-center py-20">Coming soon.</p>
      </section>
    </>
  )
}

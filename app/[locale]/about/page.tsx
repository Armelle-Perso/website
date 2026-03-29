import { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import { localized } from '@/sanity/lib/localize'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  const settings = await safeFetch<any>(siteSettingsQuery)

  const disciplines = [
    { label: t('facilitation'), desc: t('facilitationDesc') },
    { label: t('translation'), desc: t('translationDesc') },
    { label: t('visualArt'), desc: t('visualArtDesc') },
  ]

  return (
    <>
      {/* Hero — portrait + intro, fits one screen */}
      <section className="min-h-[calc(100svh-3.5rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-center">
          {settings?.heroImage && (
            <div>
              <Image
                src={urlFor(settings.heroImage).width(800).height(1000).url()}
                alt="Armelle Boussidan"
                width={800}
                height={1000}
                className="w-full h-auto max-h-[calc(100svh-7rem)] object-contain"
                priority
              />
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-muted] font-sans font-light mb-4">
              {t('subtitle')}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-light leading-[0.9] tracking-tight text-[--color-charcoal] mb-6">
              {t('title')}
            </h1>
            <div className="w-8 h-px bg-[--color-gold] mb-6" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-6">
              {t('artistConsultant')}
            </p>
            {(() => {
              const bio = localized(settings, 'bio', locale)
              return bio ? (
                <div className="space-y-4">
                  {bio.split('\n\n').filter(Boolean).map((para: string, i: number) => (
                    <p key={i} className="font-sans font-light text-sm leading-relaxed text-[--color-charcoal]">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="font-sans font-light text-sm leading-relaxed text-[--color-muted]">
                  {t('defaultBio')}
                </p>
              )
            })()}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-32">

        {/* Path */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {t('path')}
          </p>
          <p className="font-sans font-light text-sm leading-relaxed text-[--color-charcoal] max-w-3xl">
            {t('pathDesc')}
          </p>
        </section>

        {/* Fields of practice */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {t('fieldsOfPractice')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {disciplines.map((d) => (
              <div key={d.label}>
                <h3 className="font-serif text-xl font-light mb-1">{d.label}</h3>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[--color-muted] font-sans font-light">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Explore */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/consulting"
            className="group block border border-[--color-border] p-8 hover:border-[--color-gold] transition-colors duration-300"
          >
            <h3 className="font-serif text-2xl font-light text-[--color-charcoal] mb-2 group-hover:text-[--color-gold] transition-colors">
              {t('facilitation')}
            </h3>
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] group-hover:text-[--color-gold] transition-colors">
              {t('exploreConsulting')}
            </span>
          </Link>
          <Link
            href="/art/paintings"
            className="group block border border-[--color-border] p-8 hover:border-[--color-gold] transition-colors duration-300"
          >
            <h3 className="font-serif text-2xl font-light text-[--color-charcoal] mb-2 group-hover:text-[--color-gold] transition-colors">
              {t('visualArt')}
            </h3>
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] group-hover:text-[--color-gold] transition-colors">
              {t('exploreArt')}
            </span>
          </Link>
        </section>

      </div>
    </>
  )
}

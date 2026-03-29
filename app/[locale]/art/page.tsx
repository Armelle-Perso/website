import { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

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

  const artSections = [
    { labelKey: 'paintingsLabel' as const, href: '/art/paintings', descKey: 'paintingsDesc' as const },
    { labelKey: 'collectivesLabel' as const, href: '/art/collectives', descKey: 'collectivesDesc' as const },
    { labelKey: 'exhibitionsLabel' as const, href: '/art/exhibitions', descKey: 'exhibitionsDesc' as const },
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

      {/* Category grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-[--color-border]">
          {artSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group p-10 border-b border-r border-[--color-border] hover:bg-[--color-gold-light] transition-colors"
            >
              <h2 className="font-serif text-3xl mb-3 group-hover:text-[--color-charcoal]">{t(section.labelKey)}</h2>
              {t(section.descKey) && <p className="text-sm text-[--color-muted] font-sans leading-relaxed">{t(section.descKey)}</p>}
              <span className="inline-block mt-6 text-xs tracking-widest text-[--color-gold] transition-opacity">→</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

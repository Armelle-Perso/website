import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeFetch } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import { localized } from '@/sanity/lib/localize'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const settings = await safeFetch<any>(siteSettingsQuery)
  const seoDesc = settings ? localized(settings, 'seoDescription', locale) : ''
  return {
    title: 'Armelle Boussidan',
    description: seoDesc || t('defaultTagline').replace('\n', ' '),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const nav = await getTranslations('nav')

  const settings = await safeFetch<any>(siteSettingsQuery)

  const tagline = settings ? localized(settings, 'tagline', locale) : ''

  const cards = [
    {
      title: nav('about'),
      desc: t('aboutDesc'),
      href: '/about' as const,
    },
    {
      title: nav('consulting'),
      desc: t('consultingDesc'),
      href: '/consulting' as const,
    },
    {
      title: nav('paintings'),
      desc: t('paintingsDesc'),
      href: '/art/paintings' as const,
    },
  ]

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-svh flex items-center justify-center bg-[#1C1C1C]">
        {/* Content */}
        <div className="text-center px-6 max-w-3xl">
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light text-[#C4A882] tracking-tight leading-[0.9] mb-4">
            Armelle
            <br />
            Boussidan
          </h1>
          <div className="w-10 h-px bg-[#C4A882] mx-auto my-6" />
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#C4A882] font-sans font-light mb-8">
            {t('artistConsultant')}
          </p>
          <p className="font-sans font-light text-sm sm:text-base text-[#EDE0CC] leading-relaxed whitespace-pre-line max-w-lg mx-auto mb-10">
            {tagline || t('defaultTagline')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="px-6 py-2.5 border border-[#C4A882]/50 text-[#C4A882] text-xs uppercase tracking-[0.2em] font-sans font-light hover:bg-[#C4A882] hover:text-white transition-all duration-300"
            >
              {t('aboutMe')}
            </Link>
            <Link
              href="/art/paintings"
              className="px-6 py-2.5 border border-[#C4A882]/50 text-[#C4A882] text-xs uppercase tracking-[0.2em] font-sans font-light hover:bg-[#C4A882] hover:text-white transition-all duration-300"
            >
              {t('viewArt')}
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2.5 border border-[#C4A882]/50 text-[#C4A882] text-xs uppercase tracking-[0.2em] font-sans font-light hover:bg-[#C4A882] hover:text-white transition-all duration-300"
            >
              {t('getInTouch')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Cards ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block border border-[--color-border] p-8 hover:border-[--color-gold] transition-colors duration-300"
            >
              <h2 className="font-serif text-2xl font-light text-[--color-charcoal] mb-3 group-hover:text-[--color-gold] transition-colors">
                {card.title}
              </h2>
              <p className="font-sans font-light text-sm text-[--color-muted] leading-relaxed mb-6">
                {card.desc}
              </p>
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] group-hover:text-[--color-gold] transition-colors">
                {t('view')}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

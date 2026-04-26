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
    <section className="h-svh flex items-center justify-center bg-[#FAF9F6] px-6 overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col items-center gap-8">

        {/* ── Hero text ── */}
        <div className="text-center max-w-2xl">
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-7xl font-light text-[#C4A882] tracking-tight leading-[0.95] mb-3">
            Armelle Boussidan
          </h1>

          {/* ornamented divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="block w-12 h-px bg-[#C4A882]" />
            <span className="text-[#C4A882] text-[10px]">◆</span>
            <span className="block w-12 h-px bg-[#C4A882]" />
          </div>

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#8A7A55] font-sans font-light mb-5">
            {t('artistConsultant')}
          </p>
          <p className="font-serif italic text-lg sm:text-xl text-[#1C1C1C] leading-snug whitespace-pre-line max-w-md mx-auto">
            {tagline || t('defaultTagline')}
          </p>
        </div>

        {/* ── Two floating doors ── magazine-style links */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-3xl relative">
          <span
            aria-hidden
            className="hidden md:block absolute left-1/2 top-2 bottom-2 w-px bg-[#C4A882]/30"
          />
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block text-center"
            >
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#1C1C1C] mb-1 inline-block relative pb-1">
                {card.title}
                <span
                  aria-hidden
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px bg-[#C4A882] w-0 group-hover:w-full transition-all duration-500"
                />
              </h2>
              <p className="font-sans font-light text-xs text-[#6B6B6B] leading-snug max-w-xs mx-auto mt-2 mb-3">
                {card.desc}
              </p>
              <span
                aria-hidden
                className="inline-block text-[#C4A882] text-base transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          ))}
        </div>

        {/* ── Quiet text links ── */}
        <div className="w-full max-w-md grid grid-cols-[1fr_auto_1fr] items-center gap-x-5 text-[10px] uppercase tracking-[0.2em] font-sans font-light text-[#6B6B6B]">
          <Link href="/about" className="hover:text-[#C4A882] transition-colors justify-self-end">
            {t('aboutMe')}
          </Link>
          <span className="text-[#C4A882]/40 justify-self-center">◆</span>
          <Link href="/contact" className="hover:text-[#C4A882] transition-colors justify-self-start">
            {t('getInTouch')}
          </Link>
        </div>
      </div>
    </section>
  )
}

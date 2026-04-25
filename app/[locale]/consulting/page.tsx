import { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeFetch } from '@/sanity/lib/client'
import { consultingProjectsQuery } from '@/sanity/lib/queries'
import WordCloud from '@/components/WordCloud'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'consulting' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ConsultingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('consulting')
  const nav = await getTranslations('nav')

  const projects = await safeFetch<any[]>(consultingProjectsQuery)
  const featured = projects?.filter((p: any) => p.featured) || []

  const services = [
    { title: t('consultantTitle'), desc: t('consultantDesc') },
    { title: t('interpreterTitle'), desc: t('interpreterDesc') },
    { title: t('writerTitle'), desc: t('writerDesc') },
  ]

  const professionalPath = [
    { org: 'Life Itself', role: t('lifeItselfRole'), dates: t('lifeItselfDates'), desc: t('lifeItselfDesc'), href: 'https://lifeitself.org/', external: true, logo: '/logos/lifeitself.svg' },
    { org: t('siaOrg'), role: t('siaRole'), dates: t('siaDates'), desc: t('siaDesc'), href: 'https://entersia.com/', external: true, logo: '/logos/sia.png' },
    { org: 'Seed2Shirt', role: t('seed2shirtRole'), dates: t('seed2shirtDates'), desc: t('seed2shirtDesc'), href: 'https://seed2shirt.com/fep/', external: true, logo: '/logos/seed2shirt.png' },
    { org: 'Existence', role: t('existenceRole'), dates: t('existenceDates'), desc: t('existenceDesc'), href: 'https://existence.fr/', external: true, logo: '/logos/existence.ico' },
    { org: 'Orinko', org2: 'Vibratis', href2: 'https://vibratis.fr/', role: t('orinkoRole'), dates: t('orinkoDates'), desc: t('orinkoDesc'), href: 'https://orinko.org/', external: true, logo: '/logos/orinko.png' },
    { org: 'Sunseed Desert Technology', role: t('sunseedRole'), dates: t('sunseedDates'), desc: t('sunseedDesc'), href: 'https://www.sunseed.org.uk/', external: true, logo: '/logos/sunseed.png' },
    { org: 'M33', role: t('m33Role'), dates: t('m33Dates'), desc: t('m33Desc'), href: 'https://www.instagram.com/atelierm33/', external: true, logo: '/logos/m33.png' },
  ]

  const education = [
    { title: t('phdTitle'), place: t('phdPlace'), date: t('phdDate'), detail: t('phdDetail') },
    { title: t('maTitle'), place: t('maPlace'), date: t('maDate'), detail: t('maDetail') },
    { title: t('m1Title'), place: t('m1Place'), date: t('m1Date'), detail: t('m1Detail') },
  ]

  const training = [
    { title: t('permacultureTitle'), place: t('permaculturePlace'), date: t('permacultureDate'), href: 'https://circlepermaculture.com' },
    { title: t('yogaTitle'), place: t('yogaPlace'), date: t('yogaDate'), href: 'http://yoga-toulouse.fr' },
    { title: t('herbalTitle'), place: t('herbalPlace'), date: t('herbalDate'), href: 'https://www.legattilier.com/' },
  ]

  const languages = [
    { lang: t('frenchLang'), level: t('frenchLevel') },
    { lang: t('englishLang'), level: t('englishLevel') },
    { lang: t('spanishLang'), level: t('spanishLevel') },
  ]

  return (
    <>
      {/* Hero — word cloud + intro, fits one screen */}
      <section className="min-h-[calc(100svh-3.5rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <WordCloud locale={locale} />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-muted] font-sans font-light mb-4">
              {t('subtitle')}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-light leading-[0.9] tracking-tight text-[--color-charcoal] mb-6">
              {t('title')}
            </h1>
            <div className="w-8 h-px bg-[--color-gold] mb-6" />
            <div className="space-y-4">
              <p className="font-sans font-light text-sm leading-relaxed text-[--color-charcoal]">
                {t('intro')}
              </p>
              <p className="font-sans font-light text-sm leading-relaxed text-[--color-charcoal]">
                {t('vision')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-32">

        {/* Services */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {t('servicesTitle')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {services.map((s) => (
              <div key={s.title}>
                <h3 className="font-serif text-xl font-light mb-1">{s.title}</h3>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[--color-muted] font-sans font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Path */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {t('professionalPath')}
          </p>
          <div className="space-y-0">
            {professionalPath.map((item) => (
              <div key={item.org} className="border-b border-[--color-border] py-5 flex items-start gap-4">
                {item.logo && (
                  <Image
                    src={item.logo}
                    alt={item.org}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain shrink-0 mt-0.5 rounded"
                  />
                )}
                <div className="flex-1 flex items-baseline justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      {item.external ? (
                        <>
                          <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-serif text-base font-light hover:text-[--color-gold] transition-colors">
                            {item.org}
                          </a>
                          {item.org2 && (
                            <>
                              <span className="font-serif text-base font-light">&</span>
                              <a href={item.href2} target="_blank" rel="noopener noreferrer" className="font-serif text-base font-light hover:text-[--color-gold] transition-colors">
                                {item.org2}
                              </a>
                            </>
                          )}
                        </>
                      ) : (
                        <Link href={item.href} className="font-serif text-base font-light hover:text-[--color-gold] transition-colors">
                          {item.org}
                        </Link>
                      )}
                      <span className="text-[11px] font-sans font-light text-[--color-muted]">{item.role}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] font-sans font-light text-[--color-muted] leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] shrink-0">
                    {item.dates}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Training — 2 columns like about page */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-8">
                {t('education')}
              </p>
              <div className="space-y-0">
                {education.map((item) => (
                  <div key={item.title} className="border-b border-[--color-border] py-5 flex items-baseline justify-between gap-6">
                    <div>
                      <p className="font-serif text-base font-light">{item.title}</p>
                      <p className="text-[11px] font-sans font-light text-[--color-muted] mt-0.5">{item.place}</p>
                      <p className="text-[11px] font-sans font-light text-[--color-muted] mt-0.5">{item.detail}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] shrink-0">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Training */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-8">
                {t('additionalTraining')}
              </p>
              <div className="space-y-0">
                {training.map((item) => (
                  <div key={item.title} className="border-b border-[--color-border] py-5 flex items-baseline justify-between gap-6">
                    <div>
                      <p className="font-serif text-base font-light">{item.title}</p>
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[11px] font-sans font-light text-[--color-muted] hover:text-[--color-charcoal] transition-colors">
                        {item.place}
                      </a>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] shrink-0">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {t('languages')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {languages.map((item) => (
              <div key={item.lang}>
                <h3 className="font-serif text-xl font-light mb-1">{item.lang}</h3>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[--color-muted] font-sans font-light">{item.level}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {nav('research')}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl md:text-3xl font-light text-[--color-charcoal] mb-3 leading-tight">
                Academic publications
              </h3>
              <p className="font-sans font-light text-sm text-[--color-muted] leading-relaxed">
                Peer-reviewed work in linguistics, computational semantics & cognitive science.
              </p>
            </div>
            <Link
              href="/consulting/publications"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-sans font-light text-[--color-gold] hover:text-[--color-charcoal] transition-colors shrink-0"
            >
              View publications →
            </Link>
          </div>
        </section>

        {/* Selected Projects (Sanity-driven) */}
        {featured.length > 0 && (
          <section>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
              {t('selectedProjects')}
            </p>
            <div className="space-y-0">
              {featured.map((p: any) => (
                <div key={p._id} className="border-b border-[--color-border] py-5 flex items-baseline justify-between gap-6">
                  <div>
                    <p className="font-serif text-base font-light">{p.title}</p>
                    {p.description && <p className="mt-0.5 text-[11px] text-[--color-muted] font-sans font-light">{p.description}</p>}
                    {p.services?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.services.map((s: string) => (
                          <span key={s} className="text-xs border border-[--color-border] px-2 py-0.5 font-sans text-[--color-muted]">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] shrink-0">
                    {p.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA */}
      <section className="bg-[--color-gold-light] border-t border-[--color-border] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl mb-4">{t('collaboratorTitle')}</h2>
          <p className="text-[--color-muted] font-sans mb-8">{t('collaboratorDesc')}</p>
          <Link href="/contact" className="inline-block bg-[--color-charcoal] text-white px-10 py-4 text-sm font-sans font-medium tracking-wide hover:bg-[--color-gold] transition-colors">
            {t('getInTouch')}
          </Link>
        </div>
      </section>
    </>
  )
}

import { Metadata } from 'next'
import { Fragment } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import PageHeader from '@/components/PageHeader'
import { CREATIVE_PATH, SERIES_LINKS } from '@/lib/creative-path'

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

// **Series** becomes a link to the series page, *Title* becomes italics
function RichLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**')) {
          const name = part.slice(2, -2)
          const slug = SERIES_LINKS[name]
          return slug ? (
            <Link key={i} href={`/art/paintings/${slug}`} className="text-[--color-charcoal] border-b border-[--color-gold] hover:text-[--color-gold] transition-colors duration-300">
              {name}
            </Link>
          ) : (
            <strong key={i} className="font-normal">{name}</strong>
          )
        }
        if (part.startsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

export default async function CreativePathPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('creativePath')
  const text = CREATIVE_PATH[locale] ?? CREATIVE_PATH.en
  const para = 'font-sans font-light text-base leading-relaxed text-[--color-charcoal]'

  return (
    <>
      <PageHeader title={text.title} subtitle={t('label')} />

      <figure className="max-w-lg mx-auto px-6 mb-16">
        <Image
          src="/images/paintings/creative-path/performance-le-point-fort-2014.jpg"
          alt={t('photoCaption')}
          width={1065}
          height={1600}
          priority
          className="w-full h-auto"
          sizes="(max-width: 640px) 100vw, 512px"
        />
        <figcaption className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mt-3">
          {t('photoCaption')}
        </figcaption>
      </figure>

      <article className="max-w-3xl mx-auto px-6 pb-24">
        <div className="space-y-5 mb-16">
          {text.intro.map((p, i) => (
            <p key={i} className="font-serif text-lg md:text-xl font-light leading-relaxed text-[--color-charcoal]">
              <RichLine text={p} />
            </p>
          ))}
        </div>

        {text.sections.map((section) => (
          <section key={section.heading} className="mb-14">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-6">
              {section.heading}
            </h2>
            <div className="space-y-5">
              {section.paragraphs.map((p, i) => (
                <p key={i} className={para}>
                  <RichLine text={p} />
                </p>
              ))}
            </div>
          </section>
        ))}

        <p className="pt-8 border-t border-[--color-border] text-xs font-sans font-light italic text-[--color-muted] leading-relaxed">
          {text.source}
        </p>

        <div className="mt-16">
          <Link href="/art/paintings" className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-gold] hover:text-[--color-charcoal] transition-colors duration-300">
            {t('backToSeries')}
          </Link>
        </div>
      </article>
    </>
  )
}

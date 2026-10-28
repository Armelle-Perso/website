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

// Performance photos (Paul Roquecave, Le point Fort, 2014), keyed by section:
// the gesture beside the floor-painting paragraph, the hand in the matter
// beside the inward turn of 2015–2016
const SECTION_PHOTOS: Record<number, { src: string; width: number; height: number }> = {
  0: { src: '/images/paintings/creative-path/performance-le-point-fort-2014-gesture.jpg', width: 1065, height: 1600 },
  1: { src: '/images/paintings/creative-path/performance-le-point-fort-2014-touch.jpg', width: 1600, height: 1065 },
}

// **Series** becomes a link to the series page (new tab, so the reader keeps
// their place in the text), *Title* becomes italics
function RichLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**')) {
          const name = part.slice(2, -2)
          const slug = SERIES_LINKS[name]
          return slug ? (
            <Link key={i} href={`/art/paintings/${slug}`} target="_blank" rel="noopener" className="text-[--color-charcoal] border-b border-[--color-gold] hover:text-[--color-gold] transition-colors duration-300">
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
  const para = 'font-serif font-light text-lg leading-relaxed text-[--color-charcoal] text-justify hyphens-auto'

  return (
    <>
      <PageHeader title={text.title} subtitle={t('label')} />

      {/* Opening text beside the photo; stacked on small screens */}
      <div lang={locale} className="max-w-5xl mx-auto px-6 mb-16 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-14 items-start">
        <div className="space-y-5">
          {text.intro.map((p, i) => (
            <p key={i} className="font-serif text-lg md:text-xl font-light leading-relaxed text-[--color-charcoal] text-justify hyphens-auto">
              <RichLine text={p} />
            </p>
          ))}
        </div>
        <figure className="max-w-sm mx-auto md:mx-0">
          <Image
            src="/images/paintings/creative-path/performance-le-point-fort-2014-listening.jpg"
            alt={t('photoCaption')}
            width={1065}
            height={1600}
            priority
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 360px"
          />
          <figcaption className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mt-3">
            {t('photoCaption')}
          </figcaption>
        </figure>
      </div>

      {/* Same grid as the opening: text on the left, photos on the right */}
      <article lang={locale} className="max-w-5xl mx-auto px-6 pb-24">
        {text.sections.map((section, si) => {
          const photo = SECTION_PHOTOS[si]
          return (
            <section key={section.heading} className="mb-14 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-14 items-start">
              <div>
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
              </div>
              {photo && (
                <figure className="max-w-sm mx-auto md:mx-0 md:mt-12">
                  <Image
                    src={photo.src}
                    alt={t('photoCaption')}
                    width={photo.width}
                    height={photo.height}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                  <figcaption className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mt-3">
                    {t('photoCaption')}
                  </figcaption>
                </figure>
              )}
            </section>
          )
        })}

        <div className="md:w-3/5">
          <p className="pt-8 border-t border-[--color-border] text-xs font-sans font-light italic text-[--color-muted] leading-relaxed">
            {text.source}
          </p>

          <div className="mt-16">
            <Link href="/art/paintings" className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-gold] hover:text-[--color-charcoal] transition-colors duration-300">
              {t('backToSeries')}
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}

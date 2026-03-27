import { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { paintingSeriesBySlugQuery } from '@/sanity/lib/queries'
import PageHeader from '@/components/PageHeader'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('collectors')
  return {
    title: t('title'),
    description: t('title'),
  }
}

export default async function CollectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('collectors')

  // The 'People with their painting' series in Sanity
  const data = await safeFetch<any>(paintingSeriesBySlugQuery, { slug: 'people' })
  const photos = data?.artworks || []

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Artist quote */}
      {t('quote') && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <blockquote className="font-serif text-2xl md:text-3xl font-light leading-[1.4] text-[--color-charcoal] italic">
            {t('quote')}
          </blockquote>
          <div className="mt-8 w-8 h-px bg-[--color-gold]" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-sans text-[--color-muted]">{t('attribution')}</p>
        </section>
      )}

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {photos.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo: any, i: number) => (
              <div key={photo._key || i} className="break-inside-avoid">
                {photo.image && (
                  <div className="relative overflow-hidden bg-[--color-gold-light]">
                    <Image
                      src={urlFor(photo.image).width(900).url()}
                      alt={photo.title || t('title')}
                      width={900}
                      height={700}
                      className="w-full h-auto object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {photo.title && (
                      <p className="mt-3 font-serif text-sm font-light text-[--color-muted] italic">
                        {photo.title}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-[--color-muted] font-sans font-light text-sm leading-relaxed max-w-sm mx-auto">
              {t('photosComing')}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-24 border-t border-[--color-border] pt-16 text-center max-w-xl mx-auto">
          <p className="font-serif text-xl font-light text-[--color-charcoal] mb-6">
            {t('ownWork')}
          </p>
          <p className="text-sm font-sans font-light text-[--color-muted] leading-relaxed mb-10">
            {t('sendPhoto')}
          </p>
          <Link
            href="/contact"
            className="text-[11px] uppercase tracking-[0.2em] font-sans text-[--color-charcoal] border-b border-[--color-charcoal] pb-0.5 hover:text-[--color-gold] hover:border-[--color-gold] transition-colors duration-300"
          >
            {t('sendSelfie')}
          </Link>
        </div>
      </section>
    </>
  )
}

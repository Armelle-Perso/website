import { Metadata } from 'next'
import { safeFetch } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { jewelryCollectionsQuery } from '@/sanity/lib/queries'
import PageHeader from '@/components/PageHeader'
import Gallery, { GalleryImage } from '@/components/Gallery'
import { PortableText } from 'next-sanity'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('jewelry')
  return { title: t('title'), description: t('description') }
}

export default async function JewelryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('jewelry')

  const collections = await safeFetch<any[]>(jewelryCollectionsQuery)

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {collections?.length ? (
          collections.map((col: any) => {
            const images: GalleryImage[] = (col.pieces || []).map((p: any) => ({
              src: urlFor(p.image).width(800).url(),
              title: p.title,
              description: [p.category, p.materials].filter(Boolean).join(' · '),
            }))
            return (
              <div key={col._id}>
                <div className="mb-8">
                  <h2 className="font-serif text-3xl">{col.title}</h2>
                  {col.subtitle && <p className="text-[--color-muted] font-sans mt-1">{col.subtitle}</p>}
                  {col.collaborator && <p className="text-sm text-[--color-gold] font-sans mt-1">{t('collaborator', { name: col.collaborator })}</p>}
                  {col.description && (
                    <div className="mt-4 prose font-sans text-[--color-muted] max-w-2xl">
                      <PortableText value={col.description} />
                    </div>
                  )}
                </div>
                {images.length > 0 && <Gallery images={images} columns={4} />}
              </div>
            )
          })
        ) : (
          <p className="text-[--color-muted] font-sans text-center py-20">{t('comingSoon')}</p>
        )}
      </section>
    </>
  )
}

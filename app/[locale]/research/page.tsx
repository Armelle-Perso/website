import { Metadata } from 'next'
import Image from 'next/image'
import { safeFetch } from '@/sanity/lib/client'
import { researchQuery } from '@/sanity/lib/queries'
import PageHeader from '@/components/PageHeader'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('research')
  return { title: t('title') }
}

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('research')

  const research = await safeFetch<any[]>(researchQuery)

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle="Academic Work"
      />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 lg:gap-20">

          {/* Publications — main column */}
          <section>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
              Publications
            </p>
            {research?.length ? (
              <div className="space-y-0">
                {research.map((item: any) => (
                  <div key={item._id} className="border-b border-[--color-border] py-6 flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-16 shrink-0 text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] pt-1">
                      {item.year}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-start gap-3">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif text-lg font-light hover:text-[--color-gold] transition-colors duration-300"
                          >
                            {item.title}
                          </a>
                        ) : (
                          <h2 className="font-serif text-lg font-light">{item.title}</h2>
                        )}
                        {item.language && (
                          <span className="text-[10px] border border-[--color-border] px-2 py-0.5 font-sans text-[--color-muted] uppercase tracking-[0.1em] shrink-0">
                            {item.language}
                          </span>
                        )}
                      </div>
                      {item.coAuthors && (
                        <p className="text-[11px] text-[--color-muted] font-sans font-light mt-1.5">
                          With {item.coAuthors}
                        </p>
                      )}
                      {item.publication && (
                        <p className="text-[11px] text-[--color-gold] font-sans font-light mt-1">
                          {item.publication}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm text-[--color-muted] font-sans font-light mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[--color-muted] font-sans text-center py-20">{t('comingSoon')}</p>
            )}
          </section>

          {/* Sidebar — semantic atlas image */}
          <aside className="lg:sticky lg:top-24 lg:self-start bg-[--color-cream]">
            <Image
              src="/images/research/semantic-atlas.png"
              alt="Semantic Atlas — interactive model of lexical representation, 2010"
              width={500}
              height={400}
              className="research-hero-img w-full h-auto"
              priority
            />
            <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mt-4 leading-relaxed">
              Semantic Atlas — interactive model of lexical representation (2010, with{' '}
              <a href="https://perso.univ-rennes2.fr/anne-lyse.renon" target="_blank" rel="noopener noreferrer" className="hover:text-[--color-gold] transition-colors duration-300 underline underline-offset-2">Anne-Lyse Renon</a>)
            </p>
          </aside>

        </div>
      </div>
    </>
  )
}

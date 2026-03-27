import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'imprint' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function ImprintPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('imprint')

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-32">
      <h1 className="font-serif text-4xl font-light text-[--color-charcoal] mb-2">{t('title')}</h1>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[--color-muted] font-sans font-light mb-10">{t('subtitle')}</p>
      <div className="w-12 h-px bg-[--color-gold] mb-10" />

      <div className="space-y-10 font-sans font-light text-sm text-[--color-charcoal] leading-relaxed">
        {/* Publisher */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('publisher')}</h2>
          <p className="font-medium">{t('name')}</p>
          <p className="text-[--color-muted]">{t('status')}</p>
          <p className="text-[--color-muted]">{t('siret')}</p>
        </section>

        {/* Hosting */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('hosting')}</h2>
          <p className="font-medium">{t('hostName')}</p>
          <p className="text-[--color-muted]">{t('hostAddress')}</p>
          <p className="text-[--color-muted]">
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-[--color-gold] transition-colors">
              {t('hostWebsite')}
            </a>
          </p>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('intellectualProperty')}</h2>
          <p className="text-[--color-muted]">{t('intellectualPropertyDesc')}</p>
        </section>

        {/* Liability */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('liability')}</h2>
          <p className="text-[--color-muted]">{t('liabilityDesc')}</p>
        </section>

        {/* Contact & Privacy links */}
        <section className="flex flex-col gap-3 pt-4">
          <p className="text-[--color-muted]">{t('contactNote')}</p>
          <Link href="/privacy" className="text-[--color-gold] hover:text-[--color-charcoal] transition-colors">
            {t('privacyLink')}
          </Link>
        </section>
      </div>
    </div>
  )
}

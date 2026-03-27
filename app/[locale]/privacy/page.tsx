import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('privacy')

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-32">
      <h1 className="font-serif text-4xl font-light text-[--color-charcoal] mb-2">{t('title')}</h1>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[--color-muted] font-sans font-light mb-2">{t('subtitle')}</p>
      <p className="text-xs text-[--color-muted] font-sans font-light mb-10">{t('lastUpdated')}</p>
      <div className="w-12 h-px bg-[--color-gold] mb-10" />

      <div className="space-y-10 font-sans font-light text-sm text-[--color-charcoal] leading-relaxed">
        {/* Introduction */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('introTitle')}</h2>
          <p className="text-[--color-muted]">{t('introDesc')}</p>
        </section>

        {/* Data controller */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('controllerTitle')}</h2>
          <p className="text-[--color-muted]">{t('controllerDesc')}</p>
        </section>

        {/* Data collected */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('collectedTitle')}</h2>

          <h3 className="font-serif text-base font-light mt-6 mb-2">{t('contactFormTitle')}</h3>
          <p className="text-[--color-muted]">{t('contactFormDesc')}</p>

          <h3 className="font-serif text-base font-light mt-6 mb-2">{t('analyticsTitle')}</h3>
          <p className="text-[--color-muted]">{t('analyticsDesc')}</p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('cookiesTitle')}</h2>
          <p className="text-[--color-muted]">{t('cookiesDesc')}</p>
        </section>

        {/* Your rights */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('rightsTitle')}</h2>
          <p className="text-[--color-muted]">{t('rightsDesc')}</p>
        </section>

        {/* Third-party services */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('thirdPartyTitle')}</h2>
          <p className="text-[--color-muted] mb-3">{t('thirdPartyDesc')}</p>
          <ul className="list-disc pl-5 text-[--color-muted] space-y-1">
            <li>{t('thirdPartyVercel')}</li>
            <li>{t('thirdPartySanity')}</li>
            <li>{t('thirdPartyResend')}</li>
            <li>{t('thirdPartyGoogle')}</li>
            <li>{t('thirdPartyRedbubble')}</li>
          </ul>
        </section>

        {/* Changes */}
        <section>
          <h2 className="font-serif text-xl font-light mb-3">{t('changesTitle')}</h2>
          <p className="text-[--color-muted]">{t('changesDesc')}</p>
        </section>

        {/* Links */}
        <section className="pt-4">
          <Link href="/imprint" className="text-[--color-gold] hover:text-[--color-charcoal] transition-colors">
            ← Imprint
          </Link>
        </section>
      </div>
    </div>
  )
}

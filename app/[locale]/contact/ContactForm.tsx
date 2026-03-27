'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import PageHeader from '@/components/PageHeader'

export default function ContactForm() {
  const searchParams = useSearchParams()
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    howFound: '',
    drawnTo: '',
  })

  useEffect(() => {
    const work = searchParams.get('work')
    const series = searchParams.get('series')
    if (work) {
      const subject = series ? `Inquiry: ${work} (${series})` : `Inquiry: ${work}`
      setForm((f) => ({ ...f, subject }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '', howFound: '', drawnTo: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass = "w-full border-b border-[--color-border] bg-transparent px-0 py-3 font-sans text-sm focus:outline-none focus:border-[--color-gold] transition-colors placeholder:text-[--color-border]"
  const labelClass = "block text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mb-2"

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24">

          {/* Left: invitation text */}
          <div>
            <p className="font-sans font-light text-sm leading-loose text-[--color-charcoal] mb-8">
              {t('invitation')}
            </p>
            <p className="font-sans font-light text-sm leading-loose text-[--color-muted] mb-10">
              {t('noWrongReason')}
            </p>
            <div className="w-8 h-px bg-[--color-gold] mb-8" />
            <div className="space-y-4 text-[11px] uppercase tracking-[0.2em] font-sans text-[--color-muted]">
              <p>{t('strasbourg')}</p>
              <p>{t('andalusia')}</p>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {status === 'sent' ? (
              <div className="py-20 border-t border-[--color-border]">
                <div className="w-8 h-px bg-[--color-gold] mb-8" />
                <p className="font-serif text-3xl font-light mb-3">{t('thankYou')}</p>
                <p className="text-[--color-muted] font-sans font-light text-sm leading-loose">
                  {t('messageReceived')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 border-t border-[--color-border] pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                  <div>
                    <label className={labelClass}>{t('nameLabel')}</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                      placeholder={t('namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('emailLabel')}</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t('subjectLabel')}</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={inputClass}
                    placeholder={t('subjectPlaceholder')}
                  />
                </div>

                <div>
                  <label className={labelClass}>{t('messageLabel')}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                    placeholder={t('messagePlaceholder')}
                  />
                </div>

                {/* Optional enrichment fields */}
                <div className="border-t border-[--color-border] pt-8 space-y-8">
                  <p className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-border]">{t('optional')}</p>

                  <div>
                    <label className={labelClass}>{t('howFoundLabel')}</label>
                    <input
                      value={form.howFound}
                      onChange={(e) => setForm({ ...form, howFound: e.target.value })}
                      className={inputClass}
                      placeholder={t('howFoundPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>{t('drawnToLabel')}</label>
                    <textarea
                      rows={3}
                      value={form.drawnTo}
                      onChange={(e) => setForm({ ...form, drawnTo: e.target.value })}
                      className={`${inputClass} resize-none`}
                      placeholder={t('drawnToPlaceholder')}
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm font-sans">{t('error')}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="text-[11px] uppercase tracking-[0.2em] font-sans text-[--color-charcoal] border-b border-[--color-charcoal] pb-0.5 hover:text-[--color-gold] hover:border-[--color-gold] transition-colors duration-300 disabled:opacity-40"
                >
                  {status === 'sending' ? t('sending') : t('send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

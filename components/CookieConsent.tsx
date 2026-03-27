'use client'

import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const COOKIE_KEY = 'cookie-consent'

export function useCookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY)
    if (stored === 'accepted') setConsent(true)
    else if (stored === 'declined') setConsent(false)
  }, [])

  return consent
}

export default function CookieConsent() {
  const t = useTranslations('cookieConsent')
  const [visible, setVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY)
    if (!stored) setVisible(true)
  }, [])

  // Add bottom padding to body so the fixed banner never covers content
  useEffect(() => {
    if (!visible) return
    const update = () => {
      const h = bannerRef.current?.offsetHeight ?? 0
      document.body.style.paddingBottom = `${h}px`
    }
    update()
    window.addEventListener('resize', update)
    return () => {
      document.body.style.paddingBottom = ''
      window.removeEventListener('resize', update)
    }
  }, [visible])

  const dismiss = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(COOKIE_KEY, choice)
    setVisible(false)
    if (choice === 'accepted') window.location.reload()
  }

  if (!visible) return null

  return (
    <div ref={bannerRef} className="fixed bottom-0 left-0 right-0 z-50 border-t border-[--color-border]" style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="flex-1 text-xs font-sans font-light text-[--color-muted] leading-relaxed">
          {t('message')}{' '}
          <Link href="/privacy" className="text-[--color-gold] hover:underline">
            {t('learnMore')}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => dismiss('declined')}
            className="px-4 py-1.5 text-[10px] font-sans font-light tracking-wider uppercase text-[--color-muted] border border-[--color-border] rounded hover:border-[--color-charcoal] hover:text-[--color-charcoal] transition-colors"
          >
            {t('decline')}
          </button>
          <button
            onClick={() => dismiss('accepted')}
            className="px-4 py-1.5 text-[10px] font-sans font-light tracking-wider uppercase bg-[--color-charcoal] text-[--color-cream] rounded hover:bg-[--color-gold] transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}

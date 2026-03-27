'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales } from '@/i18n/config'
import { useState, useRef, useEffect } from 'react'

const localeConfig: Record<string, { label: string; flag: string; short: string }> = {
  en: { label: 'English', flag: '🇬🇧', short: 'EN' },
  fr: { label: 'Français', flag: '🇫🇷', short: 'FR' },
  es: { label: 'Español', flag: '🇪🇸', short: 'ES' },
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any })
    setOpen(false)
  }

  const current = localeConfig[locale]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-sans font-light tracking-[0.18em] uppercase text-[--color-muted] hover:text-[--color-charcoal] transition-colors duration-300"
        aria-label="Change language"
      >
        {/* Globe icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {current?.short || locale.toUpperCase()}
      </button>
      {open && (
        <ul className="absolute bottom-full left-0 mb-3 border border-[--color-border] min-w-[10rem] z-50 shadow-lg md:bottom-auto md:top-full md:left-auto md:right-0 md:mb-0 md:mt-3" style={{ backgroundColor: 'var(--color-cream)' }}>
          {locales.map((l) => {
            const cfg = localeConfig[l]
            return (
              <li key={l}>
                <button
                  onClick={() => switchLocale(l)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 text-[11px] tracking-[0.12em] font-sans font-light hover:bg-[--color-gold-light] transition-colors duration-150 ${l === locale ? 'text-[--color-gold]' : 'text-[--color-charcoal]'}`}
                >
                  <span className="text-base leading-none">{cfg.flag}</span>
                  <span>{cfg.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

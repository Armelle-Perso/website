'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  return (
    <footer className="border-t border-[--color-border] bg-[--color-cream] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[--color-muted]">
        <div className="text-center md:text-left">
          <p className="font-serif text-lg text-[--color-charcoal] mb-1">Armelle Boussidan</p>
          <p>{t('artistConsultant')}</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/art" className="hover:text-[--color-charcoal] transition-colors">{nav('art')}</Link>
          <Link href="/consulting" className="hover:text-[--color-charcoal] transition-colors">{nav('consulting')}</Link>
          <Link href="/contact" className="hover:text-[--color-charcoal] transition-colors">{nav('contact')}</Link>
          <Link href="/imprint" className="hover:text-[--color-charcoal] transition-colors">{t('imprint')}</Link>
          <Link href="/privacy" className="hover:text-[--color-charcoal] transition-colors">{t('privacy')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <a href="https://www.instagram.com/armelle.boussidan/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="hover:text-[--color-gold] transition-colors">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://www.redbubble.com/people/ArmelleArt/shop?asc=u" target="_blank" rel="noopener noreferrer" aria-label="Redbubble"
            className="hover:text-[--color-gold] transition-colors">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.248 17.5H8.75a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 1 .75-.75h1.5v-3.5h-1.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75V14h1.248a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-.75.75zM12 4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5z"/>
            </svg>
          </a>
        </div>
      </div>
      <div className="border-t border-[--color-border] py-4 text-center text-xs text-[--color-muted]">
        {t('rights', { year: new Date().getFullYear() })}
      </div>
    </footer>
  )
}

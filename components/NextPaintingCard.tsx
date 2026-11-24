'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

/** Phones and tablets: a visible "Next painting" at the bottom of a painting page. */
export default function NextPaintingCard({ href, title, thumb }: { href: string | null; title: string | null; thumb: string | null }) {
  const t = useTranslations('artworkNav')
  if (!href) return null
  return (
    <div className="lg:hidden max-w-7xl mx-auto px-6 pb-12">
      <Link href={href} className="group flex items-center gap-5 border-t border-[--color-border] pt-8">
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="w-24 h-24 object-cover shrink-0 bg-[--color-gold-light]" loading="lazy" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-gold] mb-2">{t('nextPainting')}</p>
          <p className="font-serif text-xl font-light text-[--color-charcoal] leading-tight">{title}</p>
        </div>
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="shrink-0 text-[--color-muted] group-hover:text-[--color-charcoal] transition-colors">
          <path d="M10 5l9 9-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  )
}

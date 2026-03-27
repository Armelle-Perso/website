'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'

interface Props {
  prevHref?: string | null
  prevTitle?: string | null
  nextHref?: string | null
  nextTitle?: string | null
}

export default function ArtworkNav({ prevHref, prevTitle, nextHref, nextTitle }: Props) {
  const router = useRouter()
  const t = useTranslations('artworkNav')

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevHref) router.push(prevHref)
      if (e.key === 'ArrowRight' && nextHref) router.push(nextHref)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prevHref, nextHref, router])

  return (
    <>
      {/* ── Left / Prev ── */}
      <div className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 ${!prevHref ? 'pointer-events-none opacity-0' : ''}`}>
        {prevHref ? (
          <Link
            href={prevHref}
            className="group flex items-center h-40"
            aria-label={`${t('previous')}: ${prevTitle}`}
          >
            {/* Hit area + reveal panel */}
            <div className="flex items-center h-full pl-0 group-hover:pl-0 transition-all duration-500 ease-out">
              {/* Background panel — slides in from left */}
              <div className="
                flex items-center gap-4
                h-full px-5
                bg-[--color-cream]/0 group-hover:bg-[--color-cream]/95
                backdrop-blur-none group-hover:backdrop-blur-sm
                shadow-none group-hover:shadow-[4px_0_24px_rgba(0,0,0,0.06)]
                transition-all duration-500 ease-out
                overflow-hidden
              ">
                {/* Arrow */}
                <div className="shrink-0 text-[--color-charcoal]/30 group-hover:text-[--color-charcoal] transition-colors duration-300 group-hover:-translate-x-1 transition-transform">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M18 5L9 14l9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Title — hidden until hover */}
                <div className="max-w-0 group-hover:max-w-[180px] overflow-hidden transition-all duration-500 ease-out">
                  <div className="w-[180px] pr-4">
                    <p className="text-[9px] uppercase tracking-[0.25em] font-sans text-[--color-muted] mb-1 whitespace-nowrap">{t('previous')}</p>
                    <p className="font-serif text-sm font-light text-[--color-charcoal] leading-tight line-clamp-2">{prevTitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ) : null}
      </div>

      {/* ── Right / Next ── */}
      <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 ${!nextHref ? 'pointer-events-none opacity-0' : ''}`}>
        {nextHref ? (
          <Link
            href={nextHref}
            className="group flex items-center h-40"
            aria-label={`${t('next')}: ${nextTitle}`}
          >
            <div className="flex items-center h-full transition-all duration-500 ease-out">
              <div className="
                flex items-center gap-4
                h-full px-5
                bg-[--color-cream]/0 group-hover:bg-[--color-cream]/95
                backdrop-blur-none group-hover:backdrop-blur-sm
                shadow-none group-hover:shadow-[-4px_0_24px_rgba(0,0,0,0.06)]
                transition-all duration-500 ease-out
                overflow-hidden
              ">
                {/* Title — hidden until hover, text right-aligned */}
                <div className="max-w-0 group-hover:max-w-[180px] overflow-hidden transition-all duration-500 ease-out">
                  <div className="w-[180px] pl-4 text-right">
                    <p className="text-[9px] uppercase tracking-[0.25em] font-sans text-[--color-muted] mb-1 whitespace-nowrap">{t('next')}</p>
                    <p className="font-serif text-sm font-light text-[--color-charcoal] leading-tight line-clamp-2">{nextTitle}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 text-[--color-charcoal]/30 group-hover:text-[--color-charcoal] transition-colors duration-300 group-hover:translate-x-1 transition-transform">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M10 5l9 9-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ) : null}
      </div>
    </>
  )
}

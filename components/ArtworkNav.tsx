'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { isLightboxOpen } from '@/lib/lightbox-state'

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
      // While the lightbox is open the arrows drive the lightbox, not the page
      if (isLightboxOpen()) return
      if (e.key === 'ArrowLeft' && prevHref) router.push(prevHref)
      if (e.key === 'ArrowRight' && nextHref) router.push(nextHref)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prevHref, nextHref, router])

  // Swipe navigation on touch screens: swipe left = next, swipe right = previous.
  // Only a clear, quick, mostly horizontal one-finger swipe counts, so vertical
  // scrolling and pinch-zoom are untouched. Touches starting at the screen edges
  // are left to the phone's own back gesture. Inactive while the lightbox is open.
  useEffect(() => {
    const EDGE = 24, MIN_DX = 60, MAX_MS = 700
    let sx = 0, sy = 0, st = 0, tracking = false
    const onStart = (e: TouchEvent) => {
      tracking = false
      if (e.touches.length !== 1 || isLightboxOpen()) return
      const t = e.touches[0]
      if (t.clientX < EDGE || t.clientX > window.innerWidth - EDGE) return
      const el = e.target as HTMLElement | null
      if (el?.closest('input, textarea, select, [data-no-swipe]')) return
      sx = t.clientX; sy = t.clientY; st = Date.now(); tracking = true
    }
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return
      tracking = false
      if (isLightboxOpen() || (window.visualViewport && window.visualViewport.scale > 1.01)) return
      const t = e.changedTouches[0]
      const dx = t.clientX - sx, dy = t.clientY - sy
      if (Date.now() - st > MAX_MS || Math.abs(dx) < MIN_DX || Math.abs(dx) < Math.abs(dy) * 1.8) return
      if (dx < 0 && nextHref) router.push(nextHref)
      if (dx > 0 && prevHref) router.push(prevHref)
    }
    const onCancel = () => { tracking = false }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    window.addEventListener('touchcancel', onCancel, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onCancel)
    }
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

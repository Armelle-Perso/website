'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const KEY = 'swipe-hint-seen'

/**
 * Touch screens only: a quiet "swipe to see the next painting" line under the
 * painting, on the visitor's first painting page only. Fades after six
 * seconds, and never comes back for that visitor.
 */
export default function SwipeHint({ enabled }: { enabled: boolean }) {
  const t = useTranslations('artworkNav')
  const [state, setState] = useState<'off' | 'on' | 'fading'>('off')
  useEffect(() => {
    if (!enabled || !window.matchMedia('(pointer: coarse)').matches) return
    try { if (localStorage.getItem(KEY)) return; localStorage.setItem(KEY, '1') } catch { return }
    setState('on')
    const fade = () => setState(s => (s === 'on' ? 'fading' : s))
    const timer = setTimeout(fade, 6000)
    return () => clearTimeout(timer)
  }, [enabled])
  if (state === 'off') return null
  return (
    <p
      aria-hidden
      onTransitionEnd={() => setState('off')}
      className={`lg:hidden mt-3 text-[11px] font-sans font-light tracking-[0.08em] text-[--color-muted] transition-opacity duration-1000 ${state === 'fading' ? 'opacity-0' : 'opacity-100'}`}
    >
      ‹&nbsp;&nbsp;{t('swipeHint')}&nbsp;&nbsp;›
    </p>
  )
}

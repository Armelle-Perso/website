'use client'

import { useEffect, useRef } from 'react'

/**
 * Art page: each catalogue quote fills the screen in turn while scrolling.
 * A quote is fully visible and full size when centred, and fades and shrinks
 * as it moves away. Written straight to the style, no re-render.
 */
export default function ArtQuotes({ quotes, source }: { quotes: { text: string; author: string }[]; source: string }) {
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLElement[]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      for (const el of els) {
        const r = el.getBoundingClientRect()
        const k = Math.min(1, Math.abs(r.top + r.height / 2 - vh / 2) / (vh * 0.6))
        const e = 1 - k * k * (3 - 2 * k)
        el.style.opacity = (0.08 + 0.92 * e).toFixed(3)
        el.style.transform = `scale(${(0.82 + 0.18 * e).toFixed(3)})`
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-6">
      {quotes.map((q, i) => (
        <div key={i} className="min-h-[100svh] flex items-center justify-center">
          <figure ref={el => { refs.current[i] = el }} className="max-w-4xl text-center will-change-transform">
            <div className="w-8 h-px bg-[--color-gold] mx-auto mb-10" />
            <blockquote className="font-serif text-3xl md:text-5xl font-light italic leading-tight text-[--color-charcoal]">
              {q.text}
            </blockquote>
            <figcaption className="mt-8 text-[10px] md:text-xs uppercase tracking-[0.25em] font-sans font-light text-[--color-muted]">
              {q.author}
            </figcaption>
          </figure>
        </div>
      ))}
      <p className="max-w-4xl mx-auto -mt-16 pb-24 text-center text-xs font-sans font-light italic text-[--color-muted] leading-relaxed">
        {source}
      </p>
    </section>
  )
}

'use client'

import { useEffect, useRef } from 'react'

/**
 * Art page: each catalogue quote fills the screen in turn while scrolling.
 * A quote is fully visible and full size when centred, and fades and shrinks
 * as it moves away. Written straight to the style, no re-render.
 */
export default function ArtQuotes({ quotes, source, bg }: { quotes: { text: string; author: string; note?: string; bg?: string }[]; source?: string; bg?: string }) {
  const refs = useRef<(HTMLElement | null)[]>([])
  const bgRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLElement[]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { bgRefs.current.forEach(b => { if (b) b.style.opacity = '1' }); return }
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      for (const [i, el] of els.entries()) {
        const r = el.getBoundingClientRect()
        const k = Math.min(1, Math.abs(r.top + r.height / 2 - vh / 2) / (vh * 0.6))
        const e = 1 - k * k * (3 - 2 * k)
        el.style.opacity = (0.08 + 0.92 * e).toFixed(3)
        el.style.transform = `scale(${(0.82 + 0.18 * e).toFixed(3)})`
        const b = bgRefs.current[i]
        if (b) { const k2 = Math.min(1, Math.abs(r.top + r.height / 2 - vh / 2) / (vh * 0.95)); const e2 = 1 - k2 * k2 * (3 - 2 * k2); b.style.opacity = (e2 * e2).toFixed(3) }   // background fades in from the page colour, then out
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <section>
      {quotes.map((q, i) => (
        <div key={i} className="relative min-h-[100svh] flex items-center justify-center px-6 overflow-hidden">
          {(q.bg || bg) && (
            <div ref={el => { bgRefs.current[i] = el }} aria-hidden className="absolute inset-0 pointer-events-none"
              style={{ opacity: 0, maskImage: 'linear-gradient(transparent, #000 35%, #000 65%, transparent)', WebkitMaskImage: 'linear-gradient(transparent, #000 35%, #000 65%, transparent)', background: `linear-gradient(color-mix(in srgb, var(--color-cream) 80%, transparent), color-mix(in srgb, var(--color-cream) 80%, transparent)), url(${q.bg || bg}) center / cover` }} />
          )}
          <figure ref={el => { refs.current[i] = el }} className="relative max-w-4xl text-center will-change-transform">
            <div className="w-8 h-px bg-[--color-gold] mx-auto mb-10" />
            <blockquote className="font-serif text-3xl md:text-5xl font-light italic leading-tight text-[--color-charcoal]">
              {q.text}
            </blockquote>
            <figcaption className="mt-8 text-[10px] md:text-xs uppercase tracking-[0.25em] font-sans font-light text-[--color-muted]">
              {q.author}
            </figcaption>
            {q.note && (
              <p className="mt-3 text-xs font-sans font-light italic text-[--color-muted] leading-relaxed">{q.note}</p>
            )}
          </figure>
        </div>
      ))}
      {source && <p className="max-w-4xl mx-auto px-6 pt-8 pb-24 text-center text-xs font-sans font-light italic text-[--color-muted] leading-relaxed">
        {source}
      </p>}
    </section>
  )
}

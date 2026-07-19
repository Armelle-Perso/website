'use client'

import { useState, useEffect, useCallback } from 'react'

type Testimonial = { quote: string; name: string; role?: string; translatedFrom?: string | null }

export default function TestimonialsCarousel({
  testimonials,
  title,
}: {
  testimonials: Testimonial[]
  title: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = testimonials.length

  const go = useCallback((i: number) => setIndex((i + count) % count), [count])

  // Time each slide by its own reading length: base buffer + words ÷ reading speed.
  // Adapts automatically to each testimonial and to the displayed language.
  useEffect(() => {
    if (paused || count <= 1) return
    const READING_WPM = 160
    const words = testimonials[index].quote.trim().split(/\s+/).filter(Boolean).length
    const ms = Math.min(Math.max(2500 + (words / READING_WPM) * 60000, 6000), 120000)
    const id = setTimeout(() => setIndex((v) => (v + 1) % count), ms)
    return () => clearTimeout(id)
  }, [index, paused, count, testimonials])

  if (count === 0) return null

  const current = testimonials[index]

  return (
    <section
      className="mb-28 pb-28 border-b border-[--color-border]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
        {title}
      </p>

      <div className="relative max-w-3xl mx-auto text-center min-h-[11rem] flex flex-col items-center justify-center">
        <figure key={index} style={{ animation: 'testimonialFade 0.6s ease' }} className="space-y-5">
          <blockquote className="font-serif text-xl md:text-2xl font-light leading-relaxed text-[--color-charcoal]">
            “{current.quote}”
          </blockquote>
          <figcaption className="space-y-1">
            <span className="block text-[11px] uppercase tracking-[0.15em] text-[--color-muted] font-sans font-light">
              {current.name}
              {current.role ? `, ${current.role}` : ''}
            </span>
            {current.translatedFrom && (
              <span className="block text-[10px] tracking-[0.1em] text-[--color-muted] font-sans font-light italic opacity-70">
                {current.translatedFrom}
              </span>
            )}
          </figcaption>
        </figure>
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Show testimonial ${i + 1} of ${count}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? 'w-6 bg-[--color-gold]'
                  : 'w-1.5 bg-[--color-border] hover:bg-[--color-muted]'
              }`}
            />
          ))}
        </div>
      )}

      <style>{`@keyframes testimonialFade { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </section>
  )
}

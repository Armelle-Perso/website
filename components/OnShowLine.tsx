'use client'

import { useEffect, useState } from 'react'
import { ON_SHOW } from '@/lib/on-show'

/**
 * "On show at …" line on a painting page. Decided in the browser, so it
 * appears by itself on the start date (and disappears after the end date)
 * without a new deploy.
 */
export default function OnShowLine({ artworkSlug, locale }: { artworkSlug: string; locale: string }) {
  const [show, setShow] = useState<(typeof ON_SHOW)[number] | null>(null)
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    setShow(ON_SHOW.find(s => s.works.includes(artworkSlug) && today >= s.start && (!s.end || today <= s.end)) || null)
  }, [artworkSlug])
  if (!show) return null
  const tx = show.text[locale as keyof typeof show.text] || show.text.en
  return (
    <p className="mt-5 font-sans text-sm font-light leading-relaxed text-[--color-charcoal]">
      {tx.before}
      <a href={show.url} target="_blank" rel="noopener noreferrer"
        className="text-[--color-gold] underline decoration-[--color-gold] underline-offset-4 hover:text-[--color-charcoal] transition-colors">
        {show.venue}
      </a>
      {tx.after}
    </p>
  )
}

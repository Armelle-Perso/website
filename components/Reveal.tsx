'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

/** Fades and lifts its content in when it scrolls into view, after `delay` ms. */
export default function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return }
    const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setShown(true); obs.disconnect() } }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}
      style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(24px)',
        transition: `opacity 1.1s ease ${delay}ms, transform 1.1s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

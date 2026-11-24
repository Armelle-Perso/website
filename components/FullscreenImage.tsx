'use client'

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { setLightboxOpen } from '@/lib/lightbox-state'

interface Slide {
  src: string
  alt?: string
}

interface FullscreenImageProps {
  slides: Slide[]
  index: number
  children: ReactNode
  /** Full href for each slide, e.g. "/art/paintings/lightcodes-2021/some-artwork" */
  hrefs?: string[]
}

const MAX = 4
const STEP = 1.6

/*
 * The painting in normal view can be zoomed in place (pinch on phones, the
 * + / − buttons, ctrl + wheel or a trackpad pinch on PC, the wheel once zoomed),
 * and dragged when zoomed. A plain click/tap at 1× opens the fullscreen viewer,
 * which has its own zoom (pinch, double tap, wheel, buttons). When zoomed, the
 * high-resolution fullscreen image is loaded so details stay sharp.
 */
export default function FullscreenImage({ slides, index, children, hrefs }: FullscreenImageProps) {
  const [open, setOpen] = useState(false)
  const currentIndex = useRef(index)
  const router = useRouter()
  const t = useTranslations('artworkNav')

  const box = useRef<HTMLDivElement>(null)
  const [view, setView] = useState({ s: 1, x: 0, y: 0 })
  const v = useRef(view)
  const [hiRes, setHiRes] = useState(false)
  const moved = useRef(false)

  const apply = useCallback((s: number, x: number, y: number) => {
    const el = box.current
    if (!el) return
    s = Math.min(MAX, Math.max(1, s))
    const w = el.clientWidth, h = el.clientHeight
    x = Math.min(0, Math.max(w - w * s, x))
    y = Math.min(0, Math.max(h - h * s, y))
    if (s === 1) { x = 0; y = 0 }
    v.current = { s, x, y }
    setView(v.current)
    if (s > 1) setHiRes(true)
  }, [])

  // zoom keeping the point (cx, cy) of the box still
  const zoomAt = useCallback((s2: number, cx: number, cy: number) => {
    const { s, x, y } = v.current
    s2 = Math.min(MAX, Math.max(1, s2))
    apply(s2, cx - (cx - x) * (s2 / s), cy - (cy - y) * (s2 / s))
  }, [apply])

  const zoomCentre = (f: number) => {
    const el = box.current
    if (!el) return
    zoomAt(v.current.s * f, el.clientWidth / 2, el.clientHeight / 2)
  }

  // a new painting (client navigation) starts unzoomed
  useEffect(() => { apply(1, 0, 0); setHiRes(false) }, [index, slides, apply])

  useEffect(() => {
    const el = box.current
    if (!el) return
    const rel = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect()
      return [cx - r.left, cy - r.top]
    }

    // wheel: ctrl + wheel (and trackpad pinch) always zooms the painting;
    // the plain wheel zooms only once zoomed, otherwise the page scrolls
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && v.current.s === 1) return
      e.preventDefault()
      const [cx, cy] = rel(e.clientX, e.clientY)
      zoomAt(v.current.s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), cx, cy)
    }

    // touch: two fingers pinch-zoom, one finger drags when zoomed
    let pinch: { d: number; s: number } | null = null
    let drag: { px: number; py: number } | null = null
    const dist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinch = { d: dist(e.touches[0], e.touches[1]), s: v.current.s }
        drag = null; moved.current = true
      } else if (e.touches.length === 1 && v.current.s > 1) {
        drag = { px: e.touches[0].clientX, py: e.touches[0].clientY }
        moved.current = false
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (pinch && e.touches.length === 2) {
        e.preventDefault()
        const [a, b] = [e.touches[0], e.touches[1]]
        const [cx, cy] = rel((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2)
        zoomAt(pinch.s * dist(a, b) / pinch.d, cx, cy)
      } else if (drag && e.touches.length === 1) {
        e.preventDefault()
        const tt = e.touches[0]
        const dx = tt.clientX - drag.px, dy = tt.clientY - drag.py
        if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true
        drag = { px: tt.clientX, py: tt.clientY }
        apply(v.current.s, v.current.x + dx, v.current.y + dy)
      }
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinch = null
      if (e.touches.length === 0) drag = null
    }

    // mouse: drag when zoomed
    let mdrag: { px: number; py: number } | null = null
    const onMouseDown = (e: MouseEvent) => {
      if (v.current.s === 1 || e.button !== 0) return
      e.preventDefault()
      mdrag = { px: e.clientX, py: e.clientY }; moved.current = false
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!mdrag) return
      const dx = e.clientX - mdrag.px, dy = e.clientY - mdrag.py
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true
      mdrag = { px: e.clientX, py: e.clientY }
      apply(v.current.s, v.current.x + dx, v.current.y + dy)
    }
    const onMouseUp = () => { mdrag = null }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [apply, zoomAt])

  const openViewer = () => { setOpen(true); setLightboxOpen(true) }

  const handleClose = useCallback(() => {
    setOpen(false)
    setLightboxOpen(false)
    // If user navigated to a different slide, go to that artwork's page
    if (hrefs && currentIndex.current !== index) {
      const target = hrefs[currentIndex.current]
      if (target) {
        router.push(target)
      }
    }
  }, [hrefs, index, router])

  const zoomed = view.s > 1
  const btn = 'flex items-center justify-center h-8 min-w-8 px-1.5 text-[--color-muted] hover:text-[--color-gold] transition-colors disabled:opacity-30 disabled:hover:text-[--color-muted]'

  return (
    <>
      <div className="relative max-w-full min-w-0">
        <div
          ref={box}
          className={`relative overflow-hidden select-none ${zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
          style={{ touchAction: zoomed ? 'none' : 'pan-y' }}
          {...(zoomed ? { 'data-no-swipe': '' } : {})}
          role="button"
          tabIndex={0}
          aria-label={t('fullscreen')}
          onClick={() => { if (!zoomed && !moved.current) openViewer(); moved.current = false }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openViewer() } }}
        >
          <div
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`, transformOrigin: '0 0' }}
            className="relative [&>img]:block"
          >
            {children}
            {hiRes && slides[index] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slides[index].src} alt="" aria-hidden draggable={false}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            )}
          </div>
        </div>

        {/* controls under the painting: zoom out / in, full screen */}
        <div className="mt-3 flex justify-end items-center gap-1">
          {(
            <button type="button" className={btn} onClick={() => zoomCentre(1 / STEP)} disabled={!zoomed} aria-label={t('zoomOut')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            </button>
          )}
          <button type="button" className={btn} onClick={() => zoomCentre(STEP)} disabled={view.s >= MAX} aria-label={t('zoomIn')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </button>
          <button type="button" className={`${btn} gap-2 ml-2`} onClick={openViewer} aria-label={t('fullscreen')}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="font-sans text-[10px] uppercase tracking-[0.18em]">{t('fullscreen')}</span>
          </button>
        </div>
      </div>

      <Lightbox
        open={open}
        close={handleClose}
        index={index}
        slides={slides}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 2, scrollToZoom: true, doubleClickMaxStops: 2 }}
        on={{ view: ({ index: i }) => { currentIndex.current = i } }}
        styles={{
          container: { backgroundColor: 'rgba(28, 28, 28, 0.97)' },
        }}
      />
    </>
  )
}

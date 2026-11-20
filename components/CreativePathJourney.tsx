'use client'

// "Creative path" as a journey: the text is read on the left, the paintings
// follow the reading on the right (canvas), with a full-screen painting at each
// chapter. Text and images: lib/creative-path.ts + lib/creative-path-journey.ts.
// Rules chosen by Armelle (Nov 2026): images follow the order of the text, a
// series' image comes only once its name is read, no image is ever repeated,
// slow and gentle movement, and images also change at reading pace when the
// reader does not scroll.

import { useEffect, useRef } from 'react'
import { Fragment } from 'react'
import { SERIES_LINKS } from '@/lib/creative-path'
import { M33_URL } from '@/components/LinkM33'
import type { JourneyImage, JourneyLayout } from '@/lib/creative-path-journey'
import './creative-path-journey.css'

type Props = {
  locale: string
  title: string
  headings: string[]
  source: string
  layout: JourneyLayout
  images: Record<string, JourneyImage>
  captions: Record<string, string>
  labels: { label: string; seeAvailable: string; tbc: string; seePainting: string }
}

const prefix = (locale: string) => (locale === 'en' ? '' : `/${locale}`)

// **Series** = link to the series page (new tab), *Title* = italics, M33 = link to the studio
function Rich({ text, locale }: { text: string; locale: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**')) {
          const name = part.slice(2, -2), slug = SERIES_LINKS[name]
          return slug ? (
            <a key={i} className="series" href={`${prefix(locale)}/art/paintings/${slug}`} target="_blank" rel="noopener">{name}</a>
          ) : <strong key={i} style={{ fontWeight: 400 }}>{name}</strong>
        }
        if (part.startsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
        return part.split(/(\bM33\b(?!-))/g).map((q, j) =>
          q === 'M33'
            ? <a key={`${i}-${j}`} className="series" href={M33_URL} target="_blank" rel="noopener noreferrer">M33</a>
            : <Fragment key={`${i}-${j}`}>{q}</Fragment>
        )
      })}
    </>
  )
}

function Para({ chunks, cls, locale }: { chunks: JourneyLayout['intro'][number]; cls?: string; locale: string }) {
  return (
    <p className={`body ${cls || ''}`}>
      {chunks.map(([k, t], i) => (
        <span key={i} className="c" data-k={JSON.stringify(k)}><Rich text={t} locale={locale} />{' '}</span>
      ))}
    </p>
  )
}

export default function CreativePathJourney(props: Props) {
  const { locale, title, headings, source, layout, labels } = props
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    return startJourney(el, props)
    // the page is static per locale: run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const P = prefix(locale)
  return (
    <div className="cpj" ref={root}>
      <div className="bar" data-r="bar" />
      <div className="full" data-r="full" aria-hidden="true">
        <div className="img bgblur" data-r="fullbg" />
        <div className="img" data-r="fullimg" />
        <div className="shade" />
        <div className="ttl"><small data-r="fullsmall">{labels.label}</small><span data-r="fullttl" /></div>
      </div>
      <div className="wrap">
        <main className="text" data-r="text" lang={locale}>
          <div className="head">
            <p className="sub">{labels.label}</p>
            <h1>{title}</h1>
            <div className="rule" />
          </div>
          {layout.intro.map((c, i) => <Para key={`i${i}`} chunks={c} cls="intro" locale={locale} />)}
          {layout.sections.map((sec, si) => {
            if (!sec.full) {
              return (
                <Fragment key={si}>
                  <h2 style={{ marginTop: '6vh' }}>{headings[si]}</h2>
                  {sec.ps.map((c, j) => <Para key={j} chunks={c} locale={locale} />)}
                </Fragment>
              )
            }
            return (
              <Fragment key={si}>
                <div className="gap" data-full={sec.full} data-h={headings[si]}><h2>{headings[si]}</h2></div>
                {sec.ps.map((c, j) => (
                  <Fragment key={j}>
                    <Para chunks={c} locale={locale} cls={j === sec.ps.length - 1 ? 'last' : ''} />
                    {sec.interlude && sec.interlude.after === j && (
                      <div className="gap interlude" data-full={sec.interlude.key} data-h="" />
                    )}
                  </Fragment>
                ))}
              </Fragment>
            )
          })}
          <p className="tbc">{labels.tbc}</p>
          <p className="src">{source}</p>
          <a className="see" href={`${P}/art/paintings/available`}>
            <span>{labels.seeAvailable.replace(' →', '')}</span><span>→</span>
          </a>
        </main>
        <aside className="frame-col">
          <div className="frame" data-r="frame">
            <canvas data-r="canvas" aria-hidden="true" />
            <div className="label" data-r="label">
              <div data-r="ltxt" />
              <a data-r="ll" href="#" target="_blank" rel="noopener">{labels.seePainting}</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// The engine (same behaviour as the approved prototype, draft 11)
// ---------------------------------------------------------------------------
type Img = JourneyImage & { lo?: HTMLImageElement; hi?: HTMLImageElement; cap?: string }
type Ch = {
  els: HTMLElement[]; p: Img; part: number; parts: number
  tail?: HTMLElement; gap?: HTMLElement; type?: string; z?: number; dir?: number; hold?: number
}

function startJourney(root: HTMLElement, props: Props): () => void {
  const r = (n: string) => root.querySelector(`[data-r="${n}"]`) as HTMLElement
  const canvas = r('canvas') as HTMLCanvasElement, ctx = canvas.getContext('2d')!
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const q = new URLSearchParams(location.search)
  const base = prefix(props.locale)
  let W = 0, H = 0, DPR = 1
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

  // images, with the caption in the reader's language
  const P: Record<string, Img> = {}
  for (const [k, v] of Object.entries(props.images)) P[k] = { ...v, cap: props.captions[k] }

  // ---- read the text: one image per sentence group, built from the page itself ----
  const CH: Ch[] = []
  const GAPS: { el: HTMLElement; h: string; cap?: string; p: Img }[] = []
  let pendingHold: HTMLElement[] = []
  let pendingGap: HTMLElement | null = null
  root.querySelectorAll<HTMLElement>('[data-r="text"] .gap, [data-r="text"] span.c').forEach(node => {
    if (node.classList.contains('gap')) {
      if (CH.length) CH[CH.length - 1].tail = node
      const p = P[node.dataset.full!]
      GAPS.push({ el: node, h: node.dataset.h || '', cap: p.cap, p })
      pendingGap = node
      return
    }
    const k = JSON.parse(node.dataset.k!) as string | string[]
    const ks = Array.isArray(k) ? k : [k]
    // 'hold': the text continues the image already shown, unless a full screen came in between
    if (ks[0] === 'hold' && CH.length && !CH[CH.length - 1].tail) { CH[CH.length - 1].els.push(node); return }
    if (ks[0] === 'hold') { pendingHold.push(node); return }
    ks.forEach((kk, j) => {
      const els = j === 0 ? [...pendingHold, node] : [node]
      const c: Ch = { els, p: P[kk], part: j, parts: ks.length }
      if (pendingGap && j === 0) { c.gap = pendingGap; pendingGap = null }
      CH.push(c)
    })
    pendingHold = []
  })
  const N = CH.length
  if (!N) return () => {}

  // images change at reading pace inside each chapter
  const WPS = 230 / 60
  type Grp = { m0: number; end: number; dur: number[]; first: HTMLElement; lastEl: HTMLElement; tx: number | null; lt: number | null }
  const TIMEDP: Grp[] = []
  CH.forEach((c, j) => {
    const last = TIMEDP[TIMEDP.length - 1]
    const words = c.els.map(e => e.textContent || '').join(' ').split(/\s+/).filter(Boolean).length / (c.parts || 1)
    const dur = Math.max(4, words / WPS)
    if (last && !c.gap) { last.end = j + 1; last.dur.push(dur); last.lastEl = c.els[c.els.length - 1] }
    else TIMEDP.push({ m0: j, end: j + 1, dur: [dur], first: c.els[0], lastEl: c.els[c.els.length - 1], tx: null, lt: null })
  })
  for (let k = TIMEDP.length - 1; k >= 0; k--) if (TIMEDP[k].end - TIMEDP[k].m0 < 2) TIMEDP.splice(k, 1)

  // load images: small first, then large, in reading order
  for (const p of Object.values(P)) {
    p.lo = new Image(); p.hi = new Image()
    p.lo.src = p.photo ? p.u : p.u + '?w=500&fm=jpg&q=70'
  }
  const order = [...new Set(CH.map(c => c.p))]
  let alive = true
  ;(function hi(i: number) {
    if (!alive || i >= order.length) return
    const p = order[i]
    p.hi!.onload = p.hi!.onerror = () => hi(i + 1)
    p.hi!.src = p.photo ? p.u : p.u + '?w=2200&fm=jpg&q=82'
  })(0)

  const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const smooth = (t: number) => t * t * (3 - 2 * t)

  // a different, slow movement for each passage
  let seed = 11
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  CH.forEach((c, i) => {
    const types = c.p.photo ? ['centre', 'pullback'] : ['d1', 'd2', 'pullback', 'pan', 'centre']
    c.type = types[(i * 3 + Math.floor(rnd() * 5)) % types.length]
    if (i > 0 && c.type === CH[i - 1].type) c.type = types[(types.indexOf(c.type) + 1) % types.length]
    c.z = c.p.photo ? 1.06 + rnd() * 0.04 : 1.18 + rnd() * 0.14
    c.dir = rnd() < 0.5 ? -1 : 1
    c.hold = 0.3 + rnd() * 0.12
    if (c.p.cam) { c.type = c.p.cam; if (c.p.camZ) c.z = c.p.camZ / 0.92 }
  })
  const d = (p: Img, n: 1 | 2) => (n === 1 ? p.d1 : p.d2) || [0.5, 0.5]
  function camera(c: Ch, t: number) {
    const p = c.p, k = smooth(clamp((t - c.hold!) / (1 - c.hold!))), kk = smooth(clamp(t))
    switch (c.type) {
      case 'd1': return { x: lerp(.5, d(p, 1)[0], k), y: lerp(.5, d(p, 1)[1], k), z: lerp(1, c.z!, k) }
      case 'd2': return { x: lerp(.5, d(p, 2)[0], k), y: lerp(.5, d(p, 2)[1], k), z: lerp(1, c.z!, k) }
      case 'pullback': return { x: lerp(d(p, 1)[0], .5, kk), y: lerp(d(p, 1)[1], .5, kk), z: lerp(c.z!, 1, kk) }
      case 'pan': return { x: lerp(.5 - .12 * c.dir!, .5 + .12 * c.dir!, kk), y: .5, z: c.z! * 0.95 }
      case 'still': return { x: .5, y: .5, z: 1 }
      default: return { x: .5, y: .5, z: lerp(1, c.z! * 0.92, kk) }
    }
  }
  function draw(p: Img, cam: { x: number; y: number; z: number }, alpha: number) {
    const img = p.hi!.complete && p.hi!.naturalWidth ? p.hi! : (p.lo!.complete && p.lo!.naturalWidth ? p.lo! : null)
    if (!img || alpha <= 0) return
    const pw = p.w || img.naturalWidth, ph = p.h || img.naturalHeight
    const s = Math.min(W / pw, H / ph) * cam.z, iw = pw * s, ih = ph * s
    const hx = W / 2 / iw, hy = H / 2 / ih
    const cx = hx < .5 ? clamp(cam.x, hx, 1 - hx) : .5
    const cy = hy < .5 ? clamp(cam.y, hy, 1 - hy) : .5
    ctx.globalAlpha = alpha
    ctx.drawImage(img, W / 2 - cx * iw, H / 2 - cy * ih, iw, ih)
    ctx.globalAlpha = 1
  }

  let shown = -1, labTimer = 0
  function render(x: number) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    ctx.clearRect(0, 0, W, H)
    x = clamp(x, 0, N - 0.0001)
    const i = Math.floor(x), t = x - i, c = CH[i], pc = CH[i - 1]
    const FADE = c.p.fade || 0.42
    if (pc && pc.p !== c.p && t < FADE) { const k = smooth(t / FADE); draw(pc.p, camera(pc, 1), 1 - k); draw(c.p, camera(c, t), k) }
    else draw(c.p, camera(c, t), 1)
    if (i !== shown) {
      shown = i
      CH.forEach((dd, j) => dd.els.forEach(e => e.classList.toggle('reading', j === i)))
      const lab = r('label'); lab.style.opacity = '0'
      clearTimeout(labTimer)
      labTimer = window.setTimeout(() => {
        const p = c.p, ll = r('ll') as HTMLAnchorElement
        if (p.photo) { r('ltxt').innerHTML = `<span class="cap">${esc(p.cap || '')}</span>`; ll.style.display = 'none' }
        else {
          r('ltxt').innerHTML = `<span class="t">${esc(p.t || '')}</span> <span class="m">${esc(p.s || '')} · ${p.years}${p.dim ? ' · ' + esc(p.dim) : ''}</span>`
          ll.style.display = ''; ll.href = `${base}/art/paintings/${p.ss}/${p.sl}`
        }
        lab.style.opacity = '1'
      }, 500)
    }
  }

  // reading position: a sentence group plays while it travels from 75 % to 30 % of the screen
  let lastY = scrollY
  function reading() {
    if (q.get('x') !== null) return +q.get('x')!
    const A = innerHeight * 0.75, B = innerHeight * 0.30
    let x = 0
    for (let i = 0; i < N; i += CH[i].parts || 1) {
      const r0 = CH[i].els[0].getBoundingClientRect(), r1 = CH[i].els[CH[i].els.length - 1].getBoundingClientRect()
      const rr = { top: r0.top, bottom: r1.bottom }
      if (CH[i].tail) { const g = CH[i].tail!.getBoundingClientRect(); rr.bottom = Math.max(rr.bottom, g.top + g.height * 0.5 - innerHeight * 0.5 + B) }
      if (CH[i].p.stretch) rr.bottom += CH[i].p.stretch! * innerHeight
      let top = rr.top
      if (CH[i].gap) { const g = CH[i].gap!.getBoundingClientRect(); top = Math.min(top, g.top + g.height * 0.5 - innerHeight * 0.5 + A) }
      if (top > A) break
      x = i + clamp((A - top) / Math.max(1, rr.bottom - top + (A - B))) * (CH[i].parts || 1)
      if (rr.bottom > B) break
    }
    // inside a chapter, images follow the reading pace even without scrolling,
    // never ahead of text not on screen yet, and rewind when scrolling back up
    if (+r('full').style.opacity < 0.05) {
      const now = performance.now()
      for (const pp of TIMEDP) {
        const a = pp.first.getBoundingClientRect(), z = pp.lastEl.getBoundingClientRect()
        if (a.top > innerHeight) { pp.tx = null; pp.lt = null; continue }
        const active = a.top < innerHeight * 0.75 && z.bottom > innerHeight * 0.08
        if (!active) { pp.lt = null; continue }
        if (pp.tx == null) pp.tx = pp.m0
        let reached = pp.m0
        for (let j = pp.m0; j < pp.end; j++) {
          // a new paragraph counts as reached once it is in the reading zone; inside a paragraph, once its series name is well above the middle
          const e = CH[j].els[0], startsPara = e.parentElement?.firstElementChild === e
          if (e.getBoundingClientRect().top < innerHeight * (startsPara ? 0.55 : 0.38)) reached = j
        }
        pp.tx = Math.max(pp.tx, reached)
        if (scrollY < lastY - 0.5) {
          let back = pp.m0
          for (let j = pp.m0; j < pp.end; j++) if (CH[j].els[0].getBoundingClientRect().top < innerHeight * 0.6) back = j
          pp.tx = Math.min(pp.tx, back + 0.5)
        }
        const dt = pp.lt ? Math.min(0.1, (now - pp.lt) / 1000) : 0; pp.lt = now
        const j = Math.min(pp.end - 1, Math.floor(pp.tx))
        pp.tx = Math.min(pp.end - 0.001, pp.tx + dt / pp.dur[j - pp.m0])
        // never ahead of text that is not on screen (a new paragraph may start anywhere on screen)
        const ahead = (n: number) => { const e = CH[n].els[0]; return e.getBoundingClientRect().top > innerHeight * (e.parentElement?.firstElementChild === e ? 1 : 0.9) }
        while (Math.floor(pp.tx) > pp.m0 && ahead(Math.floor(pp.tx))) pp.tx = Math.floor(pp.tx) - 0.001
        if (x >= pp.m0 - 1 && x < pp.end) x = pp.tx
      }
    }
    lastY = scrollY
    if (reduce) x = Math.floor(x) + 0.2
    return x
  }

  // the page takes on the colour of the painting being read (very lightly)
  const html = document.documentElement, body = document.body
  const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
  const colOf = (p: Img) => (p.c ? hex(p.c) : [150, 140, 125])
  let baseCol = [250, 249, 246], dark = false
  const readTheme = () => {
    dark = html.getAttribute('data-theme') === 'dark'
    const v = getComputedStyle(html).getPropertyValue('--color-cream').trim()
    baseCol = /^#[0-9a-f]{6}$/i.test(v) ? hex(v) : (dark ? [20, 20, 20] : [250, 249, 246])
  }
  readTheme()
  const mo = new MutationObserver(readTheme)
  mo.observe(html, { attributes: true, attributeFilter: ['data-theme', 'class'] })
  let tintNow: number[] | null = null
  function tint(x: number) {
    x = clamp(x, 0, N - 0.0001)
    const i = Math.floor(x), t = x - i, c = CH[i], pc = CH[i - 1]
    let col = colOf(c.p)
    if (pc) { const k = smooth(clamp(t / 0.28)); const a = colOf(pc.p); col = a.map((v, j) => lerp(v, col[j], k)) }
    const amt = dark ? 0.13 : 0.09
    const target = baseCol.map((v, j) => lerp(v, col[j], amt))
    tintNow = tintNow ? tintNow.map((v, j) => lerp(v, target[j], 0.05)) : target
    const rgb = `rgb(${tintNow.map(Math.round).join(',')})`
    html.style.setProperty('background-color', rgb, 'important')
    body.style.setProperty('background-color', rgb, 'important')
    root.style.setProperty('--cpj-tint', rgb)
  }

  // at each chapter, the painting briefly fills the whole screen with the chapter title
  let fullIdx = -1
  function chapters() {
    const forced = q.get('chap')
    let best = 0, bi = -1, prog = 0
    GAPS.forEach((g, j) => {
      const rr = g.el.getBoundingClientRect()
      const dd = (rr.top + rr.height * 0.5 - innerHeight * 0.5) / (innerHeight * 0.42)
      const o = clamp(1 - Math.abs(dd)); if (o > best) { best = o; bi = j; prog = dd }
    })
    if (forced !== null) { bi = +forced; best = 1; prog = 0 }
    const full = r('full')
    if (bi < 0 || best <= 0) { full.style.opacity = '0'; return }
    const g = GAPS[bi]
    if (bi !== fullIdx) {
      fullIdx = bi
      const url = `url("${g.p.photo ? (g.p.full || g.p.u) : g.p.u + '?fm=jpg&q=90'}")`
      r('fullimg').style.backgroundImage = url
      r('fullttl').textContent = g.h
      r('fullsmall').textContent = g.h ? props.labels.label : (g.cap || '')
    }
    full.style.opacity = String(smooth(clamp(best * 1.6)))
    r('fullimg').style.transform = `scale(${1 + 0.04 * (1 - prog) / 2}) translateY(${prog * -1.5}%)`
  }

  let cur = 0, raf = 0
  function frame() {
    const tg = reading()
    cur = (reduce || q.get('x') !== null || +r('full').style.opacity > 0.85) ? tg : cur + (tg - cur) * 0.022
    render(cur)
    tint(cur)
    chapters()
    r('bar').style.width = (clamp(scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100) + '%'
    raf = requestAnimationFrame(frame)
  }
  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2)
    const rr = r('frame').getBoundingClientRect(); W = rr.width; H = rr.height
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR)
    ctx.imageSmoothingQuality = 'high'
  }
  const onVis = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0 } else if (!raf) raf = requestAnimationFrame(frame) }
  addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVis)
  resize(); cur = reading(); raf = requestAnimationFrame(frame)

  // leaving the page: stop everything and give the site its colours back
  return () => {
    alive = false
    cancelAnimationFrame(raf)
    clearTimeout(labTimer)
    removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVis)
    mo.disconnect()
    html.style.removeProperty('background-color')
    body.style.removeProperty('background-color')
  }
}

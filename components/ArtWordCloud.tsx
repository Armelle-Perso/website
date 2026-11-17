'use client'

import { useEffect, useRef, useState } from 'react'

// Word cloud of Armelle's painting style (art page). Same visual language as
// components/WordCloud.tsx (consulting), built from her own keywords:
// approach, gesture, pictorial language, colour, matter. Categories are mixed
// in space; each category is a superimposed layer (its own constellation).
// Source files: CREA/SITE PERSO/Nuage-mon-style (version 2026-11-15 finale).

const SERIF = '"Cormorant Garamond", Georgia, serif'
const SANS = '"Plus Jakarta Sans", system-ui, sans-serif'
const CX = 350, CY = 300
const R = 80

const texts: Record<string, string[]> = {
  fr: ["Énergie", "Intuition", "Canaliser", "Invisible", "Sensible", "Intime", "Art visionnaire", "Flux", "Méditation", "Cérémonie", "Cosmique", "Nature", "Plantes", "Geste", "Expressionnisme", "Action painting", "Coulures", "Mouvement", "Danse", "Corps", "Langage pictural", "Abstraction lyrique", "Biomorphisme", "Signe", "Symboles", "Vibration", "Couleur", "Contraste", "Vivacité", "Lumière", "Matière", "Texture", "Sables", "Terres", "Superpositions", "Acryliques", "Posca", "Encre", "Organique", "Minéral", "Conscience"],
  en: ["Energy", "Intuition", "Channel", "Invisible", "Sensitive", "Intimate", "Visionary art", "Flow", "Meditation", "Ceremony", "Cosmic", "Nature", "Plants", "Gesture", "Expressionism", "Action painting", "Drips", "Movement", "Dance", "Body", "Pictorial language", "Lyrical abstraction", "Biomorphism", "Sign", "Symbols", "Vibrancy", "Colour", "Contrast", "Vividness", "Light", "Matter", "Texture", "Sands", "Earths", "Layering", "Acrylics", "Posca", "Ink", "Organic", "Mineral", "Consciousness"],
  es: ["Energía", "Intuición", "Canalizar", "Invisible", "Sensible", "Íntimo", "Arte visionario", "Flujo", "Meditación", "Ceremonia", "Cósmico", "Naturaleza", "Plantas", "Gesto", "Expresionismo", "Action painting", "Chorreados", "Movimiento", "Danza", "Cuerpo", "Lenguaje pictórico", "Abstracción lírica", "Biomorfismo", "Signo", "Símbolos", "Vibración", "Color", "Contraste", "Viveza", "Luz", "Materia", "Textura", "Arenas", "Tierras", "Capas", "Acrílicos", "Posca", "Tinta", "Orgánico", "Mineral", "Conciencia"],
}

interface WL { x: number; y: number; size: number; font: string; color: string; opacity: number; rotate: number }
const W: WL[] = [
  { x: 350, y: 300, size: 26, font: 'serif', color: '--color-charcoal', opacity: 1, rotate: 0 },
  { x: 351, y: 166, size: 23, font: 'serif', color: '--color-gold', opacity: 0.95, rotate: 0 },
  { x: 355, y: 428, size: 23, font: 'serif', color: '--color-gold', opacity: 0.95, rotate: 0 },
  { x: 222, y: 341, size: 23, font: 'serif', color: '--color-gold', opacity: 0.95, rotate: 0 },
  { x: 271, y: 206, size: 23, font: 'serif', color: '--color-gold', opacity: 0.95, rotate: 0 },
  { x: 450, y: 147, size: 18, font: 'serif', color: '--color-gold', opacity: 0.85, rotate: 0 },
  { x: 156, y: 307, size: 18, font: 'serif', color: '--color-charcoal', opacity: 0.85, rotate: 0 },
  { x: 415, y: 78, size: 15, font: 'sans', color: '--color-muted', opacity: 0.72, rotate: 0 },
  { x: 498, y: 489, size: 15, font: 'serif', color: '--color-muted', opacity: 0.72, rotate: 3 },
  { x: 300, y: 37, size: 12, font: 'sans', color: '--color-muted', opacity: 0.65, rotate: -3 },
  { x: 495, y: 531, size: 12, font: 'serif', color: '--color-muted', opacity: 0.65, rotate: 0 },
  { x: 54, y: 303, size: 12, font: 'sans', color: '--color-muted', opacity: 0.65, rotate: 3 },
  { x: 121, y: 392, size: 15, font: 'serif', color: '--color-muted', opacity: 0.72, rotate: -3 },
  { x: 429, y: 203, size: 23, font: 'serif', color: '--color-gold', opacity: 0.95, rotate: 0 },
  { x: 550, y: 292, size: 18, font: 'serif', color: '--color-charcoal', opacity: 0.85, rotate: 0 },
  { x: 513, y: 119, size: 15, font: 'sans', color: '--color-muted', opacity: 0.72, rotate: -3 },
  { x: 396, y: 526, size: 15, font: 'serif', color: '--color-muted', opacity: 0.72, rotate: 0 },
  { x: 100, y: 278, size: 15, font: 'sans', color: '--color-muted', opacity: 0.72, rotate: 3 },
  { x: 495, y: 69, size: 12, font: 'serif', color: '--color-muted', opacity: 0.65, rotate: -3 },
  { x: 300, y: 563, size: 12, font: 'sans', color: '--color-muted', opacity: 0.65, rotate: 0 },
  { x: 478, y: 258, size: 23, font: 'serif', color: '--color-charcoal', opacity: 0.95, rotate: 0 },
  { x: 450, y: 461, size: 18, font: 'serif', color: '--color-gold', opacity: 0.85, rotate: 0 },
  { x: 249, y: 142, size: 18, font: 'serif', color: '--color-charcoal', opacity: 0.85, rotate: 0 },
  { x: 575, y: 208, size: 15, font: 'sans', color: '--color-muted', opacity: 0.72, rotate: 3 },
  { x: 627, y: 209, size: 12, font: 'serif', color: '--color-muted', opacity: 0.65, rotate: -3 },
  { x: 478, y: 338, size: 23, font: 'serif', color: '--color-gold', opacity: 0.95, rotate: 0 },
  { x: 265, y: 400, size: 23, font: 'serif', color: '--color-gold', opacity: 0.95, rotate: 0 },
  { x: 600, y: 320, size: 15, font: 'sans', color: '--color-muted', opacity: 0.72, rotate: -3 },
  { x: 285, y: 522, size: 15, font: 'serif', color: '--color-muted', opacity: 0.72, rotate: 0 },
  { x: 222, y: 262, size: 23, font: 'serif', color: '--color-gold', opacity: 0.95, rotate: 0 },
  { x: 429, y: 391, size: 23, font: 'serif', color: '--color-charcoal', opacity: 0.95, rotate: 0 },
  { x: 254, y: 459, size: 18, font: 'serif', color: '--color-gold', opacity: 0.85, rotate: 0 },
  { x: 571, y: 407, size: 15, font: 'serif', color: '--color-muted', opacity: 0.72, rotate: 3 },
  { x: 187, y: 474, size: 15, font: 'sans', color: '--color-muted', opacity: 0.72, rotate: -3 },
  { x: 129, y: 193, size: 15, font: 'serif', color: '--color-muted', opacity: 0.72, rotate: 0 },
  { x: 203, y: 114, size: 15, font: 'sans', color: '--color-muted', opacity: 0.72, rotate: 3 },
  { x: 304, y: 74, size: 15, font: 'serif', color: '--color-muted', opacity: 0.72, rotate: -3 },
  { x: 623, y: 391, size: 12, font: 'sans', color: '--color-muted', opacity: 0.65, rotate: 0 },
  { x: 124, y: 471, size: 12, font: 'serif', color: '--color-muted', opacity: 0.65, rotate: 3 },
  { x: 126, y: 129, size: 12, font: 'sans', color: '--color-muted', opacity: 0.65, rotate: -3 },
  // Consciousness (added 17 Nov 2026), just under Energy
  { x: 350, y: 345, size: 18, font: 'serif', color: '--color-charcoal', opacity: 0.85, rotate: 0 },
]
// category of each word (0 approach, 1 gesture, 2 pictorial language, 3 colour, 4 matter)
const CAT: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0]
// constellation of each category across the whole circle
const E: [number, number][] = [[4, 9], [9, 1], [1, 7], [7, 5], [5, 0], [0, 8], [8, 10], [10, 2], [2, 12], [12, 3], [3, 6], [6, 11], [11, 4], [0, 40], [40, 8], [17, 18], [18, 13], [13, 15], [15, 14], [14, 16], [16, 19], [19, 17], [22, 23], [23, 24], [24, 20], [20, 21], [21, 22], [29, 27], [27, 25], [25, 28], [28, 26], [26, 29], [34, 39], [39, 35], [35, 36], [36, 37], [37, 32], [32, 30], [30, 31], [31, 33], [33, 38], [38, 34]]

// ─── Geometry: Metatron's cube and what it contains ─────────
function hexRing(r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
  })
}
const inner = hexRing(R)
const outer = hexRing(R * 2)
const mcNodes = [{ x: CX, y: CY }, ...inner, ...outer]
const mcConnections: [number, number][] = []
for (let i = 0; i < 13; i++) for (let j = i + 1; j < 13; j++) mcConnections.push([i, j])
const poly = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('') + 'Z'
const star = (r1: number, r2: number, n: number) => {
  const d: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const a = (i * Math.PI) / n - Math.PI / 2
    const r = i % 2 ? r2 : r1
    d.push(`${i ? 'L' : 'M'}${(CX + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)}`)
  }
  return d.join(' ') + ' Z'
}
const H = R / 2
const flower = [
  { x: 0, y: 0 },
  ...Array.from({ length: 6 }, (_, i) => ({ x: H * Math.cos(i * Math.PI / 3 - Math.PI / 2), y: H * Math.sin(i * Math.PI / 3 - Math.PI / 2) })),
  ...Array.from({ length: 6 }, (_, i) => ({ x: 2 * H * Math.cos(i * Math.PI / 3 - Math.PI / 2), y: 2 * H * Math.sin(i * Math.PI / 3 - Math.PI / 2) })),
  ...Array.from({ length: 6 }, (_, i) => ({ x: Math.sqrt(3) * H * Math.cos(i * Math.PI / 3), y: Math.sqrt(3) * H * Math.sin(i * Math.PI / 3) })),
]

// each word drifts half-way towards its neighbours, then home
const neighbours = W.map((_, i) => {
  const n = E.filter(e => e.includes(i)).map(e => (e[0] === i ? e[1] : e[0]))
  return [...n, 0].filter((v, k, a) => v !== i && a.indexOf(v) === k).slice(0, 6)
})

export default function ArtWordCloud({ locale }: { locale: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(false)
  const t = texts[locale] || texts.en

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(svg)
    return () => obs.disconnect()
  }, [])

  const drift = W.map((w, i) => {
    const path = neighbours[i]
    const n = path.length
    const seg = 100 / (n + 2)
    const stops = [`0%,${Math.round(seg * 0.4)}%{transform:translate(0px,0px) scale(1)}`]
    path.forEach((tIdx, j) => {
      const dx = ((W[tIdx].x - w.x) * 0.5).toFixed(1)
      const dy = ((W[tIdx].y - w.y) * 0.5).toFixed(1)
      const sc = (j + i) % 2 ? '0.88' : '1.25'
      stops.push(`${Math.round(seg * (j + 1))}%,${Math.round(seg * (j + 1.4))}%{transform:translate(${dx}px,${dy}px) scale(${sc})}`)
    })
    stops.push(`${Math.round(seg * (n + 1))}%,100%{transform:translate(0px,0px) scale(1)}`)
    return `@keyframes awc-d${i}{${stops.join('')}}`
  }).join('\n')

  const travel = E.map(([a, b], i) =>
    `@keyframes awc-t${i}{0%,8%{transform:translate(0,0)}42%,58%{transform:translate(${(W[b].x - W[a].x).toFixed(1)}px,${(W[b].y - W[a].y).toFixed(1)}px)}92%,100%{transform:translate(0,0)}}`
  ).join('\n')

  const gold = { stroke: 'var(--color-gold)' }
  const fade = (delay: number) => ({ opacity: visible ? 1 : 0, transition: `opacity 2s ease ${delay}s` })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <style>{`
        ${drift}
        ${travel}
        @keyframes awc-glow { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.7; } }
        @keyframes awc-line { 0%, 100% { opacity: 0.06; } 50% { opacity: 0.18; } }
        @keyframes awc-cube { 0%,100% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(90deg) scale(1.03); } 50% { transform: rotate(180deg) scale(0.97); } 75% { transform: rotate(270deg) scale(1.02); } }
        @keyframes awc-hex { 0%,100% { transform: rotate(360deg) scale(1); } 33% { transform: rotate(240deg) scale(1.04); } 66% { transform: rotate(120deg) scale(0.96); } }
        @keyframes awc-star { 0%,100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.06); } }
        @keyframes awc-ring { 0%,100% { transform: scale(1); } 50% { transform: scale(1.015); } }
        .awc-o { transform-origin: ${CX}px ${CY}px; }
        @media (prefers-reduced-motion: reduce) { .awc-anim, .awc-anim * { animation: none !important; } }
      `}</style>

      <svg ref={svgRef} viewBox="-50 -20 800 660" className="w-full h-auto overflow-visible awc-anim" role="img"
        aria-label={t.join(', ')}>
        <defs>
          <radialGradient id="awc-glow-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.2" />
            <stop offset="40%" stopColor="var(--color-gold)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </radialGradient>
          <filter id="awc-blur"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <ellipse cx={CX} cy={CY} rx="280" ry="260" fill="url(#awc-glow-bg)" />

        {/* Layer: geometry */}
        <g style={fade(0.2)}>
          <g className="awc-o" style={{ animation: visible ? 'awc-cube 200s ease-in-out infinite' : 'none' }}>
            {mcConnections.map(([a, b], i) => (
              <line key={`mc-${i}`} x1={mcNodes[a].x} y1={mcNodes[a].y} x2={mcNodes[b].x} y2={mcNodes[b].y}
                style={{ ...gold, animation: visible ? `awc-line ${7 + (i % 5) * 2}s ease-in-out ${(i % 8) * 0.5}s infinite` : 'none' }}
                strokeWidth="0.5" opacity="0.1" />
            ))}
            {mcNodes.map((n, i) => (
              <circle key={`mcc-${i}`} cx={n.x} cy={n.y} r={R} fill="none" style={gold} strokeWidth="0.7" opacity={i === 0 ? 0.25 : 0.14} />
            ))}
          </g>
          <g className="awc-o" style={{ animation: visible ? 'awc-ring 14s ease-in-out infinite' : 'none' }}>
            {flower.map((p, i) => (
              <circle key={`fl-${i}`} cx={CX + p.x} cy={CY + p.y} r={H} fill="none" style={gold} strokeWidth="0.5" opacity="0.16" />
            ))}
            <circle cx={CX} cy={CY} r={3 * H} fill="none" style={gold} strokeWidth="0.7" opacity="0.2" />
          </g>
          <g className="awc-o" style={{ animation: visible ? 'awc-hex 150s ease-in-out infinite' : 'none' }}>
            <path d={poly(outer)} fill="none" style={gold} strokeWidth="0.8" opacity="0.26" />
            {[0, 2, 4].map(k => <line key={`cy-${k}`} x1={CX} y1={CY} x2={outer[k].x} y2={outer[k].y} style={gold} strokeWidth="0.6" opacity="0.2" />)}
            {[1, 3, 5].map(k => <line key={`cx-${k}`} x1={inner[k].x} y1={inner[k].y} x2={outer[k].x} y2={outer[k].y} style={gold} strokeWidth="0.6" opacity="0.2" />)}
          </g>
          <g className="awc-o" style={{ animation: visible ? 'awc-star 120s ease-in-out infinite' : 'none' }}>
            <path d={poly([inner[0], inner[2], inner[4]])} fill="none" style={gold} strokeWidth="0.7" opacity="0.24" />
            <path d={poly([inner[1], inner[3], inner[5]])} fill="none" style={gold} strokeWidth="0.7" opacity="0.24" />
          </g>
          {[0, 2, 4].map(k => (
            <path key={`oc-${k}`} d={poly([outer[k], inner[(k + 2) % 6], inner[(k + 4) % 6]])} fill="none" style={gold} strokeWidth="0.4" opacity="0.12" />
          ))}
          <circle cx={CX} cy={CY} r={2 * R + 12} fill="none" style={gold} strokeWidth="0.5" opacity="0.16" />
          <path d={star(160, 80, 6)} fill="none" style={{ ...gold, animation: visible ? 'awc-hex 150s ease-in-out infinite' : 'none' }} className="awc-o" strokeWidth="0.8" opacity="0.26" />
          <path d={star(90, 42, 5)} fill="none" style={{ ...gold, animation: visible ? 'awc-star 120s ease-in-out infinite' : 'none' }} className="awc-o" strokeWidth="0.6" opacity="0.2" />
        </g>

        {/* Layers: one constellation per category, superimposed */}
        {[0, 1, 2, 3, 4].map(c => (
          <g key={`cat-${c}`} style={fade(0.4)}>
            {E.filter(([a]) => CAT[a] === c).map(([a, b], i) => (
              <g key={`e-${c}-${i}`}>
                <line x1={W[a].x} y1={W[a].y} x2={W[b].x} y2={W[b].y} style={gold} strokeWidth="4" opacity="0.05" filter="url(#awc-blur)" />
                <line x1={W[a].x} y1={W[a].y} x2={W[b].x} y2={W[b].y} style={gold} strokeWidth="0.8" opacity="0.3" />
              </g>
            ))}
          </g>
        ))}

        {W.map((w, i) => (
          <circle key={`dot-${i}`} cx={w.x} cy={w.y} r={w.size > 16 ? 2.5 : 1.5}
            style={{ fill: 'var(--color-gold)', opacity: visible ? 0.35 : 0, transition: `opacity 1s ease ${0.3 + i * 0.04}s`,
              animation: visible ? `awc-glow ${5 + (i % 4) * 1.5}s ease-in-out ${i * 0.3}s infinite` : 'none' }} />
        ))}
        {E.map(([a], i) => (
          <circle key={`trav-${i}`} cx={W[a].x} cy={W[a].y} r={1.5}
            style={{ fill: 'var(--color-gold)', opacity: visible ? 0.3 : 0, transition: `opacity 1.5s ease ${0.5 + i * 0.03}s`,
              animation: visible ? `awc-t${i} ${18 + (i % 7) * 4}s ease-in-out ${(i % 9) * 2}s infinite` : 'none' }} />
        ))}

        {W.map((w, i) => (
          <text key={`${locale}-${i}`} x={w.x} y={w.y} textAnchor="middle" dominantBaseline="central"
            fontSize={w.size} fontFamily={w.font === 'serif' ? SERIF : SANS} fontWeight={300}
            transform={`rotate(${w.rotate}, ${w.x}, ${w.y})`}
            style={{ fill: `var(${w.color})`, opacity: visible ? w.opacity : 0, transition: `opacity 1s ease ${0.4 + i * 0.04}s`,
              animation: visible ? `awc-d${i} ${260 + (i % 6) * 10}s ease-in-out infinite` : 'none' }}>
            {t[i]}
          </text>
        ))}
      </svg>
    </div>
  )
}

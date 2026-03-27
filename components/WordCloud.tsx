'use client'

import { useEffect, useRef, useState } from 'react'

interface WordCloudProps {
  locale: string
}

const SERIF = '"Cormorant Garamond", Georgia, serif'
const SANS = '"Plus Jakarta Sans", system-ui, sans-serif'

const CX = 350, CY = 300
const GOLD = '--color-gold'
const CHARCOAL = '--color-charcoal'
const MUTED = '--color-muted'
const GOLD_L = '--color-gold-light'

// ─── Metatron's Cube geometry ───────────────────────────────
const MC_R = 80
function hexRing(r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
  })
}
const mcInner = hexRing(MC_R)
const mcOuter = hexRing(MC_R * 2)
const mcNodes = [{ x: CX, y: CY }, ...mcInner, ...mcOuter]

const mcConnections: [number, number][] = []
for (let i = 0; i < 13; i++)
  for (let j = i + 1; j < 13; j++)
    mcConnections.push([i, j])

// ─── Word data ──────────────────────────────────────────────
const texts: Record<string, string[]> = {
  en: [
    // Anchors (0–4)
    'Facilitation', 'Coordination', 'Ecological Transition', 'Cognitive Science', 'Neurodiversity',
    // Satellites (5–12)
    'Innovation', 'Semantics', 'Translation', 'Interpreting', 'Permaculture',
    'Consciousness', 'Arts', 'Well-being',
  ],
  fr: [
    'Facilitation', 'Coordination', 'Transition écologique', 'Sciences cognitives', 'Neurodiversité',
    'Innovation', 'Sémantique', 'Traduction', 'Interprétariat', 'Permaculture',
    'Conscience', 'Arts', 'Bien-être',
  ],
  es: [
    'Facilitación', 'Coordinación', 'Transición ecológica', 'Ciencias cognitivas', 'Neurodiversidad',
    'Innovación', 'Semántica', 'Traducción', 'Interpretación', 'Permacultura',
    'Consciencia', 'Artes', 'Bienestar',
  ],
}

// Each word: position, style, and orbital path (indices of other words to visit)
interface WL {
  x: number; y: number; size: number; font: 'serif' | 'sans'
  color: string; opacity: number; rotate: number
  path: number[]; duration: number
}

const ANCHOR = 23
const SAT = 15
const JOURNEY = 0.5 // travel 50% of the way to each target node

const W: WL[] = [
  // ── Anchors ──
  // 0: Facilitation (center)
  { x: 350, y: 285, size: ANCHOR, font: 'serif', color: CHARCOAL, opacity: 1,    rotate: 0,   path: [1, 4, 8, 2, 10, 3, 5],   duration: 260 },
  // 1: Coordination (left center)
  { x: 195, y: 310, size: ANCHOR, font: 'serif', color: GOLD,     opacity: 0.95, rotate: 0,   path: [0, 2, 9, 8, 5, 4, 3],    duration: 280 },
  // 2: Ecological Transition (upper right)
  { x: 505, y: 230, size: ANCHOR, font: 'serif', color: CHARCOAL, opacity: 0.95, rotate: 0,   path: [9, 10, 0, 1, 3, 12, 6],  duration: 290 },
  // 3: Cognitive Science (lower right)
  { x: 490, y: 385, size: ANCHOR, font: 'serif', color: GOLD,     opacity: 0.95, rotate: 0,   path: [4, 10, 6, 0, 1, 11, 2],  duration: 275 },
  // 4: Neurodiversity (center bottom)
  { x: 330, y: 415, size: ANCHOR, font: 'serif', color: CHARCOAL, opacity: 1,    rotate: 0,   path: [3, 12, 10, 0, 1, 9, 11], duration: 285 },

  // ── Satellites ──
  // 5: Innovation (upper left)
  { x: 180, y: 195, size: SAT,    font: 'sans',  color: MUTED,    opacity: 0.7,  rotate: -4,  path: [6, 0, 1, 10, 2, 8],      duration: 300 },
  // 6: Semantics (upper center-right)
  { x: 490, y: 170, size: SAT,    font: 'serif', color: MUTED,    opacity: 0.7,  rotate: -3,  path: [7, 2, 3, 0, 5, 10],      duration: 295 },
  // 7: Translation (far right)
  { x: 580, y: 300, size: SAT,    font: 'sans',  color: MUTED,    opacity: 0.65, rotate: 3,   path: [8, 0, 2, 6, 3, 11],      duration: 310 },
  // 8: Interpreting (left upper)
  { x: 150, y: 250, size: SAT,    font: 'sans',  color: GOLD,     opacity: 0.65, rotate: -5,  path: [7, 1, 0, 5, 9, 2],       duration: 305 },
  // 9: Permaculture (lower left)
  { x: 140, y: 430, size: SAT,    font: 'sans',  color: GOLD_L,   opacity: 0.6,  rotate: 5,   path: [1, 2, 4, 10, 0, 12],     duration: 295 },
  // 10: Consciousness (top center)
  { x: 360, y: 165, size: SAT,    font: 'serif', color: MUTED,    opacity: 0.65, rotate: 0,   path: [0, 2, 11, 3, 4, 6],      duration: 305 },
  // 11: Arts (lower right)
  { x: 555, y: 455, size: SAT,    font: 'serif', color: GOLD_L,   opacity: 0.6,  rotate: -4,  path: [3, 10, 4, 12, 7, 2],     duration: 290 },
  // 12: Well-being (lower center-left)
  { x: 260, y: 470, size: SAT,    font: 'sans',  color: MUTED,    opacity: 0.6,  rotate: 4,   path: [4, 9, 1, 0, 3, 10],      duration: 300 },
]

// Constellation lines connecting semantically related words
const wordEdges: [number, number][] = [
  [0, 1], [0, 4], [0, 8], [0, 10],       // Facilitation hub
  [1, 2], [1, 9], [1, 5],                 // Coordination
  [2, 6], [2, 9], [2, 10],                // Ecological Transition
  [3, 4], [3, 6], [3, 10],                // Cognitive Science
  [4, 12], [4, 3],                         // Neurodiversity
  [5, 6], [5, 8],                          // Innovation — Semantics — Interpreting
  [7, 8],                                  // Translation — Interpreting
  [9, 12],                                 // Permaculture — Well-being
  [10, 11], [11, 3],                       // Consciousness — Arts — Cognitive Science
]

// ─── Component ──────────────────────────────────────────────

export default function WordCloud({ locale }: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(false)
  const t = texts[locale] || texts.en

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(svg)
    return () => obs.disconnect()
  }, [])

  // Generate orbital keyframes — each word travels through its full path
  const driftKeyframes = W.map((w, i) => {
    const n = w.path.length
    const seg = 100 / (n + 2) // equal time per segment (nodes + home start/end)
    const stops: string[] = []

    // Start at home
    stops.push(`0%,${Math.round(seg * 0.4)}%{transform:translate(0px,0px) scale(1)}`)

    // Visit each node in the path
    w.path.forEach((targetIdx, j) => {
      const target = W[targetIdx]
      const dx = ((target.x - w.x) * JOURNEY).toFixed(1)
      const dy = ((target.y - w.y) * JOURNEY).toFixed(1)
      const scale = (j + i) % 2 === 0 ? '1.25' : '0.88'
      const arriveAt = Math.round(seg * (j + 1))
      const pauseUntil = Math.round(seg * (j + 1) + seg * 0.4)
      stops.push(`${arriveAt}%,${pauseUntil}%{transform:translate(${dx}px,${dy}px) scale(${scale})}`)
    })

    // Return home
    const returnAt = Math.round(seg * (n + 1))
    stops.push(`${returnAt}%,100%{transform:translate(0px,0px) scale(1)}`)

    return `@keyframes wc-d${i}{${stops.join('')}}`
  }).join('\n')

  // Generate traveler keyframes — nodes gliding along constellation edges
  const travelerKeyframes = wordEdges.map(([a, b], i) => {
    const dx = (W[b].x - W[a].x).toFixed(1)
    const dy = (W[b].y - W[a].y).toFixed(1)
    return `@keyframes wc-t${i}{0%,8%{transform:translate(0px,0px)}42%,58%{transform:translate(${dx}px,${dy}px)}92%,100%{transform:translate(0px,0px)}}`
  }).join('\n')

  // Star polygon helper
  const star = (r1: number, r2: number, pts: number) => {
    const d: string[] = []
    for (let i = 0; i < pts * 2; i++) {
      const a = (i * Math.PI) / pts - Math.PI / 2
      const r = i % 2 === 0 ? r1 : r2
      d.push(`${i === 0 ? 'M' : 'L'}${(CX + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)}`)
    }
    return d.join(' ') + ' Z'
  }

  const hexagram = star(160, 80, 6)
  const innerStar = star(90, 42, 5)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <style>{`
        ${driftKeyframes}
        ${travelerKeyframes}
        @keyframes wc-node-glow {
          0%, 100% { opacity: 0.2; r: 2.5px; }
          50% { opacity: 0.7; r: 4px; }
        }
        @keyframes wc-float-pulse {
          0%, 100% { opacity: 0.08; r: 1px; }
          30% { opacity: 0.35; r: 2.5px; }
          60% { opacity: 0.12; r: 1.5px; }
          80% { opacity: 0.4; r: 2px; }
        }
        @keyframes wc-float-drift-1 {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(12px, -8px); }
          50% { transform: translate(-6px, 14px); }
          75% { transform: translate(10px, 6px); }
        }
        @keyframes wc-float-drift-2 {
          0%, 100% { transform: translate(0px, 0px); }
          20% { transform: translate(-10px, 12px); }
          45% { transform: translate(14px, 4px); }
          70% { transform: translate(-8px, -10px); }
        }
        @keyframes wc-float-drift-3 {
          0%, 100% { transform: translate(0px, 0px); }
          30% { transform: translate(8px, 10px); }
          60% { transform: translate(-14px, -6px); }
          85% { transform: translate(6px, -12px); }
        }
        @keyframes wc-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wc-rotate-rev {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes wc-line-pulse {
          0%, 100% { opacity: 0.06; stroke-width: 0.4; }
          50% { opacity: 0.18; stroke-width: 0.7; }
        }
        @keyframes wc-ring-breathe {
          0%, 100% { opacity: var(--ring-op); transform: scale(1); }
          50% { opacity: calc(var(--ring-op) * 2); transform: scale(1.015); }
        }
        @keyframes wc-cube-breathe {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.03); }
          50% { transform: rotate(180deg) scale(0.97); }
          75% { transform: rotate(270deg) scale(1.02); }
        }
        @keyframes wc-hex-breathe {
          0%, 100% { transform: rotate(360deg) scale(1); }
          33% { transform: rotate(240deg) scale(1.04); }
          66% { transform: rotate(120deg) scale(0.96); }
        }
        @keyframes wc-star-drift {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.06); }
        }
        .wc-origin { transform-origin: ${CX}px ${CY}px; }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="-50 -20 800 660"
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Word cloud"
      >
        <defs>
          <radialGradient id="wc-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.2" />
            <stop offset="40%" stopColor="var(--color-gold)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </radialGradient>
          <filter id="wc-soft">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <filter id="wc-glow-line">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* ── Background glow ── */}
        <ellipse cx={CX} cy={CY} rx="280" ry="260" fill="url(#wc-glow)" />

        {/* ── Metatron's Cube — all 78 connections ── */}
        <g
          className="wc-origin"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 2.5s ease 0.2s',
            animation: visible ? 'wc-cube-breathe 200s ease-in-out infinite' : 'none',
          }}
        >
          {/* Glow layer */}
          {mcConnections.map(([a, b], i) => (
            <line
              key={`mc-g-${i}`}
              x1={mcNodes[a].x} y1={mcNodes[a].y}
              x2={mcNodes[b].x} y2={mcNodes[b].y}
              style={{ stroke: 'var(--color-gold)' }}
              strokeWidth="3"
              opacity="0.04"
              filter="url(#wc-glow-line)"
            />
          ))}
          {/* Core lines */}
          {mcConnections.map(([a, b], i) => (
            <line
              key={`mc-${i}`}
              x1={mcNodes[a].x} y1={mcNodes[a].y}
              x2={mcNodes[b].x} y2={mcNodes[b].y}
              style={{
                stroke: 'var(--color-gold)',
                animation: visible ? `wc-line-pulse ${7 + (i % 5) * 2}s ease-in-out ${(i % 8) * 0.5}s infinite` : 'none',
              }}
              strokeWidth="0.5"
              opacity="0.1"
            />
          ))}

          {/* Metatron node circles — Flower of Life overlay */}
          {mcNodes.map((n, i) => (
            <g key={`mc-c-${i}`}>
              <circle cx={n.x} cy={n.y} r={MC_R} fill="none"
                style={{ stroke: 'var(--color-gold)' }} strokeWidth="4" opacity="0.04" filter="url(#wc-glow-line)" />
              <circle cx={n.x} cy={n.y} r={MC_R} fill="none"
                style={{ stroke: 'var(--color-gold)' }} strokeWidth="0.7" opacity={i === 0 ? 0.25 : 0.14} />
            </g>
          ))}
        </g>

        {/* ── Hexagram — counter-rotating ── */}
        <g
          className="wc-origin"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 2s ease 0.5s',
            animation: visible ? 'wc-hex-breathe 150s ease-in-out infinite' : 'none',
          }}
        >
          <path d={hexagram} fill="none" style={{ stroke: 'var(--color-gold)' }} strokeWidth="4" opacity="0.06" filter="url(#wc-glow-line)" />
          <path d={hexagram} fill="none" style={{ stroke: 'var(--color-gold)' }} strokeWidth="0.8" opacity="0.28" />
        </g>

        {/* ── Inner star — rotating ── */}
        <g
          className="wc-origin"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 2s ease 0.7s',
            animation: visible ? 'wc-star-drift 120s ease-in-out infinite' : 'none',
          }}
        >
          <path d={innerStar} fill="none" style={{ stroke: 'var(--color-gold)' }} strokeWidth="3" opacity="0.05" filter="url(#wc-glow-line)" />
          <path d={innerStar} fill="none" style={{ stroke: 'var(--color-gold)' }} strokeWidth="0.6" opacity="0.22" />
        </g>

        {/* ── Concentric rings — breathing ── */}
        {[65, 120, 180, 245].map((r, i) => (
          <g key={`ring-${i}`}>
            <circle cx={CX} cy={CY} r={r} fill="none"
              style={{ stroke: 'var(--color-gold)' }} strokeWidth="4" opacity="0.04" filter="url(#wc-glow-line)" />
            <circle cx={CX} cy={CY} r={r} fill="none"
              className="wc-origin"
              style={{
                stroke: 'var(--color-gold)',
                '--ring-op': 0.1 + i * 0.03,
                opacity: visible ? 0.1 + i * 0.03 : 0,
                transition: `opacity 1.5s ease ${0.3 + i * 0.15}s`,
                animation: visible ? `wc-ring-breathe ${9 + i * 2}s ease-in-out ${i * 1.2}s infinite` : 'none',
              } as React.CSSProperties}
              strokeWidth={i === 0 ? 0.8 : 0.5}
            />
          </g>
        ))}

        {/* ── Constellation lines between words ── */}
        <g style={{ opacity: visible ? 1 : 0, transition: 'opacity 2s ease 0.4s' }}>
          {/* Glow layer */}
          {wordEdges.map(([a, b], i) => (
            <line
              key={`we-g-${i}`}
              x1={W[a].x} y1={W[a].y}
              x2={W[b].x} y2={W[b].y}
              style={{ stroke: 'var(--color-gold)' }}
              strokeWidth="5"
              opacity="0.06"
              filter="url(#wc-glow-line)"
            />
          ))}
          {/* Core lines */}
          {wordEdges.map(([a, b], i) => (
            <line
              key={`we-${i}`}
              x1={W[a].x} y1={W[a].y}
              x2={W[b].x} y2={W[b].y}
              style={{ stroke: 'var(--color-gold)' }}
              strokeWidth="0.8"
              opacity="0.3"
            />
          ))}
        </g>

        {/* ── Node dots at word positions — pulsing ── */}
        {W.map((w, i) => (
          <circle
            key={`dot-${i}`}
            cx={w.x} cy={w.y}
            r={2.5}
            style={{
              fill: 'var(--color-gold)',
              opacity: visible ? 0.35 : 0,
              transition: `opacity 1s ease ${0.3 + i * 0.05}s`,
              animation: visible ? `wc-node-glow ${5 + (i % 4) * 1.5}s ease-in-out ${i * 0.3}s infinite` : 'none',
            }}
          />
        ))}

        {/* ── Traveling nodes — gliding along constellation edges ── */}
        {wordEdges.map(([a], i) => (
          <circle
            key={`trav-${i}`}
            cx={W[a].x} cy={W[a].y}
            r={1.5}
            style={{
              fill: 'var(--color-gold)',
              opacity: visible ? 0.3 : 0,
              transition: `opacity 1.5s ease ${0.5 + i * 0.04}s`,
              animation: visible ? `wc-t${i} ${18 + (i % 7) * 4}s ease-in-out ${(i % 9) * 2}s infinite` : 'none',
            }}
          />
        ))}

        {/* ── Floating decorative nodes — pulsating ── */}
        {[
          { x: 280, y: 160 }, { x: 420, y: 140 }, { x: 560, y: 240 },
          { x: 600, y: 320 }, { x: 540, y: 480 }, { x: 380, y: 510 },
          { x: 200, y: 480 }, { x: 100, y: 380 }, { x: 80,  y: 220 },
          { x: 180, y: 140 }, { x: 480, y: 160 }, { x: 620, y: 280 },
          { x: 500, y: 510 }, { x: 300, y: 520 }, { x: 120, y: 340 },
          { x: 140, y: 460 }, { x: 440, y: 120 }, { x: 560, y: 460 },
          { x: 260, y: 110 }, { x: 650, y: 220 }, { x: 60,  y: 260 },
          { x: 340, y: 540 }, { x: 470, y: 400 }, { x: 220, y: 200 },
        ].map((n, i) => (
          <circle
            key={`float-${i}`}
            cx={n.x} cy={n.y}
            r={1}
            style={{
              fill: 'var(--color-gold)',
              opacity: visible ? 0.15 : 0,
              transition: `opacity 2s ease ${1 + i * 0.1}s`,
              animation: visible
                ? `wc-float-pulse ${8 + (i % 5) * 3}s ease-in-out ${i * 0.7}s infinite, wc-float-drift-${1 + (i % 3)} ${30 + (i % 7) * 5}s ease-in-out ${i * 1.2}s infinite`
                : 'none',
            }}
          />
        ))}

        {/* ── Words — orbiting through nodes ── */}
        {W.map((w, i) => (
          <text
            key={`${locale}-${i}`}
            x={w.x} y={w.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={w.size}
            fontFamily={w.font === 'serif' ? SERIF : SANS}
            fontWeight={300}
            transform={`rotate(${w.rotate}, ${w.x}, ${w.y})`}
            style={{
              fill: `var(${w.color})`,
              opacity: visible ? w.opacity : 0,
              transition: `opacity 1s ease ${0.4 + i * 0.06}s`,
              animation: visible ? `wc-d${i} ${w.duration}s ease-in-out infinite` : 'none',
            }}
          >
            {t[i]}
          </text>
        ))}
      </svg>
    </div>
  )
}

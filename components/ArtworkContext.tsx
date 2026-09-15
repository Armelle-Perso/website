'use client'

// The artwork page is rendered once, statically, with both browsing contexts:
// within its series, and across available works (?from=available). Reading the
// query string here, on the client, keeps the page cacheable. Reading it on the
// server made every visit a fresh render on Vercel.

import { ReactNode, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ArtworkNav from './ArtworkNav'
import FullscreenImage from './FullscreenImage'

export interface NavData {
  prevHref: string | null
  prevTitle: string | null
  nextHref: string | null
  nextTitle: string | null
}

export interface CountData {
  current: number
  total: number
}

export interface SlidesData {
  slides: { src: string; alt: string }[]
  hrefs: string[]
  index: number
}

interface Both<T> {
  series: T
  available: T
}

function useFromAvailable() {
  return useSearchParams().get('from') === 'available'
}

function NavInner({ series, available }: Both<NavData>) {
  const nav = useFromAvailable() ? available : series
  return <ArtworkNav {...nav} />
}

export function ContextualArtworkNav(props: Both<NavData>) {
  return (
    <Suspense fallback={<ArtworkNav {...props.series} />}>
      <NavInner {...props} />
    </Suspense>
  )
}

function SwitchInner({ series, available }: Both<ReactNode>) {
  return <>{useFromAvailable() ? available : series}</>
}

export function ContextualSwitch(props: Both<ReactNode>) {
  return (
    <Suspense fallback={props.series}>
      <SwitchInner {...props} />
    </Suspense>
  )
}

function Counter({ count }: { count: CountData | null }) {
  if (!count || count.total <= 1) return null
  return (
    <span className="text-[10px] font-sans text-[--color-border] tabular-nums shrink-0">
      {count.current} / {count.total}
    </span>
  )
}

function CounterInner({ series, available }: Both<CountData | null>) {
  return <Counter count={useFromAvailable() ? available : series} />
}

export function ContextualArtworkCounter(props: Both<CountData | null>) {
  return (
    <Suspense fallback={<Counter count={props.series} />}>
      <CounterInner {...props} />
    </Suspense>
  )
}

function FullscreenInner({ series, available, children }: Both<SlidesData> & { children: ReactNode }) {
  const s = useFromAvailable() ? available : series
  return (
    <FullscreenImage slides={s.slides} index={s.index} hrefs={s.hrefs}>
      {children}
    </FullscreenImage>
  )
}

export function ContextualFullscreenImage(props: Both<SlidesData> & { children: ReactNode }) {
  const { series, children } = props
  return (
    <Suspense
      fallback={
        <FullscreenImage slides={series.slides} index={series.index} hrefs={series.hrefs}>
          {children}
        </FullscreenImage>
      }
    >
      <FullscreenInner {...props} />
    </Suspense>
  )
}

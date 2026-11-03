import type { MetadataRoute } from 'next'
import { safeFetch } from '@/sanity/lib/client'
import { sitemapQuery } from '@/sanity/lib/queries'
import { locales, defaultLocale } from '@/i18n/config'

export const revalidate = 86400

// The site answers on www; the bare domain redirects there
const BASE = 'https://www.armelleboussidan.com'

const STATIC_PATHS = [
  '/',
  '/about',
  '/consulting',
  '/contact',
  '/shop',
  '/art',
  '/art/paintings',
  '/art/paintings/creative-path',
  '/art/paintings/available',
  '/art/paintings/people',
  '/art/collectives',
  '/art/exhibitions',
]

// English has no prefix (localePrefix: 'as-needed'); French and Spanish do
const url = (locale: string, path: string) => {
  const prefix = locale === defaultLocale ? '' : `/${locale}`
  return `${BASE}${prefix}${path === '/' && prefix ? '' : path}`
}

// One entry per page in each language, each listing its translations
const entries = (path: string): MetadataRoute.Sitemap =>
  locales.map((locale) => ({
    url: url(locale, path),
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])),
    },
  }))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const series = (await safeFetch<{ series: string; artworks: string[] | null }[]>(sitemapQuery)) ?? []
  const paths = new Set(STATIC_PATHS)
  for (const s of series) {
    if (!s.series) continue
    paths.add(`/art/paintings/${s.series}`)
    for (const a of s.artworks ?? []) paths.add(`/art/paintings/${s.series}/${a}`)
  }
  return [...paths].flatMap(entries)
}

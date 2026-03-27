import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '..', '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const client = createClient({
  projectId: env['NEXT_PUBLIC_SANITY_PROJECT_ID'],
  dataset: env['NEXT_PUBLIC_SANITY_DATASET'] || 'production',
  token: env['SANITY_API_TOKEN'],
  apiVersion: '2024-01-01',
  useCdn: false,
})

const series = await client.fetch(`*[_type == "paintingSeries"] | order(order asc) {
  _id, title, slug, coverImage, "artworkCount": count(artworks)
}`)

console.log(`\nPainting series in Sanity (${series.length} total):\n`)
for (const s of series) {
  const hasCover = !!s.coverImage?.asset?._ref
  console.log(`  ${hasCover ? '✓' : '✗'} ${s.title}  —  ${s.artworkCount} artworks  —  slug: ${s.slug?.current}  —  cover: ${hasCover}`)
}

// Check one series in detail
const first = series[0]
if (first) {
  const detail = await client.fetch(`*[_type == "paintingSeries" && _id == $id][0]{ artworks[0..1] }`, { id: first._id })
  console.log(`\nFirst artwork in "${first.title}":\n`, JSON.stringify(detail?.artworks?.[0], null, 2))
}

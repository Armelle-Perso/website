/**
 * Lists all artworks in the 2018-2019 series.
 *   node scripts/_list-2018.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(path.resolve(__dirname, '../.env.local'), 'utf8').split('\n')
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

async function run() {
  const series = await client.fetch(
    `*[_type == "paintingSeries" && title match "2018*"][0]{ title, artworks[]{ title, _key } }`
  )
  if (!series) { console.error('Not found!'); process.exit(1) }
  console.log(`${series.title} — ${series.artworks.length} artworks:\n`)
  series.artworks.forEach((a, i) => console.log(`  ${i + 1}. ${a.title}`))
}

run().catch(err => { console.error(err); process.exit(1) })

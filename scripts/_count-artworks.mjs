/**
 * Counts artworks by availability status.
 *   node scripts/_count-artworks.mjs
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
  const series = await client.fetch(`*[_type == "paintingSeries"] | order(year desc){ title, artworks[]{ title, available } }`)

  let grandTotal = 0, grandAvail = 0, grandNot = 0, grandUnset = 0

  for (const s of series) {
    const artworks = s.artworks || []
    const avail = artworks.filter(a => a.available === true).length
    const not = artworks.filter(a => a.available === false).length
    const unset = artworks.filter(a => a.available == null).length

    console.log(`\n${s.title} (${artworks.length} works)`)
    console.log(`  ✓ Available: ${avail}  ✗ Not available: ${not}  ? Unset: ${unset}`)

    if (unset > 0) {
      artworks.filter(a => a.available == null).forEach(a => console.log(`    → ${a.title}`))
    }

    grandTotal += artworks.length
    grandAvail += avail
    grandNot += not
    grandUnset += unset
  }

  console.log(`\n${'═'.repeat(50)}`)
  console.log(`TOTAL: ${grandTotal} artworks`)
  console.log(`  ✓ Available: ${grandAvail}`)
  console.log(`  ✗ Not available: ${grandNot}`)
  console.log(`  ? Unset (treated as available): ${grandUnset}`)
  console.log(`  → Shown as available: ${grandAvail + grandUnset}`)
}

run().catch(err => { console.error(err); process.exit(1) })

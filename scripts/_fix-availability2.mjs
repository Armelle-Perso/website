/**
 * Marks specific artworks as not available.
 *   node scripts/_fix-availability2.mjs
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

const unavailable = ['Mother of the Universe', 'Departure', 'Dragon Waters', 'Spirit Dimension']

async function run() {
  const series = await client.fetch(`*[_type == "paintingSeries"]{ _id, title, artworks[] }`)

  for (const s of series) {
    if (!s.artworks?.length) continue
    let changed = false

    const updated = s.artworks.map(a => {
      if (!a.title) return a
      if (unavailable.some(name => a.title.toLowerCase() === name.toLowerCase())) {
        console.log(`  → ${a.title} (in ${s.title}) → not available`)
        changed = true
        return { ...a, available: false }
      }
      return a
    })

    if (changed) {
      await client.patch(s._id).set({ artworks: updated }).commit()
      console.log(`✓ ${s.title} updated`)
    }
  }

  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

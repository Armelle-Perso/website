/**
 * Mark artworks as NOT available:
 *   - Second experiment on dynamic forms
 *   - Third eye opening
 *   - Primordia
 *
 *   node scripts/_fix-availability4.mjs
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

const titlesToRemove = [
  'second experiment on dynamic forms',
  'third eye opening',
  'primordia',
]

async function run() {
  const allSeries = await client.fetch(
    `*[_type == "paintingSeries"]{ _id, title, artworks[] }`
  )

  for (const series of allSeries) {
    let changed = false
    const updated = (series.artworks || []).map(a => {
      if (a.title && titlesToRemove.some(t => a.title.toLowerCase().includes(t))) {
        if (a.available !== false) {
          console.log(`  → ${a.title} (${series.title}) → available: false`)
          changed = true
          return { ...a, available: false }
        }
      }
      return a
    })

    if (changed) {
      await client.patch(series._id).set({ artworks: updated }).commit()
      console.log(`✓ ${series.title} updated`)
    }
  }

  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

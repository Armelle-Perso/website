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

// Titles to mark as unavailable (matched case-insensitively, accent-insensitive)
const MAKE_UNAVAILABLE = [
  'raag bihag',
  'dragon waters',
  'mother of the universe',
  'triptych sol del corazon 1',
  'triptych sol del corazon 2',
  'triptych sol del corazon 3',
]

function normalise(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function run() {
  const series = await client.fetch(`*[_type == "paintingSeries"]{ _id, title, artworks[] }`)
  let total = 0

  for (const s of series) {
    if (!s.artworks?.length) continue
    let changed = false

    const updated = s.artworks.map(a => {
      if (!a.title) return a
      const norm = normalise(a.title)
      const hit = MAKE_UNAVAILABLE.find(t => norm.includes(normalise(t)))
      if (hit && a.available !== false) {
        console.log(`  → ${a.title}`)
        changed = true
        total++
        return { ...a, available: false }
      }
      return a
    })

    if (changed) {
      await client.patch(s._id).set({ artworks: updated }).commit()
      console.log(`✓  ${s.title}`)
    }
  }

  console.log(`\nDone. ${total} artwork${total !== 1 ? 's' : ''} marked unavailable.`)
}

run().catch(console.error)

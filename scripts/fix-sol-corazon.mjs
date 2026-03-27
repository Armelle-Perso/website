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

function normalise(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
      if (norm.includes('triptych sol del corazon')) {
        console.log(`  → fixing: "${a.title}"`)
        changed = true
        total++
        return { ...a, medium: 'Acrylics on canvas' }
      }
      return a
    })

    if (changed) {
      await client.patch(s._id).set({ artworks: updated }).commit()
      console.log(`✓  ${s.title}`)
    }
  }

  console.log(`\nDone. ${total} artwork${total !== 1 ? 's' : ''} updated.`)
}

run().catch(console.error)

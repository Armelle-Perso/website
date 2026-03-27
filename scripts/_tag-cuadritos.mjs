/**
 * Tags Cuadritos artworks with subseries field.
 *   node scripts/_tag-cuadritos.mjs
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

const cuadritosTitles = ['arriba', 'lunita', 'penoncillo', 'tierra ajena', 'animalitos']

async function run() {
  const series = await client.fetch(
    `*[_type == "paintingSeries" && title match "2018*"][0]{ _id, title, artworks[] }`
  )
  if (!series) { console.error('2018-2019 series not found!'); process.exit(1) }

  let changed = false
  const updated = series.artworks.map(a => {
    if (a.title && cuadritosTitles.some(t => a.title.toLowerCase().includes(t))) {
      console.log(`  → ${a.title} → subseries: Cuadritos`)
      changed = true
      return { ...a, subseries: 'Cuadritos' }
    }
    return a
  })

  if (changed) {
    await client.patch(series._id).set({ artworks: updated }).commit()
    console.log(`✓ ${series.title} updated`)
  } else {
    console.log('No matching artworks found!')
  }

  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

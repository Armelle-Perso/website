/**
 * One-off, 2026-10-28, per Armelle: Émanation opens with Diptych Passage.
 * Before: Entering Light, Alien Encounter, L'Homme au Condor, Diptych Passage,
 * Home Is Where You Go, Departure, Dragon Waters, Sol del Corazón, Charlie 1-3.
 *
 *   node scripts/passage-first-emanation.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(path.resolve(__dirname, '..', '.env.local'), 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
)

const client = createClient({
  projectId: env['NEXT_PUBLIC_SANITY_PROJECT_ID'],
  dataset: env['NEXT_PUBLIC_SANITY_DATASET'] || 'production',
  token: env['SANITY_API_TOKEN'],
  apiVersion: '2024-01-01',
  useCdn: false,
})

const { artworks } = await client.fetch(`*[_id=="series-2015-2017"][0]{artworks}`)
const passage = artworks.find(a => a.slug?.current === 'diptych-passage')
if (!passage) throw new Error('Diptych Passage not found')
await client.patch('series-2015-2017')
  .set({ artworks: [passage, ...artworks.filter(a => a !== passage)] })
  .commit()
console.log('Diptych Passage now opens Émanation.')

// Coming Home (Serotiny, 2025): medium corrected per Armelle, 3 Nov 2026.
// Rollback: set it back to 'Acrylics on canvas'.
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(path.resolve(__dirname, '..', '.env.local'), 'utf8').split('\n')
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

const MEDIUM = 'Red earth from El Morreón, acrylics and posca on canvas'
const s = await client.fetch(`*[_type == "paintingSeries" && slug.current == "2025-2026"][0]{ _id, "a": artworks[slug.current == "coming-home"][0]{ _key, medium } }`)
console.log('Before:', s.a.medium)
await client.patch(s._id).set({ [`artworks[_key=="${s.a._key}"].medium`]: MEDIUM }).commit()
const after = await client.fetch(`*[_id == $id][0].artworks[slug.current == "coming-home"][0].medium`, { id: s._id })
console.log('After: ', after)

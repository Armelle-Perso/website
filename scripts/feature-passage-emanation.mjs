/**
 * One-off, 2026-10-28, per Armelle: after the split, Diptych Passage looked
 * crushed in the Émanation grid (a wide diptych in a one-third column). It
 * becomes featured, shown full width like Home Is Where You Go and Sol del
 * Corazón. Before: featured unset.
 *
 *   node scripts/feature-passage-emanation.mjs
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

await client.patch('series-2015-2017')
  .set({ 'artworks[slug.current=="diptych-passage"].featured': true })
  .commit()
console.log('Diptych Passage featured in Émanation.')

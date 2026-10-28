/**
 * One-off, 2026-10-28: Armelle does not want Majorelle on the site after all.
 * Undoes the Majorelle part of add-multidimensional-playfulness-and-majorelle.mjs.
 *
 *   node scripts/remove-majorelle.mjs
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

await client.patch('series-2018-2019').unset(['artworks[_key=="majorelle"]']).commit()
console.log('Majorelle removed from Hidrocoria.')

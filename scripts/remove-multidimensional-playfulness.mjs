/**
 * One-off, 2026-10-28: Multidimensional Playfulness comes off the site until its size is known
 * (per Armelle: no size, no listing). It stays filed under Diffraction.
 * Undoes the Playfulness part of add-multidimensional-playfulness-and-majorelle.mjs.
 *
 *   node scripts/remove-multidimensional-playfulness.mjs
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

await client.patch('1y7ZVPKFp3J9IOAgPWvCg5').unset(['artworks[_key=="multidimensional-playfulness"]']).commit()
console.log('Multidimensional Playfulness removed from Diffraction.')

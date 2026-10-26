/**
 * One-off, 2026-10-27: Elan (150 × 50 cm) shown full width in the middle of
 * the 2014 series, like Sol del Corazón in 2015–2016: featured = true and
 * moved to just after In Depth (middle of the shown works).
 * Before: Elan at index 4, not featured.
 *
 *   node scripts/feature-elan-2014.mjs
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

async function run() {
  const arts = await client.fetch(`*[_id=="series-2012-2014"][0].artworks`)
  const elan = arts.find(a => a.slug?.current === 'elan')
  const anchor = arts.find(a => a.slug?.current === 'in-depth')
  if (!elan || !anchor) throw new Error('Elan or In Depth not found')
  await client.patch('series-2012-2014')
    .unset([`artworks[_key=="${elan._key}"]`])
    .insert('after', `artworks[_key=="${anchor._key}"]`, [{ ...elan, featured: true }])
    .commit()
  console.log('Elan featured, placed after In Depth.')
}

run().catch(err => { console.error(err); process.exit(1) })

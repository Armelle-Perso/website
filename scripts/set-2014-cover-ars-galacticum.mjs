/**
 * One-off, 2026-10-28: Nebula (2014) circle -> Ars Galacticum (per Armelle:
 * a deep blue starfield that matches the title, and breaks the two pink circles). Previous cover: Joy.
 *
 *   node scripts/set-2014-cover-ars-galacticum.mjs
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
  const ref = await client.fetch(`*[_id=="series-2012-2014"][0].artworks[slug.current=="ars-galacticum"][0].image.asset._ref`)
  if (!ref) throw new Error('Ars Galacticum not found')
  await client.patch('series-2012-2014').set({ coverImage: { _type: 'image', asset: { _type: 'reference', _ref: ref } } }).commit()
  console.log(`Nebula (2014) cover -> Ars Galacticum (${ref})`)
}

run().catch(err => { console.error(err); process.exit(1) })

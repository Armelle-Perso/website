/**
 * One-off, 2026-10-27: 2012–2013 circle -> Ishtar (per Armelle; sold work,
 * her choice). Previous cover: Devil's Dare.
 *
 *   node scripts/set-2012-2013-cover-ishtar.mjs
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
  const ref = await client.fetch(`*[_id=="series-2012-2013"][0].artworks[slug.current=="ishtar"][0].image.asset._ref`)
  if (!ref) throw new Error('Ishtar not found')
  await client.patch('series-2012-2013').set({ coverImage: { _type: 'image', asset: { _type: 'reference', _ref: ref } } }).commit()
  console.log(`2012–2013 cover -> Ishtar (${ref})`)
}

run().catch(err => { console.error(err); process.exit(1) })

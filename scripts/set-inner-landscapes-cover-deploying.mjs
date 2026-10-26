/**
 * One-off, 2026-10-26: Inner Landscapes series cover -> "Deploying".
 * Previous cover, for rollback: image-c66865c09977da407a806ac1676fc75b3de54d49-3619x2400-jpg (Opening Up)
 *
 *   node scripts/set-inner-landscapes-cover-deploying.mjs
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
  const ref = await client.fetch(
    `*[_id=="series-inner-landscapes-2023"][0].artworks[title=="Deploying"][0].image.asset._ref`
  )
  if (!ref) { console.error('Deploying not found, nothing done.'); process.exit(1) }
  await client.patch('series-inner-landscapes-2023')
    .set({ coverImage: { _type: 'image', asset: { _type: 'reference', _ref: ref } } })
    .commit()
  console.log(`Inner Landscapes cover -> Deploying (${ref})`)
}

run().catch(err => { console.error(err); process.exit(1) })

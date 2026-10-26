/**
 * One-off, 2026-10-27: Sanguine was painted in Brussels in 2013 (Armelle is
 * certain, although its photo and inventory line are filed under 2014, the
 * year it entered the gallery). Moves it from "2014" to the end of
 * "2012–2013", year 2014 -> 2013. Old links redirect in next.config.ts.
 *
 *   node scripts/move-sanguine-to-2012-2013.mjs
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
  const s = await client.fetch(`*[_id=="series-2012-2014"][0].artworks[slug.current=="sanguine"][0]`)
  if (!s) { console.log('Sanguine not in 2014, nothing done.'); return }
  await client.transaction()
    .patch(client.patch('series-2012-2014').unset([`artworks[_key=="${s._key}"]`]))
    .patch(client.patch('series-2012-2013').insert('after', 'artworks[-1]', [{ ...s, year: '2013' }]))
    .commit()
  console.log('Sanguine moved to 2012–2013 (2013).')
}

run().catch(err => { console.error(err); process.exit(1) })

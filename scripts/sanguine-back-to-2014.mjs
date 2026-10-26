/**
 * One-off, 2026-10-27: Sanguine was painted in Brussels, but in 2014 (Armelle
 * left Brussels in 2014). Moves it back from "2012–2013" to "2014", year 2014.
 * Reverses scripts/move-sanguine-to-2012-2013.mjs.
 *
 *   node scripts/sanguine-back-to-2014.mjs
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
  const s = await client.fetch(`*[_id=="series-2012-2013"][0].artworks[slug.current=="sanguine"][0]`)
  if (!s) { console.log('Sanguine not in 2012-2013, nothing done.'); return }
  await client.transaction()
    .patch(client.patch('series-2012-2013').unset([`artworks[_key=="${s._key}"]`]))
    .patch(client.patch('series-2012-2014').insert('after', 'artworks[-1]', [{ ...s, year: '2014' }]))
    .commit()
  console.log('Sanguine back in 2014 (2014).')
}

run().catch(err => { console.error(err); process.exit(1) })

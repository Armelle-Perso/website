/**
 * One-off, 2026-10-26: "Joy" (2014, 160 × 130 cm) appeared in both 2012–2014
 * and 2015–2017 by mistake. Keeps the 2012–2014 entry (it has year and
 * medium); removes the 2015–2017 copy, which had neither.
 * Rollback: re-insert the printed entry at the start of series-2015-2017.artworks.
 *
 *   node scripts/remove-joy-duplicate-2015-2017.mjs
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
  const entry = await client.fetch(`*[_id=="series-2015-2017"][0].artworks[slug.current=="joy"][0]`)
  if (!entry) { console.log('No Joy in 2015-2017, nothing done.'); return }
  console.log('Removing (for rollback):', JSON.stringify(entry))
  await client.patch('series-2015-2017').unset([`artworks[_key=="${entry._key}"]`]).commit()
  console.log('Removed Joy from 2015-2017.')
}

run().catch(err => { console.error(err); process.exit(1) })

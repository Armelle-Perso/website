/**
 * One-off, 2026-11-17: gives every series a slug with its name, like the newer
 * ones (lightcodes-2021, morphogenese-2015-2016...). Old year-only URLs are
 * redirected in next.config.ts. Rollback: run with --rollback.
 *
 *   node scripts/rename-series-slugs-with-names.mjs [--rollback]
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

const RENAMES = {
  '2011': 'prakriti-2011',
  '2012-2013': 'axis-mundi-2012-2013',
  '2014': 'nebula-2014',
  '2015-2016': 'emanation-2015-2016',
  '2018-2019': 'hidrocoria-2018-2019',
  '2022-2023': 'diffraction-2022-2023',
  '2025-2026': 'serotiny-2025-2026',
}
const rollback = process.argv.includes('--rollback')
const pairs = Object.entries(RENAMES).map(([a, b]) => (rollback ? [b, a] : [a, b]))

async function run() {
  const tx = client.transaction()
  for (const [from, to] of pairs) {
    const docs = await client.fetch(`*[_type=="paintingSeries" && slug.current==$from]{_id,title}`, { from })
    if (docs.length !== 1) throw new Error(`${from}: ${docs.length} documents found`)
    console.log(`${docs[0]._id} (${JSON.stringify(docs[0].title)}): ${from} -> ${to}`)
    tx.patch(docs[0]._id, p => p.set({ 'slug.current': to }))
  }
  await tx.commit()
  console.log('done')
}
run().catch(err => { console.error(err); process.exit(1) })

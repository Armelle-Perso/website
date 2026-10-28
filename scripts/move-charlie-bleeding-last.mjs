/**
 * One-off, 2026-10-28: in 2015-2016, the three Charlie Bleeding paintings move
 * from the start to the end of the series (per Armelle: the series is about the
 * spiritual opening, and Charlie Bleeding is another energy). Previous order:
 * charlie-bleeding-1, -2, -3 first, then the rest unchanged.
 *
 *   node scripts/move-charlie-bleeding-last.mjs
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
  const doc = await client.getDocument('series-2015-2017')
  const isCharlie = a => (a.slug?.current || '').startsWith('charlie-bleeding')
  const rest = doc.artworks.filter(a => !isCharlie(a))
  const charlie = doc.artworks.filter(isCharlie)
  if (charlie.length !== 3) throw new Error(`expected 3 Charlie Bleeding, found ${charlie.length}`)
  await client.patch('series-2015-2017').set({ artworks: [...rest, ...charlie] }).commit()
  console.log('new order:', [...rest, ...charlie].map(a => a.slug?.current).join(', '))
}

run().catch(err => { console.error(err); process.exit(1) })

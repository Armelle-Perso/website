/**
 * One-off, 2026-10-27: "First Pieces" (2011) renamed "Prakriti" (Sanskrit:
 * primordial nature, the original matter). Slug stays "2011".
 * Previous title: "First Pieces".
 *
 *   node scripts/rename-2011-prakriti.mjs
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
  const before = await client.fetch(`*[_id=="series-2011"][0]{title,year}`)
  await client.patch('series-2011').set({ title: 'Prakriti' }).commit()
  console.log(`"${before.title}" (${before.year}) -> "Prakriti"`)
}

run().catch(err => { console.error(err); process.exit(1) })

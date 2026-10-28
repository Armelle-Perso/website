/**
 * One-off, 2026-10-28: "2018–2019" renamed "Hidrocoria" (botany: seeds
 * dispersed by water). Slug stays "2018-2019".
 * Previous title: "2018–2019".
 *
 *   node scripts/rename-2018-2019-hidrocoria.mjs
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
  const before = await client.fetch(`*[_id=="series-2018-2019"][0]{title,year}`)
  await client.patch('series-2018-2019').set({ title: 'Hidrocoria' }).commit()
  console.log(`"${before.title}" (${before.year}) -> "Hidrocoria"`)
}

run().catch(err => { console.error(err); process.exit(1) })

/**
 * One-off, 2026-10-28: "2012–2013" renamed "Axis Mundi" (the world axis
 * linking earth and sky in myths: Ishtar, Devil's Dare, Signs, Terra). Slug stays "2012-2013".
 * Previous title: "2012–2013".
 *
 *   node scripts/rename-2012-2013-axis-mundi.mjs
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
  const before = await client.fetch(`*[_id=="series-2012-2013"][0]{title,year}`)
  await client.patch('series-2012-2013').set({ title: 'Axis Mundi' }).commit()
  console.log(`"${before.title}" (${before.year}) -> "Axis Mundi"`)
}

run().catch(err => { console.error(err); process.exit(1) })

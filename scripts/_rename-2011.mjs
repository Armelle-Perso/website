/**
 * Renames the 2011 series to "First Pieces".
 *   node scripts/_rename-2011.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(path.resolve(__dirname, '../.env.local'), 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const client = createClient({
  projectId: env['NEXT_PUBLIC_SANITY_PROJECT_ID'],
  dataset: env['NEXT_PUBLIC_SANITY_DATASET'] || 'production',
  token: env['SANITY_API_TOKEN'],
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function run() {
  const series = await client.fetch(
    `*[_type == "paintingSeries" && (title == "2011" || year == 2011)][0]{ _id, title }`
  )
  if (!series) {
    console.error('2011 series not found!')
    process.exit(1)
  }
  console.log(`Found: "${series.title}"`)

  await client.patch(series._id).set({ title: 'First Pieces' }).commit()
  console.log('✓ Renamed to "First Pieces"')

  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

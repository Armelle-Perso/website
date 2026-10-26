/**
 * One-off, 2026-10-26: renames the 2025-2026 series slug "2025" -> "2025-2026"
 * so URLs match the title. Old /art/paintings/2025/... links are redirected in
 * next.config.ts. Rollback: set slug.current back to "2025" on series-2025.
 *
 *   node scripts/rename-series-2025-slug.mjs
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
  const before = await client.fetch(`*[_id=="series-2025"][0].slug.current`)
  console.log(`Before: ${before}`)
  await client.patch('series-2025').set({ 'slug.current': '2025-2026' }).commit()
  console.log('After: 2025-2026')
}

run().catch(err => { console.error(err); process.exit(1) })

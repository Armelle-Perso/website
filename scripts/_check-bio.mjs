/**
 * Reads the current bio from Sanity siteSettings.
 *   node scripts/_check-bio.mjs
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
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ bio, bio_fr, bio_es }`)
  console.log('=== EN bio ===')
  console.log(settings.bio || '(empty)')
  console.log('\n=== FR bio ===')
  console.log(settings.bio_fr || '(empty)')
  console.log('\n=== ES bio ===')
  console.log(settings.bio_es || '(empty)')
}

run().catch(err => { console.error(err); process.exit(1) })

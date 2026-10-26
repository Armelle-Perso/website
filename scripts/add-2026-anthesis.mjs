/**
 * One-off, 2026-10-26:
 *  1. Uploads "Anthesis" (2026, F30, lava sand, acrylics and posca) into the
 *     2025-2026 series, available.
 *  2. Makes it the series cover (the circle on /art/paintings).
 *     Previous cover, for rollback: image-11bd0bb960ec7c0acb6ddeca7c3a6f1cf226d1e2-3630x2894-jpg (Coming Home)
 *
 *   node scripts/add-2026-anthesis.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
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

const NEW_IMAGE = 'C:\\Users\\DELL\\OneDrive\\Documents\\CREA\\TOILES\\2026\\2026-Anthesis-92x73.jpg'

async function run() {
  const existing = await client.fetch(`*[_id=="series-2025"][0].artworks[slug.current=="anthesis"][0]`)
  if (existing) { console.error('Anthesis is already in the series, nothing done.'); process.exit(1) }
  if (!existsSync(NEW_IMAGE)) { console.error(`Not found: ${NEW_IMAGE}`); process.exit(1) }

  const asset = await client.assets.upload('image', readFileSync(NEW_IMAGE), {
    filename: path.basename(NEW_IMAGE), contentType: 'image/jpeg',
  })
  console.log(`Uploaded ${path.basename(NEW_IMAGE)} -> ${asset._id}`)

  const image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  const artwork = {
    _type: 'object',
    _key: asset._id,
    image,
    title: 'Anthesis',
    slug: { _type: 'slug', current: 'anthesis' },
    medium: 'Lava sand, acrylics and posca on canvas',
    dimensions: '92 × 73 cm',
    year: '2026',
    available: true,
  }

  await client
    .patch('series-2025')
    .set({ coverImage: image })
    .insert('after', 'artworks[-1]', [artwork])
    .commit()

  console.log('Anthesis added to 2025-2026 and set as the series cover.')
}

run().catch(err => { console.error(err); process.exit(1) })

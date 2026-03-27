/**
 * Uploads "Inner Landscapes" (2023) painting series to Sanity.
 * Images are read from the local filesystem and uploaded as Sanity assets.
 * Uses createOrReplace so it's safe to re-run.
 *
 *   node scripts/add-inner-landscapes.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '..', '.env.local')
if (!existsSync(envPath)) {
  console.error('Missing .env.local — need NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.')
  process.exit(1)
}
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
)

const projectId = env['NEXT_PUBLIC_SANITY_PROJECT_ID']
const token = env['SANITY_API_TOKEN']
const dataset = env['NEXT_PUBLIC_SANITY_DATASET'] || 'production'

if (!projectId || !token) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN in .env.local first.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

const IMAGES_DIR = 'C:\\Users\\DELL\\OneDrive\\Documents\\CREA\\TOILES\\2023\\InnerLandscapes'

const SERIES_ID = 'series-inner-landscapes-2023'
const SERIES_SLUG = 'inner-landscapes-2023'

const artworks = [
  { file: '1-Unfolding-27x100-modif.jpg', title: 'Unfolding', slug: 'unfolding', dimensions: '27 × 100 cm', year: '2023', available: true },
  { file: '2-Unlocking-35x60.jpg',        title: 'Unlocking', slug: 'unlocking', dimensions: '35 × 60 cm',  year: '2023', available: false },
  { file: '3-Opening-up-41x60.jpg',       title: 'Opening Up', slug: 'opening-up', dimensions: '41 × 60 cm',  year: '2023', available: false },
  { file: '4-Deploying-41x60-ok.jpg',     title: 'Deploying', slug: 'deploying', dimensions: '41 × 60 cm',  year: '2023', available: true },
]

async function uploadImage(filePath) {
  const buffer = readFileSync(filePath)
  const filename = path.basename(filePath)
  return client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' })
}

async function run() {
  console.log('Uploading Inner Landscapes (2023)...\n')

  const artworkDocs = []
  let coverAsset = null

  for (const art of artworks) {
    const filePath = path.join(IMAGES_DIR, art.file)
    if (!existsSync(filePath)) {
      console.error(`  File not found: ${filePath}`)
      process.exit(1)
    }

    const asset = await uploadImage(filePath)
    console.log(`  Uploaded: ${art.file} → ${asset._id}`)

    if (!coverAsset) coverAsset = asset

    artworkDocs.push({
      _type: 'object',
      _key: asset._id,
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      title: art.title,
      slug: { _type: 'slug', current: art.slug },
      medium: 'Acrylics on canvas',
      dimensions: art.dimensions,
      year: art.year,
      available: art.available,
    })
  }

  const doc = {
    _type: 'paintingSeries',
    _id: SERIES_ID,
    title: 'Inner Landscapes',
    slug: { _type: 'slug', current: SERIES_SLUG },
    year: '2023',
    coverImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: coverAsset._id },
    },
    artworks: artworkDocs,
  }

  await client.createOrReplace(doc)
  console.log(`\nCreated document: ${SERIES_ID}`)
  console.log('Done! Check /studio and /art/paintings to verify.')
}

run().catch(err => { console.error(err); process.exit(1) })

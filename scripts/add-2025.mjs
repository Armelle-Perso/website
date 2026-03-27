/**
 * Uploads 2025 painting series to Sanity.
 *   node scripts/add-2025.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '..', '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
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

const IMAGES_DIR = 'C:\\Users\\DELL\\OneDrive\\Documents\\CREA\\TOILES\\2025'
const SERIES_ID = 'series-2025'
const SERIES_SLUG = '2025'

const artworks = [
  { file: 'Coming-home-92x73-not available.jpg', title: 'Coming Home', slug: 'coming-home', dimensions: '92 × 73 cm', year: '2025', available: false },
  { file: 'Gifts-in-limbo-81x60.jpg',            title: 'Gifts in Limbo', slug: 'gifts-in-limbo', dimensions: '81 × 60 cm', year: '2025', available: true },
  { file: 'La-vida-de-barranco-81x60.jpg',        title: 'La Vida de Barranco', slug: 'la-vida-de-barranco', dimensions: '81 × 60 cm', year: '2025', available: true },
]

async function uploadImage(filePath) {
  const buffer = readFileSync(filePath)
  const filename = path.basename(filePath)
  return client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' })
}

async function run() {
  console.log('Uploading 2025 series...\n')

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
    title: '2025',
    slug: { _type: 'slug', current: SERIES_SLUG },
    year: '2025',
    coverImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: coverAsset._id },
    },
    artworks: artworkDocs,
  }

  await client.createOrReplace(doc)
  console.log(`\nCreated document: ${SERIES_ID}`)
  console.log('Done!')
}

run().catch(err => { console.error(err); process.exit(1) })

/**
 * Appends 3 missing artworks to the existing Lightcodes series.
 *   node scripts/add-lightcodes-missing.mjs
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

const IMAGES_DIR = 'C:\\Users\\DELL\\OneDrive\\Desktop\\site-update-art'
const SERIES_ID = 'series-lightcodes-2021'

const artworks = [
  {
    file: 'Lionsgate-series-lightcodes-not-available-2021-posca-acrylic-on-leather-2021.jpg',
    title: 'Lionsgate',
    slug: 'lionsgate',
    medium: 'Posca & acrylic on leather',
    dimensions: '',
    year: '2021',
    available: false,
  },
  {
    file: 'fortaleza-not-available-35x9-2021.jpg',
    title: 'Fortaleza',
    slug: 'fortaleza',
    medium: 'Posca & acrylic on leather',
    dimensions: '35 × 9 cm',
    year: '2021',
    available: false,
  },
  {
    file: 'lightcodes-SeedPiece-on-leather-2021-not-available-turned-into-jewelry.jpg',
    title: 'SeedPiece',
    slug: 'seedpiece',
    medium: 'Posca on leather',
    dimensions: '',
    year: '2021',
    available: false,
  },
]

async function uploadImage(filePath) {
  const buffer = readFileSync(filePath)
  const filename = path.basename(filePath)
  return client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' })
}

async function run() {
  console.log('Appending 3 artworks to Lightcodes series...\n')

  const newArtworks = []

  for (const art of artworks) {
    const filePath = path.join(IMAGES_DIR, art.file)
    if (!existsSync(filePath)) {
      console.error(`  File not found: ${filePath}`)
      process.exit(1)
    }

    const asset = await uploadImage(filePath)
    console.log(`  Uploaded: ${art.title} → ${asset._id}`)

    const doc = {
      _type: 'object',
      _key: asset._id.replace('image-', '').slice(0, 12),
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      title: art.title,
      slug: { _type: 'slug', current: art.slug },
      medium: art.medium,
      year: art.year,
      available: art.available,
    }
    if (art.dimensions) doc.dimensions = art.dimensions
    if (art.hideDimensions) doc.hideDimensions = true

    newArtworks.push(doc)
  }

  // Append to existing artworks array
  await client
    .patch(SERIES_ID)
    .setIfMissing({ artworks: [] })
    .append('artworks', newArtworks)
    .commit()

  console.log(`\nAppended ${newArtworks.length} artworks to ${SERIES_ID}`)
  console.log('Done!')
}

run().catch(err => { console.error(err); process.exit(1) })

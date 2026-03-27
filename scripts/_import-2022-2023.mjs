/**
 * Creates "2022-2023" painting series and imports artworks with images.
 *   node scripts/_import-2022-2023.mjs
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

const artworks = [
  {
    title: 'Cellular Reweaving',
    dimensions: '53 × 12 cm',
    medium: 'Linen canvas on plywood',
    year: 2022,
    available: false,
    file: 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2022/CELLULAR-REWEAVING-2022-53x12-lINENCANVASONPLYWOOD-not-available.jpeg',
  },
  {
    title: 'Prismatic Love',
    dimensions: '50 × 81 cm',
    year: 2022,
    available: false,
    file: 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2022/prismatic-love-2022-50x81-not-available.jpg',
  },
  {
    title: 'Self Sustaining Lights',
    dimensions: '45 × 55 cm',
    year: 2022,
    available: false,
    file: 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2022/self-sustaining-lights-45-55-2022--not-available.jpg',
  },
  {
    title: 'Serenity in Diffraction',
    medium: 'On papyrus',
    year: 2022,
    file: 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2022/serenity-in-diffraction-papyrus-2022.jpg',
  },
  {
    title: 'Untitled',
    dimensions: '100 × 73 cm',
    year: 2022,
    file: 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2022/Untitled-100x73-2022.jpg',
  },
  {
    title: 'Fragmented Realities',
    dimensions: '90 × 33 cm',
    year: 2023,
    file: 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2023/Fragmented-Realities-90x33.jpg',
  },
  {
    title: 'Back in Town',
    dimensions: '90 × 33 cm',
    year: 2023,
    available: true,
    file: 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2023/Back-in-Town-90x33-available.jpg',
  },
]

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function run() {
  const artworkObjects = []

  for (const a of artworks) {
    console.log(`Uploading: ${a.title}...`)
    const imageBuffer = readFileSync(a.file)
    const ext = path.extname(a.file).replace('.', '')
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: `${slugify(a.title)}.${ext}`,
      contentType: ext === 'jpeg' || ext === 'jpg' ? 'image/jpeg' : 'image/png',
    })
    console.log(`  ✓ Uploaded: ${asset._id}`)

    const obj = {
      _key: slugify(a.title),
      _type: 'object',
      title: a.title,
      slug: { _type: 'slug', current: slugify(a.title) },
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    }
    if (a.dimensions) obj.dimensions = a.dimensions
    if (a.medium) obj.medium = a.medium
    if (a.year) obj.year = a.year
    if (a.available === true) obj.available = true
    if (a.available === false) obj.available = false

    artworkObjects.push(obj)
  }

  // Create the series
  const series = await client.create({
    _type: 'paintingSeries',
    title: '2022-2023',
    slug: { _type: 'slug', current: '2022-2023' },
    year: 2022,
    coverImage: artworkObjects.find(a => a.title === 'Self Sustaining Lights').image,
    artworks: artworkObjects,
  })

  console.log(`\n✓ Created series "${series.title}" with ${artworkObjects.length} artworks`)
  console.log('Done!')
}

run().catch(err => { console.error(err); process.exit(1) })

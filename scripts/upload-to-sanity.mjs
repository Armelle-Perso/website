/**
 * Uploads downloaded images to Sanity and creates paintingSeries documents.
 * Requires .env.local with NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.
 * Run AFTER download-images.mjs:
 *   node scripts/download-images.mjs
 *   node scripts/upload-to-sanity.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync, readdirSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env.local manually
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '..', '.env.local')
if (!existsSync(envPath)) {
  console.error('Missing .env.local — fill in NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN first.')
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

const DOWNLOADS_DIR = path.resolve(__dirname, '..', 'downloads', 'images')

// Series metadata — edit titles/years as needed
const seriesMeta = {
  'lightcodes-2021':  { title: 'Lightcodes', year: 2021, slug: 'lightcodes-2021' },
  'transforma-2020':  { title: 'Transforma', year: 2020, slug: 'transforma-2020' },
  'cuadritos-2019':   { title: 'Cuadritos', year: 2019, slug: 'cuadritos-2019' },
  '2018-2019':        { title: '2018–2019', year: 2019, slug: '2018-2019' },
  'caminos-2017-2018':{ title: 'Caminos', year: 2018, slug: 'caminos-2017-2018' },
  '2015-2017':        { title: '2015–2017', year: 2017, slug: '2015-2017' },
  '2012-2014':        { title: '2012–2014', year: 2014, slug: '2012-2014' },
  'endorphines-2012': { title: 'Endorphines', year: 2012, slug: 'endorphines-2012' },
  '2011':             { title: '2011', year: 2011, slug: '2011' },
  'people':           { title: 'People with their painting', year: null, slug: 'people' },
}

async function uploadImage(filePath) {
  const buffer = readFileSync(filePath)
  const filename = path.basename(filePath)
  const ext = path.extname(filename).toLowerCase().replace('.', '')
  const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
  const contentType = mimeMap[ext] || 'image/jpeg'
  return client.assets.upload('image', buffer, { filename, contentType })
}

async function run() {
  const paintingsDir = path.join(DOWNLOADS_DIR, 'paintings')
  if (!existsSync(paintingsDir)) {
    console.error(`Run download-images.mjs first — ${paintingsDir} not found`)
    process.exit(1)
  }

  // Upload painting series
  for (const [seriesSlug, meta] of Object.entries(seriesMeta)) {
    const seriesDir = path.join(paintingsDir, seriesSlug)
    if (!existsSync(seriesDir)) { console.log(`Skip missing: ${seriesSlug}`); continue }

    const files = readdirSync(seriesDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    console.log(`\nSeries: ${meta.title} (${files.length} images)`)

    const imageRefs = []
    for (const file of files) {
      try {
        const asset = await uploadImage(path.join(seriesDir, file))
        imageRefs.push({ _type: 'image', _key: asset._id, asset: { _type: 'reference', _ref: asset._id } })
        console.log(`  Uploaded: ${file}`)
      } catch (err) {
        console.error(`  Failed: ${file} — ${err.message}`)
      }
    }

    // Create or update the paintingSeries document
    const doc = {
      _type: 'paintingSeries',
      _id: `series-${meta.slug}`,
      title: meta.title,
      slug: { _type: 'slug', current: meta.slug },
      year: meta.year,
      images: imageRefs,
    }
    await client.createOrReplace(doc)
    console.log(`  Created document: series-${meta.slug}`)
  }

  // Upload jewelry images
  const jewelryDir = path.join(DOWNLOADS_DIR, 'jewelry')
  if (existsSync(jewelryDir)) {
    const files = readdirSync(jewelryDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    console.log(`\nJewelry (${files.length} images)`)
    const imageRefs = []
    for (const file of files) {
      try {
        const asset = await uploadImage(path.join(jewelryDir, file))
        imageRefs.push({ _type: 'image', _key: asset._id, asset: { _type: 'reference', _ref: asset._id } })
        console.log(`  Uploaded: ${file}`)
      } catch (err) {
        console.error(`  Failed: ${file} — ${err.message}`)
      }
    }
    await client.createOrReplace({
      _type: 'jewelryCollection',
      _id: 'jewelry-lightcode-accessories',
      title: 'Lightcode Accessories',
      slug: { _type: 'slug', current: 'lightcode-accessories' },
      images: imageRefs,
    })
    console.log('  Created document: jewelry-lightcode-accessories')
  }

  // Upload sketches images
  const sketchesDir = path.join(DOWNLOADS_DIR, 'sketches')
  if (existsSync(sketchesDir)) {
    const files = readdirSync(sketchesDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    console.log(`\nSketches (${files.length} images)`)
    for (const file of files) {
      try {
        await uploadImage(path.join(sketchesDir, file))
        console.log(`  Uploaded: ${file}`)
      } catch (err) {
        console.error(`  Failed: ${file} — ${err.message}`)
      }
    }
  }

  console.log('\nAll done! Open /studio to review and add titles/descriptions.')
}

run().catch(err => { console.error(err); process.exit(1) })

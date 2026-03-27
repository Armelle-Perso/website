/**
 * Patches the Sanity documents to move images into the correct `artworks` field
 * and sets the first image as the coverImage for each series.
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '..', '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
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

// Fetch all paintingSeries docs that have the wrong `images` field
const docs = await client.fetch(`*[_type == "paintingSeries"]{ _id, title, images, artworks, coverImage }`)
console.log(`Found ${docs.length} painting series documents\n`)

for (const doc of docs) {
  const imageRefs = doc.images || []

  if (!imageRefs.length) {
    console.log(`SKIP  ${doc.title} — no images field found`)
    continue
  }

  // Convert each image ref into an artwork object
  const artworks = imageRefs.map((img, i) => ({
    _type: 'object',
    _key: img._key || `artwork-${i}`,
    image: {
      _type: 'image',
      asset: img.asset,
    },
    title: '',
    medium: '',
    dimensions: '',
    year: '',
    available: false,
  }))

  // Use the first image as the cover
  const coverImage = {
    _type: 'image',
    asset: imageRefs[0].asset,
  }

  await client
    .patch(doc._id)
    .set({ artworks, coverImage })
    .unset(['images'])
    .commit()

  console.log(`✓  ${doc.title} — ${artworks.length} artworks, cover set`)
}

// Also fix the jewelry collection
const jewelry = await client.fetch(`*[_type == "jewelryCollection"]{ _id, title, images, pieces }`)
for (const doc of jewelry) {
  const imageRefs = doc.images || []
  if (!imageRefs.length) continue

  const pieces = imageRefs.map((img, i) => ({
    _type: 'object',
    _key: img._key || `piece-${i}`,
    image: { _type: 'image', asset: img.asset },
    title: '',
    category: 'Other',
    materials: '',
    available: false,
  }))

  await client.patch(doc._id).set({ pieces }).unset(['images']).commit()
  console.log(`✓  ${doc.title} (jewelry) — ${pieces.length} pieces`)
}

console.log('\nDone! Refresh http://localhost:3001/art/paintings')

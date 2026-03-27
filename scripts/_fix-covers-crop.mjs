/**
 * Adjusts crop on cover images for "First Pieces" (2011) and 2015-2017
 * to zoom in and hide visible lines/edges.
 *   node scripts/_fix-covers-crop.mjs
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
    `*[_type == "paintingSeries" && (year == 2011 || title match "2015*")]{ _id, title, year, coverImage }`
  )

  if (!series.length) {
    console.error('No matching series found!')
    process.exit(1)
  }

  for (const s of series) {
    if (!s.coverImage) {
      console.log(`⚠ ${s.title} has no cover image, skipping`)
      continue
    }

    // Crop aggressively (~25%) to ensure no edge lines visible in circle
    const updatedCover = {
      ...s.coverImage,
      crop: { top: 0.2, bottom: 0.2, left: 0.2, right: 0.2, _type: 'sanity.imageCrop' },
      hotspot: { x: 0.5, y: 0.5, width: 0.6, height: 0.6, _type: 'sanity.imageHotspot' },
    }

    await client.patch(s._id).set({ coverImage: updatedCover }).commit()
    console.log(`✓ ${s.title} — cover cropped & centered`)
  }

  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

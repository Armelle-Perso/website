/**
 * Updates the coverImage for the Inner Landscapes series to use "Opening Up".
 *   node scripts/update-covers.mjs
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
  // 1. Update Inner Landscapes cover to "Opening Up"
  const innerLandscapes = await client.fetch(
    `*[_type == "paintingSeries" && slug.current == "inner-landscapes-2023"][0]{
      _id,
      artworks[]{ title, image }
    }`
  )

  if (!innerLandscapes) {
    console.error('Inner Landscapes series not found!')
    process.exit(1)
  }

  const openingUp = innerLandscapes.artworks?.find(a => a.title === 'Opening Up')
  if (!openingUp?.image?.asset?._ref) {
    console.error('Opening Up artwork not found in Inner Landscapes!')
    console.log('Available:', innerLandscapes.artworks?.map(a => a.title))
    process.exit(1)
  }

  await client.patch(innerLandscapes._id)
    .set({ coverImage: { _type: 'image', asset: { _type: 'reference', _ref: openingUp.image.asset._ref } } })
    .commit()
  console.log('✓ Inner Landscapes cover → Opening Up')

  // 2. Verify Sol del Corazón is findable for available works cover
  const solImage = await client.fetch(
    `*[_type == "paintingSeries" && count(artworks[title match "Sol Coraz"]) > 0][0]{
      "artworks": artworks[title match "Sol Coraz"]{ title, slug, image }
    }`
  )

  if (solImage?.artworks?.length) {
    console.log('✓ Sol del Corazón artworks found:')
    solImage.artworks.forEach(a => console.log(`  - ${a.title} (slug: ${a.slug?.current})`))
  } else {
    console.error('✗ No Sol del Corazón artworks found! Available works cover will use fallback.')
  }

  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

/**
 * Removes duplicate 2022-2023 series, keeping the one with "Self Sustaining Lights" cover.
 *   node scripts/_fix-2022-duplicates.mjs
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
  const all = await client.fetch(
    `*[_type == "paintingSeries" && slug.current == "2022-2023"]{ _id, title, "coverTitle": artworks[0].title, "coverAsset": coverImage.asset._ref }`
  )

  console.log(`Found ${all.length} series with slug "2022-2023":`)
  all.forEach(s => console.log(`  ${s._id} — cover asset: ${s.coverAsset || '(none)'}, first artwork: ${s.coverTitle}`))

  // Find the one with Self Sustaining Lights cover (the one we patched)
  // That's the one updated by _fix-2022-cover.mjs
  // We need to check which one has the right cover — fetch more detail
  const detailed = await client.fetch(
    `*[_type == "paintingSeries" && slug.current == "2022-2023"]{
      _id,
      "coverArtworkTitles": artworks[].title,
      "coverRef": coverImage.asset._ref
    }`
  )

  // Find the keeper: the one whose coverImage matches "Self Sustaining Lights" artwork image
  let keepId = null
  let deleteIds = []

  for (const s of detailed) {
    const selfSustaining = await client.fetch(
      `*[_type == "paintingSeries" && _id == $id][0]{
        "coverRef": coverImage.asset._ref,
        "sslRef": artworks[title == "Self Sustaining Lights"][0].image.asset._ref
      }`,
      { id: s._id }
    )
    if (selfSustaining.coverRef && selfSustaining.sslRef && selfSustaining.coverRef === selfSustaining.sslRef) {
      keepId = s._id
    } else {
      deleteIds.push(s._id)
    }
  }

  if (!keepId) {
    console.error('Could not identify which series has Self Sustaining Lights as cover!')
    console.log('Keeping the most recent one and deleting the other(s)...')
    keepId = all[all.length - 1]._id
    deleteIds = all.slice(0, -1).map(s => s._id)
  }

  console.log(`\nKeeping: ${keepId}`)
  for (const id of deleteIds) {
    await client.delete(id)
    console.log(`✓ Deleted: ${id}`)
  }

  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

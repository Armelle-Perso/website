/**
 * Removes "Raag Bihag (original)" and updates "Raag Bihag (album cover)" info.
 *   node scripts/_fix-raag-bihag.mjs
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
    `*[_type == "paintingSeries" && count(artworks[title match "Raag Bihag*"]) > 0][0]{
      _id, title, artworks[]
    }`
  )

  if (!series) {
    console.error('Series with Raag Bihag not found!')
    process.exit(1)
  }

  console.log(`Found in: ${series.title}`)

  const updated = series.artworks
    // Remove the original
    .filter(a => {
      if (a.title === 'Raag Bihag (original)') {
        console.log('✓ Removed: Raag Bihag (original)')
        return false
      }
      return true
    })
    // Update the album cover
    .map(a => {
      if (a.title === 'Raag Bihag (album cover)') {
        console.log('✓ Updated: Raag Bihag (album cover)')
        return {
          ...a,
          title: 'Raag Bihag',
          medium: 'Album cover for Etienne Bartholomew — painted live as the album was recorded',
          available: false,
          link: 'https://etiennesitar.bandcamp.com/album/raag-bihag',
        }
      }
      return a
    })

  await client.patch(series._id).set({ artworks: updated }).commit()
  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

/**
 * Updates 2022-2023 cover to "Self Sustaining Lights".
 *   node scripts/_fix-2022-cover.mjs
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
    `*[_type == "paintingSeries" && slug.current == "2022-2023"][0]{ _id, artworks[]{ title, image } }`
  )
  if (!series) { console.error('Series not found!'); process.exit(1) }

  const artwork = series.artworks.find(a => a.title === 'Self Sustaining Lights')
  if (!artwork) { console.error('Artwork not found!'); process.exit(1) }

  await client.patch(series._id).set({ coverImage: artwork.image }).commit()
  console.log('✓ Cover updated to "Self Sustaining Lights"')
}

run().catch(err => { console.error(err); process.exit(1) })

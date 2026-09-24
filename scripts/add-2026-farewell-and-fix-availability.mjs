/**
 * One-off, 2026-09-24:
 *  1. Sets availability on the 16 artworks that had the field unset.
 *     All available except "Experiment on Dynamic Forms" (per Armelle).
 *  2. Renames the "2025" series to "2025-2026" (title and year; the slug
 *     stays "2025" so existing URLs keep working).
 *  3. Uploads "A Farewell to the Mountains" (2026) into that series.
 *
 *   node scripts/add-2026-farewell-and-fix-availability.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(path.resolve(__dirname, '..', '.env.local'), 'utf8').split('\n')
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

const NOT_AVAILABLE = ['Experiment on Dynamic Forms']

const NEW_IMAGE = 'C:\\Users\\DELL\\OneDrive\\Documents\\CREA\\TOILES\\2026\\2026-A-farewell-to-the-mountains-73x54.jpg'

async function run() {
  // ---- 1. availability on the unset artworks -------------------------
  const series = await client.fetch(
    `*[_type=="paintingSeries"]{_id, title, "unset": artworks[!defined(available)]{_key, title}}[count(unset)>0]`
  )
  let set = 0
  for (const s of series) {
    let p = client.patch(s._id)
    for (const a of s.unset) {
      const available = !NOT_AVAILABLE.includes(a.title)
      p = p.set({ [`artworks[_key=="${a._key}"].available`]: available })
      console.log(`  ${s.title} / ${a.title} -> available: ${available}`)
      set++
    }
    await p.commit()
  }
  console.log(`\nAvailability set on ${set} artworks.\n`)

  // ---- 2 & 3. rename the series and add the new painting -------------
  if (!existsSync(NEW_IMAGE)) { console.error(`Not found: ${NEW_IMAGE}`); process.exit(1) }
  const asset = await client.assets.upload('image', readFileSync(NEW_IMAGE), {
    filename: path.basename(NEW_IMAGE), contentType: 'image/jpeg',
  })
  console.log(`Uploaded ${path.basename(NEW_IMAGE)} -> ${asset._id}`)

  const artwork = {
    _type: 'object',
    _key: asset._id,
    image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    title: 'A Farewell to the Mountains',
    slug: { _type: 'slug', current: 'a-farewell-to-the-mountains' },
    medium: 'Acrylics on canvas',
    dimensions: '73 × 54 cm',
    year: '2026',
    available: true,
  }

  await client
    .patch('series-2025')
    .set({ title: '2025-2026', year: '2025-2026' })
    .insert('after', 'artworks[-1]', [artwork])
    .commit()

  console.log('Series renamed to 2025-2026 and the painting added.')
}

run().catch(err => { console.error(err); process.exit(1) })

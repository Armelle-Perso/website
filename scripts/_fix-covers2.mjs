/**
 * Sets cover images: 2011 → Prakriti, 2015-2017 → Departure.
 *   node scripts/_fix-covers2.mjs
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
  const allSeries = await client.fetch(
    `*[_type == "paintingSeries"]{ _id, title, year, artworks[]{ title, image } }`
  )

  // 2011 / First Pieces → Prakriti
  const s2011 = allSeries.find(s => s.year === 2011 || s.title === 'First Pieces' || s.title === '2011')
  if (s2011) {
    const prakriti = s2011.artworks?.find(a => a.title?.toLowerCase().includes('prakriti'))
    if (prakriti?.image) {
      await client.patch(s2011._id).set({ coverImage: prakriti.image }).commit()
      console.log(`✓ ${s2011.title} → cover set to "${prakriti.title}"`)
    } else {
      console.error('Prakriti not found in 2011 series!')
    }
  } else {
    console.error('2011 series not found!')
  }

  // 2015-2017 → Departure
  const s2015 = allSeries.find(s => s.title?.includes('2015'))
  if (s2015) {
    const departure = s2015.artworks?.find(a => a.title?.toLowerCase() === 'departure')
    if (departure?.image) {
      await client.patch(s2015._id).set({ coverImage: departure.image }).commit()
      console.log(`✓ ${s2015.title} → cover set to "Departure"`)
    } else {
      console.error('Departure not found in 2015-2017 series!')
    }
  } else {
    console.error('2015-2017 series not found!')
  }

  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

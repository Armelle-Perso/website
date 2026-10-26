/**
 * One-off, 2026-10-26: series covers (the circles on /art/paintings) switched
 * to available works, per Armelle. Previous covers, for rollback:
 *   1y7ZVPKFp3J9IOAgPWvCg5 (2022-2023)  image-9a72c3cd38ba99fd906f1d2358d531377655992b-2872x2356-jpg (Self Sustaining Lights)
 *   series-lightcodes-2021              image-79065979816cc9bccb9ef13f35f4d1759c513e4d-3051x2876-jpg (Desert Star Mural)
 *   series-transforma-2020              image-7250957fc09cfae902cff6c1a698278d976c4c32-2056x1704-jpg (Sabor Desconocido)
 *   series-2015-2017                    image-d1a3c6daa68b7a654eded057c875371bc1e06410-2560x1962-jpg (Departure)
 *   series-2012-2014                    image-ae13bc90f8433827fd01e3582f03d8770edf4670-2560x851-jpg (Elan)
 *   series-endorphines-2012             image-1e96880ac47397c60baf395e77e02114386fcc98-2360x2360-jpg (Abyssal Lifeforms)
 *
 *   node scripts/set-covers-available-2026-10.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
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

const COVERS = {
  '1y7ZVPKFp3J9IOAgPWvCg5': 'fragmented-realities',
  'series-lightcodes-2021': 'flowers-for-hathor',
  'series-transforma-2020': 'espiritu-de-planta',
  'series-2015-2017': 'diptych-passage',
  'series-2012-2014': 'joy',
  'series-endorphines-2012': 'endorphines-1',
}

async function run() {
  for (const [id, slug] of Object.entries(COVERS)) {
    const ref = await client.fetch(
      `*[_id==$id][0].artworks[slug.current==$slug][0].image.asset._ref`, { id, slug }
    )
    if (!ref) { console.error(`${id}: ${slug} not found, skipped`); continue }
    await client.patch(id)
      .set({ coverImage: { _type: 'image', asset: { _type: 'reference', _ref: ref } } })
      .commit()
    console.log(`${id} -> ${slug}`)
  }
}

run().catch(err => { console.error(err); process.exit(1) })

/**
 * One-off, 2026-10-26, per Armelle:
 *  - Series "2015–2017" becomes "2015–2016" (no painting in 2017 except
 *    Raag Bihag). Slug 2015-2017 -> 2015-2016 (old links redirect in
 *    next.config.ts). Year 2017 -> 2016.
 *  - Each work gets its year (2015 or 2016), from the TOILES year folders.
 *  - Raag Bihag (summer 2017) moves to the start of 2018–2019, year 2017.
 * Before: title "2015–2017", year 2017, slug "2015-2017", no artwork years.
 *
 *   node scripts/split-2015-2016-and-move-raag-bihag.mjs
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

const YEAR_2016 = ['departure', 'dragon-waters', 'spirit-dimension', 'natem', 'triptych-sol-del-corazon-overview']
const RAAG = 'raag-bihag-album-cover'

async function run() {
  const series = await client.fetch(`*[_id=="series-2015-2017"][0]{artworks}`)
  const raag = series.artworks.find(a => a.slug?.current === RAAG)
  if (!raag) throw new Error('Raag Bihag not found in 2015-2017')

  let p = client.patch('series-2015-2017').set({ title: '2015–2016', year: 2016, 'slug.current': '2015-2016' })
  for (const a of series.artworks) {
    if (a.slug?.current === RAAG) continue
    const year = YEAR_2016.includes(a.slug?.current) ? '2016' : '2015'
    p = p.set({ [`artworks[_key=="${a._key}"].year`]: year })
  }
  p = p.unset([`artworks[_key=="${raag._key}"]`])

  await client.transaction()
    .patch(p)
    .patch(client.patch('series-2018-2019').insert('before', 'artworks[0]', [{ ...raag, year: '2017' }]))
    .commit()
  console.log('2015–2016 updated, years set, Raag Bihag moved to 2018–2019.')
}

run().catch(err => { console.error(err); process.exit(1) })

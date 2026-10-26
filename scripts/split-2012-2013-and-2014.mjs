/**
 * One-off, 2026-10-27, per Armelle (dates from her CREA/TOILES folders):
 *  - New series "2012–2013" (Lyon, Brussels), slug 2012-2013: the nine 2012
 *    works plus You Can Fly (2013). Circle: Devil's Dare (available).
 *  - Existing series "2012–2014" becomes "2014" (Strasbourg), slug 2014.
 *  - Pompadour: 2013 -> 2014 (TOILES/2014 and the 2014 inventory sheet).
 * Old links redirect in next.config.ts.
 * Before: one series "2012–2014", slug 2012-2014, year 2014, cover Joy.
 *
 *   node scripts/split-2012-2013-and-2014.mjs
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

const MOVED = ['devil-s-dare', 'freedom-of-speech', 'innocence', 'ishtar', 'primordia',
  'profil', 'signs', 'terra', 'terre-d-eau', 'you-can-fly']

async function run() {
  const src = await client.fetch(`*[_id=="series-2012-2014"][0]`)
  if (!src) throw new Error('series-2012-2014 not found')
  const moved = src.artworks.filter(a => MOVED.includes(a.slug?.current))
  if (moved.length !== MOVED.length) throw new Error(`expected ${MOVED.length} works, found ${moved.length}`)
  const devil = moved.find(a => a.slug.current === 'devil-s-dare')
  const pompadour = src.artworks.find(a => a.slug?.current === 'pompadour')

  let p = client.patch('series-2012-2014')
    .set({ title: '2014', year: 2014, 'slug.current': '2014' })
    .unset(moved.map(a => `artworks[_key=="${a._key}"]`))
  if (pompadour) p = p.set({ [`artworks[_key=="${pompadour._key}"].year`]: '2014' })

  await client.transaction()
    .createIfNotExists({
      _id: 'series-2012-2013',
      _type: 'paintingSeries',
      title: '2012–2013',
      slug: { _type: 'slug', current: '2012-2013' },
      year: 2013,
      medium: src.medium,
      coverImage: { _type: 'image', asset: devil.image.asset },
      artworks: moved,
    })
    .patch(p)
    .commit()
  console.log(`Created 2012–2013 with ${moved.length} works; 2012–2014 is now 2014.`)
}

run().catch(err => { console.error(err); process.exit(1) })

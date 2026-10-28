/**
 * One-off, 2026-10-28, per Armelle:
 *  - Multidimensional Playfulness (2020, painted in Órgiva at the time of
 *    Prismatic Love, which she finished later) joins Diffraction, first in
 *    the series. Its date stays 2020. Photo: CREA\TOILES\2020\
 *    multidimensionalPLayfulness-.jpg (the sharper of the two). Available.
 *  - Majorelle (2019, 50 × 61 cm) joins Hidrocoria after The Fool, before the
 *    Cuadritos. Photo: CREA\TOILES\2019\majorelle-lowq-50x61-2019.jpg, to be
 *    reshot in Strasbourg. Available.
 * Medium and the Playfulness size are not known, so they are left empty.
 *
 *   node scripts/add-multidimensional-playfulness-and-majorelle.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, createReadStream } from 'fs'
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

const TOILES = 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES'

async function upload(file) {
  const asset = await client.assets.upload('image', createReadStream(file), { filename: path.basename(file) })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function run() {
  const diffraction = '1y7ZVPKFp3J9IOAgPWvCg5'
  const hidrocoria = 'series-2018-2019'
  const have = await client.fetch(`*[_id in [$a, $b]].artworks[].slug.current`, { a: diffraction, b: hidrocoria })
  if (have.includes('multidimensional-playfulness') || have.includes('majorelle')) throw new Error('already added')

  const mp = {
    _key: 'multidimensional-playfulness', _type: 'object',
    title: 'Multidimensional Playfulness',
    slug: { _type: 'slug', current: 'multidimensional-playfulness' },
    year: 2020, available: true,
    image: await upload(`${TOILES}/2020/multidimensionalPLayfulness-.jpg`),
  }
  const maj = {
    _key: 'majorelle', _type: 'object',
    title: 'Majorelle',
    slug: { _type: 'slug', current: 'majorelle' },
    year: '2019', dimensions: '50 × 61 cm', available: true,
    image: await upload(`${TOILES}/2019/majorelle-lowq-50x61-2019.jpg`),
  }

  await client.transaction()
    .patch(client.patch(diffraction).insert('before', 'artworks[0]', [mp]))
    .patch(client.patch(hidrocoria).insert('after', 'artworks[slug.current=="the-fool"]', [maj]))
    .commit()
  console.log('Multidimensional Playfulness added to Diffraction, Majorelle to Hidrocoria.')
}

run().catch(err => { console.error(err); process.exit(1) })

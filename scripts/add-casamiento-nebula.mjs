/**
 * One-off, 2026-10-28, per Armelle: Casamiento (2014, 89 × 130 cm, portrait,
 * "60P" in the inventory) joins Nebula, available. Photo: the darker one she
 * chose, CREA\TOILES\2014\autresFormats\casamiento_130x89 (Nikon D700,
 * Dec 2014). Placed after Transient Landscape. Medium left empty (not noted).
 *
 *   node scripts/add-casamiento-nebula.mjs
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

const have = await client.fetch(`*[_id=="series-2012-2014"][0].artworks[].slug.current`)
if (have.includes('casamiento')) throw new Error('already added')

const asset = await client.assets.upload('image',
  createReadStream('C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2014/autresFormats/casamiento_130x89'),
  { filename: 'casamiento_130x89.jpg', contentType: 'image/jpeg' })

await client.patch('series-2012-2014').insert('after', 'artworks[slug.current=="transient-landscape"]', [{
  _key: 'casamiento', _type: 'object',
  title: 'Casamiento',
  slug: { _type: 'slug', current: 'casamiento' },
  year: '2014', dimensions: '89 × 130 cm', available: true,
  image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
}]).commit()
console.log('Casamiento added to Nebula.')

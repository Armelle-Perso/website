/**
 * Adds Neurographic Reset (2025, 33 × 27 cm, available, Mallorca) to Serotiny,
 * after La Vida de Barranco (9 Nov 2026).   node scripts/add-neurographic-reset.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, createReadStream } from 'fs'
const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production', token: env.SANITY_API_TOKEN, apiVersion: '2024-01-01', useCdn: false })
const FILE = 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2025/neurographic-exploration-33x27.jpg'
const s = await c.fetch(`*[_id=="series-2025"][0]{artworks[]{_key, slug}}`)
if (s.artworks.some(a => a.slug?.current === 'neurographic-reset')) { console.log('already there'); process.exit() }
const asset = await c.assets.upload('image', createReadStream(FILE), { filename: 'neurographic-reset-33x27.jpg' })
const after = s.artworks.find(a => a.slug?.current === 'la-vida-de-barranco')._key
await c.patch('series-2025').insert('after', `artworks[_key=="${after}"]`, [{
  _key: asset._id, _type: 'object', title: 'Neurographic Reset', slug: { _type: 'slug', current: 'neurographic-reset' },
  year: '2025', dimensions: '33 × 27 cm', medium: 'Acrylics and posca on canvas', available: true,
  image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
}]).commit()
console.log('added', asset._id)

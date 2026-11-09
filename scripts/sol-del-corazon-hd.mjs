/**
 * Sol del Corazón overview: replace the 875 px framed PNG with the HD montage
 * of the three panels (7971 × 4200), 9 Nov 2026.   node scripts/sol-del-corazon-hd.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, createReadStream } from 'fs'
const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production', token: env.SANITY_API_TOKEN, apiVersion: '2024-01-01', useCdn: false })
const OLD = 'image-7de73b276fcaa027a956f8df2b795feaf50d2b2f-875x506-png'
const FILE = 'C:/Users/DELL/OneDrive/Documents/CREA/TOILES/2016/triptych-sol-del-corazon-3x81x130cm-2016-HD.jpg'
const refs = await c.fetch(`*[references($id)]{_id, _type}`, { id: OLD })
console.log('documents using the old image:', refs)
const asset = await c.assets.upload('image', createReadStream(FILE), { filename: 'sol-del-corazon-triptych-hd.jpg' })
console.log('uploaded', asset._id, asset.metadata?.dimensions)
for (const d of refs) {
  const doc = await c.getDocument(d._id)
  const json = JSON.stringify(doc).replaceAll(`"_ref":"${OLD}"`, `"_ref":"${asset._id}"`)
  const n = JSON.parse(json)
  const patch = c.patch(d._id)
  for (const k of Object.keys(n)) if (!k.startsWith('_') && JSON.stringify(n[k]) !== JSON.stringify(doc[k])) patch.set({ [k]: n[k] })
  await patch.commit(); console.log('updated', d._id)
}

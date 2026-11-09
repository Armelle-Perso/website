/** Back in Town is signed 2022 (Nov 2026). node scripts/_fix-back-in-town-year.mjs [--apply] */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')
  .filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const client = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production', token: env.SANITY_API_TOKEN, apiVersion: '2024-01-01', useCdn: false })
const docs = await client.fetch(`*[_type == "paintingSeries" && count(artworks[title match "Back in Town"]) > 0]{_id, title, year, artworks[title match "Back in Town"]{_key, title, year}}`)
console.log(JSON.stringify(docs, null, 1))
const loose = await client.fetch(`*[title match "Back in Town"]{_id, _type, year}`)
console.log(JSON.stringify(loose))
if (process.argv.includes('--apply')) for (const d of docs) for (const a of d.artworks)
  await client.patch(d._id).set({ [`artworks[_key=="${a._key}"].year`]: 2022 }).commit().then(() => console.log('set', d._id))

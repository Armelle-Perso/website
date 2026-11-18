/**
 * 2026-11-18: About bio. She paints since 2006 and exhibits since 2011
 * (the bio said "painting and exhibiting since 2011"). Before values are
 * printed for rollback.
 *
 *   node scripts/fix-bio-painting-since-2006.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(readFileSync(path.resolve(__dirname, '..', '.env.local'), 'utf8').split('\n')
  .filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const client = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production', token: env.SANITY_API_TOKEN, apiVersion: '2024-01-01', useCdn: false })
const R = {
  bio: ['I have been painting and exhibiting since 2011', 'I have been painting since 2006 and exhibiting since 2011'],
  bio_fr: ['je peins et expose depuis 2011', 'je peins depuis 2006 et expose depuis 2011'],
  bio_es: ['pinto y expongo desde 2011', 'pinto desde 2006 y expongo desde 2011'],
}
const doc = await client.fetch(`*[_type == "siteSettings"][0]{ _id, bio, bio_fr, bio_es }`)
const set = {}
for (const [k, [a, b]] of Object.entries(R)) {
  console.log(`Before ${k}:`, doc[k])
  if (!doc[k]?.includes(a)) throw new Error(`${k}: "${a}" not found`)
  set[k] = doc[k].replace(a, b)
}
await client.patch(doc._id).set(set).commit()
console.log('Updated', Object.keys(set).join(', '))

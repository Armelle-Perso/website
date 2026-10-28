/**
 * One-off, 2026-10-28, per Armelle: series text for Prakriti, from her own words,
 * in the same one-line style as Nebula, Hidrocoria and Morphogenèse.
 * (Sanskrit, primordial matter; eternal, unmanifested root cause of the material universe).
 * Before: no description.
 *
 *   node scripts/set-prakriti-text.mjs
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

const block = (key, text) => [{
  _type: 'block', _key: key, style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
}]

const TEXTS = {
  'series-2011': {
    description: 'Prakriti, from the Sanskrit for primordial matter, is the eternal, unmanifested root cause of the material universe.',
    description_fr: "Prakriti, du sanskrit « matière primordiale », est la cause première, éternelle et non manifestée, de l'univers matériel.",
    description_es: 'Prakriti, del sánscrito «materia primordial», es la causa primera, eterna y no manifestada, del universo material.',
  },
}

let tx = client.transaction()
for (const [id, t] of Object.entries(TEXTS)) {
  const k = id.replace('series-', '')
  tx = tx.patch(client.patch(id).set({
    description: block(`${k}-en`, t.description),
    description_fr: block(`${k}-fr`, t.description_fr),
    description_es: block(`${k}-es`, t.description_es),
  }))
}
await tx.commit()
console.log('Prakriti text set.')

/**
 * One-off, 2026-10-28, per Armelle: series text for Endorphines (option B),
 * in the same one-line style as Nebula, Hidrocoria and Morphogenèse.
 * Endorphins as the body's answer to pain, no diagnosis named.
 * Before: no description.
 *
 *   node scripts/set-endorphines-text.mjs
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
  'series-endorphines-2012': {
    description: "Endorphins are the body's own answer to pain: a rush that rises, then a wave that soothes.",
    description_fr: "Les endorphines sont la réponse du corps à la douleur : une montée, puis une vague qui apaise.",
    description_es: 'Las endorfinas son la respuesta del cuerpo al dolor: una subida, y luego una ola que calma.',
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
console.log('Endorphines text set.')

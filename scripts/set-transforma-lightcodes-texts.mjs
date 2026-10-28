/**
 * One-off, 2026-10-28, per Armelle: one-line series texts for Transforma and Lightcodes,
 * in the same one-line style as Nebula, Hidrocoria and Morphogenèse.
 * Their longer story stays in "Behind the series" at the bottom of the page.
 * Before: no descriptions on either series.
 *
 *   node scripts/set-transforma-lightcodes-texts.mjs
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
  'series-transforma-2020': {
    description: 'Metamorphosis is the moment a living form becomes another; Transforma is about this transformation in the world of plants and in ourselves.',
    description_fr: "La métamorphose est le moment où une forme vivante en devient une autre ; Transforma parle de cette transformation, dans le monde des plantes et en nous-mêmes.",
    description_es: 'La metamorfosis es el momento en que una forma viva se convierte en otra; Transforma habla de esta transformación, en el mundo de las plantas y en nosotros mismos.',
  },
  'series-lightcodes-2021': {
    description: 'Lightcodes are patterns born under the stars, a geometry of light that repeats like a constellation and carries information from other times.',
    description_fr: "Les Lightcodes sont des motifs nés sous les étoiles, une géométrie de lumière qui se répète comme une constellation et porte des informations venues d'autres temps.",
    description_es: 'Los Lightcodes son patrones nacidos bajo las estrellas, una geometría de luz que se repite como una constelación y lleva información de otros tiempos.',
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
console.log('Transforma and Lightcodes texts set.')

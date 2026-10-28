/**
 * One-off, 2026-10-28, per Armelle: series texts for Caminos and Axis Mundi,
 * in the same one-line style as Nebula, Hidrocoria and Morphogenèse.
 * The Caminos place is described, never named (her wish).
 * Before: no descriptions on either series.
 *
 *   node scripts/set-caminos-axis-mundi-texts.mjs
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
  'series-caminos-2017-2018': {
    description: 'Caminos follows a path through the desert, along an irrigation channel, up to the spring where the water bubbles from the ground.',
    description_fr: "Caminos suit un chemin à travers le désert, le long d'un canal d'irrigation, jusqu'à la source où l'eau sort de terre en bouillonnant.",
    description_es: 'Caminos sigue un camino por el desierto, a lo largo de la acequia, hasta el nacimiento donde el agua brota a borbotones de la tierra.',
  },
  'series-2012-2013': {
    description: 'The axis mundi is the axis of the world in ancient myths, the tree or mountain that links the depths of the earth to the sky. These paintings go to meet ancestral forces: goddesses, signs, the matter of the earth.',
    description_fr: "L'axis mundi est l'axe du monde des mythes anciens, l'arbre ou la montagne qui relie les profondeurs de la terre au ciel. Ces peintures vont à la rencontre des forces ancestrales : déesses, signes, matière de la terre.",
    description_es: 'El axis mundi es el eje del mundo de los mitos antiguos, el árbol o la montaña que une las profundidades de la tierra con el cielo. Estas pinturas van al encuentro de las fuerzas ancestrales: diosas, signos, materia de la tierra.',
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
console.log('Caminos and Axis Mundi texts set.')

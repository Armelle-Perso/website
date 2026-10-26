/**
 * One-off, 2026-10-26: the 2025-2026 series is named "Serotiny" (per
 * Armelle), with its text in EN/FR/ES. Slug stays "2025-2026".
 * Previous title: "2025-2026"; previous descriptions: none.
 * The public text is deliberately metaphorical; keep it that way.
 * Anthesis may not be the last painting of the series, so the text does not say it ends there.
 *
 *   node scripts/set-serotiny-series.mjs
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

const TEXT = {
  description: 'Serotiny is the botanical name for seeds that stay sealed in their cones, sometimes for years, until the heat of a fire opens them. These paintings come from such a time: a long wait, held closed, then a fire, a leap into the unknown, and finally an opening. Anthesis names that moment, when the flower opens.',
  description_fr: "La sérotinie désigne, en botanique, les graines qui restent enfermées dans leurs cônes, parfois pendant des années, jusqu'à ce que la chaleur d'un feu les ouvre. Ces peintures viennent d'un tel moment : une longue attente où tout restait fermé, puis un feu, un saut dans l'inconnu, et enfin une ouverture. Anthesis nomme ce moment, celui où la fleur s'ouvre.",
  description_es: 'La serotinia es el nombre botánico de las semillas que permanecen selladas en sus piñas, a veces durante años, hasta que el calor de un fuego las abre. Estas pinturas nacen de un tiempo así: una larga espera en la que todo permanecía cerrado, luego un fuego, un salto al vacío y, por fin, una apertura. Anthesis nombra ese momento, cuando la flor se abre.',
}

async function run() {
  await client.patch('series-2025').set({
    title: 'Serotiny',
    description: block('se-en', TEXT.description),
    description_fr: block('se-fr', TEXT.description_fr),
    description_es: block('se-es', TEXT.description_es),
  }).commit()
  console.log('Series renamed to Serotiny, text set (en, fr, es).')
}

run().catch(err => { console.error(err); process.exit(1) })

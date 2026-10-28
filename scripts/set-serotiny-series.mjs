/**
 * One-off, 2026-10-26: the 2025-2026 series is named "Serotiny" (per
 * Armelle), with its text in EN/FR/ES. Slug stays "2025-2026".
 * Previous title: "2025-2026"; previous descriptions: none.
 * The public text is deliberately metaphorical; keep it that way.
 * 2026-10-28: first sentence corrected, the term names the trait, not the seeds.
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
  description: 'Serotiny is the botanical name for the way some seeds stay sealed in their cones, sometimes for years, until the heat of a fire opens them. These paintings are born of such a time. Anthesis names the moment when the flower opens.',
  description_fr: "La sérotinie désigne, en botanique, le fait que certaines graines restent enfermées dans leurs cônes, parfois pendant des années, jusqu'à ce que la chaleur d'un feu les ouvre. Ces peintures sont nées d'une telle période. Anthesis nomme le moment où la fleur s'ouvre.",
  description_es: 'La serotinia es el nombre botánico del hecho de que algunas semillas permanezcan selladas en sus piñas, a veces durante años, hasta que el calor de un fuego las abra. Estas pinturas nacen de un tiempo así. Anthesis nombra el momento en que la flor se abre.',
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

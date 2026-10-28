/**
 * One-off, 2026-10-28: text of the Nebula series (2014) in EN/FR/ES,
 * one sentence, chosen by Armelle (no "astronomy" wording, no "gas").
 * The public text stays metaphorical: no places, music or home.
 *
 *   node scripts/set-nebula-series.mjs
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
  description: 'In a nebula, scattered matter slowly gathers until a star is born.',
  description_fr: "Dans une nébuleuse, la matière éparse se rassemble peu à peu, jusqu'à ce que naisse une étoile.",
  description_es: 'En una nebulosa, la materia dispersa se reúne poco a poco, hasta que nace una estrella.',
}

async function run() {
  const before = await client.fetch(`*[_id=="series-2012-2014"][0]{title,description,description_fr,description_es}`)
  console.log('before:', JSON.stringify(before))
  await client.patch('series-2012-2014').set({
    description: block('ne-en', TEXT.description),
    description_fr: block('ne-fr', TEXT.description_fr),
    description_es: block('ne-es', TEXT.description_es),
  }).commit()
  console.log('Nebula text set (en, fr, es).')
}

run().catch(err => { console.error(err); process.exit(1) })

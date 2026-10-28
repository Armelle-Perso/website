/**
 * One-off, 2026-10-28: text of the Hidrocoria series (2018-2019) in EN/FR/ES,
 * one sentence, chosen by Armelle. FR reworded the same day ("portées par" -> "qui voyagent au fil de l'eau"). Previous descriptions: none (printed below).
 * The public text stays metaphorical: no places, music or home.
 *
 *   node scripts/set-hidrocoria-series.mjs
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
  description: 'Hidrocoria is the botanical name for seeds carried by water to the place where they will take root.',
  description_fr: "L'hydrochorie désigne, en botanique, les graines qui voyagent au fil de l'eau jusqu'à l'endroit où elles prendront racine.",
  description_es: 'La hidrocoria es el nombre botánico de las semillas que el agua lleva hasta el lugar donde echarán raíces.',
}

async function run() {
  const before = await client.fetch(`*[_id=="series-2018-2019"][0]{title,description,description_fr,description_es}`)
  console.log('before:', JSON.stringify(before))
  await client.patch('series-2018-2019').set({
    description: block('hi-en', TEXT.description),
    description_fr: block('hi-fr', TEXT.description_fr),
    description_es: block('hi-es', TEXT.description_es),
  }).commit()
  console.log('Hidrocoria text set (en, fr, es).')
}

run().catch(err => { console.error(err); process.exit(1) })

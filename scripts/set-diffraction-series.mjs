/**
 * One-off, 2026-10-26: the 2022-2023 series is named "Diffraction" (per
 * Armelle: an active work on light across three places and moments).
 * Slug stays "2022-2023". Previous title: "2022-2023"; previous text: none.
 *
 *   node scripts/set-diffraction-series.mjs
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
  description: 'Diffraction is what light does when it meets an obstacle: it bends, opens and breaks into colour. These paintings come from a deliberate work on light, carried through different places and moments. Light is split, refracted and recomposed, as if each fragment held part of the whole, in the light as in ourselves.',
  description_fr: "La diffraction, c'est ce que fait la lumière lorsqu'elle rencontre un obstacle : elle se courbe, s'ouvre et se décompose en couleurs. Ces peintures naissent d'un travail délibéré sur la lumière, mené à travers différents lieux et différents moments. La lumière s'y divise, se réfracte et se recompose, comme si chaque fragment contenait une part du tout, dans la lumière comme en nous.",
  description_es: 'La difracción es lo que hace la luz cuando encuentra un obstáculo: se curva, se abre y se descompone en colores. Estas pinturas nacen de un trabajo deliberado sobre la luz, llevado a través de distintos lugares y momentos. La luz se divide, se refracta y se recompone, como si cada fragmento contuviera una parte del todo, en la luz como en nosotros.',
}

async function run() {
  const year = await client.fetch(`*[_id=="1y7ZVPKFp3J9IOAgPWvCg5"][0].year`)
  await client.patch('1y7ZVPKFp3J9IOAgPWvCg5').set({
    title: 'Diffraction', year: '2022-2023',
    description: block('df-en', TEXT.description),
    description_fr: block('df-fr', TEXT.description_fr),
    description_es: block('df-es', TEXT.description_es),
  }).commit()
  console.log(`Renamed to Diffraction with text (year was ${year}, now "2022-2023").`)
}

run().catch(err => { console.error(err); process.exit(1) })

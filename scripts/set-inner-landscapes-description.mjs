/**
 * One-off, 2026-10-26: series text for Inner Landscapes (EN approved by
 * Armelle; FR/ES translated). Previous value: empty arrays.
 *
 *   node scripts/set-inner-landscapes-description.mjs
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
  description: 'Inner Landscapes explores how inner emotional states are mirrored in the landscapes around us, and how the outer world in turn shapes what we feel inside. The titles name movements of opening and transformation: Unfolding, Unlocking, Opening Up, Deploying, Morphing.',
  description_fr: "La série Inner Landscapes explore la façon dont nos états émotionnels intérieurs se reflètent dans les paysages qui nous entourent, et dont le monde extérieur façonne à son tour ce que nous ressentons. Les titres nomment des mouvements d'ouverture et de transformation : Unfolding, Unlocking, Opening Up, Deploying, Morphing.",
  description_es: 'La serie Inner Landscapes explora cómo los estados emocionales interiores se reflejan en los paisajes que nos rodean, y cómo el mundo exterior, a su vez, moldea lo que sentimos por dentro. Los títulos nombran movimientos de apertura y transformación: Unfolding, Unlocking, Opening Up, Deploying, Morphing.',
}

async function run() {
  await client.patch('series-inner-landscapes-2023').set({
    description: block('il-en', TEXT.description),
    description_fr: block('il-fr', TEXT.description_fr),
    description_es: block('il-es', TEXT.description_es),
  }).commit()
  console.log('Inner Landscapes description set (en, fr, es).')
}

run().catch(err => { console.error(err); process.exit(1) })

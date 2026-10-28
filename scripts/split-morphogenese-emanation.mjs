/**
 * One-off, 2026-10-28, per Armelle: the 2015–2016 series splits in two.
 *  - Series "2015–2016" (id series-2015-2017, slug 2015-2016) becomes
 *    "Émanation" (colour and light). Slug unchanged.
 *  - New series "Morphogenèse" (matter, texture, fractal detail), slug
 *    morphogenese-2015-2016, cover Experiment on Dynamic Forms. The works
 *    below move there, in this order; old links redirect in next.config.ts.
 *  - Both show "2015-2016"; Émanation (order 1) is listed before
 *    Morphogenèse (order 2). Sorting uses string(year), see queries.ts.
 * Before: title "2015–2016", year 2016, no order, no descriptions.
 *
 *   node scripts/split-morphogenese-emanation.mjs
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

const MORPHO = [
  'experiment-on-dynamic-forms', 'back-to-basics', 'second-experiment-on-dynamic-forms',
  'archaic-jolt', 'auto-emergence', 'timeless-inner-garden', 'mother-of-the-universe',
  'triptych-order-and-disorder-in-chaos', 'third-eye-opening', 'spirit-dimension', 'natem',
]
const EMANATION = [
  'entering-light', 'alien-encounter', 'l-homme-au-condor', 'diptych-passage',
  'triptych-home-is-where-you-go', 'departure', 'dragon-waters',
  'triptych-sol-del-corazon-overview',
  'charlie-bleeding-1', 'charlie-bleeding-2', 'charlie-bleeding-3', // hidden on the site
]

async function run() {
  const old = await client.fetch(`*[_id=="series-2015-2017"][0]{medium, artworks}`)
  const bySlug = Object.fromEntries(old.artworks.map(a => [a.slug?.current, a]))
  const all = [...MORPHO, ...EMANATION]
  const missing = all.filter(s => !bySlug[s])
  const extra = old.artworks.filter(a => !all.includes(a.slug?.current)).map(a => a.slug?.current)
  if (missing.length || extra.length) throw new Error(`missing ${missing} / not placed ${extra}`)

  const cover = bySlug['experiment-on-dynamic-forms'].image

  await client.transaction()
    .createOrReplace({
      _id: 'series-morphogenese-2015-2016',
      _type: 'paintingSeries',
      title: 'Morphogenèse',
      slug: { _type: 'slug', current: 'morphogenese-2015-2016' },
      year: '2015-2016',
      order: 2,
      medium: old.medium,
      coverImage: { _type: 'image', asset: cover.asset },
      description: block('mo-en', 'Morphogenesis is the birth of living forms, when cells organise themselves into patterns.'),
      description_fr: block('mo-fr', "La morphogenèse est la naissance des formes du vivant, quand les cellules s'organisent en motifs."),
      description_es: block('mo-es', 'La morfogénesis es el nacimiento de las formas vivas, cuando las células se organizan en patrones.'),
      artworks: MORPHO.map(s => bySlug[s]),
    })
    .patch(client.patch('series-2015-2017').set({
      title: 'Émanation',
      year: '2015-2016',
      order: 1,
      description: block('em-en', 'Emanation is light born within that radiates outward.'),
      description_fr: block('em-fr', "L'émanation est la lumière qui naît à l'intérieur et rayonne au dehors."),
      description_es: block('em-es', 'La emanación es la luz que nace en el interior y se irradia hacia fuera.'),
      artworks: EMANATION.map(s => bySlug[s]),
    }))
    .commit()
  console.log(`Morphogenèse: ${MORPHO.length} works. Émanation: ${EMANATION.length} works (3 hidden).`)
}

run().catch(err => { console.error(err); process.exit(1) })

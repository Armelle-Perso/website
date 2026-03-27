/**
 * Imports research items from armelleboussidan.com into Sanity.
 *   node scripts/import-research.mjs
 */

import { createClient } from '@sanity/client'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '..', '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const client = createClient({
  projectId: env['NEXT_PUBLIC_SANITY_PROJECT_ID'],
  dataset: env['NEXT_PUBLIC_SANITY_DATASET'] || 'production',
  token: env['SANITY_API_TOKEN'],
  apiVersion: '2024-01-01',
  useCdn: false,
})

const items = [
  {
    title: 'Dynamics of semantic change: Detecting, analyzing and modeling semantic change in corpus in short diachrony',
    year: '2013',
    language: 'English',
    publication: 'Ph.D Thesis — University of Lyon, CNRS, ISC, L2C2',
    link: 'http://theses.univ-lyon2.fr/documents/lyon2/2013/boussidan_a/pdfAmont/boussidan_a_these.pdf',
    order: 1,
  },
  {
    title: 'Dynamiques du changement sémantique. Détection, analyse et modélisation du changement sémantique en corpus en diachronie courte',
    year: '2014',
    language: 'French',
    publication: 'Texto ! Textes & Cultures, XIX, 1',
    link: 'http://www.revue-texto.net/docannexe/file/3445/texto_boussidan.pdf',
    order: 2,
  },
  {
    title: 'Using topic salience and connotational drifts to detect candidates to semantic change',
    year: '2011',
    language: 'English',
    coAuthors: 'S. Ploux',
    publication: 'Ninth International Conference on Computational Semantics (IWCS), Oxford, UK',
    link: 'https://aclanthology.org/W11-0134.pdf',
    order: 3,
  },
  {
    title: 'Repérage automatique de la néologie sémantique en corpus à travers des représentations cartographiques évolutives : vers une méthode de visualisation graphique dynamique de la diachronie de la néologie',
    year: '2012',
    language: 'French',
    coAuthors: 'A.-L. Renon, C. Franco, S. Lupone, S. Ploux',
    publication: 'Cahiers de Lexicologie, Centre National de la Recherche Scientifique',
    link: 'https://hal.archives-ouvertes.fr/file/index/docid/934820/filename/BoussidanRenonFrancoLuponePloux.pdf',
    order: 4,
  },
  {
    title: 'The Semantic Atlas: an Interactive Model of Lexical Representation',
    year: '2010',
    language: 'English',
    coAuthors: 'S. Ploux, H. Ji',
    publication: 'Seventh International Language Resources and Evaluation, Valletta, Malta',
    link: 'https://hal.archives-ouvertes.fr/hal-00933294/document',
    order: 5,
  },
  {
    title: 'Phonaesthemic and Etymological effects on the Distribution of Senses in Statistical Models of Semantics',
    year: '2009',
    language: 'English',
    coAuthors: 'E. Sagi, S. Ploux',
    publication: 'Distributional Semantics beyond Concrete Concepts Workshop, 31st Annual Conference of the Cognitive Science Society, Amsterdam, The Netherlands',
    link: 'https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.465.7918&rep=rep1&type=pdf',
    order: 6,
  },
  {
    title: 'La malbouffe : un cas de néologie et de glissement sémantique fulgurants',
    year: '2009',
    language: 'French',
    coAuthors: 'S. Lupone, S. Ploux',
    publication: 'Du thème au terme, émergence et lexicalisation des connaissances — 8ème Conférence Internationale Terminologie et Intelligence Artificielle, Toulouse',
    link: 'https://www.irit.fr/TIA09/thekey/atelier1/Atelier%201_5_Boussidan_et_al.pdf',
    order: 7,
  },
]

async function run() {
  // Delete existing research items to avoid duplicates
  const existing = await client.fetch(`*[_type == "researchItem"]{ _id }`)
  if (existing.length) {
    console.log(`Deleting ${existing.length} existing research items...`)
    for (const doc of existing) {
      await client.delete(doc._id)
    }
  }

  for (const item of items) {
    const doc = { _type: 'researchItem', ...item }
    const result = await client.create(doc)
    console.log(`✓ ${item.title.slice(0, 60)}... (${result._id})`)
  }

  console.log(`\nDone! ${items.length} research items imported.`)
}

run().catch(err => { console.error(err); process.exit(1) })

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

const exhibitions = [
  // Solo exhibitions
  {
    title: 'Más alma',
    type: 'solo',
    year: 2021,
    venue: 'Templo San Román',
    city: 'Sevilla, Spain',
    upcoming: false,
  },
  {
    title: 'Transforma',
    type: 'solo',
    year: 2020,
    venue: 'Ceramiq',
    city: 'Orgiva, Spain',
    upcoming: false,
  },
  {
    title: 'Le Mandala',
    type: 'solo',
    year: 2016,
    city: 'Strasbourg, France',
    upcoming: false,
  },
  {
    title: 'Monographie',
    type: 'solo',
    year: 2014,
    venue: 'Galerie Le Point Fort',
    city: 'Strasbourg, France',
    upcoming: false,
  },
  {
    title: 'Endorphine',
    type: 'solo',
    year: 2012,
    venue: 'La Fée Verte',
    city: 'Lyon, France',
    upcoming: false,
  },
  {
    title: 'Experiens',
    type: 'solo',
    year: 2011,
    venue: 'Galerie Le Laboratoire',
    city: 'Lyon, France',
    upcoming: false,
  },

  // Multimedia
  {
    title: 'Anankha',
    type: 'collective',
    year: 2020,
    venue: 'Orarca Techno Zen Centre',
    city: 'Spain',
    description: 'Live prismatic ceremony, collaboration with Michal Hermon.',
    upcoming: false,
  },

  // Collective exhibitions
  {
    title: 'Alquimia cafe',
    type: 'collective',
    year: 2023,
    venue: 'Alquimia cafe',
    city: 'Orgiva, Spain',
    upcoming: false,
  },
  {
    title: 'Teaser group show',
    type: 'collective',
    year: 2021,
    venue: 'Bhuti',
    city: 'London, UK',
    description: 'Curated by Jo Holland.',
    upcoming: false,
  },
  {
    title: 'Artist Network Alpujarra',
    type: 'collective',
    year: 2019,
    city: 'Spain',
    upcoming: false,
  },
  {
    title: "L'Atelier Restaurant",
    type: 'collective',
    year: 2017,
    venue: "L'Atelier Restaurant",
    city: 'Strasbourg, France',
    description: 'With Corto Koller.',
    upcoming: false,
  },
  {
    title: 'The sensory experiment',
    type: 'collective',
    year: 2015,
    venue: "l'Atelier",
    city: 'Nicosia, Cyprus',
    upcoming: false,
  },
  {
    title: 'Order and Disorder in Chaos',
    type: 'collective',
    year: 2015,
    venue: 'Apothikes 79',
    city: 'Larnaca, Cyprus',
    upcoming: false,
  },
  {
    title: 'M33 collective',
    type: 'collective',
    year: 2014,
    venue: 'M33 Studio',
    city: 'Strasbourg, France',
    upcoming: false,
  },
  {
    title: 'Artists of the Galerie Le Point Fort',
    type: 'collective',
    year: 2015,
    venue: 'Galerie Le Point Fort',
    city: 'Strasbourg, France',
    upcoming: false,
  },
  {
    title: 'Entélékiss',
    type: 'collective',
    year: 2015,
    venue: 'Friche Lamartine',
    city: 'Lyon, France',
    description: 'Four-hands paintings with Jérôme Dupré la Tour.',
    upcoming: false,
  },
  {
    title: 'The Lost Room collective',
    type: 'collective',
    year: 2011,
    city: 'Villeurbanne, France',
    upcoming: false,
  },

  // Fairs
  {
    title: 'Art 3F 2015',
    type: 'fair',
    year: 2015,
    city: 'Nice, France',
    description: 'Gallery Le Point Fort representation.',
    upcoming: false,
  },
  {
    title: 'St-art 2014 Salon',
    type: 'fair',
    year: 2014,
    city: 'Strasbourg, France',
    description: 'Gallery Le Point Fort representation.',
    upcoming: false,
  },

  // Charity exhibitions
  {
    title: 'Les Vingt ans d\'Ithaque',
    type: 'charity',
    year: 2014,
    venue: 'Palais Universitaire',
    city: 'Strasbourg, France',
    description: 'Ithaque association.',
    upcoming: false,
  },
  {
    title: 'Lien Direct union benefit',
    type: 'charity',
    year: 2014,
    venue: 'Villa Gillet',
    city: 'Lyon, France',
    upcoming: false,
  },
  {
    title: 'Project Vénus III',
    type: 'charity',
    year: 2011,
    city: 'Lyon, France',
    description: 'Breast cancer research.',
    upcoming: false,
  },
]

async function run() {
  // Check if exhibitions already exist
  const existing = await client.fetch(`count(*[_type == "exhibition"])`)
  if (existing > 0) {
    console.log(`${existing} exhibitions already exist. Skipping import.`)
    console.log('To reimport, delete existing exhibitions in Sanity Studio first.')
    return
  }

  console.log(`Importing ${exhibitions.length} exhibitions...\n`)

  for (const ex of exhibitions) {
    const doc = {
      _type: 'exhibition',
      title: ex.title,
      type: ex.type === 'solo' ? 'Solo Exhibition' : ex.type === 'collective' ? 'Group Exhibition' : ex.type === 'fair' ? 'Art Fair' : 'Other',
      startDate: `${ex.year}-01-01`,
      venue: ex.venue || '',
      city: ex.city || '',
      upcoming: ex.upcoming || false,
    }
    if (ex.description) {
      doc.description = [{ _type: 'block', _key: Math.random().toString(36).slice(2), style: 'normal', children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text: ex.description, marks: [] }], markDefs: [] }]
    }

    const created = await client.create(doc)
    console.log(`✓  ${ex.year} — ${ex.title} (${ex.city})`)
  }

  console.log('\nDone. All exhibitions imported.')
}

run().catch(console.error)

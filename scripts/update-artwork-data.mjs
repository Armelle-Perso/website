/**
 * Populates all artwork titles, dimensions, medium, year, availability and slug
 * into the existing paintingSeries documents in Sanity.
 * Run: node scripts/update-artwork-data.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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

function slug(title) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// All artwork data keyed by series slug
const seriesData = {
  'lightcodes-2021': {
    medium: 'Acrylics and posca on linen canvas or papyrus',
    artworks: [
      { title: 'Desert Star Mural', dimensions: '100 × 100 cm', year: '2021', available: false },
      { title: 'Andromedan Shell', dimensions: '55 × 55 cm', year: '2021', available: true },
      { title: 'Key to the Pyramids', dimensions: '25 × 40 cm', year: '2021', available: true },
      { title: 'Solar Scarab', dimensions: '', year: '2021', available: false },
      { title: 'Flowers for Hathor', dimensions: '45 × 49 cm', year: '2021', available: true },
      { title: 'Deep Dive', dimensions: '69 × 10 cm', year: '2021', available: false },
      { title: 'Dahabian Groove', dimensions: '60 × 34 cm', year: '2021', available: false },
      { title: 'Heart Codes', dimensions: '9 × 45 cm', year: '2021', available: false },
      { title: 'Letting Go', dimensions: '76 × 30 cm', year: '2021', available: true },
      { title: 'Reclaiming', dimensions: '79 × 30 cm', year: '2021', available: false },
      { title: 'Sacred Fish', dimensions: '76 × 30 cm', year: '2021', available: true },
      { title: 'Rewiring', dimensions: '10 × 30 cm', year: '2021', available: true },
      { title: 'Diemptation', dimensions: 'Ø 77 cm', year: '2021', available: true },
      { title: 'Llaves', dimensions: '55 × 35 cm', year: '2021', available: true },
    ],
  },
  'transforma-2020': {
    medium: 'Linen canvas, acrylics, posca and watercolour',
    artworks: [
      { title: 'Sabor Desconocido', dimensions: '38 × 46 cm', year: '2020', available: false },
      { title: 'El Mundo de las Plantas', dimensions: '38 × 46 cm', year: '2020', available: true },
      { title: 'Espíritu de Planta', dimensions: '61 × 50 cm', year: '2020', available: true },
      { title: 'Mundo Escondido', dimensions: '33 × 41 cm', year: '2020', available: true },
      { title: 'Pico Flor', dimensions: '116 × 89 cm', year: '2020', available: true },
      { title: 'Portal', dimensions: '116 × 89 cm', year: '2020', available: false },
      { title: 'Study in Plant Magic', dimensions: '24 × 30 cm', year: '2020', available: false },
      { title: 'Universo Parallelo', dimensions: '33 × 41 cm', year: '2020', available: true },
      { title: 'Vehículo Vegetal', dimensions: '55 × 46 cm', year: '2020', available: true },
    ],
  },
  'cuadritos-2019': {
    medium: 'Acrylics on canvas',
    artworks: [
      { title: 'Agüita', dimensions: '16 × 16 cm', year: '2019', available: true },
      { title: 'Animalitos', dimensions: '20 × 20 cm', year: '2019', available: true },
      { title: 'Arriba', dimensions: '20 × 20 cm', year: '2019', available: false },
      { title: 'Lunita', dimensions: '25 × 25 cm', year: '2019', available: true },
      { title: 'Penoncillo', dimensions: '16 × 16 cm', year: '2019', available: true },
      { title: 'Tierra Ajena', dimensions: '16 × 16 cm', year: '2019', available: false },
    ],
  },
  '2018-2019': {
    medium: 'Acrylics on linen canvas',
    artworks: [
      { title: 'Fluir', dimensions: '81 × 116 cm', year: '2018', available: true },
      { title: 'San Pedro Azulero', dimensions: '60 × 30 cm', year: '2018', available: false },
      { title: 'Seeds', dimensions: '80 × 80 cm', year: '2018', available: false },
      { title: 'Dabbling in Non-Duality', dimensions: '60 × 81 cm', year: '2019', available: true },
      { title: 'Dyptich Canoñera', dimensions: 'Diptych', year: '2019', available: true },
      { title: 'The Fool', dimensions: '81 × 65 cm', year: '2019', available: true },
    ],
  },
  'caminos-2017-2018': {
    medium: 'Acrylics on canvas',
    artworks: [
      { title: 'Camino al Nacimiento', dimensions: '57 × 79 cm', year: '2017', available: false, note: 'If you see this painting, please get in touch.' },
      { title: 'Camino de Noche', dimensions: '71 × 76 cm', year: '2017', available: false, note: 'If you see this painting, please get in touch.' },
      { title: 'Camino del Silencio', dimensions: '', year: '2017', available: false, note: 'If you see this painting, please get in touch.' },
      { title: 'Camino Rojo', dimensions: '60 × 53 cm', year: '2018', available: false, note: 'If you see this painting, please get in touch.' },
      { title: 'Renacimiento', dimensions: '57 × 77 cm', year: '2018', available: false, note: 'If you see this painting, please get in touch.' },
    ],
  },
  '2015-2017': {
    medium: 'Acrylics on canvas',
    artworks: [
      { title: 'Charlie Bleeding 1', dimensions: '', year: '2015', medium: 'Acrylic pastels', available: true },
      { title: 'Charlie Bleeding 2', dimensions: '', year: '2015', medium: 'Acrylic pastels', available: true },
      { title: 'Charlie Bleeding 3', dimensions: '', year: '2015', medium: 'Acrylic pastels', available: true },
      { title: 'Archaic Jolt', dimensions: '30 × 30 cm', year: '2015', available: true },
      { title: 'Back to Basics', dimensions: '50 × 200 cm', year: '2015', medium: 'Acrylic on tarpaulin', available: false },
      { title: 'Entering Light', dimensions: '189 × 160 cm', year: '2015', available: true },
      { title: 'Auto-Emergence', dimensions: '80 × 80 cm', year: '2015', available: true },
      { title: 'Experiment on Dynamic Forms', dimensions: '50 × 50 cm', year: '2015', available: true },
      { title: 'Second Experiment on Dynamic Forms', dimensions: '20 × 40 cm', year: '2015', available: false },
      { title: 'Triptyque Home Is Where You Go', dimensions: '61×81 · 65×81 · 61×81 cm', year: '2015', available: true },
      { title: 'Timeless Inner Garden', dimensions: '40 × 40 cm', year: '2015', available: true },
      { title: 'Alien Encounter', dimensions: '90 × 130 cm', year: '2015', available: true },
      { title: "L'Homme au Condor", dimensions: '65 × 50 cm', year: '2015', available: true },
      { title: 'Mother of the Universe', dimensions: '116 × 73 cm', year: '2015', available: false },
      { title: 'Diptych Passage', dimensions: '73×100 & 73×54 cm', year: '2015', available: true },
      { title: 'Third Eye Opening', dimensions: '240 × 160 cm', year: '2015', available: true },
      { title: 'Triptych — Order and Disorder in Chaos', dimensions: '3 × 60×200 cm', year: '2015', available: true },
      { title: 'Departure', dimensions: '73 × 92 cm', year: '2016', available: false },
      { title: 'Spirit Dimension', dimensions: '73 × 54 cm', year: '2016', available: false },
      { title: 'Dragon Waters', dimensions: '116 × 73 cm', year: '2016', available: false },
      { title: 'Natem', dimensions: '40 × 40 cm', year: '2016', available: false },
      { title: 'Triptych Sol del Corazón', dimensions: '3 × 81×130 cm', year: '2016', available: true },
      { title: 'Raag Bihag', dimensions: '', year: '2017', medium: 'Album cover painting for Etienne Bartholomew', available: true },
      { title: 'Joy', dimensions: '160 × 130 cm', year: '2014', available: true },
    ],
  },
  '2012-2014': {
    medium: 'Acrylics on canvas',
    artworks: [
      { title: "Devil's Dare", dimensions: '50 × 70 cm', year: '2012', available: true },
      { title: 'Freedom of Speech', dimensions: '120 × 120 cm', year: '2012', available: false },
      { title: 'Innocence', dimensions: '50 × 70 cm', year: '2012', available: false },
      { title: 'Ishtar', dimensions: '130 × 90 cm', year: '2012', available: false },
      { title: 'Primordia', dimensions: '40 × 33 cm', year: '2012', available: true },
      { title: 'Profil', dimensions: '130 × 100 cm', year: '2012', medium: 'In collaboration with Mathieu Devavry', available: false },
      { title: 'Signs', dimensions: '90 × 110 cm', year: '2012', available: false },
      { title: 'Terra', dimensions: '80 × 80 cm', year: '2012', available: false },
      { title: "Terre d'Eau", dimensions: '3 × 30×10 cm', year: '2012', medium: 'Clay and ink', available: true },
      { title: 'Chimères', dimensions: '60 × 72.5 cm', year: '2013', available: false },
      { title: 'You Can Fly', dimensions: '50 × 50 cm', year: '2013', available: false },
      { title: 'Pompadour', dimensions: '80 × 80 cm', year: '2014', available: false },
      { title: 'Ars Galacticum', dimensions: '70 × 50 cm', year: '2014', available: true },
      { title: 'Blue Fire', dimensions: '146 × 114 cm', year: '2014', available: true },
      { title: 'Efflorescence', dimensions: '116 × 89 cm', year: '2014', available: false },
      { title: 'Élan', dimensions: '150 × 50 cm', year: '2014', available: false },
      { title: 'Facing the Autumn Fire', dimensions: '116 × 89 cm', year: '2014', available: true },
      { title: 'Fragments Africains', dimensions: 'Shredded canvas', year: '2014', available: false },
      { title: 'Hippomundus', dimensions: '70 × 100 cm', year: '2014', available: false },
      { title: 'In Depth', dimensions: '11 × 23.5 cm', year: '2014', available: false },
      { title: 'In the Sweet Sight of Time', dimensions: '146 × 89 cm', year: '2014', available: true },
      { title: 'M33-1', dimensions: '89 × 130 cm', year: '2014', available: true },
      { title: 'Meditation Under a Tree', dimensions: '25 × 25 cm', year: '2014', medium: 'Sous verre', available: false },
      { title: 'Sanguine', dimensions: '100 × 100 cm', year: '2014', available: false },
      { title: 'Transient Landscape', dimensions: '146 × 89 cm', year: '2014', available: true },
      { title: 'Triptych Enveloppes Solaires', dimensions: '3 × 80×100 cm', year: '2014', available: false },
      { title: 'Enveloppes Solaires I', dimensions: '80 × 100 cm', year: '2014', available: false },
      { title: 'Enveloppes Solaires II', dimensions: '80 × 100 cm', year: '2014', available: false },
      { title: 'Enveloppes Solaires III', dimensions: '80 × 100 cm', year: '2014', available: false },
    ],
  },
  'endorphines-2012': {
    medium: 'Acrylics on canvas',
    artworks: [
      { title: 'Endorphines 1', dimensions: '80 × 80 cm', year: '2012', available: true },
      { title: 'Endorphines 2', dimensions: '80 × 80 cm', year: '2012', available: true },
      { title: 'Endorphines 3', dimensions: '80 × 80 cm', year: '2012', available: true },
      { title: 'Open', dimensions: '80 × 80 cm', year: '2012', available: false },
      { title: 'Abyssal Lifeforms', dimensions: '80 × 80 cm', year: '2012', available: false },
      { title: 'Beyond Light', dimensions: '80 × 80 cm', year: '2012', available: false },
      { title: 'Beyond Darkness', dimensions: '80 × 80 cm', year: '2012', available: false },
      { title: 'Carbon Lifeforms', dimensions: '80 × 80 cm', year: '2012', available: true },
      { title: 'Underwater', dimensions: '80 × 80 cm', year: '2012', available: false },
    ],
  },
  '2011': {
    medium: 'Acrylics on canvas',
    artworks: [
      { title: 'Baku Marin Mineur', dimensions: '40 × 80 cm', year: '2011', available: true },
      { title: 'Baku Majeur', dimensions: '40 × 80 cm', year: '2011', available: false },
      { title: 'Créatures du Royaume des Tortues', dimensions: '20 × 20 cm', year: '2011', available: false },
      { title: 'Flower', dimensions: '40 × 33 cm', year: '2011', available: false },
      { title: 'Green Visions', dimensions: '20 × 25 cm', year: '2011', available: false },
      { title: 'In Mind', dimensions: '30 × 30 cm', year: '2011', available: false },
      { title: 'Moais', dimensions: '50 × 50 cm', year: '2011', available: true },
      { title: 'Prakriti', dimensions: '50 × 50 cm', year: '2011', available: true },
      { title: 'Spacejunk', dimensions: '55 × 70 cm', year: '2011', available: true },
      { title: 'Vision', dimensions: '20 × 25 cm', year: '2011', available: true },
    ],
  },
  'people': {
    medium: 'Photography',
    artworks: [
      { title: 'Desert Star — Aicha Makeba, Ras Abu Galum, Egypt', dimensions: '', year: '2021', available: false },
      { title: 'Hippomundus — Alexis Baillis, Colmar, France', dimensions: '', year: '2014', available: false },
      { title: 'Self-sustaining Lights — Antony Valenti, Cornwall, UK', dimensions: '', year: '', available: false },
      { title: 'Sabor Desconocido — Don Francisco Blanc Castan, Sevilla, Spain', dimensions: '', year: '2020', available: false },
      { title: 'Terra — Sébastien Ferlay, Lyon, France', dimensions: '', year: '2012', available: false },
      { title: 'Enveloppes Solaires — Sébastien Kahn, Paris, France', dimensions: '', year: '2014', available: false },
      { title: 'Portal — Juju & Emilien', dimensions: '', year: '2020', available: false },
    ],
  },
}

// Fetch all series
const docs = await client.fetch(`*[_type == "paintingSeries"]{ _id, title, slug, artworks }`)
console.log(`Found ${docs.length} series\n`)

for (const doc of docs) {
  const seriesSlug = doc.slug?.current
  const data = seriesData[seriesSlug]

  if (!data) {
    console.log(`SKIP  ${doc.title} — no data mapped (slug: ${seriesSlug})`)
    continue
  }

  const existingArtworks = doc.artworks || []
  const newData = data.artworks

  // Merge: keep existing image references, update metadata
  const updatedArtworks = existingArtworks.map((existing, i) => {
    const meta = newData[i]
    if (!meta) return existing
    return {
      ...existing,
      title: meta.title,
      medium: meta.medium || data.medium,
      dimensions: meta.dimensions,
      year: meta.year,
      available: meta.available,
      slug: { _type: 'slug', current: slug(meta.title) },
    }
  })

  await client.patch(doc._id).set({
    artworks: updatedArtworks,
    medium: data.medium,
  }).commit()

  const availCount = updatedArtworks.filter(a => a.available).length
  console.log(`✓  ${doc.title} — ${updatedArtworks.length} artworks, ${availCount} available`)
}

console.log('\nDone. All artwork metadata updated.')

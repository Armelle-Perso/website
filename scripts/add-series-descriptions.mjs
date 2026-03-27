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

// Helper to convert plain text to Portable Text blocks
function toPortableText(text) {
  return text.split('\n\n').filter(Boolean).map(para => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text: para.trim(), marks: [] }],
    markDefs: [],
  }))
}

const seriesDescriptions = {
  'Lightcodes': {
    year: '2021',
    medium: 'Acrylics & posca on linen canvas or papyrus',
    description: toPortableText(``),
  },
  'Transforma': {
    year: '2020',
    medium: 'Linen canvas, acrylics, posca, watercolour',
    description: toPortableText(``),
  },
  'Cuadritos': {
    year: '2019',
    medium: 'Acrylics on canvas',
    description: toPortableText(``),
  },
  'Caminos': {
    year: '2017–2018',
    medium: 'Acrylics on canvas',
    description: toPortableText(``),
  },
  '2018–2019': {
    year: '2018–2019',
    medium: 'Acrylics and mixed media on canvas',
    description: toPortableText(``),
  },
  '2015–2017': {
    year: '2015–2017',
    medium: 'Acrylics and mixed media on canvas',
    description: toPortableText(``),
  },
  '2012–2014': {
    year: '2012–2014',
    medium: 'Acrylics and mixed media on canvas',
    description: toPortableText(``),
  },
  'Endorphines': {
    year: '2012',
    medium: 'Acrylics on canvas, 80 × 80 cm',
    description: toPortableText(``),
  },
  '2011': {
    year: '2011',
    medium: 'Acrylics and mixed media on canvas',
    description: toPortableText(``),
  },
}

async function run() {
  const series = await client.fetch(`*[_type == "paintingSeries"]{ _id, title, year }`)
  console.log(`Found ${series.length} series\n`)

  for (const s of series) {
    const data = seriesDescriptions[s.title]
    if (!data) {
      console.log(`⚠  No description for: ${s.title}`)
      continue
    }

    const patch = {}
    if (data.description) patch.description = data.description
    if (data.medium) patch.medium = data.medium
    if (data.year && !s.year) patch.year = data.year

    await client.patch(s._id).set(patch).commit()
    console.log(`✓  ${s.title}`)
  }

  console.log('\nDone. Series descriptions updated.')
}

run().catch(console.error)

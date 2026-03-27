import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(path.resolve(__dirname, '../.env.local'), 'utf8').split('\n')
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

// ── Site Settings translations ──
const siteSettingsTranslations = {
  tagline_fr: 'Peintre autodidacte. Traductrice. Facilitatrice.\nÉquilibrant innovation et savoirs ancestraux.',
  tagline_es: 'Pintora autodidacta. Traductora. Facilitadora.\nEquilibrando innovación y saberes ancestrales.',
  bio_fr: `Armelle Boussidan est consultante et artiste, avec un vif intérêt pour l'innovation et les savoirs ancestraux.

Peintre autodidacte exposant depuis 2011, ses peintures sont des expressions d'états énergétiques invisibles qu'elle canalise dans un langage intime, intuitif et sensible. Elle vit la créativité comme un flux méditatif de guérison et une danse avec l'esprit.

Parallèlement à sa pratique artistique, Armelle travaille comme consultante freelance depuis 2018 — coordination de projets et facilitation, traduction, interprétation et rédaction en anglais et en français.`,
  bio_es: `Armelle Boussidan es consultora y artista, con un gran interés tanto por la innovación como por los saberes ancestrales.

Pintora autodidacta exponiendo desde 2011, sus pinturas son expresiones de estados energéticos invisibles que canaliza en un lenguaje íntimo, intuitivo y sensible. Vive la creatividad como un flujo meditativo de sanación y una danza con el espíritu.

Paralelamente a su práctica artística, Armelle trabaja como consultora freelance desde 2018 — coordinación de proyectos y facilitación, traducción, interpretación y redacción en inglés y francés.`,
  seoDescription_fr: 'Consultante et artiste. Peintures, bijoux, multimédia, traduction et facilitation.',
  seoDescription_es: 'Consultora y artista. Pinturas, joyería, multimedia, traducción y facilitación.',
}

// ── Series descriptions (Portable Text format) ──
function textToBlocks(text) {
  return text.split('\n\n').filter(Boolean).map(para => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text: para.trim(), marks: [] }],
  }))
}

const seriesTranslations = {
  'lightcodes-2021': {
    description_fr: textToBlocks(``),
    description_es: textToBlocks(``),
  },
  'transforma-2020': {
    description_fr: textToBlocks(``),
    description_es: textToBlocks(``),
  },
  'cuadritos-2019': {
    description_fr: textToBlocks(``),
    description_es: textToBlocks(``),
  },
  'caminos-2017-2018': {
    description_fr: textToBlocks(``),
    description_es: textToBlocks(``),
  },
  'endorphines-2012': {
    description_fr: textToBlocks(``),
    description_es: textToBlocks(``),
  },
  '2018-2019': {
    description_fr: textToBlocks(``),
    description_es: textToBlocks(``),
  },
  '2015-2017': {
    description_fr: textToBlocks(``),
    description_es: textToBlocks(``),
  },
  '2012-2014': {
    description_fr: textToBlocks(``),
    description_es: textToBlocks(``),
  },
  '2011': {
    description_fr: textToBlocks(``),
    description_es: textToBlocks(``),
  },
}

async function run() {
  // 1. Update siteSettings
  console.log('Updating siteSettings translations...')
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)
  if (settings) {
    await client.patch(settings._id).set(siteSettingsTranslations).commit()
    console.log('✓ siteSettings updated with FR + ES translations')
  } else {
    console.log('⚠ No siteSettings document found')
  }

  // 2. Update painting series descriptions
  console.log('\nUpdating series descriptions...')
  const allSeries = await client.fetch(`*[_type == "paintingSeries"]{ _id, "slug": slug.current }`)

  for (const s of allSeries) {
    const translations = seriesTranslations[s.slug]
    if (translations) {
      await client.patch(s._id).set(translations).commit()
      console.log(`✓ ${s.slug} — FR + ES descriptions added`)
    }
  }

  console.log('\nDone.')
}

run().catch(console.error)

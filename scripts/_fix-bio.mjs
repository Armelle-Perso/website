/**
 * Updates siteSettings bio to first person (EN, FR, ES).
 *   node scripts/_fix-bio.mjs
 */
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

const bio = `I am a consultant and artist, with a keen interest in both innovation and ancestral knowledge.

My consulting services include project coordination and facilitation, translation, interpreting, as well as writing in English and French.

I am also an artist, mainly a painter, although I explore other media too, especially in collaboration.

Enjoy browsing my art, as well as links to inspiring projects and people I am collaborating or collaborated with.`

const bio_fr = `Je suis consultante et artiste, avec un vif intérêt pour l'innovation et les savoirs ancestraux.

Mes services de conseil incluent la coordination de projets et la facilitation, la traduction, l'interprétation, ainsi que la rédaction en anglais et en français.

Je suis aussi artiste, principalement peintre, bien que j'explore d'autres médiums, notamment en collaboration.

Bonne navigation à travers mon art, ainsi que les liens vers des projets et des personnes inspirantes avec lesquels je collabore ou ai collaboré.`

const bio_es = `Soy consultora y artista, con un gran interés tanto por la innovación como por los saberes ancestrales.

Mis servicios de consultoría incluyen coordinación de proyectos y facilitación, traducción, interpretación, así como redacción en inglés y francés.

También soy artista, principalmente pintora, aunque exploro otros medios, especialmente en colaboración.

Disfruta navegando por mi arte, así como los enlaces a proyectos y personas inspiradoras con quienes colaboro o he colaborado.`

async function run() {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)
  if (!settings) {
    console.error('siteSettings not found!')
    process.exit(1)
  }

  await client.patch(settings._id).set({ bio, bio_fr, bio_es }).commit()
  console.log('✓ Bio updated to first person (EN, FR, ES)')
  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

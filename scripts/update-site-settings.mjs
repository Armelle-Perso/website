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

async function run() {
  // Check for existing siteSettings
  const existing = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)

  // bio is a plain text field in the schema
  const bioText = `Armelle Boussidan is a consultant and artist, with a keen interest in both innovation and ancestral knowledge.

She is a self-taught painter exhibiting since 2011. Her paintings are expressions of invisible energetic states that she channels into an intimate, intuitive and sensitive language. She experiences creativity as a healing meditative flow and a dance with spirit.

Alongside her art practice, Armelle works as a freelance consultant since 2018 — project coordination and facilitation, translation, interpreting, and writing in English and French.`

  const data = {
    _type: 'siteSettings',
    tagline: 'Self-taught painter. Translator. Facilitator. Balancing innovation and ancestral knowledge.',
    bio: bioText,
    seoDescription: 'Armelle Boussidan — consultant and artist. Paintings, jewelry, multimedia, translation and facilitation.',
    socialLinks: {
      instagram: 'https://www.instagram.com/armellebou',
    },
  }

  if (existing?._id) {
    await client.patch(existing._id).set(data).commit()
    console.log('✓ Updated existing siteSettings')
  } else {
    await client.create(data)
    console.log('✓ Created siteSettings')
  }

  console.log('\nDone.')
}

run().catch(console.error)

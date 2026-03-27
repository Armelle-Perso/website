import { createClient } from '@sanity/client'
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync, unlinkSync } from 'fs'
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

const PORTRAIT_URL = 'https://armelleboussidan.com/wp-content/uploads/2022/12/ArmelleBoussidan-PaolaGuigouPhoto2021-15.jpeg'

async function run() {
  console.log('Downloading portrait...')
  const res = await fetch(PORTRAIT_URL)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  const tmpPath = path.resolve(__dirname, 'portrait-tmp.jpeg')
  writeFileSync(tmpPath, buffer)
  console.log(`  Downloaded ${(buffer.length / 1024).toFixed(0)} KB`)

  console.log('Uploading to Sanity...')
  const asset = await client.assets.upload('image', readFileSync(tmpPath), {
    filename: 'armelle-boussidan-portrait.jpeg',
  })
  console.log(`  Asset ID: ${asset._id}`)

  unlinkSync(tmpPath)

  console.log('Patching siteSettings...')
  const existing = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)
  if (!existing?._id) {
    console.error('No siteSettings document found. Run update-site-settings.mjs first.')
    return
  }

  await client.patch(existing._id).set({
    heroImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    },
    heroImageAlt: 'Armelle Boussidan — photo by Paola Guigou, 2021',
  }).commit()

  console.log('Done! Portrait uploaded and set as heroImage.')
}

run().catch(console.error)

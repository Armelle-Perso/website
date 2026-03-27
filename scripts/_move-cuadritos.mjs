/**
 * Moves artworks from the "Cuadritos" series into "2018-2019",
 * then deletes the Cuadritos series document.
 *   node scripts/_move-cuadritos.mjs
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

async function run() {
  // Find the Cuadritos series
  const cuadritos = await client.fetch(
    `*[_type == "paintingSeries" && title match "Cuadritos*"][0]{ _id, title, artworks[] }`
  )
  if (!cuadritos) {
    console.error('Cuadritos series not found!')
    process.exit(1)
  }
  console.log(`Found: ${cuadritos.title} (${cuadritos.artworks?.length || 0} artworks)`)

  // Find the 2018-2019 series
  const target = await client.fetch(
    `*[_type == "paintingSeries" && title match "2018*"][0]{ _id, title, artworks[] }`
  )
  if (!target) {
    console.error('2018-2019 series not found!')
    process.exit(1)
  }
  console.log(`Target: ${target.title} (${target.artworks?.length || 0} artworks)`)

  // Append cuadritos artworks to 2018-2019
  const merged = [...(target.artworks || []), ...(cuadritos.artworks || [])]
  await client.patch(target._id).set({ artworks: merged }).commit()
  console.log(`✓ Moved ${cuadritos.artworks?.length || 0} artworks into ${target.title}`)

  // Delete the cuadritos series
  await client.delete(cuadritos._id)
  console.log(`✓ Deleted "${cuadritos.title}" series`)

  console.log('\nDone!')
}

run().catch(err => { console.error(err); process.exit(1) })

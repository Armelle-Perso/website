// Hidrocoria series year 2019 -> '2018-2019' (7 Nov 2026, per Armelle: her CREA
// folders date Fluir to 2018; the series slug and the creative path already say 2018-2019).
// Rollback: set it back to the number 2019.
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(path.resolve(__dirname, '..', '.env.local'), 'utf8').split('\n')
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

console.log('Before:', await client.fetch(`*[_id == "series-2018-2019"][0].year`))
await client.patch('series-2018-2019').set({ year: '2018-2019' }).commit()
console.log('After: ', await client.fetch(`*[_id == "series-2018-2019"][0].year`))

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
  dataset: 'production', token: env['SANITY_API_TOKEN'],
  apiVersion: '2024-01-01', useCdn: false,
})
const series = await client.fetch(`*[_type == "paintingSeries"]{ title, "slug": slug.current } | order(title asc)`)
series.forEach(s => console.log(`"${s.slug}"  →  ${s.title}`))

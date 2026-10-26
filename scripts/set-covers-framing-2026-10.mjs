/**
 * One-off, 2026-10-26, per Armelle:
 *  - 2022-2023 circle -> Serenity in Diffraction, framed inside the gold
 *    papyrus border on the central motif. Square rect 640,270,1960,1960.
 *    (was Fragmented Realities: image-7b9a454800b12f...)
 *  - Lightcodes circle (Flowers for Hathor): framed from the very top so the
 *    flowers sit lower in the circle. Square rect 0,0,2897,2897.
 *  - 2015-2017 circle (Diptych Passage): framed on the right panel so the gap
 *    between the two canvases is out. Square rect 920,14,950,950.
 * Framing is stored as Sanity crop + hotspot on coverImage. Rollback: unset
 * coverImage.crop and coverImage.hotspot.
 *
 *   node scripts/set-covers-framing-2026-10.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(path.resolve(__dirname, '..', '.env.local'), 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
)

const client = createClient({
  projectId: env['NEXT_PUBLIC_SANITY_PROJECT_ID'],
  dataset: env['NEXT_PUBLIC_SANITY_DATASET'] || 'production',
  token: env['SANITY_API_TOKEN'],
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Square rect in pixels -> Sanity crop (fractions trimmed from each side)
// and a hotspot covering the same square.
function framing(w, h, left, top, size) {
  return {
    crop: { _type: 'sanity.imageCrop', top: top / h, bottom: (h - top - size) / h, left: left / w, right: (w - left - size) / w },
    hotspot: { _type: 'sanity.imageHotspot', x: (left + size / 2) / w, y: (top + size / 2) / h, width: size / w, height: size / h },
  }
}

async function run() {
  const serenity = await client.fetch(
    `*[_id=="1y7ZVPKFp3J9IOAgPWvCg5"][0].artworks[slug.current=="serenity-in-diffraction"][0].image.asset._ref`
  )
  if (!serenity) throw new Error('Serenity in Diffraction not found')
  await client.patch('1y7ZVPKFp3J9IOAgPWvCg5')
    .set({ coverImage: { _type: 'image', asset: { _type: 'reference', _ref: serenity }, ...framing(4000, 2504, 640, 270, 1960) } })
    .commit()
  console.log('2022-2023 -> Serenity in Diffraction')

  await client.patch('series-lightcodes-2021')
    .set(Object.fromEntries(Object.entries(framing(2897, 3170, 0, 0, 2897)).map(([k, v]) => [`coverImage.${k}`, v])))
    .commit()
  console.log('Lightcodes framing set')

  await client.patch('series-2015-2017')
    .set(Object.fromEntries(Object.entries(framing(2056, 978, 920, 14, 950)).map(([k, v]) => [`coverImage.${k}`, v])))
    .commit()
  console.log('2015-2017 framing set')
}

run().catch(err => { console.error(err); process.exit(1) })

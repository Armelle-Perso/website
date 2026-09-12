import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

/** Pull the real pixel dimensions out of a Sanity asset ref (…-3090x4910.jpg). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function imageDimensions(source: any): { width: number; height: number } | null {
  const ref: string | undefined = source?.asset?._ref || source?._ref
  const m = ref?.match(/-(\d+)x(\d+)-/)
  if (!m) return null
  return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) }
}

import type { Metadata } from 'next'
import { urlFor } from '@/sanity/lib/image'

// Link preview (WhatsApp, social) built from a Sanity image: 1200x630 JPG on the
// Sanity CDN (absolute https URL, no redirect, light enough for WhatsApp).
// whole = show the entire painting on a dark background instead of cropping it
export function ogFromSanity(image: any, title: string, description?: string, whole = false): Pick<Metadata, 'openGraph' | 'twitter'> {
  if (!image?.asset) return {}
  const url = whole
    ? urlFor(image).url().split('?')[0] + '?w=1200&h=630&fit=fill&bg=141414&fm=jpg&q=80'   // no crop at all
    : urlFor(image).width(1200).height(630).fit('crop').format('jpg').quality(80).url()
  const img = { url, width: 1200, height: 630, alt: title, type: 'image/jpeg' }
  return {
    openGraph: { title, description, siteName: 'Armelle Boussidan', type: 'website', images: [img] },
    twitter: { card: 'summary_large_image', title, description, images: [url] },
  }
}

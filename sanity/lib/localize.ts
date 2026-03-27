/**
 * Pick the localized version of a field from a Sanity document.
 * Falls back to the English (default) field if the localized one is missing.
 *
 * Usage: localized(settings, 'bio', locale)
 * → returns settings.bio_fr for French, settings.bio for English, etc.
 */
export function localized(obj: any, field: string, locale: string): string {
  if (!obj) return ''
  if (locale === 'en') return obj[field] || ''
  return obj[`${field}_${locale}`] || obj[field] || ''
}

/**
 * Same as localized() but for any field type (Portable Text arrays, etc.).
 * Returns the raw value without casting to string.
 */
export function localizedField(obj: any, field: string, locale: string): any {
  if (!obj) return null
  if (locale === 'en') return obj[field] || null
  return obj[`${field}_${locale}`] || obj[field] || null
}

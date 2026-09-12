/**
 * Display-side cleanup for artwork titles coming from Sanity.
 * Strips editorial suffixes like "(overview)" that shouldn't show on the site.
 */
export function cleanTitle(title?: string | null): string {
  if (!title) return ''
  return title.replace(/\s*\((overview|vue d'ensemble|vista general)\)\s*$/i, '').trim()
}

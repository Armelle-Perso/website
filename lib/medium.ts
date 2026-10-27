/**
 * Translations for the medium texts stored in Sanity, which only exist in one
 * language there. Keyed by the exact Sanity text; a text missing from this
 * table is shown as is. Add a line here when a new medium is entered.
 */
const MEDIUMS: Record<string, { en?: string; fr: string; es: string }> = {
  'Acrylics and mixed media on canvas': { fr: 'Acrylique et techniques mixtes sur toile', es: 'Acrílico y técnica mixta sobre lienzo' },
  'Acrylics on canvas': { fr: 'Acrylique sur toile', es: 'Acrílico sobre lienzo' },
  'Acrylics on canvas, 80 × 80 cm': { fr: 'Acrylique sur toile, 80 × 80 cm', es: 'Acrílico sobre lienzo, 80 × 80 cm' },
  'Acrylics on linen canvas': { fr: 'Acrylique sur toile de lin', es: 'Acrílico sobre lienzo de lino' },
  'Acrylics & posca on linen canvas or papyrus': { fr: 'Acrylique et Posca sur toile de lin ou papyrus', es: 'Acrílico y Posca sobre lienzo de lino o papiro' },
  'Acrylics and posca on linen canvas or papyrus': { fr: 'Acrylique et Posca sur toile de lin ou papyrus', es: 'Acrílico y Posca sobre lienzo de lino o papiro' },
  'Linen canvas, acrylics, posca, watercolour': { fr: 'Toile de lin, acrylique, Posca, aquarelle', es: 'Lienzo de lino, acrílico, Posca, acuarela' },
  'Linen canvas, acrylics, posca and watercolour': { fr: 'Toile de lin, acrylique, Posca et aquarelle', es: 'Lienzo de lino, acrílico, Posca y acuarela' },
  'Linen canvas on plywood': { fr: 'Toile de lin sur contreplaqué', es: 'Lienzo de lino sobre contrachapado' },
  'Lava sand, acrylics and posca on canvas': { fr: 'Sable volcanique, acrylique et Posca sur toile', es: 'Arena volcánica, acrílico y Posca sobre lienzo' },
  'Posca & acrylic on leather': { fr: 'Posca et acrylique sur cuir', es: 'Posca y acrílico sobre cuero' },
  'Posca on leather': { fr: 'Posca sur cuir', es: 'Posca sobre cuero' },
  'On papyrus': { fr: 'Sur papyrus', es: 'Sobre papiro' },
  'Clay and ink': { fr: 'Argile et encre', es: 'Arcilla y tinta' },
  'Photography': { fr: 'Photographie', es: 'Fotografía' },
  'Sous verre': { en: 'Under glass', fr: 'Sous verre', es: 'Bajo vidrio' },
  'In collaboration with Mathieu Devavry': { fr: 'En collaboration avec Mathieu Devavry', es: 'En colaboración con Mathieu Devavry' },
  'Album cover for Etienne Bartholomew — painted live as the album was recorded': {
    fr: "Pochette d'album pour Etienne Bartholomew, peinte en direct pendant l'enregistrement",
    es: 'Portada del álbum de Etienne Bartholomew, pintada en directo durante la grabación',
  },
}

export function translateMedium(medium: string | null | undefined, locale: string): string | undefined {
  if (!medium) return undefined
  const entry = MEDIUMS[medium.trim()]
  if (!entry) return medium
  if (locale === 'fr' || locale === 'es') return entry[locale]
  return entry.en ?? medium
}

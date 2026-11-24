// Paintings currently shown in a venue: an "On show at …" line on their page.
// Dates are YYYY-MM-DD; the line shows from `start` to `end` (no end = until removed).
// When a painting sells or comes back, remove its slug.
export const ON_SHOW = [
  {
    id: 'batx-2026',
    start: '2026-12-03', // opening Thu 3 Dec 2026, 18:00
    end: null as string | null, // works come back early April 2027
    venue: 'Batx Santa Catalina',
    url: 'https://batxcafe.com/',
    text: {
      en: { before: 'On show at ', after: ', Carrer de Despuig 63, Palma de Mallorca, Spain' },
      fr: { before: 'Exposé chez ', after: ', Carrer de Despuig 63, Palma de Mallorca, Espagne' },
      es: { before: 'Expuesto en ', after: ', Carrer de Despuig 63, Palma de Mallorca, España' },
    },
    // the 17 works of the Batx price list (artwork slugs)
    works: [
      'la-vida-de-barranco', 'anthesis', 'flowers-for-hathor', 'mundo-escondido',
      'a-farewell-to-the-mountains', 'gifts-in-limbo', 'neurographic-reset', 'morphing',
      'deploying', 'back-in-town', 'fragmented-realities', 'andromedan-shell',
      'universo-parallelo', 'lunita', 'animalitos', 'penoncillo', 'terre-d-eau',
    ],
  },
]

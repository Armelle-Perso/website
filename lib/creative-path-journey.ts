// "Creative path" journey: which painting, detail or photo accompanies each part of the text.
// Built from the local prototype (C:\\Github\\prototypes\\painting-journey, draft 11, Nov 2026).
// Each paragraph is a list of [image key(s), text] chunks; a chunk starts at the series name it shows.
// 'hold' = the text continues the image already on screen. The text itself is lib/creative-path.ts, unchanged.

export type JourneyKey = string | string[]
export type JourneyChunk = [JourneyKey, string]
export type JourneyImage = {
  u: string; w?: number; h?: number; c?: string; photo?: boolean; full?: string
  t?: string; s?: string; years?: string; dim?: string; ss?: string; sl?: string
  d1?: number[]; d2?: number[]; cam?: string; camZ?: number; fade?: number; stretch?: number
}
export type JourneyLayout = {
  intro: JourneyChunk[][]
  sections: { full: string | null; interlude?: { after: number; key: string }; ps: JourneyChunk[][] }[]
}

export const JOURNEY_IMAGES: Record<string, JourneyImage> = {
 "animalitos": {
  "t": "Animalitos",
  "s": "Cuadritos",
  "years": "2018–2019",
  "ss": "hidrocoria-2018-2019",
  "sl": "animalitos",
  "dim": "20 × 20 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/c12e96eeeb0610741bbd35c23bba1060c24e7a31-1574x1585.jpg",
  "w": 1574,
  "h": 1585,
  "c": "#2c3c54",
  "d1": [
   0.438,
   0.562
  ],
  "d2": [
   0.812,
   0.312
  ]
 },
 "anthesis": {
  "t": "Anthesis",
  "s": "Serotiny",
  "years": "2025–2026",
  "ss": "serotiny-2025-2026",
  "sl": "anthesis",
  "dim": "92 × 73 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/9a07166c4b4d01af365ffea227299a5342b44c10-3630x2938.jpg",
  "w": 3630,
  "h": 2938,
  "c": "#779861",
  "d1": [
   0.312,
   0.688
  ],
  "d2": [
   0.688,
   0.688
  ]
 },
 "bf_det": {
  "photo": true,
  "u": "/images/paintings/creative-path/journey/bluefire-detail.jpg",
  "w": 2200,
  "h": 1643,
  "d1": [
   0.5,
   0.5
  ],
  "d2": [
   0.5,
   0.5
  ],
  "fade": 0.65
 },
 "camino": {
  "t": "Camino al Nacimiento",
  "s": "Caminos",
  "years": "2017–2018",
  "ss": "caminos-2017-2018",
  "sl": "camino-al-nacimiento",
  "dim": "57 × 79 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/67ef45311efeb283addd647ca760cdec07bee0b0-2772x1974.jpg",
  "w": 2772,
  "h": 1974,
  "c": "#f4cd6c",
  "d1": [
   0.312,
   0.688
  ],
  "d2": [
   0.812,
   0.562
  ]
 },
 "chumbera": {
  "photo": true,
  "u": "/images/paintings/creative-path/journey/chumbera-full.jpg",
  "w": 2200,
  "h": 1650,
  "d1": [
   0.5,
   0.5
  ],
  "d2": [
   0.5,
   0.5
  ],
  "full": "/images/paintings/creative-path/journey/chumbera-full.jpg"
 },
 "coming": {
  "t": "Coming Home",
  "s": "Serotiny",
  "years": "2025–2026",
  "ss": "serotiny-2025-2026",
  "sl": "coming-home",
  "dim": "92 × 73 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/11bd0bb960ec7c0acb6ddeca7c3a6f1cf226d1e2-3630x2894.jpg",
  "w": 3630,
  "h": 2894,
  "c": "#2e84d5",
  "d1": [
   0.562,
   0.562
  ],
  "d2": [
   0.312,
   0.812
  ]
 },
 "det15": {
  "photo": true,
  "u": "/images/paintings/creative-path/journey/detail-2015.jpg",
  "w": 2200,
  "h": 1467,
  "d1": [
   0.5,
   0.5
  ],
  "d2": [
   0.5,
   0.5
  ]
 },
 "edf": {
  "t": "Experiment on Dynamic Forms",
  "s": "Morphogenèse",
  "years": "2015–2016",
  "ss": "morphogenese-2015-2016",
  "sl": "experiment-on-dynamic-forms",
  "dim": "50 × 50 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/5b84c3452e0b2b0f19170454a7a090e2ae20c947-3084x3084.jpg",
  "w": 3084,
  "h": 3084,
  "c": "#b9b9ba",
  "d1": [
   0.438,
   0.312
  ],
  "d2": [
   0.562,
   0.812
  ],
  "cam": "still"
 },
 "endo": {
  "t": "Endorphines 1",
  "s": "Endorphines",
  "years": "2012",
  "ss": "endorphines-2012",
  "sl": "endorphines-1",
  "dim": "80 × 80 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/449fdbd6162e723b3a7b7225fdc48c1444f4b217-2366x2366.jpg",
  "w": 2366,
  "h": 2366,
  "c": "#777e87",
  "d1": [
   0.562,
   0.312
  ],
  "d2": [
   0.188,
   0.312
  ]
 },
 "flower": {
  "t": "Flower",
  "s": "Prakriti",
  "years": "2011",
  "ss": "prakriti-2011",
  "sl": "flower",
  "dim": "40 × 33 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/c24bf2b7c91d25cdaf3e3e41b227e0f97e38c921-2039x2560.jpg",
  "w": 2039,
  "h": 2560,
  "c": "#0d58d1",
  "d1": [
   0.312,
   0.812
  ],
  "d2": [
   0.562,
   0.562
  ]
 },
 "fluir": {
  "t": "Fluir",
  "s": "Hidrocoria",
  "years": "2018–2019",
  "ss": "hidrocoria-2018-2019",
  "sl": "fluir",
  "dim": "81 × 116 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/61b92fd87738fa58cb4c17f6928efc5209853e36-2178x1526.jpg",
  "w": 2178,
  "h": 1526,
  "c": "#4baebd",
  "d1": [
   0.312,
   0.562
  ],
  "d2": [
   0.688,
   0.688
  ],
  "cam": "centre",
  "camZ": 1.35
 },
 "il_det": {
  "photo": true,
  "u": "/images/paintings/creative-path/journey/inner-landscapes-detail.jpg",
  "w": 2200,
  "h": 1650,
  "d1": [
   0.5,
   0.5
  ],
  "d2": [
   0.5,
   0.5
  ]
 },
 "ishtar": {
  "t": "Ishtar",
  "s": "Axis Mundi",
  "years": "2012–2013",
  "ss": "axis-mundi-2012-2013",
  "sl": "ishtar",
  "dim": "130 × 90 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/c786e97ab41848ee96208a062a2d4bf020896ad4-1760x2560.jpg",
  "w": 1760,
  "h": 2560,
  "c": "#ac6f68",
  "d1": [
   0.312,
   0.562
  ],
  "d2": [
   0.188,
   0.188
  ],
  "fade": 0.65
 },
 "noche": {
  "t": "Camino de Noche",
  "s": "Caminos",
  "years": "2017–2018",
  "ss": "caminos-2017-2018",
  "sl": "camino-de-noche",
  "dim": "71 × 76 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/990c933052945dd63a4ea6c8401e7f24c6f25099-1734x1412.jpg",
  "w": 1734,
  "h": 1412,
  "c": "#878583",
  "d1": [
   0.438,
   0.438
  ],
  "d2": [
   0.188,
   0.688
  ]
 },
 "ph_gesture": {
  "photo": true,
  "u": "/images/paintings/creative-path/performance-le-point-fort-2014-gesture.jpg",
  "w": 1065,
  "h": 1600,
  "d1": [
   0.5,
   0.45
  ],
  "d2": [
   0.5,
   0.55
  ]
 },
 "ph_listen": {
  "photo": true,
  "u": "/images/paintings/creative-path/performance-le-point-fort-2014-listening.jpg",
  "w": 1065,
  "h": 1600,
  "d1": [
   0.5,
   0.45
  ],
  "d2": [
   0.5,
   0.55
  ]
 },
 "ph_touch": {
  "photo": true,
  "u": "/images/paintings/creative-path/performance-le-point-fort-2014-touch.jpg",
  "w": 1600,
  "h": 1065,
  "d1": [
   0.5,
   0.45
  ],
  "d2": [
   0.5,
   0.55
  ]
 },
 "ph_transforma": {
  "photo": true,
  "u": "/images/paintings/creative-path/journey/transforma-exhibition.jpg",
  "w": 2200,
  "h": 1320,
  "d1": [
   0.5,
   0.55
  ],
  "d2": [
   0.5,
   0.5
  ],
  "cam": "pullback"
 },
 "picoflor": {
  "t": "Pico Flor",
  "s": "Transforma",
  "years": "2020",
  "ss": "transforma-2020",
  "sl": "pico-flor",
  "dim": "116 × 89 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/4b971d4cfda224a3a9c4492d37aaed944777801e-2056x2698.jpg",
  "w": 2056,
  "h": 2698,
  "c": "#f6630b",
  "d1": [
   0.312,
   0.312
  ],
  "d2": [
   0.562,
   0.688
  ]
 },
 "pomp_det": {
  "photo": true,
  "u": "/images/paintings/creative-path/journey/det_ch0.jpg",
  "w": 2200,
  "h": 1650,
  "d1": [
   0.5,
   0.5
  ],
  "d2": [
   0.5,
   0.5
  ]
 },
 "portal": {
  "t": "Portal",
  "s": "Transforma",
  "years": "2020",
  "ss": "transforma-2020",
  "sl": "portal",
  "dim": "116 × 89 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/4c6fe3e31e81cc4e076d821f8b9ead30a5a1da02-2056x2685.jpg",
  "w": 2056,
  "h": 2685,
  "c": "#0eaf36",
  "d1": [
   0.438,
   0.312
  ],
  "d2": [
   0.312,
   0.688
  ]
 },
 "prakriti": {
  "t": "Prakriti",
  "s": "Prakriti",
  "years": "2011",
  "ss": "prakriti-2011",
  "sl": "prakriti",
  "dim": "50 × 50 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/6a913370c6cce685c55bc7d6679d0e31080a2eb6-2222x2238.jpg",
  "w": 2222,
  "h": 2238,
  "c": "#ac798b",
  "d1": [
   0.562,
   0.312
  ],
  "d2": [
   0.312,
   0.812
  ]
 },
 "prismatic": {
  "t": "Prismatic Love",
  "s": "Diffraction",
  "years": "2022–2023",
  "ss": "diffraction-2022-2023",
  "sl": "prismatic-love",
  "dim": "50 × 81 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/92c650006659c4ef8a6758becb9800d9dac8f5d3-3911x2407.jpg",
  "w": 3911,
  "h": 2407,
  "c": "#602c2b",
  "d1": [
   0.438,
   0.312
  ],
  "d2": [
   0.688,
   0.562
  ]
 },
 "pyramids": {
  "t": "Key to the Pyramids",
  "s": "Lightcodes",
  "years": "2021",
  "ss": "lightcodes-2021",
  "sl": "key-to-the-pyramids",
  "dim": "25 × 40 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/4f6d809dda823ed80a4327b4f11ca66fd9a511b1-3369x2035.jpg",
  "w": 3369,
  "h": 2035,
  "c": "#ccaa06",
  "d1": [
   0.688,
   0.438
  ],
  "d2": [
   0.312,
   0.562
  ],
  "stretch": 0.3,
  "fade": 0.6
 },
 "sol": {
  "t": "Triptych Sol del Corazón",
  "s": "Émanation",
  "years": "2015–2016",
  "ss": "emanation-2015-2016",
  "sl": "triptych-sol-del-corazon-overview",
  "dim": "240 × 130 cm",
  "u": "https://cdn.sanity.io/images/pyibu0t8/production/70739312aac0acdd0ce0422775356bb910556a36-7971x4200.jpg",
  "w": 7971,
  "h": 4200,
  "c": "#dba628",
  "d1": [
   0.812,
   0.688
  ],
  "d2": [
   0.188,
   0.812
  ],
  "cam": "centre",
  "camZ": 1.35
 }
}

export const JOURNEY_CAPTIONS: Record<string, Record<string, string>> = {
 "en": {
  "ph_listen": "Performance at Galerie Le point Fort, Strasbourg, 16 November 2014. Photo: Paul Roquecave",
  "ph_gesture": "Performance at Galerie Le point Fort, Strasbourg, 16 November 2014. Photo: Paul Roquecave",
  "ph_touch": "Performance at Galerie Le point Fort, Strasbourg, 16 November 2014. Photo: Paul Roquecave",
  "bf_det": "Nebula · Blue Fire, detail",
  "pomp_det": "Nebula · Pompadour, detail",
  "det15": "Detail, 2015",
  "il_det": "Inner Landscapes, detail",
  "ph_transforma": "Transforma exhibition, Órgiva, 2020",
  "chumbera": "Preparatory work for a 3D piece in chumbera, 2024"
 },
 "fr": {
  "ph_listen": "Performance à la Galerie Le point Fort, Strasbourg, 16 novembre 2014. Photo : Paul Roquecave",
  "ph_gesture": "Performance à la Galerie Le point Fort, Strasbourg, 16 novembre 2014. Photo : Paul Roquecave",
  "ph_touch": "Performance à la Galerie Le point Fort, Strasbourg, 16 novembre 2014. Photo : Paul Roquecave",
  "bf_det": "Nebula · Blue Fire, détail",
  "pomp_det": "Nebula · Pompadour, détail",
  "det15": "Détail, 2015",
  "il_det": "Inner Landscapes, détail",
  "ph_transforma": "Exposition Transforma, Órgiva, 2020",
  "chumbera": "Travail préparatoire pour une pièce en 3D en chumbera, 2024"
 },
 "es": {
  "ph_listen": "Performance en la Galería Le point Fort, Estrasburgo, 16 de noviembre de 2014. Foto: Paul Roquecave",
  "ph_gesture": "Performance en la Galería Le point Fort, Estrasburgo, 16 de noviembre de 2014. Foto: Paul Roquecave",
  "ph_touch": "Performance en la Galería Le point Fort, Estrasburgo, 16 de noviembre de 2014. Foto: Paul Roquecave",
  "bf_det": "Nebula · Blue Fire, detalle",
  "pomp_det": "Nebula · Pompadour, detalle",
  "det15": "Detalle, 2015",
  "il_det": "Inner Landscapes, detalle",
  "ph_transforma": "Exposición Transforma, Órgiva, 2020",
  "chumbera": "Trabajo preparatorio para una pieza en 3D de chumbera, 2024"
 }
}

export const JOURNEY_LABELS: Record<string, { tbc: string; seePainting: string }> = {
 "en": {
  "tbc": "To be continued…",
  "seePainting": "See the painting →"
 },
 "fr": {
  "tbc": "À suivre…",
  "seePainting": "Voir la peinture →"
 },
 "es": {
  "tbc": "Continuará…",
  "seePainting": "Ver la pintura →"
 }
}

export const JOURNEY_LAYOUT: Record<string, JourneyLayout> = {
 "en": {
  "intro": [
   [
    [
     "ph_listen",
     "I never start a painting with an image in mind. I start with a process: paint poured onto a canvas lying on the floor, ink left to set at its own pace, sand brushing the canvas. I don't think, I feel. I listen, and connect to the energy that is present. I am channeling the painting, which comes through me as much as from me."
    ]
   ],
   [
    [
     "hold",
     "I have been painting for twenty years. Placed side by side, the names of these paintings since 2011 tell a story I had not planned: a star forming, a cell organising, a seed waiting for fire, a slow movement from matter towards light. It is also a constant back-and-forth between two worlds: the outer one, of places, elements and people, and the inner one, of the body, energy and feeling. Each series begins in one and finds its echo in the other."
    ]
   ]
  ],
  "sections": [
   {
    "full": "prakriti",
    "ps": [
     [
      [
       "flower",
       "At the beginning the paint had the last word, and the work moved between the outer elements and the body. In **Prakriti** (2011), named after the Sanskrit word for primordial nature, it runs, marbles and decides. "
      ],
      [
       "endo",
       "**Endorphines** (2012) is about the rush the body feels from the inside, that surge of energy running through every nerve: the paint is sprayed onto white grounds until they glow. "
      ],
      [
       "ishtar",
       "**Axis Mundi** (2012–2013) goes the other way, down into heavy matter, to meet ancestral forces: goddesses, signs, the earth itself. Then "
      ],
      [
       "bf_det",
       "**Nebula** (2014) lifts everything into space, with compositions that burst from the centre, the way scattered matter gathers until a star is born."
      ]
     ],
     [
      [
       "pomp_det",
       "That year I co-founded M33, a collective studio named after a galaxy, the Triangulum, one of the most distant things the naked eye can see. Very different people gathered there and found their orbit around a shared place: a human galaxy, of sorts, and the paintings drew from that energy."
      ]
     ],
     [
      [
       "ph_gesture",
       "I painted all of this on the floor, moving around the canvas, tilting it so the paint would run where it wanted, with the gestural freedom of abstract expressionism. In my 2014 monograph, Arthur van Hoey placed the work between action painting and lyrical abstraction, \"taking a path that is now its own by virtue of the very synthesis it proposes.\" He also links me to Georges Mathieu, who \"moreover inscribed his research on meaning in his pictorial work.\" That search for meaning carries on in the titles."
      ]
     ]
    ]
   },
   {
    "full": "ph_touch",
    "ps": [
     [
      [
       "det15",
       "In 2015 and 2016 the work breathed in two directions at once, outward towards the light and inward into the matter."
      ]
     ],
     [
      [
       "sol",
       "**Émanation** kept the burst of Nebula, but now the light seemed to come from inside the matter: pale grounds, large formats, colour radiating outward, up to the triptych *Sol del Corazón*."
      ]
     ],
     [
      [
       "hold",
       "**Morphogenèse** went inward, into the structure of matter itself. "
      ],
      [
       "edf",
       "It began with experiments in Indian ink, where everything is a question of timing: the exact balance of texture, fluidity and time, so that the ink sets into natural fractal forms by itself, a biomorphic vocabulary of cells and branchings. *Experiment on Dynamic Forms*, which holds no paint at all, is its culmination."
      ]
     ]
    ]
   },
   {
    "full": "camino",
    "ps": [
     [
      [
       "noche",
       "**Caminos** follows an outer path that is also an inner one: a path through the desert, along an irrigation channel, up to the spring where the water bubbles from the ground. Dark grounds, lit by sparks of colour. The water carried on into "
      ],
      [
       "fluir",
       "**Hidrocoria** (2018–2019), named after seeds carried by water until they find where to take root. The palette cleared, landscapes appeared, and the forms took on outlines. Alongside them came the "
      ],
      [
       "animalitos",
       "**Cuadritos**, from a love of the tiny."
      ]
     ]
    ]
   },
   {
    "full": "portal",
    "ps": [
     [
      [
       [
        "picoflor",
        "ph_transforma"
       ],
       "**Transforma** (2020) is about metamorphosis, the moment a living form becomes another, in the world of plants and in ourselves. Plant forms grow out of the night of black grounds, in colours close to psychedelic art, and for the first time an empty space breathes. From that space a new order appears: in "
      ],
      [
       "pyramids",
       "**Lightcodes** (2021), patterns born under the stars, the forms gather into the symmetries and mandalas of sacred geometry, in the spirit of visionary art, drawn with a precise Posca line on linen and papyrus. After the codes, the light opens up. "
      ],
      [
       "prismatic",
       "**Diffraction** (2022–2023) follows what it does when it meets an obstacle: it bends, opens and breaks into colour. And what opens outside opens inside too: "
      ],
      [
       "il_det",
       "**Inner Landscapes** (2023) looks at how inner states are mirrored in the landscapes around us, and how the outer world shapes what we feel. White lines cross fluid grounds, under titles that all speak of opening: *Unfolding*, *Unlocking*, *Opening Up*."
      ]
     ],
     [
      [
       "hold",
       "And then "
      ],
      [
       "coming",
       "**Serotiny** (2025–2026). Some seeds stay sealed in their cones for years, until the heat of a fire frees them. These paintings bring everything back together: the drips of the beginning, the line, the symbols, and real matter again, with lava sand in the paint."
      ]
     ]
    ],
    "interlude": {
     "after": 0,
     "key": "chumbera"
    }
   },
   {
    "full": null,
    "ps": [
     [
      [
       "anthesis",
       "The method has not changed: set something in motion, let it make its forms, listen, and connect to the energy that is there. What has changed is how much I bring to it. At first the matter decided almost everything. Now the line, the symbols and the colour join the conversation. And almost every title names the same moment, when something held inside is finally released, inside me and in the world: a star, a form, a seed, a light."
      ]
     ]
    ]
   }
  ]
 },
 "fr": {
  "intro": [
   [
    [
     "ph_listen",
     "Je ne commence jamais une peinture avec une image en tête. Je commence par un processus : la peinture versée sur une toile posée au sol, l'encre qui prend à son rythme, le sable qui effleure la toile. Je ne pense pas, je ressens. J'écoute, et je me connecte à l'énergie présente. Je canalise la peinture, qui passe par moi autant qu'elle vient de moi."
    ]
   ],
   [
    [
     "hold",
     "Je peins depuis vingt ans. Mis côte à côte, les noms de ces peintures depuis 2011 racontent une histoire que je n'avais pas prévue : une étoile qui se forme, une cellule qui s'organise, une graine qui attend le feu, un lent mouvement de la matière vers la lumière. C'est aussi un va-et-vient constant entre deux mondes : le monde extérieur, celui des lieux, des éléments et des personnes, et le monde intérieur, celui du corps, de l'énergie et du ressenti. Chaque série naît dans l'un et trouve son écho dans l'autre."
    ]
   ]
  ],
  "sections": [
   {
    "full": "prakriti",
    "ps": [
     [
      [
       "flower",
       "Au début, la peinture avait le dernier mot, et le travail circulait entre les éléments extérieurs et le corps. Dans **Prakriti** (2011), du mot sanskrit qui désigne la nature première, elle coule, se marbre et décide. "
      ],
      [
       "endo",
       "**Endorphines** (2012) parle de la montée que le corps ressent de l'intérieur, cette vague d'énergie qui traverse chaque nerf : la peinture est pulvérisée sur des fonds blancs jusqu'à ce qu'ils rayonnent. "
      ],
      [
       "ishtar",
       "**Axis Mundi** (2012–2013) prend le chemin inverse et descend dans la matière dense, à la rencontre des forces ancestrales : déesses, signes, la terre elle-même. Puis "
      ],
      [
       "bf_det",
       "**Nebula** (2014) emporte tout dans l'espace, avec des compositions qui éclatent depuis le centre, comme la matière éparse se rassemble jusqu'à ce que naisse une étoile."
      ]
     ],
     [
      [
       "pomp_det",
       "Cette année-là, j'ai cofondé M33, un atelier collectif qui porte le nom d'une galaxie, celle du Triangle, l'un des objets les plus lointains visibles à l'œil nu. Des personnes très différentes s'y sont rassemblées et ont trouvé leur orbite autour d'un lieu partagé : une sorte de galaxie humaine, et les peintures se sont nourries de cette énergie."
      ]
     ],
     [
      [
       "ph_gesture",
       "J'ai peint tout cela au sol, en tournant autour de la toile, en l'inclinant pour que la peinture coule là où elle voulait, avec la liberté gestuelle de l'expressionnisme abstrait. Dans la monographie qui m'a été consacrée en 2014, Arthur van Hoey situe ce travail entre action painting et abstraction lyrique, « en empruntant un chemin qui lui est désormais propre en raison même de la synthèse proposée ». Il me rapproche aussi de Georges Mathieu, qui « inscrivait d'ailleurs dans son œuvre picturale, ses recherches sur la signification ». Cette recherche du sens se prolonge dans les titres."
      ]
     ]
    ]
   },
   {
    "full": "ph_touch",
    "ps": [
     [
      [
       "det15",
       "En 2015 et 2016, le travail a respiré dans deux directions à la fois : vers le dehors, vers la lumière, et vers le dedans, dans la matière."
      ]
     ],
     [
      [
       "sol",
       "**Émanation** a gardé l'éclat de Nebula, mais la lumière semblait désormais venir de l'intérieur de la matière : fonds clairs, grands formats, couleur qui rayonne vers l'extérieur, jusqu'au triptyque *Sol del Corazón*."
      ]
     ],
     [
      [
       "hold",
       "**Morphogenèse** est allée vers l'intérieur, dans la structure même de la matière. "
      ],
      [
       "edf",
       "Elle a commencé par des expérimentations à l'encre de Chine, où tout est une question de timing : le rapport exact entre texture, fluidité et temps, pour que l'encre fige d'elle-même des formes fractales naturelles, un vocabulaire biomorphique de cellules et de ramifications. *Experiment on Dynamic Forms*, qui ne contient pas une goutte de peinture, en est l'apogée."
      ]
     ]
    ]
   },
   {
    "full": "camino",
    "ps": [
     [
      [
       "noche",
       "**Caminos** suit un chemin extérieur qui est aussi un chemin intérieur : un chemin à travers le désert, le long d'un canal d'irrigation, jusqu'à la source où l'eau sort de terre en bouillonnant. Fonds sombres, éclairés d'étincelles de couleur. L'eau a continué dans "
      ],
      [
       "fluir",
       "**Hidrocoria** (2018–2019), du nom des graines qui voyagent au fil de l'eau jusqu'à trouver où prendre racine. La palette s'est éclaircie, des paysages sont apparus, et les formes se sont cernées. À leurs côtés sont nés les "
      ],
      [
       "animalitos",
       "**Cuadritos**, d'un amour du minuscule."
      ]
     ]
    ]
   },
   {
    "full": "portal",
    "ps": [
     [
      [
       [
        "picoflor",
        "ph_transforma"
       ],
       "**Transforma** (2020) parle de métamorphose, le moment où une forme vivante en devient une autre, dans le monde des plantes et en nous-mêmes. Des formes végétales poussent dans la nuit des fonds noirs, avec des couleurs proches de l'art psychédélique, et pour la première fois un espace vide respire. De cet espace naît un ordre nouveau : dans "
      ],
      [
       "pyramids",
       "**Lightcodes** (2021), des motifs nés sous les étoiles, les formes se rassemblent en symétries et en mandalas de géométrie sacrée, dans l'esprit de l'art visionnaire, tracées d'un trait de Posca précis sur lin et papyrus. Après les codes, la lumière s'ouvre. "
      ],
      [
       "prismatic",
       "**Diffraction** (2022–2023) suit ce qu'elle fait quand elle rencontre un obstacle : elle se courbe, s'ouvre et se décompose en couleurs. Et ce qui s'ouvre dehors s'ouvre aussi dedans : "
      ],
      [
       "il_det",
       "**Inner Landscapes** (2023) explore le reflet de nos états intérieurs dans les paysages qui nous entourent, et l'empreinte du monde extérieur sur ce que nous ressentons. Des lignes blanches traversent des fonds fluides, sous des titres qui parlent tous d'ouverture : *Unfolding*, *Unlocking*, *Opening Up*."
      ]
     ],
     [
      [
       "hold",
       "Puis vient "
      ],
      [
       "coming",
       "**Serotiny** (2025–2026). Certaines graines restent enfermées dans leurs cônes pendant des années, jusqu'à ce que la chaleur d'un feu les libère. Ces peintures rassemblent tout : les coulures du début, la ligne, les symboles, et de nouveau la matière réelle, avec du sable de lave dans la peinture."
      ]
     ]
    ],
    "interlude": {
     "after": 0,
     "key": "chumbera"
    }
   },
   {
    "full": null,
    "ps": [
     [
      [
       "anthesis",
       "La méthode n'a pas changé : mettre quelque chose en mouvement, le laisser faire ses formes, écouter, et me connecter à l'énergie présente. Ce qui a changé, c'est la part que j'y apporte. Au début, la matière décidait presque tout. Aujourd'hui, la ligne, les symboles et la couleur entrent dans la conversation. Et presque chaque titre nomme le même moment, celui où ce qui était retenu à l'intérieur se libère enfin, en moi et dans le monde : une étoile, une forme, une graine, une lumière."
      ]
     ]
    ]
   }
  ]
 },
 "es": {
  "intro": [
   [
    [
     "ph_listen",
     "Nunca empiezo una pintura con una imagen en mente. Empiezo con un proceso: pintura vertida sobre un lienzo tendido en el suelo, tinta que fragua a su propio ritmo, arena que roza el lienzo. No pienso, siento. Escucho y conecto con la energía que está presente. Canalizo la pintura, que pasa a través de mí tanto como sale de mí."
    ]
   ],
   [
    [
     "hold",
     "Llevo veinte años pintando. Puestos uno al lado del otro, los nombres de estas pinturas desde 2011 cuentan una historia que no había previsto: una estrella que se forma, una célula que se organiza, una semilla que espera el fuego, un lento movimiento de la materia hacia la luz. Es también un ir y venir constante entre dos mundos: el exterior, el de los lugares, los elementos y las personas, y el interior, el del cuerpo, la energía y lo que se siente. Cada serie nace en uno y encuentra su eco en el otro."
    ]
   ]
  ],
  "sections": [
   {
    "full": "prakriti",
    "ps": [
     [
      [
       "flower",
       "Al principio la pintura tenía la última palabra, y la obra se movía entre los elementos exteriores y el cuerpo. En **Prakriti** (2011), que toma su nombre de la palabra sánscrita para la naturaleza primordial, corre, se jaspea y decide. "
      ],
      [
       "endo",
       "**Endorphines** (2012) habla del subidón que el cuerpo siente desde dentro, esa oleada de energía que recorre cada nervio: la pintura se pulveriza sobre fondos blancos hasta que brillan. "
      ],
      [
       "ishtar",
       "**Axis Mundi** (2012–2013) toma el camino contrario y baja a la materia densa, al encuentro de las fuerzas ancestrales: diosas, signos, la tierra misma. Luego "
      ],
      [
       "bf_det",
       "**Nebula** (2014) lo eleva todo al espacio, con composiciones que estallan desde el centro, como la materia dispersa se reúne hasta que nace una estrella."
      ]
     ],
     [
      [
       "pomp_det",
       "Ese año cofundé M33, un taller colectivo que lleva el nombre de una galaxia, la del Triángulo, uno de los objetos más lejanos que se pueden ver a simple vista. Personas muy distintas se reunieron allí y encontraron su órbita alrededor de un lugar compartido: una especie de galaxia humana, y las pinturas se nutrieron de esa energía."
      ]
     ],
     [
      [
       "ph_gesture",
       "Pinté todo esto en el suelo, moviéndome alrededor del lienzo, inclinándolo para que la pintura corriera hacia donde quería, con la libertad gestual del expresionismo abstracto. En la monografía que me dedicaron en 2014, Arthur van Hoey situó la obra entre el action painting y la abstracción lírica, «tomando un camino que ahora le es propio en razón misma de la síntesis propuesta». También me acerca a Georges Mathieu, quien «inscribía además en su obra pictórica sus investigaciones sobre la significación». Esa búsqueda de sentido continúa en los títulos."
      ]
     ]
    ]
   },
   {
    "full": "ph_touch",
    "ps": [
     [
      [
       "det15",
       "En 2015 y 2016 la obra respiró en dos direcciones a la vez: hacia fuera, hacia la luz, y hacia dentro, en la materia."
      ]
     ],
     [
      [
       "sol",
       "**Émanation** conservó el estallido de Nebula, pero ahora la luz parecía venir del interior de la materia: fondos claros, grandes formatos, color que irradia hacia fuera, hasta el tríptico *Sol del Corazón*."
      ]
     ],
     [
      [
       "hold",
       "**Morphogenèse** fue hacia dentro, a la estructura misma de la materia. "
      ],
      [
       "edf",
       "Empezó con experimentos con tinta china, donde todo es cuestión del momento justo: la relación exacta entre textura, fluidez y tiempo, para que la tinta fije por sí sola formas fractales naturales, un vocabulario biomórfico de células y ramificaciones. *Experiment on Dynamic Forms*, que no contiene ni una gota de pintura, es su punto culminante."
      ]
     ]
    ]
   },
   {
    "full": "camino",
    "ps": [
     [
      [
       "noche",
       "**Caminos** sigue un camino exterior que es también interior: un camino por el desierto, a lo largo de la acequia, hasta el nacimiento donde el agua brota a borbotones de la tierra. Fondos oscuros, iluminados por chispas de color. El agua continuó en "
      ],
      [
       "fluir",
       "**Hidrocoria** (2018–2019), que debe su nombre a las semillas que viajan por el agua hasta encontrar dónde echar raíces. La paleta se aclaró, aparecieron paisajes y las formas adquirieron contornos. A su lado nacieron los "
      ],
      [
       "animalitos",
       "**Cuadritos**, del amor por lo diminuto."
      ]
     ]
    ]
   },
   {
    "full": "portal",
    "ps": [
     [
      [
       [
        "picoflor",
        "ph_transforma"
       ],
       "**Transforma** (2020) habla de la metamorfosis, el momento en que una forma viva se convierte en otra, en el mundo de las plantas y en nosotros mismos. Formas vegetales crecen en la noche de los fondos negros, en colores cercanos al arte psicodélico, y por primera vez un espacio vacío respira. De ese espacio nace un orden nuevo: en "
      ],
      [
       "pyramids",
       "**Lightcodes** (2021), patrones nacidos bajo las estrellas, las formas se reúnen en las simetrías y mandalas de la geometría sagrada, en el espíritu del arte visionario, trazadas con una línea precisa de Posca sobre lino y papiro. Después de los códigos, la luz se abre. "
      ],
      [
       "prismatic",
       "**Diffraction** (2022–2023) sigue lo que hace cuando encuentra un obstáculo: se curva, se abre y se descompone en color. Y lo que se abre fuera se abre también dentro: "
      ],
      [
       "il_det",
       "**Inner Landscapes** (2023) explora el reflejo de nuestros estados interiores en los paisajes que nos rodean, y la huella del mundo exterior en lo que sentimos. Líneas blancas atraviesan fondos fluidos, bajo títulos que hablan todos de apertura: *Unfolding*, *Unlocking*, *Opening Up*."
      ]
     ],
     [
      [
       "hold",
       "Y luego "
      ],
      [
       "coming",
       "**Serotiny** (2025–2026). Algunas semillas permanecen selladas en sus piñas durante años, hasta que el calor de un fuego las libera. Estas pinturas lo reúnen todo: las chorreaduras del principio, la línea, los símbolos y, de nuevo, la materia real, con arena de lava en la pintura."
      ]
     ]
    ],
    "interlude": {
     "after": 0,
     "key": "chumbera"
    }
   },
   {
    "full": null,
    "ps": [
     [
      [
       "anthesis",
       "El método no ha cambiado: poner algo en movimiento, dejar que haga sus formas, escuchar y conectar con la energía presente. Lo que ha cambiado es cuánto aporto yo. Al principio la materia lo decidía casi todo. Ahora la línea, los símbolos y el color se suman a la conversación. Y casi cada título nombra el mismo momento, aquel en que lo que estaba guardado dentro por fin se libera, en mí y en el mundo: una estrella, una forma, una semilla, una luz."
      ]
     ]
    ]
   }
  ]
 }
}

/**
 * Remaps artwork titles by matching each Sanity image asset's originalFilename
 * to the scraped filename→title pairings from armelleboussidan.com.
 * Also regenerates slugs and corrects availability flags.
 *
 * Run: node scripts/fix-artwork-titles.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '..', '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
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

function slug(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Availability from filename: if filename contains these patterns → not available
function isUnavailableFromFilename(filename) {
  const f = filename.toLowerCase()
  return f.includes('-na-') || f.includes('-na.') || f.endsWith('-na') ||
    f.includes('notavailable') || f.includes('not-available') ||
    f.includes('_na_') || f.includes('_na.') ||
    f.includes('donated')
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER MAP: lowercase filename (just the file, no path) → painting metadata
// null = contextual/header photo (skip — these are not individual paintings)
// ─────────────────────────────────────────────────────────────────────────────
const FILE_MAP = {

  // ── LIGHTCODES (2021) ─────────────────────────────────────────────────────
  'pyramidstoaddtolightcodes_resized.jpg': null,
  'stcatherinetoaddtolightcodes_resized.jpg': null,
  'hangingatlafab-addtolightcodes.jpg': null,

  '0-desert-star-mural-aichamakebacamp-rasabugallum-052021-1mx1m-na-2.jpg':
    { title: 'Desert Star Mural', dimensions: '100 × 100 cm', available: false },
  '1-andromedan-shell-55x55-052021-1.jpg':
    { title: 'Andromedan Shell', dimensions: '55 × 55 cm', available: true },
  '2-keytothepyramids-25x40-2.jpg':
    { title: 'Key to the Pyramids', dimensions: '25 × 40 cm', available: true },
  '3-solar-scarab-na-1.jpg':
    { title: 'Solar Scarab', available: false },
  '4-flowers-for-hathor-cropped-45x49-2.jpg':
    { title: 'Flowers for Hathor', dimensions: '45 × 49 cm', available: true },
  '5-deep-dive-69x10-na-1.jpg':
    { title: 'Deep Dive', dimensions: '69 × 10 cm', available: false },
  '6-dahabian-groove-60x34-2.jpg':
    { title: 'Dahabian Groove', dimensions: '60 × 34 cm', available: false },
  '8-heart-codes-9x45-2.jpg':
    { title: 'Heart Codes', dimensions: '9 × 45 cm', available: false },
  '9-letting-go-76x30-papyrus-1.jpg':
    { title: 'Letting Go', dimensions: '76 × 30 cm', available: true },
  '10-reclaiming-79x30-papyrus-1.jpg':
    { title: 'Reclaiming', dimensions: '79 × 30 cm', available: false },
  '11-sacred-fish-76x30-papyrus-1.jpg':
    { title: 'Sacred Fish', dimensions: '76 × 30 cm', available: true },
  'rewiring-lightcodes2021.jpeg':
    { title: 'Rewiring', dimensions: '10 × 30 cm', available: true },
  '12-diemptation-ok.jpg':
    { title: 'Diemptation', dimensions: 'Ø 77 cm', available: true },
  'llaves-ok.jpg':
    { title: 'Llaves', dimensions: '55 × 35 cm', available: true },

  // ── TRANSFORMA (2020) ─────────────────────────────────────────────────────
  'transformatoadd_resized.jpg': null,

  'armelle-bousidan-sabordesconodido-38x46-2020-na-1.jpeg':
    { title: 'Sabor Desconocido', dimensions: '38 × 46 cm', available: false },
  'armelle-boussidan-elmundodelasplantas-38x46-2020-1.jpeg':
    { title: 'El Mundo de las Plantas', dimensions: '38 × 46 cm', available: true },
  'armelle-boussidan-espiritudeplanta-61x50-2020-2.jpeg':
    { title: 'Espiritu de Planta', dimensions: '61 × 50 cm', available: true },
  'armelle-boussidan-mundoescondido-33x41-2020-1.jpeg':
    { title: 'Mundo Escondido', dimensions: '33 × 41 cm', available: true },
  'armelle-boussidan-picoflor-116x89-2020-1.jpeg':
    { title: 'Pico Flor', dimensions: '116 × 89 cm', available: true },
  'armelle-boussidan-portal-116x89-2020-na-1.jpeg':
    { title: 'Portal', dimensions: '116 × 89 cm', available: false },
  'armelle-boussidan-studyinplantmagic-24x30-2020-na-1.jpeg':
    { title: 'Study in Plant Magic', dimensions: '24 × 30 cm', available: false },
  'armelle-boussidan-universoparallelo-33x41-2020-1.jpeg':
    { title: 'Universo Parallelo', dimensions: '33 × 41 cm', available: true },
  'armelle-boussidan-vehiculovegetal-55x46-2020-1.jpeg':
    { title: 'Vehiculo Vegetal', dimensions: '55 × 46 cm', available: true },

  // ── CUADRITOS (2019) ──────────────────────────────────────────────────────
  // Note: agüita has accent — filename may have been saved differently
  'ag\u00fcita-16x16-aboussidan-2019.jpg':
    { title: 'Agüita', dimensions: '16 × 16 cm', available: true },
  'aguita-16x16-aboussidan-2019.jpg':
    { title: 'Agüita', dimensions: '16 × 16 cm', available: true },
  'animalitos-20x20-aboussidan-2019.jpg':
    { title: 'Animalitos', dimensions: '20 × 20 cm', available: true },
  'arriba-20x20-aboussidan-2019-na.jpg':
    { title: 'Arriba', dimensions: '20 × 20 cm', available: false },
  'lunita-25x25-aboussidan-2019.jpg':
    { title: 'Lunita', dimensions: '25 × 25 cm', available: true },
  'penoncillo-16x16-aboussidan-2019.jpg':
    { title: 'Penoncillo', dimensions: '16 × 16 cm', available: true },
  'tierra-ajena-16x16-aboussidan-2019-na-1.jpg':
    { title: 'Tierra Ajena', dimensions: '16 × 16 cm', available: false },

  // ── 2018–2019 ─────────────────────────────────────────────────────────────
  '2018-armellebousidan_fluir-81x116-1.jpg':
    { title: 'Fluir', dimensions: '81 × 116 cm', available: true },
  '2018-armelleboussidan_fluir-81x116-1.jpg':
    { title: 'Fluir', dimensions: '81 × 116 cm', available: true },
  '2018-sanpedroazulero_60x30.-not-available.jpg':
    { title: 'San Pedro Azulero', dimensions: '60 × 30 cm', available: false },
  '2018-seeds-80x80-notavailable.jpg':
    { title: 'Seeds', dimensions: '80 × 80 cm', available: false },
  '2019-dabblinginnon-duality-armellebouissidan-60x81-3.jpg':
    { title: 'Dabbling in Non-Duality', dimensions: '60 × 81 cm', available: true },
  '2019-dabblinginnon-duality-armellebouissidan-60x81-2.jpg':
    { title: 'Dabbling in Non-Duality', dimensions: '60 × 81 cm', available: true },
  '2019-dabblinginnon-duality-armellebouissidan-60x81-1.jpg':
    { title: 'Dabbling in Non-Duality', dimensions: '60 × 81 cm', available: true },
  '2019-dabblinginnon-duality-armellebouissidan-60x81.jpg':
    { title: 'Dabbling in Non-Duality', dimensions: '60 × 81 cm', available: true },
  '2019-dabbling-in-non-duality-armellebouissidan-60x81-3.jpg':
    { title: 'Dabbling in Non-Duality', dimensions: '60 × 81 cm', available: true },
  '2019-dabblinginnon-duality-armelleboussidan-60x81-3.jpg':
    { title: 'Dabbling in Non-Duality', dimensions: '60 × 81 cm', available: true },
  '2019-dyptic-canonera-donated-to-lafabrica.canonera-with-spanish-n-means-a-woman-of-lanjaron.tthis-painting-may-be-aquired-at-la-fabrica-in-lanjaron-spain.-insert-hyperlink.jpg':
    { title: 'Dyptich Cañonera', available: false },
  '2019-the-fool-armelle-boussidan-81x65-1.jpg':
    { title: 'The Fool', dimensions: '81 × 65 cm', available: true },
  '2019-the-fool-armelle-boussidan-81x65.jpg':
    { title: 'The Fool', dimensions: '81 × 65 cm', available: true },

  // ── CAMINOS (2017–2018) ───────────────────────────────────────────────────
  '2017-camino-al-nacimiento-a-boussidan-57x79cm-notavailable-if-you-see-this-painting-please-get-in-touch-with-me.jpg':
    { title: 'Camino al Nacimiento', dimensions: '57 × 79 cm', available: false },
  '2017-camino-de-noche-a-boussidan-71x76cm-notavailable-if-you-see-this-painting-please-get-in-touch-with-me-1.jpg':
    { title: 'Camino de Noche', dimensions: '71 × 76 cm', available: false },
  '2017camino-del-silencio-a-boussidan-notavailable-if-you-see-this-painting-please-get-in-touch-with-me.jpg':
    { title: 'Camino del Silencio', available: false },
  '2018-camino-rojo-a-boussidan-60x53-notavailable-if-you-see-this-painting-please-get-in-touch-with-me.jpg':
    { title: 'Camino Rojo', dimensions: '60 × 53 cm', available: false },
  '2018-renacimiento-57x77-a-boussidan-notavailable-if-you-see-this-painting-please-get-in-touch-with-me.jpg':
    { title: 'Renacimiento', dimensions: '57 × 77 cm', available: false },

  // ── 2015–2017 ─────────────────────────────────────────────────────────────
  '2015-01-charliebleeding-acrylicpastels-1-1.jpg':
    { title: 'Charlie Bleeding 1', available: true },
  '2015-01-charliebleeding-acrylicpastels-2-1.jpg':
    { title: 'Charlie Bleeding 2', available: true },
  '2015-01-charliebleeding-acrylicpastels-3-1.jpg':
    { title: 'Charlie Bleeding 3', available: true },
  '2015-archaicjolt_30x30_pmod_2015_armelle_boussidan.jpg':
    { title: 'Archaic Jolt', dimensions: '30 × 30 cm', available: true },
  '2015-backtobasics-acrylic-on-tarpaulin-50x200-na-1.jpg':
    { title: 'Back to Basics', dimensions: '50 × 200 cm', available: false },
  '2015-enteringlight_189x160_photopg-unframed-1.jpg':
    { title: 'Entering Light', dimensions: '189 × 160 cm', available: true },
  '2015-hd-auto-emergence_80x80_pmod_2015_armelle_boussidan-1.jpg':
    { title: 'Auto-Emergence', dimensions: '80 × 80 cm', available: true },
  '2015-hd-experimentondynamicforms_50x50__pmod_2015_armelle_boussidan-1.jpg':
    { title: 'Experiment on Dynamic Forms', dimensions: '50 × 50 cm', available: true },
  '2015-hd-secondexperimentondynamicforms-20x40_pmod_2015_armelle_boussidan-na-1.jpg':
    { title: 'Second Experiment on Dynamic Forms', dimensions: '20 × 40 cm', available: false },
  '2015-hd-triptyque-homeiswhereyougo-61x81_65x81_61x81_pmod_2015_armelle_boussidan.jpg':
    { title: 'Triptych Home Is Where You Go', dimensions: '61×81, 65×81, 61×81 cm', available: true },
  '2015-incollabwith-jerome-duprelateur_60x100-acrylicspastel-onhardboard-1.jpg':
    { title: 'Dieu', dimensions: '60 × 100 cm', available: true },
  '2015-incollabwith-jeromeDuprelatour-60x100-acrylicspastelsonhardboard-orgasme-1.jpg':
    { title: 'Orgasme', dimensions: '60 × 100 cm', available: true },
  '2015-incollabwith-jeromeDuprelatour-60x100-acrylicspastelsonhardboard-orgasme-1.jpg':
    { title: 'Orgasme', dimensions: '60 × 100 cm', available: true },
  '2015-incollabwith-jeromeDuprelateur-60x100-acrylicspastelsonhardboard-orgasme-1.jpg':
    { title: 'Orgasme', dimensions: '60 × 100 cm', available: true },
  '2015-incollabwith-jeromeDupre\'latour-dejalosacar_-1.jpg':
    { title: 'Deja lo Sacar', available: true },
  '2015-incollabwith-jeromeDuprélatour-dejalosacar_-1.jpg':
    { title: 'Deja lo Sacar', available: true },
  '2015-motheroftheuniverse_116x73-photopg-1.jpg':
    { title: 'Mother of the Universe', dimensions: '116 × 73 cm', available: true },
  '2015-passage-diptych-73x100_73x54_photodom-copy.jpg':
    { title: 'Diptych Passage', dimensions: '73×100 & 73×54 cm', available: true },
  '2015-thirdeyeopening_240x160hm_photopg-unframed.jpg':
    { title: 'Third Eye Opening', dimensions: '240 × 160 cm', available: true },
  '2015-timelessinnergarden_40x40_pmod_2015_armelle_boussidan.jpg':
    { title: 'Timeless Inner Garden', dimensions: '40 × 40 cm', available: true },
  '2015-tryptich-3x60x200-orderanddisorderinchaos-dancingthroughchaos-chaosdancingwithin-cosmos-1-1.jpg':
    { title: 'Triptych Order and Disorder in Chaos', dimensions: '3 × 60 × 200 cm', available: true },
  '2015-alien-encounter-90x130photodom_dark-.jpg':
    { title: 'Alien Encounter', dimensions: '90 × 130 cm', available: true },
  '2015-hd-lhommeaucondor_65x50_pmod_2015_armelle_boussidan-1.jpg':
    { title: "L'Homme au Condor", dimensions: '65 × 50 cm', available: true },
  '2015-hd-lhommeaucondor_65x50_pmod_2015_armelle_boussidan.jpg':
    { title: "L'Homme au Condor", dimensions: '65 × 50 cm', available: true },
  '2016-departure-73x92-not-available.jpg':
    { title: 'Departure', dimensions: '73 × 92 cm', available: false },
  '2016-hd-spiritdimension_73x54__pmod_2016_armelle_boussidan-notavailable.jpg':
    { title: 'Spirit Dimension', dimensions: '73 × 54 cm', available: false },
  '2016-hd-dragonwaters_116x73__pmod_2016_armelle_boussidan-1.jpg':
    { title: 'Dragon Waters', dimensions: '116 × 73 cm', available: true },
  '2016-natem_40x40-not-available.jpg':
    { title: 'Natem', dimensions: '40 × 40 cm', available: false },
  '2016-triptych-sol-del-corazon-3x81x130cm-1.png':
    { title: 'Triptych Sol del Corazón (overview)', dimensions: '3 × 81 × 130 cm', available: true },
  '2016-triptychsoldelcorazon-original1.jpg':
    { title: 'Triptych Sol del Corazón 1', dimensions: '81 × 130 cm', available: true },
  '2016-triptychsoldelcorazon-original2.jpg':
    { title: 'Triptych Sol del Corazón 2', dimensions: '81 × 130 cm', available: true },
  '2016-triptychsoldelcorazon-original3.jpg':
    { title: 'Triptych Sol del Corazón 3', dimensions: '81 × 130 cm', available: true },
  '2017-raag-bihag-original-painting-forthe-album-cover-for-etienne-bartholomew-painted-as-the-album-was-recorded.-insert-hyperlink..jpg':
    { title: 'Raag Bihag (original)', available: true },
  '2017-raag-bihag-album-cover-for-etienne-bartholomew-painted-as-the-album-was-recorded.-insert-hyperlink..jpg':
    { title: 'Raag Bihag (album cover)', available: true },

  // ── 2012–2014 ─────────────────────────────────────────────────────────────
  '2012-devils-dare_50x70-1.jpg':
    { title: "Devil's Dare", dimensions: '50 × 70 cm', available: true },
  '2012-freedom_of_speech_2012_120x120-na.jpg':
    { title: 'Freedom of Speech', dimensions: '120 × 120 cm', available: false },
  '2012-innocence_2012_50x70-na-1.jpg':
    { title: 'Innocence', dimensions: '50 × 70 cm', available: false },
  '2012-ishtar_130x90-hd_lpf-ok-pao-na-2.jpg':
    { title: 'Ishtar', dimensions: '130 × 90 cm', available: false },
  '2012-primordia_40x33-1.jpg':
    { title: 'Primordia', dimensions: '40 × 33 cm', available: true },
  '2012-profil-130x100-2012-incollabwith-mathieu_devavry-na-1.jpg':
    { title: 'Profil', dimensions: '130 × 100 cm', available: false },
  '2012-signs_90x110-na.jpg':
    { title: 'Signs', dimensions: '90 × 110 cm', available: false },
  '2012-terra_2012_80x80-na-1.jpg':
    { title: 'Terra', dimensions: '80 × 80 cm', available: false },
  '2012-terre_d_eau_3x30x10-clayink.jpg':
    { title: "Terre d'Eau", dimensions: '3 × 30 × 10 cm', available: true },
  '2013-chim\u00e8res_photopr_2013_60x72.5-na.jpg':
    { title: 'Chimères', dimensions: '60 × 72.5 cm', available: false },
  '2013-chimeres_photopr_2013_60x72.5-na.jpg':
    { title: 'Chimères', dimensions: '60 × 72.5 cm', available: false },
  '2013-you-can-fly-sousverre50x50_2013pr-na.jpg':
    { title: 'You Can Fly', dimensions: '50 × 50 cm', available: false },
  '2014-80x80-pompadour_photopaulroquecave-na.jpg':
    { title: 'Pompadour', dimensions: '80 × 80 cm', available: false },
  '2014-ars_galacticum_70x50-pguigouphoto.jpg':
    { title: 'Ars Galacticum', dimensions: '70 × 50 cm', available: true },
  '2014-bluefire146x114.jpg':
    { title: 'Blue Fire', dimensions: '146 × 114 cm', available: true },
  '2014-efflorescence116x89_photoprdsc8019-na.jpg':
    { title: 'Efflorescence', dimensions: '116 × 89 cm', available: false },
  '2014-elan_150x50bonneversion-pguigouphoto-img_8312-na.jpg':
    { title: 'Elan', dimensions: '150 × 50 cm', available: false },
  '2014-facingtheautumnfire116x89pr.jpg':
    { title: 'Facing the Autumn Fire', dimensions: '116 × 89 cm', available: true },
  '2014-fragments-africains-paolaGuigouPhoto-shreddedcanvas-na.jpg':
    { title: 'Fragments Africains', available: false },
  '2014-hippomundus70x100pr-na-1.jpg':
    { title: 'Hippomundus', dimensions: '70 × 100 cm', available: false },
  '2014-in-depth_11x23.5_2014pr-na.jpg':
    { title: 'In Depth', dimensions: '11 × 23.5 cm', available: false },
  '2014-inthesweetsightoftime146x89pr.jpg':
    { title: 'In the Sweet Sight of Time', dimensions: '146 × 89 cm', available: true },
  '2014-joy_160x130_pr.jpg':
    { title: 'Joy', dimensions: '160 × 130 cm', available: true },
  '2014-m33-1_89x130dsc8023-.jpg':
    { title: 'M33-1', dimensions: '89 × 130 cm', available: true },
  '2014-meditation-under-a-tree-25x25-sous-verre-_2014pr-na.jpg':
    { title: 'Meditation Under a Tree', dimensions: '25 × 25 cm', available: false },
  '2014-sanguine-100x100-_paolagiguouhaute-def-na.jpg':
    { title: 'Sanguine', dimensions: '100 × 100 cm', available: false },
  '2014-sanguine-100x100-_paolaguigouhaute-def-na.jpg':
    { title: 'Sanguine', dimensions: '100 × 100 cm', available: false },
  '2014-transientlandscape146x89.jpg':
    { title: 'Transient Landscape', dimensions: '146 × 89 cm', available: true },
  '2014-triptyqueenveloppessolaire2014-na.jpg':
    { title: 'Triptych Enveloppes Solaires (overview)', available: false },
  '2014-triptyqueenveloppesolaire2014-na.jpg':
    { title: 'Triptych Enveloppes Solaires (overview)', available: false },
  '2014-triptyque_enveloppe_solaire1_80x100-_dsc8016-na.jpg':
    { title: 'Triptych Enveloppes Solaires 1', dimensions: '80 × 100 cm', available: false },
  '2014-triptyque_enveloppe_solaire2_80x100-_dsc8014-na.jpg':
    { title: 'Triptych Enveloppes Solaires 2', dimensions: '80 × 100 cm', available: false },
  '2014-triptyque_enveloppe_solaire3_80x100-_dsc8012-na.jpg':
    { title: 'Triptych Enveloppes Solaires 3', dimensions: '80 × 100 cm', available: false },

  // ── ENDORPHINES (2012) ────────────────────────────────────────────────────
  '2012-endorphines_1_80x80-1.jpg':
    { title: 'Endorphines 1', dimensions: '80 × 80 cm', available: true },
  '2012-endorphines_2_80x80.jpg':
    { title: 'Endorphines 2', dimensions: '80 × 80 cm', available: true },
  '2012-endorphines_3_80x80.jpg':
    { title: 'Endorphines 3', dimensions: '80 × 80 cm', available: true },
  '2012-open_80x80-na.jpg':
    { title: 'Open', dimensions: '80 × 80 cm', available: false },
  '2012-abyssal_lifeforms_80x80-na.jpg':
    { title: 'Abyssal Lifeforms', dimensions: '80 × 80 cm', available: false },
  '2012-beyond_light_80x80-na.jpg':
    { title: 'Beyond Light', dimensions: '80 × 80 cm', available: false },
  '2012-beyond_darkness_80x80-na.jpg':
    { title: 'Beyond Darkness', dimensions: '80 × 80 cm', available: false },
  '2012-carbon_lifeforms_80x80.jpg':
    { title: 'Carbon Lifeforms', dimensions: '80 × 80 cm', available: true },
  '2012-underwater_80x80-na.jpg':
    { title: 'Underwater', dimensions: '80 × 80 cm', available: false },

  // ── 2011 ──────────────────────────────────────────────────────────────────
  '2011-baku_marin_mineur_40x80.jpg':
    { title: 'Baku Marin Mineur', dimensions: '40 × 80 cm', available: true },
  '2011-bakumajeur_40x80-na.jpg':
    { title: 'Baku Majeur', dimensions: '40 × 80 cm', available: false },
  '2011-cr\u00e9atures_du_royaume_des_tortues_20x20-na.jpg':
    { title: 'Créatures du Royaume des Tortues', dimensions: '20 × 20 cm', available: false },
  '2011-creatures_du_royaume_des_tortues_20x20-na.jpg':
    { title: 'Créatures du Royaume des Tortues', dimensions: '20 × 20 cm', available: false },
  '2011-flower_2011_40x33-na-1.jpg':
    { title: 'Flower', dimensions: '40 × 33 cm', available: false },
  '2011-green-visions20x25-na.jpg':
    { title: 'Green Visions', dimensions: '20 × 25 cm', available: false },
  '2011-in_mind_30x30-na.jpg':
    { title: 'In Mind', dimensions: '30 × 30 cm', available: false },
  '2011-moais_50x50.jpg':
    { title: 'Moaïs', dimensions: '50 × 50 cm', available: true },
  '2011-prakriti_2011-50x50-2.jpg':
    { title: 'Prakriti', dimensions: '50 × 50 cm', available: true },
  '2011-spacejunk_2011_55x70.jpg':
    { title: 'Spacejunk', dimensions: '55 × 70 cm', available: true },
  '2011-vision_20x25.jpg':
    { title: 'Vision', dimensions: '20 × 25 cm', available: true },

  // ── PEOPLE WITH THEIR PAINTING ────────────────────────────────────────────
  'aichamakeba-desertstar-rasabugalum-egypt.jpg':
    { title: 'Aicha Makeba with Desert Star — Ras Abu Galum, Egypt', available: false },
  'alexis-baillis-with-hippomundus-colmar-fr.jpeg':
    { title: 'Alexis Baillis with Hippomundus — Colmar, France', available: false },
  'antony-valenti-cornwall-uk-with-selfsustaingLights.jpeg':
    { title: 'Antony Valenti with Self-Sustaining Lights — Cornwall, UK', available: false },
  'don-francisco-blanc-castan-sabor-desconocido-sevilla-spain.jpeg':
    { title: 'Don Francisco with Sabor Desconocido — Seville, Spain', available: false },
  'sebastien-ferlay-terra-lyon.jpg':
    { title: 'Sébastien Ferlay with Terra — Lyon', available: false },
  'sebastien-kahn-enveloppes-solaires-paris.jpg':
    { title: 'Sébastien Kahn with Enveloppes Solaires — Paris', available: false },
  'juju-emilien-portal.jpg':
    { title: 'Juju & Emilien with Portal', available: false },
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalise: lowercase all FILE_MAP keys so lookup works regardless of case
const FILE_MAP_LOWER = {}
for (const [k, v] of Object.entries(FILE_MAP)) {
  FILE_MAP_LOWER[k.toLowerCase()] = v
}

async function run() {
  // 1. Fetch all image assets with their originalFilename
  console.log('Fetching Sanity image assets...')
  const assets = await client.fetch(
    `*[_type == "sanity.imageAsset"]{ _id, originalFilename }`
  )
  // Map: assetId → originalFilename (lowercase, just the file part)
  const assetFilename = {}
  for (const a of assets) {
    if (a.originalFilename) {
      assetFilename[a._id] = a.originalFilename.toLowerCase()
    }
  }
  console.log(`  ${assets.length} assets found\n`)

  // 2. Fetch all painting series with full artwork data + asset refs
  const series = await client.fetch(`
    *[_type == "paintingSeries"] | order(year desc, order asc) {
      _id, title,
      artworks[]{
        ...,
        "assetId": image.asset._ref
      }
    }
  `)
  console.log(`Found ${series.length} series\n`)

  let totalUpdated = 0
  let totalUnmatched = 0
  let totalSkipped = 0

  for (const s of series) {
    if (!s.artworks?.length) {
      console.log(`  ${s.title}: no artworks`)
      continue
    }

    let updated = 0
    let unmatched = 0
    let skipped = 0

    const newArtworks = s.artworks.map(artwork => {
      const assetId = artwork.assetId
      if (!assetId) return artwork

      const filename = assetFilename[assetId] || ''
      const meta = FILE_MAP_LOWER[filename]

      // null means it's a contextual photo — mark it clearly but keep it
      if (meta === null) {
        skipped++
        // Remove from artworks by returning null (we'll filter below)
        return null
      }

      if (meta === undefined) {
        // No match in our map — try filename-based availability at least
        const fallbackAvailable = !isUnavailableFromFilename(filename)
        unmatched++
        if (filename) {
          console.log(`    ⚠  No match for: ${filename}`)
        }
        return artwork // leave as-is
      }

      updated++

      // Rebuild artwork with corrected data
      // Keep the image ref as-is (don't expand it)
      const cleaned = {
        _key: artwork._key,
        _type: artwork._type || 'object',
        image: artwork.image,
        title: meta.title,
        slug: { _type: 'slug', current: slug(meta.title) },
        available: meta.available,
      }
      if (meta.dimensions) cleaned.dimensions = meta.dimensions
      if (artwork.medium) cleaned.medium = artwork.medium
      if (artwork.year) cleaned.year = artwork.year

      return cleaned
    })

    // Filter out contextual photos (null entries)
    const filteredArtworks = newArtworks.filter(a => a !== null)

    // Patch the series
    await client.patch(s._id).set({ artworks: filteredArtworks }).commit()

    totalUpdated += updated
    totalUnmatched += unmatched
    totalSkipped += skipped

    console.log(`✓  ${s.title}: ${updated} corrected, ${skipped} contextual removed, ${unmatched} unmatched`)
  }

  console.log(`\n── Summary ──────────────────────────────`)
  console.log(`   Corrected:  ${totalUpdated}`)
  console.log(`   Removed (contextual photos): ${totalSkipped}`)
  console.log(`   Unmatched (left as-is): ${totalUnmatched}`)
  console.log(`\nDone.`)
}

run().catch(console.error)

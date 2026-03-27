/**
 * Downloads all images from the WordPress site into downloads/images/<category>/
 * Run with: node scripts/download-images.mjs
 */

import { createWriteStream, mkdirSync, existsSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

// Works on both Windows Node and WSL Node
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_DIR = path.resolve(__dirname, '..', 'downloads', 'images')

const images = {
  'paintings/lightcodes-2021': [
    'https://armelleboussidan.com/wp-content/uploads/2022/03/PYRAMIDStoADDtoLIghtcodes_resized.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/03/StCatherineToADDtoLIghtcodes_resized.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/03/HangingatLafab-ADDtolightcodes.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/0-Desert-star-mural-aichamakebacamp-rasabugallum-052021-1mx1m-NA-2.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/1-Andromedan-Shell-55x55-052021-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2-keytothepyramids-25x40-2.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/3-Solar-Scarab-NA-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/4-Flowers-for-Hathor-cropped-45x49-2.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/5-deep-dive-69x10-NA-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/6-Dahabian-groove-60x34-2.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/8-Heart-Codes-9x45-2.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/9-Letting-go-76x30-papyrus-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/10-Reclaiming-79x30-papyrus-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/11-Sacred-Fish-76x30-papyrus-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Rewiring-LightCodes2021.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/12-diemptation-ok.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/llaves-ok.jpg',
  ],
  'paintings/transforma-2020': [
    'https://armelleboussidan.com/wp-content/uploads/2022/03/transformaTOADD_resized.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Armelle-Bousidan-SaborDesconodido-38x46-2020-NA-1.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Armelle-Boussidan-elmundodelasplantas-38x46-2020-1.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Armelle-Boussidan-EspirituDePlanta-61x50-2020-2.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Armelle-Boussidan-MundoEscondido-33x41-2020-1.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Armelle-Boussidan-PicoFlor-116x89-2020-1.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Armelle-Boussidan-Portal-116x89-2020-NA-1.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Armelle-Boussidan-StudyInPlantMagic-24x30-2020-NA-1.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Armelle-Boussidan-UniversoParallelo-33x41-2020-1.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Armelle-Boussidan-VehiculoVegetal-55x46-2020-1.jpeg',
  ],
  'paintings/cuadritos-2019': [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/agüita-16x16-aboussidan-2019.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/animalitos-20x20-aboussidan-2019.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/arriba-20x20-aboussidan-2019-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/lunita-25x25-aboussidan-2019.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/penoncillo-16x16-aboussidan-2019.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Tierra-ajena-16x16-aboussidan-2019-NA-1.jpg',
  ],
  'paintings/2018-2019': [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2018-ArmelleBoussidan_fluir-81x116-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2018-sanpedroazulero_60x30.-Not-available.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2018-SEEDS-80x80-notavailable.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2019-dabblingInNon-duality-ArmelleBoussidan-60x81-3.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2019-dyptic-Canonera-Donated-to-lafabrica.CaNonera-with-spanish-N-means-a-woman-of-Lanjaron.TThis-painting-may-be-aquired-at-La-Fabrica-in-Lanjaron-Spain.-Insert-hyperlink.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2019-the-fool-armelle-boussidan-81x65-1.jpg',
  ],
  'paintings/caminos-2017-2018': [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2017-Camino-al-nacimiento-A-Boussidan-57x79cm-NotAvailable-If-you-see-this-painting-please-get-in-touch-with-me.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2017-Camino-de-noche-A-Boussidan-71x76cm-NotAvailable-If-you-see-this-painting-please-get-in-touch-with-me-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2017Camino-del-silencio-A-Boussidan-NotAvailable-If-you-see-this-painting-please-get-in-touch-with-me.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2018-Camino-Rojo-A-Boussidan-60x53-NotAvailable-If-you-see-this-painting-please-get-in-touch-with-me.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2018-Renacimiento-57x77-A-Boussidan-NotAvailable-If-you-see-this-painting-please-get-in-touch-with-me.jpg',
  ],
  'paintings/2015-2017': [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-01-CharlieBleeding-acrylicpastels-1-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-01-CharlieBleeding-acrylicpastels-2-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-01-CharlieBleeding-acrylicpastels-3-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-archaicJolt_30x30_Pmod_2015_Armelle_Boussidan.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-backtobasics-Acrylic-on-tarpaulin-50x200-NA-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-EnteringLight_189x160_PhotoPG-unframed-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-HD-Auto-Emergence_80x80_Pmod_2015_Armelle_Boussidan-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-HD-ExperimentOnDynamicForms_50x50__Pmod_2015_Armelle_Boussidan-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-HD-SEcondExperimentOnDynamicForms-20x40_Pmod_2015_Armelle_Boussidan-NA-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-HD-Triptyque-HomeIsWhereYouGo-61x81_65x81_61x81_Pmod_2015_Armelle_Boussidan.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-incollabwith-Jerome-DuprélaTour_60x100-acrylicspastel-onHardboard-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-InCollabwith-JeromeDupréLatour-60x100-acrylicspastelsOnHardboard-orgasme-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-InCollabwith-JeromeDupréLaTour-DejaLoSacar_-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-MotherOfTheUniverse_116x73-photoPG-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-Passage-Diptych-73x100_73x54_photoDom-Copy.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-ThirdEyeOpening_240x160HM_photoPG-unframed.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-TimelessInnerGarden_40x40_Pmod_2015_Armelle_Boussidan.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-Tryptich-3X60x200-OrderAndDisorderInChaos-DancingThroughChaos-ChaosDancingWithin-Cosmos-1-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-alien-encounter-90x130PHotoDOM_dark-.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2015-HD-LhommeAuCondor_65x50_Pmod_2015_Armelle_Boussidan.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2016-Departure-73x92-Not-Available.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2016-HD-SpiritDimension_73x54__Pmod_2016_Armelle_Boussidan-NotAvailable.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2016-HD-DragonWaters_116x73__Pmod_2016_Armelle_Boussidan-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2016-Natem_40x40-Not-available.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2016-triptych-sol-del-corazon-3x81x130cm-1.png',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2016-TRiptychSoldelCorazon-Original1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2016-TRiptychSoldelCorazon-Original2.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2016-TRiptychSoldelCorazon-Original3.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2017-Raag-Bihag-Original-Painting-forthe-Album-Cover-for-Etienne-Bartholomew-painted-as-the-album-was-recorded.-Insert-Hyperlink..jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2017-Raag-Bihag-Album-Cover-for-Etienne-Bartholomew-painted-as-the-album-was-recorded.-Insert-Hyperlink..jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-JOY_160x130_PR.jpg',
  ],
  'paintings/2012-2014': [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-devils-dare_50x70-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-Freedom_of_speech_2012_120x120-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-Innocence_2012_50x70-NA-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-Ishtar_130x90-HD_LpF-OK-PAO-NA-2.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-primordia_40x33-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-Profil-130x100-2012-incollabwith-Mathieu_Devavry-NA-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-signs_90x110-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-terra_2012_80x80-NA-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-terre_d_eau_3x30x10-ClayInk.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2013-Chimères_PhotoPR_2013_60x72.5-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2013-You-can-fly-sousverre50X50_2013PR-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-80x80-Pompadour_PhotoPaulRoquecave-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-Ars_Galacticum_70x50-PGuigouPhoto.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-bluefire146x114.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-Efflorescence116x89_PhotoPRDSC8019-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-ELAN_150x50bonneversion-PGuigouPhoto-IMG_8312-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-facingtheautumnfire116x89PR.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-Fragments-africains-PaolaGuigouPhoto-ShreddedCanvas-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-hippomundus70x100PR-NA-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-In-depth_11x23.5_2014PR-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-inthesweetsightoftime146x89PR.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-JOY_160x130_PR.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-M33-1_89x130DSC8023-.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-meditation-under-a-tree-25x25-sous-verre-_2014PR-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-SANGUINE-100x100-_paolaGuigouHAUTE-DEF-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-transientLandscape146x89.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-triptyqueEnveloppeSolaire2014-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-Triptyque_enveloppe_solaire1_80x100-_DSC8016-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-Triptyque_enveloppe_solaire2_80x100-_DSC8014-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2014-Triptyque_enveloppe_solaire3_80x100-_DSC8012-NA.jpg',
  ],
  'paintings/endorphines-2012': [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-Endorphines_1_80x80-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-endorphines_2_80x80.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-endorphines_3_80x80.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-open_80x80-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-abyssal_lifeforms_80x80-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-Beyond_Light_80x80-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-Beyond_Darkness_80x80-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-Carbon_lifeforms_80x80.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2012-underwater_80x80-NA.jpg',
  ],
  'paintings/2011': [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-baku_marin_mineur_40x80.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-BAKUmajeur_40x80-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-Créatures_du_royaume_des_tortues_20x20-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-flower_2011_40x33-NA-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-green-visions20x25-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-in_mind_30x30-NA.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-Moais_50x50.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-prakriti_2011-50x50-2.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-spacejunk_2011_55x70.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/2011-vision_20x25.jpg',
  ],
  'paintings/people': [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/AichaMakeba-DesertStar-RasAbuGalum-Egypt.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Alexis-Baillis-with-Hippomundus-Colmar-FR.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Antony-Valenti-Cornwall-UK-with-SelfsustaingLights.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Don-Francisco-Blanc-Castan-Sabor-Desconocido-Sevilla-Spain.jpeg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Sebastien-Ferlay-Terra-Lyon.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Sebastien-Kahn-Enveloppes-Solaires-Paris.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/juju-emilien-portal.jpg',
  ],
  jewelry: [
    'https://armelleboussidan.com/wp-content/uploads/2022/03/SeedPIece-1024x1024.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/mycreations.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/withpeca.jpg',
  ],
  multimedia: [
    'https://armelleboussidan.com/wp-content/uploads/2022/03/1647788510190.webp',
  ],
  sketches: [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Watecolour-Posca-2019-693x1024.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Orarca.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Posca-energygridsAtalbeitar2021-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Posca-energygridsAtalbeitar2021-2-1.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Posca-energygridsAtalbeitar2021-3.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Posca-energygridsAtalbeitar2021-4.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Train-Giza-Luxor-2021-posca.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/sketch-thejunglewithin-2019-rt.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Watecolour-Posca-2019.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Watercolour-2017-Not-available-.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Watercolour-2017-2.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Watercolour-2017-3.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/Watercolour-2017.jpg',
  ],
  collectives: [
    'https://armelleboussidan.com/wp-content/uploads/2022/04/m33-1-modified.jpg',
    'https://armelleboussidan.com/wp-content/uploads/2022/04/lostroom.jpg',
  ],
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        return download(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      pipeline(res, file).then(resolve).catch(reject)
    }).on('error', reject)
  })
}

let total = 0
let done = 0
let failed = 0

for (const [category, urls] of Object.entries(images)) {
  total += urls.length
  const dir = path.join(BASE_DIR, category)
  mkdirSync(dir, { recursive: true })
}

console.log(`Downloading ${total} images...\n`)

for (const [category, urls] of Object.entries(images)) {
  const dir = path.join(BASE_DIR, category)
  for (const url of urls) {
    const filename = decodeURIComponent(path.basename(url))
    const dest = path.join(dir, filename)
    if (existsSync(dest)) {
      console.log(`  SKIP  ${category}/${filename}`)
      done++
      continue
    }
    try {
      await download(url, dest)
      done++
      console.log(`  OK    ${category}/${filename}`)
    } catch (err) {
      failed++
      console.error(`  FAIL  ${url} — ${err.message}`)
    }
  }
}

console.log(`\nDone: ${done - failed}/${total} downloaded, ${failed} failed.`)
console.log(`Images saved to: downloads/images/`)

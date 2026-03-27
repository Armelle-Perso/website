// Retries the 6 images that failed due to special characters in filenames
import { createWriteStream, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_DIR = path.resolve(__dirname, '..', 'downloads', 'images')

// Encoded URLs → local path (category/filename)
const missing = [
  ['https://armelleboussidan.com/wp-content/uploads/2022/04/ag%C3%BCita-16x16-aboussidan-2019.jpg',
   'paintings/cuadritos-2019/aguita-16x16-aboussidan-2019.jpg'],
  ['https://armelleboussidan.com/wp-content/uploads/2022/04/2015-incollabwith-Jerome-Dupr%C3%A9laTour_60x100-acrylicspastel-onHardboard-1.jpg',
   'paintings/2015-2017/2015-incollabwith-Jerome-DuprelaTour_60x100-acrylicspastel-onHardboard-1.jpg'],
  ['https://armelleboussidan.com/wp-content/uploads/2022/04/2015-InCollabwith-JeromeDupr%C3%A9Latour-60x100-acrylicspastelsOnHardboard-orgasme-1.jpg',
   'paintings/2015-2017/2015-InCollabwith-JeromeDupreLatour-60x100-acrylicspastelsOnHardboard-orgasme-1.jpg'],
  ['https://armelleboussidan.com/wp-content/uploads/2022/04/2015-InCollabwith-JeromeDupr%C3%A9LaTour-DejaLoSacar_-1.jpg',
   'paintings/2015-2017/2015-InCollabwith-JeromeDupreLaTour-DejaLoSacar_-1.jpg'],
  ['https://armelleboussidan.com/wp-content/uploads/2022/04/2013-Chim%C3%A8res_PhotoPR_2013_60x72.5-NA.jpg',
   'paintings/2012-2014/2013-Chimeres_PhotoPR_2013_60x72.5-NA.jpg'],
  ['https://armelleboussidan.com/wp-content/uploads/2022/04/2011-Cr%C3%A9atures_du_royaume_des_tortues_20x20-NA.jpg',
   'paintings/2011/2011-Creatures_du_royaume_des_tortues_20x20-NA.jpg'],
]

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
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      pipeline(res, file).then(resolve).catch(reject)
    }).on('error', reject)
  })
}

for (const [url, rel] of missing) {
  const dest = path.join(BASE_DIR, rel)
  mkdirSync(path.dirname(dest), { recursive: true })
  try {
    await download(url, dest)
    console.log(`OK    ${rel}`)
  } catch (err) {
    console.error(`FAIL  ${url} — ${err.message}`)
  }
}

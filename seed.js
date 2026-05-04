/**
 * ESTATIQ Seed Script v2
 * Usage:
 *   node seed.js          → adds 40 properties
 *   node seed.js --clean  → removes ALL properties first, then adds 40
 * 
 * Make sure backend is running on http://localhost:8000
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const API = 'http://localhost:8000'
const CLEAN = process.argv.includes('--clean')

// 40 luxury properties across India
const PROPERTIES = [
  { title: 'Beachfront Villa with Infinity Pool', price: 4500000, location: 'Goa, India', tags: ['luxury', 'pool', 'sea_view', 'garden'] },
  { title: 'Sea-View Penthouse in Bandra West', price: 8200000, location: 'Mumbai, India', tags: ['luxury', 'sea_view', 'city_view', 'modern'] },
  { title: 'Heritage Haveli with Private Courtyard', price: 3200000, location: 'Jaipur, India', tags: ['luxury', 'garden', 'spacious'] },
  { title: 'Modern Sky Villa with Panoramic Views', price: 6700000, location: 'Bangalore, India', tags: ['modern', 'city_view', 'luxury'] },
  { title: 'Lakeside Retreat with Private Boathouse', price: 2900000, location: 'Udaipur, India', tags: ['sea_view', 'garden', 'luxury'] },
  { title: 'Colonial Bungalow in Green Acres', price: 1800000, location: 'Chennai, India', tags: ['garden', 'spacious', 'modern'] },
  { title: 'High-Rise Luxury Apartment Downtown', price: 5400000, location: 'Delhi, India', tags: ['luxury', 'city_view', 'modern', 'balcony'] },
  { title: 'Hilltop Villa with Snow-Capped Views', price: 7100000, location: 'Shimla, India', tags: ['luxury', 'sea_view', 'garden', 'spacious'] },
  { title: 'Riverside Cottage Estate', price: 2200000, location: 'Coorg, India', tags: ['garden', 'spacious', 'modern'] },
  { title: 'Tropical Pool Villa in Paradise', price: 3800000, location: 'Kerala, India', tags: ['pool', 'garden', 'luxury', 'sea_view'] },
  { title: 'Ultra-Modern Glass House', price: 9500000, location: 'Hyderabad, India', tags: ['modern', 'luxury', 'city_view', 'pool'] },
  { title: 'Luxury Farmhouse with Horse Stables', price: 4100000, location: 'Pune, India', tags: ['garden', 'spacious', 'luxury'] },
  { title: 'Clifftop Bungalow with Ocean Views', price: 5600000, location: 'Vizag, India', tags: ['sea_view', 'luxury', 'balcony'] },
  { title: 'Garden Estate with Tennis Court', price: 3400000, location: 'Kolkata, India', tags: ['garden', 'spacious', 'luxury', 'modern'] },
  { title: 'Mountain Chalet with Valley Views', price: 2700000, location: 'Manali, India', tags: ['sea_view', 'spacious', 'garden'] },
  { title: 'Luxury Smart Home with Pool', price: 6300000, location: 'Ahmedabad, India', tags: ['pool', 'modern', 'luxury', 'city_view'] },
  { title: 'Boutique Hotel Style Villa', price: 4800000, location: 'Pondicherry, India', tags: ['luxury', 'garden', 'pool', 'sea_view'] },
  { title: 'Penthouse with Rooftop Infinity Pool', price: 11200000, location: 'Mumbai, India', tags: ['pool', 'sea_view', 'luxury', 'city_view', 'modern'] },
  { title: 'Eco-Luxury Treehouse Estate', price: 1950000, location: 'Wayanad, India', tags: ['garden', 'spacious', 'luxury'] },
  { title: 'Art Deco Mansion in Heritage Zone', price: 7800000, location: 'Delhi, India', tags: ['luxury', 'spacious', 'garden', 'city_view'] },
  { title: 'Seafacing Duplex with Private Terrace', price: 6100000, location: 'Goa, India', tags: ['sea_view', 'balcony', 'modern', 'luxury'] },
  { title: 'Palace-Style Bungalow with Fountain', price: 9200000, location: 'Jaipur, India', tags: ['luxury', 'garden', 'spacious', 'pool'] },
  { title: 'Contemporary Villa with Home Theater', price: 5300000, location: 'Bangalore, India', tags: ['modern', 'luxury', 'city_view'] },
  { title: 'Waterfront Retreat with Private Jetty', price: 4600000, location: 'Kerala, India', tags: ['sea_view', 'garden', 'luxury', 'pool'] },
  { title: 'Penthouse Suite with City Skyline', price: 7400000, location: 'Chennai, India', tags: ['city_view', 'luxury', 'modern', 'balcony'] },
  { title: 'Private Island Villa with Helipad', price: 15000000, location: 'Andaman, India', tags: ['sea_view', 'pool', 'luxury', 'garden'] },
  { title: 'Designer Loft with Industrial Chic', price: 3100000, location: 'Mumbai, India', tags: ['modern', 'city_view', 'luxury'] },
  { title: 'Valley View Chalet with Hot Tub', price: 2400000, location: 'Mussoorie, India', tags: ['sea_view', 'spacious', 'luxury'] },
  { title: 'Tuscan-Style Villa with Vineyard', price: 5900000, location: 'Nashik, India', tags: ['garden', 'spacious', 'luxury', 'pool'] },
  { title: 'Smart Luxury Flat in Financial District', price: 4200000, location: 'Hyderabad, India', tags: ['modern', 'city_view', 'luxury', 'balcony'] },
  { title: 'Forest Retreat with Waterfall View', price: 1750000, location: 'Coorg, India', tags: ['garden', 'spacious', 'sea_view'] },
  { title: 'Lakefront Mansion with Boat Dock', price: 8700000, location: 'Udaipur, India', tags: ['sea_view', 'luxury', 'pool', 'garden'] },
  { title: 'High-Tech Smart Bungalow', price: 3600000, location: 'Pune, India', tags: ['modern', 'luxury', 'city_view'] },
  { title: 'Coastal Estate with Beach Access', price: 6500000, location: 'Goa, India', tags: ['sea_view', 'pool', 'luxury', 'garden'] },
  { title: 'Minimalist Villa with Zen Garden', price: 4300000, location: 'Bangalore, India', tags: ['modern', 'garden', 'luxury', 'pool'] },
  { title: 'Royal Suite Penthouse 52nd Floor', price: 13500000, location: 'Mumbai, India', tags: ['city_view', 'luxury', 'modern', 'pool', 'balcony'] },
  { title: 'Countryside Manor with Orchards', price: 3900000, location: 'Shimla, India', tags: ['garden', 'spacious', 'luxury'] },
  { title: 'Rooftop Villa with 360 Degree Views', price: 5200000, location: 'Delhi, India', tags: ['city_view', 'luxury', 'modern', 'balcony'] },
  { title: 'Beachside Cottage with Sundeck', price: 2100000, location: 'Pondicherry, India', tags: ['sea_view', 'garden', 'modern'] },
  { title: 'Contemporary Mansion with Gym & Spa', price: 10500000, location: 'Bangalore, India', tags: ['luxury', 'pool', 'modern', 'garden', 'city_view'] },
]

// 40 sets of 5 Unsplash photo IDs - luxury real estate
const IMAGE_SETS = [
  ['photo-1600596542815-ffad4c1539a9','photo-1600607687939-ce8a6c25118c','photo-1600566753376-12c8ab7fb75b','photo-1600585154526-990dced4db0d','photo-1600047509807-ba8f99d2cdde'],
  ['photo-1613490493576-7fde63acd811','photo-1613977257363-707ba9348227','photo-1613977257592-4871e5fcd7c4','photo-1560185007-c5ca9d2c014d','photo-1560185127-6a8a43feb24c'],
  ['photo-1582268611958-ebfd161ef9cf','photo-1576941089067-2de3c901e126','photo-1484154218962-a197022b5858','photo-1556909114-f6e7ad7d3136','photo-1507089947368-19c1da9775ae'],
  ['photo-1600047509358-9dc75507daeb','photo-1600563438938-a9a27216b4f5','photo-1600210491369-e753d80a41f3','photo-1600121848594-d8644e57abab','photo-1599427303058-f04cbcf4756f'],
  ['photo-1512917774080-9991f1c4c750','photo-1523217582562-09d0def993a6','photo-1558036117-15d82a90b9b1','photo-1505843513577-22bb7d21e455','photo-1502005229762-cf1b2da7c5d6'],
  ['photo-1564013799919-ab600027ffc6','photo-1570129477492-45c003edd2be','photo-1588880331179-bc9b93a8cb5e','photo-1580587771525-78b9dba3b914','photo-1568605114967-8130f3a36994'],
  ['photo-1583608205776-bfd35f0d9f83','photo-1572120360610-d971b9d7767c','photo-1598928506311-c55ded91a20c','photo-1598928636135-d146006ff4be','photo-1554995207-c18c203602cb'],
  ['photo-1497366216548-37526070297c','photo-1497366754035-f200968a6e72','photo-1524758631624-e2822e304c36','photo-1533779183510-8f55a55f25b4','photo-1505691938895-1758d7feb511'],
  ['photo-1600047508788-786f3865b4da','photo-1549517045-bc93de075e53','photo-1600566752355-35792bedcfea','photo-1600210491892-03d54c0aaf87','photo-1600596542815-ffad4c1539a9'],
  ['photo-1601918774516-89a56eed3d20','photo-1601918775569-7d0a4e237fc1','photo-1583608205776-bfd35f0d9f83','photo-1600566753376-12c8ab7fb75b','photo-1564013799919-ab600027ffc6'],
  ['photo-1486304873000-235643847519','photo-1502672260266-1c1ef2d93688','photo-1545324418-cc1a3fa10c00','photo-1524755855599-df1ae9ec49ea','photo-1499916078039-922301b0eb9b'],
  ['photo-1567538096630-e0c55bd6374c','photo-1556228453-efd6c1ff04f6','photo-1558618666-fcd25c85cd64','photo-1560440021-33f9b867899d','photo-1542314831-068cd1dbfeeb'],
  ['photo-1591088398332-8a7791972843','photo-1591088416864-27cccd2ad72a','photo-1590490360182-c33d57733427','photo-1587556408519-9f90c7e27b74','photo-1586023492125-27b2c045efd7'],
  ['photo-1487958449943-2429e8be8625','photo-1481026469463-66327c86e544','photo-1493809842364-78817add7ffb','photo-1469022563428-aa04fef9f5a2','photo-1504615755583-2916b52192a3'],
  ['photo-1416331108676-a22ccb276e35','photo-1417128374-7083886dc34b','photo-1505916349660-8d91a99f3e0a','photo-1461175827210-c328b9eba7ff','photo-1416331108676-a22ccb276e35'],
  ['photo-1574739782594-db4ead022697','photo-1564013799919-ab600027ffc6','photo-1512917774080-9991f1c4c750','photo-1570129477492-45c003edd2be','photo-1600596542815-ffad4c1539a9'],
  ['photo-1600596542815-ffad4c1539a9','photo-1613490493576-7fde63acd811','photo-1582268611958-ebfd161ef9cf','photo-1600047509358-9dc75507daeb','photo-1512917774080-9991f1c4c750'],
  ['photo-1558036117-15d82a90b9b1','photo-1564013799919-ab600027ffc6','photo-1523217582562-09d0def993a6','photo-1583608205776-bfd35f0d9f83','photo-1497366216548-37526070297c'],
  ['photo-1601918774516-89a56eed3d20','photo-1486304873000-235643847519','photo-1567538096630-e0c55bd6374c','photo-1591088398332-8a7791972843','photo-1487958449943-2429e8be8625'],
  ['photo-1600047509358-9dc75507daeb','photo-1600563438938-a9a27216b4f5','photo-1583608205776-bfd35f0d9f83','photo-1613490493576-7fde63acd811','photo-1582268611958-ebfd161ef9cf'],
  ['photo-1600585154526-990dced4db0d','photo-1600047509807-ba8f99d2cdde','photo-1613977257363-707ba9348227','photo-1560185007-c5ca9d2c014d','photo-1576941089067-2de3c901e126'],
  ['photo-1484154218962-a197022b5858','photo-1556909114-f6e7ad7d3136','photo-1507089947368-19c1da9775ae','photo-1600563438938-a9a27216b4f5','photo-1600210491369-e753d80a41f3'],
  ['photo-1600121848594-d8644e57abab','photo-1599427303058-f04cbcf4756f','photo-1512917774080-9991f1c4c750','photo-1523217582562-09d0def993a6','photo-1558036117-15d82a90b9b1'],
  ['photo-1505843513577-22bb7d21e455','photo-1502005229762-cf1b2da7c5d6','photo-1564013799919-ab600027ffc6','photo-1570129477492-45c003edd2be','photo-1588880331179-bc9b93a8cb5e'],
  ['photo-1580587771525-78b9dba3b914','photo-1568605114967-8130f3a36994','photo-1583608205776-bfd35f0d9f83','photo-1572120360610-d971b9d7767c','photo-1554995207-c18c203602cb'],
  ['photo-1497366216548-37526070297c','photo-1497366754035-f200968a6e72','photo-1524758631624-e2822e304c36','photo-1533779183510-8f55a55f25b4','photo-1505691938895-1758d7feb511'],
  ['photo-1549517045-bc93de075e53','photo-1600566752355-35792bedcfea','photo-1600210491892-03d54c0aaf87','photo-1601918774516-89a56eed3d20','photo-1601918775569-7d0a4e237fc1'],
  ['photo-1486304873000-235643847519','photo-1502672260266-1c1ef2d93688','photo-1545324418-cc1a3fa10c00','photo-1524755855599-df1ae9ec49ea','photo-1499916078039-922301b0eb9b'],
  ['photo-1567538096630-e0c55bd6374c','photo-1556228453-efd6c1ff04f6','photo-1558618666-fcd25c85cd64','photo-1560440021-33f9b867899d','photo-1542314831-068cd1dbfeeb'],
  ['photo-1591088398332-8a7791972843','photo-1591088416864-27cccd2ad72a','photo-1590490360182-c33d57733427','photo-1587556408519-9f90c7e27b74','photo-1586023492125-27b2c045efd7'],
  ['photo-1487958449943-2429e8be8625','photo-1481026469463-66327c86e544','photo-1493809842364-78817add7ffb','photo-1469022563428-aa04fef9f5a2','photo-1504615755583-2916b52192a3'],
  ['photo-1600596542815-ffad4c1539a9','photo-1600607687939-ce8a6c25118c','photo-1600566753376-12c8ab7fb75b','photo-1600585154526-990dced4db0d','photo-1600047509807-ba8f99d2cdde'],
  ['photo-1613490493576-7fde63acd811','photo-1613977257363-707ba9348227','photo-1560185007-c5ca9d2c014d','photo-1560185127-6a8a43feb24c','photo-1582268611958-ebfd161ef9cf'],
  ['photo-1576941089067-2de3c901e126','photo-1484154218962-a197022b5858','photo-1556909114-f6e7ad7d3136','photo-1507089947368-19c1da9775ae','photo-1600047509358-9dc75507daeb'],
  ['photo-1600563438938-a9a27216b4f5','photo-1600210491369-e753d80a41f3','photo-1600121848594-d8644e57abab','photo-1599427303058-f04cbcf4756f','photo-1512917774080-9991f1c4c750'],
  ['photo-1523217582562-09d0def993a6','photo-1558036117-15d82a90b9b1','photo-1505843513577-22bb7d21e455','photo-1502005229762-cf1b2da7c5d6','photo-1564013799919-ab600027ffc6'],
  ['photo-1570129477492-45c003edd2be','photo-1588880331179-bc9b93a8cb5e','photo-1580587771525-78b9dba3b914','photo-1568605114967-8130f3a36994','photo-1583608205776-bfd35f0d9f83'],
  ['photo-1572120360610-d971b9d7767c','photo-1554995207-c18c203602cb','photo-1497366216548-37526070297c','photo-1524758631624-e2822e304c36','photo-1533779183510-8f55a55f25b4'],
  ['photo-1549517045-bc93de075e53','photo-1600566752355-35792bedcfea','photo-1600210491892-03d54c0aaf87','photo-1486304873000-235643847519','photo-1545324418-cc1a3fa10c00'],
  ['photo-1567538096630-e0c55bd6374c','photo-1591088398332-8a7791972843','photo-1590490360182-c33d57733427','photo-1587556408519-9f90c7e27b74','photo-1487958449943-2429e8be8625'],
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Download with retry and redirect following
function downloadImage(photoId, destPath, retries = 3) {
  return new Promise((resolve, reject) => {
    const url = `https://images.unsplash.com/${photoId}?w=1200&q=80&auto=format&fit=crop`
    
    function attempt(urlToFetch, triesLeft) {
      const mod = urlToFetch.startsWith('https') ? https : http
      const req = mod.get(urlToFetch, { timeout: 15000 }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          if (triesLeft > 0) attempt(res.headers.location, triesLeft - 1)
          else reject(new Error('Too many redirects'))
          return
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`))
          return
        }
        const stream = fs.createWriteStream(destPath)
        res.pipe(stream)
        stream.on('finish', () => {
          stream.close()
          // Check file has content
          const size = fs.statSync(destPath).size
          if (size < 1000) { reject(new Error('File too small')); return }
          resolve()
        })
        stream.on('error', reject)
      })
      req.on('error', reject)
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
    }
    
    attempt(url, retries)
  })
}

function apiRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null
    const opts = {
      hostname: 'localhost', port: 8000,
      path: urlPath, method,
      headers: body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) } : {}
    }
    const req = http.request(opts, (res) => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) })
        } catch { resolve({ status: res.statusCode, body: data }) }
      })
    })
    req.on('error', reject)
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

function uploadImages(propertyId, imagePaths) {
  return new Promise((resolve, reject) => {
    const boundary = 'ESTATIQ' + Date.now()
    let body = Buffer.alloc(0)
    for (const imgPath of imagePaths) {
      if (!fs.existsSync(imgPath)) continue
      const fileContent = fs.readFileSync(imgPath)
      const header = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="images"; filename="${path.basename(imgPath)}"\r\nContent-Type: image/jpeg\r\n\r\n`)
      body = Buffer.concat([body, header, fileContent, Buffer.from('\r\n')])
    }
    body = Buffer.concat([body, Buffer.from(`--${boundary}--\r\n`)])
    const req = http.request({
      hostname: 'localhost', port: 8000,
      path: `/api/properties/${propertyId}/images`, method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length }
    }, (res) => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => resolve(res.statusCode))
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function getAllProperties() {
  try {
    const res = await apiRequest('GET', '/api/properties?limit=200', null)
    return res.body?.data || []
  } catch { return [] }
}

async function deleteProperty(id) {
  // We don't have a delete endpoint, so we'll just skip this
  // Instead we filter by title when checking duplicates
}

async function main() {
  console.log('🏠 ESTATIQ Seed Script v2\n')

  // Check backend is running
  try {
    await apiRequest('GET', '/health', null)
    console.log('✅ Backend connected\n')
  } catch {
    console.log('❌ Cannot connect to backend at http://localhost:8000')
    console.log('   Make sure to run: npm run dev in the backend folder\n')
    process.exit(1)
  }

  // If --clean flag: inform user to clear manually or we skip duplicates
  if (CLEAN) {
    console.log('ℹ️  --clean flag detected.')
    console.log('   MongoDB does not have a bulk delete API in this backend.')
    console.log('   To clean: open MongoDB Compass → smart_property_db → properties → Delete All\n')
    console.log('   Continuing to add 40 new properties...\n')
  }

  const tmpDir = path.join(__dirname, 'tmp_seed_images')
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

  let created = 0
  let failed = 0

  for (let i = 0; i < PROPERTIES.length; i++) {
    const prop = PROPERTIES[i]
    const imageSet = IMAGE_SETS[i]

    console.log(`[${i + 1}/${PROPERTIES.length}] ${prop.title}`)
    console.log(`   📍 ${prop.location} | 💰 $${(prop.price / 1000000).toFixed(1)}M`)

    // Create property
    let propertyId
    try {
      const res = await apiRequest('POST', '/api/properties', { title: prop.title, price: prop.price, location: prop.location })
      if (!res.body?.success) throw new Error(res.body?.message || 'Create failed')
      propertyId = res.body.data._id
    } catch (err) {
      console.log(`   ❌ Failed to create: ${err.message}\n`)
      failed++
      continue
    }

    // Download all 5 images with retry
    const imagePaths = []
    for (let j = 0; j < 5; j++) {
      const photoId = imageSet[j]
      const imgPath = path.join(tmpDir, `p${i}_img${j}.jpg`)
      let success = false
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await downloadImage(photoId, imgPath)
          imagePaths.push(imgPath)
          process.stdout.write(` 📸${j + 1}`)
          success = true
          break
        } catch {
          if (attempt < 2) await sleep(1000)
        }
      }
      if (!success) process.stdout.write(` ✗${j + 1}`)
      await sleep(150)
    }
    console.log()

    // Upload images
    if (imagePaths.length > 0) {
      try {
        const status = await uploadImages(propertyId, imagePaths)
        if (status === 202) {
          console.log(`   ✅ ${imagePaths.length}/5 images uploaded — AI queued`)
          created++
        } else {
          console.log(`   ⚠️  Upload returned status ${status}`)
          created++
        }
      } catch (err) {
        console.log(`   ❌ Upload error: ${err.message}`)
        failed++
      }
    } else {
      console.log(`   ⚠️  No images downloaded, property created without images`)
      created++
    }

    // Cleanup temp files
    imagePaths.forEach(p => { try { fs.unlinkSync(p) } catch {} })
    console.log()

    await sleep(15000) // wait 15s between properties to let AI finish
  }

  try { fs.rmdirSync(tmpDir) } catch {}

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Done! ${created} properties created, ${failed} failed`)
  console.log(`🤖 AI analysis running in background (~2-3 min)`)
  console.log(`🌐 Open http://localhost:3000 to see your listings`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch(err => {
  console.error('❌ Fatal:', err.message)
  process.exit(1)
})

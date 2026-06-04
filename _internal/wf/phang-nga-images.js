export const meta = {
  name: 'phang-nga-images',
  description: 'Download real licensed images for Phang Nga: city hero + 38 article heroes',
  phases: [ { title: 'Cities', detail: 'city hero' }, { title: 'Articles', detail: 'one hero per article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น อ่าวพังงา เขาตะปู สิมิลัน เขาหลัก เกาะยาว ตะกั่วป่า) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มไม่ทราบสิทธิ์
- รูปต้อง "เกี่ยวกับพังงา/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch → WebFetch หา URL ไฟล์ตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลด **curl -m 60 --connect-timeout 20 -L -o <path> <url>** (ห้าม curl ไม่มี -m) · ถ้า upload.wikimedia.org ตอบ 429 ให้ใช้ endpoint แบบ Special:FilePath/<file>?width=1600 พร้อม -A "Mozilla/5.0" แทน
- บันทึก .jpg แม้ต้นฉบับ webp/png · ตรวจ > 15KB (ls -l) · ถ้าเล็ก/พัง ลองแหล่งอื่น **ไม่เกิน 3 แหล่ง** แล้วรายงาน SKIPPED (ห้าม retry วน)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของพังงา (อ่าวพังงา/เขาตะปู เกาะเจมส์บอนด์ หรือ สิมิลัน/เสม็ดนางชี) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/phang-nga.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:phang-nga', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'phang-nga-food-guide','phang-nga-seafood','phang-nga-hokkien-mee','phang-nga-southern-food',
  'phang-nga-khanom-jeen','khao-lak-restaurants','takua-pa-old-town-food','phang-nga-cafe-guide',
  'koh-yao-food','phang-nga-mookata-buffet','phang-nga-local-breakfast','phang-nga-dessert-souvenir',
  'phang-nga-attractions','phang-nga-bay-james-bond','similan-islands-guide','surin-islands-guide',
  'khao-lak-guide','koh-yao-noi-guide','koh-yao-yai-guide','takua-pa-old-town-guide',
  'wat-tham-suwan-kuha','phang-nga-waterfalls','samet-nangshe-viewpoint','phang-nga-sea-canoe',
  'phang-nga-1-day-itinerary','phang-nga-2d1n-itinerary','phang-nga-3d2n-itinerary','phang-nga-diving-plan',
  'koh-yao-island-plan','takua-pa-khao-lak-plan','phang-nga-photo-spots-plan','phang-nga-bay-canoe-plan',
  'phang-nga-phuket-plan','phang-nga-krabi-plan','phang-nga-family-plan','phang-nga-first-timer-guide',
  'phang-nga-travel-tips','phang-nga-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นพังงา"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: สถานที่เฉพาะ (อ่าวพังงา/เขาตะปู/สิมิลัน/สุรินทร์/เขาหลัก/เกาะยาว/ตะกั่วป่า/เสม็ดนางชี/วัดถ้ำสุวรรณคูหา) ใช้ Wikimedia Commons ของจริง · อาหาร/คาเฟ่/แผน/เตรียมตัว ใช้ Unsplash/Pexels รูปบรรยากาศทะเลอันดามัน-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (หาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

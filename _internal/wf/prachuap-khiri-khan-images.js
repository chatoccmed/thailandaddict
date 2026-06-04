export const meta = {
  name: 'prachuap-khiri-khan-images',
  description: 'Download real licensed images for Prachuap Khiri Khan (Hua Hin): city hero + 38 article heroes',
  phases: [ { title: 'Cities', detail: 'city hero' }, { title: 'Articles', detail: 'one hero per article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น สถานีรถไฟหัวหิน เขาตะเกียบ เขาสามร้อยยอด ถ้ำพระยานคร อ่าวประจวบสามอ่าว) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มไม่ทราบสิทธิ์
- รูปต้อง "เกี่ยวกับประจวบ/หัวหิน/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch → WebFetch หา URL ไฟล์ตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลด **curl -m 60 --connect-timeout 20 -L -o <path> <url>** (ห้าม curl ไม่มี -m)
- บันทึก .jpg แม้ต้นฉบับ webp/png · ตรวจ > 15KB (ls -l) · ถ้าเล็ก/พัง ลองแหล่งอื่น **ไม่เกิน 3 แหล่ง** แล้วรายงาน SKIPPED (ห้าม retry วน)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของหัวหิน/ประจวบ (สถานีรถไฟหัวหิน หรือ อ่าวประจวบสามอ่าว/เขาสามร้อยยอด/หาดหัวหิน) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/prachuap-khiri-khan.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:prachuap', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'prachuap-food-guide','hua-hin-seafood','prachuap-pla-tu','hua-hin-night-market',
  'hua-hin-cafe-guide','hua-hin-restaurants','prachuap-pineapple-souvenir','hua-hin-beach-clubs',
  'prachuap-mookata-buffet','hua-hin-dessert-cafe','prachuap-town-food','hua-hin-local-breakfast',
  'prachuap-attractions','hua-hin-beach-guide','hua-hin-railway-station','khao-takiab-guide',
  'khao-sam-roi-yot-guide','phraya-nakhon-cave-guide','prachuap-saam-ao-guide','wat-khao-chong-krachok',
  'ban-krut-bang-saphan-guide','rajabhakti-park-guide','hua-hin-art-markets','hua-hin-vineyard-guide',
  'prachuap-1-day-itinerary','prachuap-2d1n-itinerary','prachuap-3d2n-itinerary','hua-hin-cafe-beach-plan',
  'khao-sam-roi-yot-plan','hua-hin-family-plan','prachuap-photo-spots-plan','ban-krut-bang-saphan-plan',
  'hua-hin-phetchaburi-plan','prachuap-chumphon-plan','hua-hin-weekend-getaway','prachuap-first-timer-guide',
  'prachuap-travel-tips','prachuap-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นประจวบ/หัวหิน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: สถานที่เฉพาะ (สถานีรถไฟหัวหิน/เขาตะเกียบ/เขาสามร้อยยอด/ถ้ำพระยานคร/สามอ่าว/วัดเขาช่องกระจก) ใช้ Wikimedia Commons ของจริง · อาหาร/คาเฟ่/แผน/เตรียมตัว ใช้ Unsplash/Pexels รูปบรรยากาศทะเล-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (หาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

export const meta = {
  name: 'nan-images',
  description: 'Download real licensed images for Nan: city hero + 38 article heroes',
  phases: [ { title: 'Cities', detail: 'city hero' }, { title: 'Articles', detail: 'one hero per article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น วัดภูมินทร์ วัดพระธาตุแช่แห้ง ดอยภูคา ดอยเสมอดาว บ่อเกลือ ปัว) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มไม่ทราบสิทธิ์
- รูปต้อง "เกี่ยวกับน่าน/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch → WebFetch หา URL ไฟล์ตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลด **curl -m 60 --connect-timeout 20 -L -o <path> <url>** (ห้าม curl ไม่มี -m) · ถ้า upload.wikimedia.org ตอบ 429 ใช้ endpoint Special:FilePath/<file>?width=1600 พร้อม -A "Mozilla/5.0" แทน
- บันทึก .jpg แม้ต้นฉบับ webp/png · ตรวจ > 15KB (ls -l) · ถ้าเล็ก/พัง ลองแหล่งอื่น **ไม่เกิน 3 แหล่ง** แล้วรายงาน SKIPPED (ห้าม retry วน)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของน่าน (วัดภูมินทร์ หรือ ทุ่งนาปัว/ดอยภูคา/ทะเลหมอกดอยเสมอดาว) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/nan.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:nan', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'nan-food-guide','nan-northern-cuisine','nan-khao-soi','nan-cafe-guide',
  'pua-cafe-rice-fields','nan-tai-lue-food','nan-local-breakfast','nan-souvenir-makfaichin',
  'nan-street-night-market','nan-mookata-buffet','nan-dessert-cafe','nan-local-restaurants',
  'nan-attractions','wat-phumin-guide','wat-phrathat-chae-haeng','nan-national-museum',
  'doi-phu-kha-national-park','doi-samer-dao-guide','bo-kluea-guide','pua-tai-lue-guide',
  'road-1256-skyroad','sao-din-na-noi','nan-old-town-walk','nan-viewpoints-mist',
  'nan-1-day-itinerary','nan-2d1n-itinerary','nan-3d2n-itinerary','nan-cafe-old-town-plan',
  'nan-nature-plan','nan-skyroad-1256-plan','nan-photo-spots-plan','nan-temples-culture-plan',
  'nan-phayao-plan','nan-phrae-plan','nan-family-plan','nan-first-timer-guide',
  'nan-travel-tips','nan-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นน่าน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: สถานที่เฉพาะ (วัดภูมินทร์/พระธาตุแช่แห้ง/ดอยภูคา/ดอยเสมอดาว/บ่อเกลือ/ปัว/ถนนลอยฟ้า/เสาดินนาน้อย) ใช้ Wikimedia Commons ของจริง · อาหาร/คาเฟ่/แผน/เตรียมตัว ใช้ Unsplash/Pexels รูปบรรยากาศเหนือ-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (หาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

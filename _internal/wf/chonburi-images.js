export const meta = {
  name: 'chonburi-images',
  description: 'Download real licensed images for Chonburi: city hero + 38 article heroes',
  phases: [ { title: 'Cities', detail: 'city hero' }, { title: 'Articles', detail: 'one hero per article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น หาดพัทยา บางแสน เกาะล้าน ปราสาทสัจธรรม สวนนงนุช วัดเขาชีจรรย์) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มไม่ทราบสิทธิ์
- รูปต้อง "เกี่ยวกับชลบุรี/พัทยา/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch → WebFetch หา URL ไฟล์ตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลด **curl -m 60 --connect-timeout 20 -L -o <path> <url>** (ห้าม curl ไม่มี -m)
- บันทึก .jpg แม้ต้นฉบับ webp/png · ตรวจ > 15KB (ls -l) · ถ้าเล็ก/พัง ลองแหล่งอื่น **ไม่เกิน 3 แหล่ง** แล้วรายงาน SKIPPED (ห้าม retry วน)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของชลบุรี/พัทยา (หาดพัทยาจากจุดชมวิว หรือ เกาะล้าน/บางแสน/ปราสาทสัจธรรม) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/chonburi.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:chonburi', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'chonburi-food-guide','chonburi-seafood','sriracha-japanese-food','nong-mon-market-guide',
  'pattaya-restaurants','chonburi-cafe-guide','chonburi-mookata-buffet','pattaya-international-food',
  'chonburi-street-food','bangsaen-beach-eats','pattaya-beach-clubs','chonburi-dessert-cafe',
  'chonburi-attractions','pattaya-beach-guide','bangsaen-beach-guide','koh-larn-guide',
  'sanctuary-of-truth-guide','nong-nooch-garden-guide','khao-chi-chan-guide','pattaya-viewpoint-guide',
  'khao-sam-muk-guide','sriracha-guide','pattaya-floating-market','sattahip-beaches-guide',
  'chonburi-1-day-itinerary','chonburi-2d1n-itinerary','chonburi-3d2n-itinerary','chonburi-sea-island-plan',
  'chonburi-food-trip-plan','pattaya-sightseeing-plan','chonburi-cafe-plan','chonburi-photo-spots-plan',
  'bangkok-chonburi-day-trip','chonburi-rayong-plan','chonburi-family-plan','chonburi-first-timer-guide',
  'chonburi-travel-tips','chonburi-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นชลบุรี/พัทยา"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: สถานที่เฉพาะ (หาดพัทยา/บางแสน/เกาะล้าน/ปราสาทสัจธรรม/สวนนงนุช/เขาชีจรรย์/เขาสามมุก) ใช้ Wikimedia Commons ของจริง · อาหาร/คาเฟ่/แผน/เตรียมตัว ใช้ Unsplash/Pexels รูปบรรยากาศทะเล-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (หาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

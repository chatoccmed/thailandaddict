export const meta = {
  name: 'kanchanaburi-images',
  description: 'Download real licensed images for Kanchanaburi: city hero + 38 article heroes',
  phases: [ { title: 'Cities', detail: 'city hero' }, { title: 'Articles', detail: 'one hero per article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น สะพานข้ามแม่น้ำแคว ทางรถไฟสายมรณะ น้ำตกเอราวัณ สะพานมอญสังขละบุรี สุสานทหาร) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มไม่ทราบสิทธิ์
- รูปต้อง "เกี่ยวกับกาญจนบุรี/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch → WebFetch หา URL ไฟล์ตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลด **curl -m 60 --connect-timeout 20 -L -o <path> <url>** (ห้าม curl ไม่มี -m)
- บันทึก .jpg แม้ต้นฉบับ webp/png · ตรวจ > 15KB (ls -l) · ถ้าเล็ก/พัง ลองแหล่งอื่น **ไม่เกิน 3 แหล่ง** แล้วรายงาน SKIPPED (ห้าม retry วน)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของกาญจนบุรี (สะพานข้ามแม่น้ำแคว หรือ น้ำตกเอราวัณ/ทางรถไฟสายมรณะ/สะพานมอญ) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/kanchanaburi.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:kanchanaburi', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'kanchanaburi-food-guide','kanchanaburi-river-fish','kanchanaburi-riverside-restaurants','kanchanaburi-isan-somtam',
  'kanchanaburi-cafe-guide','kanchanaburi-mookata-buffet','sangkhlaburi-mon-food','kanchanaburi-street-food',
  'kanchanaburi-dessert-souvenir','kanchanaburi-local-restaurants','kanchanaburi-local-breakfast','erawan-route-eats',
  'kanchanaburi-attractions','bridge-river-kwai-guide','death-railway-tham-krasae','erawan-waterfall-guide',
  'sai-yok-national-park','srinakarin-dam-guide','sangkhlaburi-mon-bridge','allied-war-cemetery-museum',
  'prasat-muang-sing','kanchanaburi-raft-houses','hellfire-pass-guide','kanchanaburi-caves-hotsprings',
  'kanchanaburi-1-day-itinerary','kanchanaburi-2d1n-itinerary','kanchanaburi-3d2n-itinerary','kanchanaburi-nature-plan',
  'kanchanaburi-history-plan','sangkhlaburi-plan','kanchanaburi-cafe-raft-plan','kanchanaburi-photo-spots-plan',
  'nakhon-pathom-kanchanaburi-day-trip','kanchanaburi-ratchaburi-plan','kanchanaburi-family-plan','kanchanaburi-first-timer-guide',
  'kanchanaburi-travel-tips','kanchanaburi-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นกาญจนบุรี"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: สถานที่เฉพาะ (สะพานข้ามแม่น้ำแคว/สายมรณะ/ถ้ำกระแซ/น้ำตกเอราวัณ/ไทรโยค/สะพานมอญ/สุสานทหาร/ปราสาทเมืองสิงห์) ใช้ Wikimedia Commons ของจริง · อาหาร/คาเฟ่/แผน/เตรียมตัว ใช้ Unsplash/Pexels รูปบรรยากาศแม่น้ำ-ป่า-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (หาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

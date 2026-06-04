export const meta = {
  name: 'phuket-images-recover',
  description: 'Recover the 19 Phuket article images that the first images run left missing (Wikimedia/Unsplash/Pexels)',
  phases: [ { title: 'Articles', detail: 'one hero image per missing Phuket article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น เกาะพีพี อ่าวพังงา หาดในหาน) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับภูเก็ต/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl (ตั้ง timeout เช่น curl -m 60)
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจว่าไฟล์ > 15KB (ls -l). ถ้าเล็ก/พัง ลองแหล่งอื่นจนได้ แต่ไม่ต้องลองเกิน 3 แหล่ง — ถ้าไม่ได้จริง ๆ ให้ข้ามและรายงาน
`

phase('Articles')
const ARTICLES = [
  'phi-phi-island-tour','phang-nga-bay-tour','phuket-beaches-guide','phuket-viewpoints',
  'phuket-island-hopping-guide','phuket-1-day-itinerary','phuket-2d1n-itinerary','phuket-3d2n-itinerary',
  'phuket-old-town-cafe-plan','phuket-beach-plan','phuket-island-hopping-plan','phuket-photo-spots-plan',
  'phuket-family-plan','phuket-krabi-plan','phuket-phang-nga-plan','phuket-budget-plan',
  'phuket-first-timer-guide','phuket-travel-tips','phuket-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นภูเก็ต"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (เกาะพีพี/อ่าวพังงา/หาด/จุดชมวิว) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นแผนเที่ยว/เตรียมตัว/ครอบครัว ใช้ Unsplash/Pexels รูปบรรยากาศภูเก็ต-ทะเลไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (ถ้าหาไม่ได้ บอกว่า SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Recovered images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

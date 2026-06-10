export const meta = {
  name: 'khon-kaen-images-recover',
  description: 'Recover 3 Khon Kaen article images missing/undersized from the first images workflow',
  phases: [ { title: 'Articles', detail: 'wat-thung-setthi, khon-kaen-getting-around, khon-kaen-maha-sarakham-plan' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มที่ไม่ทราบสิทธิ์
- รูปแนวนอน คุณภาพดี เกี่ยวกับขอนแก่น/อีสาน/หัวข้อนั้นจริง
- WebSearch → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ · ถ้า WebFetch ค้าง ข้าม
- บันทึกเป็น .jpg · ตรวจไฟล์ > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น รวมไม่เกิน 3 แหล่ง ถ้ายังไม่ได้รายงาน SKIPPED (ห้าม retry วน)
`

phase('Articles')
const ITEMS = [
  ['wat-thung-setthi','วัดทุ่งเศรษฐี ขอนแก่น เจดีย์ขาวกลางทุ่ง — ใช้ Wikimedia Commons ของจริง'],
  ['khon-kaen-getting-around','การเดินทางในขอนแก่น — รูปสนามบินขอนแก่น/รถสองแถว/ถนนในเมือง หรือ Unsplash/Pexels รูปการเดินทาง/ถนนไทยที่เหมาะ'],
  ['khon-kaen-maha-sarakham-plan','แผนข้ามจังหวัด ขอนแก่น-มหาสารคาม — รูปพระธาตุนาดูน/เมืองตักสิลามหาสารคาม (Wikimedia) หรือ Unsplash/Pexels บรรยากาศอีสานที่เหมาะ'],
]
const res = await parallel(ITEMS.map(([slug,hint]) => () =>
  agent(`หารูปจริงสำหรับบทความ astro/src/content/articles/${slug}.json (อ่าน h1/title ก่อน) — ${hint}
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน · เขียนทับของเดิมได้)
${DLRULES}
รายงานสั้น ๆ: แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Recovered images: ${ok}/${ITEMS.length}`)
return { total: ITEMS.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

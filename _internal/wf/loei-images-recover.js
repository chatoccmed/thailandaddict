export const meta = {
  name: 'loei-images-recover',
  description: 'Recover the 12 missing/undersized Loei article hero images (Wikimedia/Unsplash/Pexels)',
  phases: [
    { title: 'Recover', detail: 'one image agent per missing Loei article slug' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น ภูกระดึง เชียงคาน ภูเรือ วัดเนรมิตวิปัสสนา สวนหินผางาม พระธาตุศรีสองรัก ผีตาโขน) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศภูเขา/แม่น้ำโขง/แผนเที่ยวทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเลย/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('Recover')
const ARTICLES = [
  'wat-neramit-wipassana','suan-hin-pha-ngam','phu-kradueng-trek-plan','phu-ruea-phu-thok-nature-plan',
  'chiang-khan-cafe-plan','loei-dan-sai-culture-plan','loei-phetchabun-mountain-plan','loei-udon-thani-mekong-plan',
  'loei-family-plan','loei-first-timer-guide','loei-travel-tips','loei-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเลย/เชียงคาน/ภูเขา/แม่น้ำโขง"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (วัดเนรมิตวิปัสสนา/สวนหินผางาม/ภูกระดึง/ภูเรือ/ภูทอก/ผีตาโขน/ด่านซ้าย) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นแผนเที่ยว/คาเฟ่/ครอบครัว/เตรียมตัว/การเดินทาง ใช้ Unsplash/Pexels รูปภูเขาเลย/แม่น้ำโขง/คาเฟ่/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Recover' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Recovered images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

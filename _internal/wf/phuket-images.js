export const meta = {
  name: 'phuket-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Phuket: city hero + 38 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero banner' },
    { title: 'Articles', detail: 'one hero image per Phuket article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น เมืองเก่าภูเก็ต พระใหญ่ วัดฉลอง แหลมพรหมเทพ หาดป่าตอง) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับภูเก็ต/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (เช่น upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่นจนได้
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของภูเก็ต (หาดทรายขาว/ทะเลอันดามัน หรือ เมืองเก่าชิโน-โปรตุกีส หรือ พระใหญ่วิวทะเล) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/phuket.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:phuket', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'phuket-food-guide','phuket-hokkien-mee','phuket-old-town-cafe','phuket-seafood',
  'phuket-southern-food','phuket-dim-sum-breakfast','phuket-roti-tea','phuket-michelin-fine-dining',
  'phuket-mookata-buffet','phuket-local-sweets','phuket-street-food-markets','phuket-beach-bars-dining',
  'phuket-attractions','phuket-old-town-guide','patong-beach-guide','kata-karon-beach-guide',
  'big-buddha-phuket-guide','promthep-cape-guide','wat-chalong-guide','phi-phi-island-tour',
  'phang-nga-bay-tour','phuket-beaches-guide','phuket-viewpoints','phuket-island-hopping-guide',
  'phuket-1-day-itinerary','phuket-2d1n-itinerary','phuket-3d2n-itinerary','phuket-old-town-cafe-plan',
  'phuket-beach-plan','phuket-island-hopping-plan','phuket-photo-spots-plan','phuket-family-plan',
  'phuket-krabi-plan','phuket-phang-nga-plan','phuket-budget-plan','phuket-first-timer-guide',
  'phuket-travel-tips','phuket-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นภูเก็ต"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (เมืองเก่าภูเก็ต/หาดป่าตอง/กะตะ-กะรน/พระใหญ่/แหลมพรหมเทพ/วัดฉลอง/เกาะพีพี/อ่าวพังงา) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศภูเก็ต-ทะเลไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

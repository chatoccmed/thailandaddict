export const meta = {
  name: 'fix-en-thai',
  description: 'Fix residual Thai text in already-translated EN hotel reviews — translate/romanize every Thai field to native English, structure preserved',
  phases: [
    { title: 'Fix', detail: 'one agent per review → overwrite astro/src/content/reviews-en/<slug>.json with zero Thai' },
  ],
}

// args.slugs = list of review slugs whose EN file still contains Thai

const RULES = `
งาน: ไฟล์ EN รีวิวโรงแรมนี้แปลไปแล้วแต่ "มีภาษาไทยตกค้าง" ในบาง field — แก้ให้เป็นอังกฤษเนทีฟทั้งหมด ไม่เหลือตัวอักษรไทยแม้แต่ตัวเดียว (ยกเว้นสัญลักษณ์ ฿ ใช้ได้)

วิธีทำ:
1) อ่านต้นฉบับไทย astro/src/content/reviews/<slug>.json (เป็นแหล่งความหมาย) และไฟล์ EN ปัจจุบัน astro/src/content/reviews-en/<slug>.json
2) เขียนทับ astro/src/content/reviews-en/<slug>.json ให้เป็น JSON ที่ "คีย์/ลำดับ/จำนวนสมาชิก array เท่าต้นฉบับไทยเป๊ะ" และ **ไม่มีตัวอักษรไทยเหลือเลย**

⛔ คงเดิมเป๊ะ (เหมือนกฎแปลเดิม): slug, cluster, score/starRating/ratingCount/ตัวเลข/ราคา(เลข)/width, รูปทุก path (image,heroImg,heroSub1,heroSub2,mapImg,gallery,related[].img), URL/ลิงก์ทุกอัน, icon/emoji, สี hex
- parentCrumbUrl ต้องมี /en/ (https://thailandaddict.com/en/...)

✅ ส่วนที่ "ต้องเป็นอังกฤษ" — แก้ทุกที่ที่ยังเป็นไทย:
- field ป้าย/ประเภท: parentShort("Top 10 <เมือง>"→ใช้ชื่อเมืองอังกฤษจาก crumbCityName), type/typeEn/typeFull/qiType (ประเภทโรงแรม เช่น "รีสอร์ตพูลวิลล่า"→"Pool Villa Resort", "เกสต์เฮาส์/อพาร์ตเมนต์"→"Guesthouse/Apartment", "คอนโด"→"Condo"), regionLabel, badgeLoc, badgeMid, hiLoc, hiTag, qiRooms, qiCol5*
- ชื่อโรงแรม name/prevName/nextName: เอา gloss ภาษาไทยในวงเล็บออก เช่น "Udee Condo (อยู่ดีคอนโด)"→"Udee Condo" (คงชื่อแบรนด์อังกฤษ)
- **ที่อยู่ (สำคัญ — ถอดเป็นอักษรโรมัน ไม่ใช่แปลความหมาย):** streetAddress, mapAddr, addressLocality
  เช่น "ถนนฉะเชิงเทรา-บางปะกง ตำบลโสธร อำเภอเมืองฉะเชิงเทรา" → "Chachoengsao-Bang Pakong Rd, Tambon Sothon, Mueang Chachoengsao"
  ("ถนน"→Rd/Road, "ตำบล"→Tambon, "อำเภอ"→Amphoe/อำเภอเมือง→Mueang, "จังหวัด"→ตัดออกหรือชื่อจังหวัดอังกฤษ, "ซอย"→Soi, "หมู่"→Moo) · ใช้สะกดโรมันมาตรฐานของชื่อสถานที่ไทย
- เนื้อหา: title, metaDesc, keywords, ogTitle, ogDesc, twDesc, schemaDesc, h1, intro, body[].html, faq[].q/a, rooms[].name/full, tips, info[].k/v, nearby[].n/d, highlights, ratingBars[].label, booking/agoda pros/cons, honestSummary, honestChecks, galleryAlts, relatedTitle, faqTitle — แปลส่วนที่ยังเป็นไทยให้เป็นอังกฤษเนทีฟ (โทนเพื่อนเล่าให้เพื่อน honest)

หน่วย: ฿→THB, /คืน→/night, ตร.ม.→sqm, นาที→min, "15:00 น."→"3:00 PM", "~10 นาทีรถ"→"~10 min drive", "~3 นาทีเดิน"→"~3 min walk"
ห้ามแต่งข้อมูล/ตัวเลข/สถานที่เพิ่ม · ห้ามคำคลีเช่ AI (world-class/nestled/boasts/hidden gem/breathtaking เกร่อ)

ก่อนจบ: node -e "const a=require('fs').readFileSync('astro/src/content/reviews-en/<slug>.json','utf8'); if(/[\\u0E01-\\u0E5B]/.test(a.replace(/\\u0E3F/g,''))) throw new Error('STILL HAS THAI'); JSON.parse(a)" — ต้องผ่าน (ไม่มีไทยเหลือ + JSON valid). เขียนเฉพาะไฟล์ reviews-en/<slug>.json
`

let parsedArgs = args
if (typeof args === 'string') { try { parsedArgs = JSON.parse(args) } catch {} }
let slugs = (parsedArgs && parsedArgs.slugs) ? parsedArgs.slugs.slice() : []
log(`Fixing residual Thai in ${slugs.length} EN reviews`)

phase('Fix')
const res = await parallel(slugs.map(slug => () =>
  agent(
`แก้ภาษาไทยตกค้างในไฟล์ EN: slug=${slug}
${RULES}`,
    { label: `fix:${slug}`, phase: 'Fix', model: 'opus' }
  ).then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Fixed: ${ok}/${slugs.length}`)
return { total: slugs.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

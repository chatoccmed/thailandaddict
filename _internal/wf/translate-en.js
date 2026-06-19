export const meta = {
  name: 'translate-en',
  description: 'Translate Thai article JSON → English (articles-en/) at native travel-copy quality, structure/links/numbers preserved',
  phases: [
    { title: 'Translate', detail: 'one agent per article → astro/src/content/articles-en/<slug>.json' },
  ],
}

// args.slugs = explicit list of article slugs to translate (orchestrator passes them)

const RULES = `
บทบาท: คุณคือ Web Developer + นักแปลไทย→อังกฤษระดับเนทีฟสายท่องเที่ยว งานนี้แปลไฟล์เนื้อหา JSON ของบทความ ไม่ใช่ HTML ดิบ (Astro ใช้ layout เดียว render ทั้ง TH/EN → โครงสร้าง HTML เหมือนกัน 100% โดยอัตโนมัติอยู่แล้ว)

OUTPUT: เขียนไฟล์เดียวด้วย Write ที่ astro/src/content/articles-en/<slug>.json (mkdir -p astro/src/content/articles-en ก่อน) — ต้องเป็น JSON valid โครงสร้าง/คีย์เหมือนไฟล์ต้นฉบับไทยเป๊ะ (schema = articleSchema เดียวกัน)

⛔ คงไว้เป๊ะ ๆ ห้ามแก้ (โครงสร้าง/ข้อมูล/ลิงก์/ตัวเลข):
- slug, type, cluster, crumbCityHref, regionHref, heroImg, image, heroEmoji, publishedDate, modifiedDate
- ทุก href: related[].href, blocks ranked/cards items[].href, cta.href  (คง URL เดิม — ระบบ /en/ เติม prefix ให้เอง)
- ตัวเลข/จำนวน/ราคา (เช่น 300, 1500) คงเดิม — แปลเฉพาะ "หน่วย/คำ" เช่น บาท→THB, /คืน→/night, นาที→min, กม.→km
- ลำดับ blocks, จำนวน items, ค่า rank/rankColor/score/stars/tags-ที่เป็นข้อมูล คงเดิม

✅ แปลเป็นอังกฤษเนทีฟ (สำนวนท่องเที่ยวเพื่อนเล่าให้เพื่อน honest ไม่ใช่แปลตรงตัวเครื่อง) ทุก field ที่ผู้อ่านเห็น:
- title, metaDesc, keywords, ogTitle, ogDesc, eyebrow, h1, intro (intro มี HTML inline ได้ — แปลข้อความ คงแท็ก), chips[], readTime ("5 นาที"→"5 min read")
- crumbCity, regionLabel: แปลชื่อไทย→ชื่ออังกฤษทางการ (เกาะล้าน→Koh Larn, หาดตาแหวน→Tawaen Beach, พัทยา→Pattaya ฯลฯ)
- blocks: h2.text · p.html(คงแท็ก HTML) · list.items[] · tip.title/html · ranked.items[].name/blurb/meta/price(แปลหน่วยคงตัวเลข)/tags[] · cards.items[].name/blurb/tag · day.label("วันที่ 1"→"Day 1")/title/items[].time/activity/note · cta.text/label
- faq[].q/a · related[].title (แปล label คง href)

มาตรฐานสูง (สำคัญ):
- title ≤ ~60 ตัวอักษร, metaDesc ≤ ~160 — เขียนแบบ SEO อังกฤษธรรมชาติ มีบริบทสถานที่+Thailand ไม่ใช่แปลคำต่อคำ
- ชื่อเฉพาะไทย: ใช้ทับศัพท์อังกฤษที่คนใช้จริง (Koh Larn, Tawaen Beach, Wat …) · ชื่อโรงแรม/แบรนด์คงเดิม
- คงความ honest/EEAT ทุกจุด (เตือนอากาศ/ความปลอดภัย/ราคาผันผวน/คนเยอะ) เป็นอังกฤษ
- ห้ามคำคลีเช่ AI อังกฤษ: world-class, nestled, boasts, a testament to, hidden gem, must-visit (เกร่อ), in the heart of (เกร่อ), unparalleled, breathtaking (เกร่อ) — เขียนให้เป็นธรรมชาติ
- หน่วยเงิน: ใช้ THB (หรือ ฿) สม่ำเสมอ · เวลา/ระยะใช้รูปแบบอังกฤษ

ก่อนจบ: ls -l ยืนยันไฟล์ถูกเขียน + node -e "const a=require('./astro/src/content/articles-en/<slug>.json'); JSON.parse(JSON.stringify(a))" parse ผ่าน + เช็กว่า top-level keys เท่ากับไฟล์ไทย (slug/type/cluster ตรงกัน). เขียนเฉพาะไฟล์ articles-en/<slug>.json เท่านั้น ห้ามแตะไฟล์ไทย
`

log('args typeof=' + (typeof args) + ' value=' + JSON.stringify(args))
let parsedArgs = args
if (typeof args === 'string') { try { parsedArgs = JSON.parse(args) } catch {} }
let slugs = (parsedArgs && parsedArgs.slugs) ? parsedArgs.slugs.slice() : []
const existing = new Set(parsedArgs && parsedArgs.existingEn ? parsedArgs.existingEn : [])
slugs = slugs.filter(s => !existing.has(s))
log(`Translating ${slugs.length} articles → EN`)

phase('Translate')
const res = await parallel(slugs.map(slug => () =>
  agent(
`แปลบทความนี้เป็นภาษาอังกฤษ: อ่าน astro/src/content/articles/${slug}.json (ต้นฉบับไทย) แล้วสร้าง astro/src/content/articles-en/${slug}.json
${RULES}
slug=${slug} (คง slug/type/cluster เดิมจากไฟล์ไทย). รายงานสั้น ๆ: จำนวน blocks ที่แปล + JSON valid ไหม`,
    { label: `en:${slug}`, phase: 'Translate', model: 'opus' }
  ).then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`EN articles written: ${ok}/${slugs.length}`)
return { total: slugs.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

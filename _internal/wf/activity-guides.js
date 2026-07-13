export const meta = {
  name: 'activity-guides',
  description: 'Build 8 nationwide attraction-level activity guides (beaches/temples/waterfalls/national-parks/markets/viewpoints/elephant-sanctuaries/caves) in the site\'s proven gen-best-of format. Each agent reads its real-attraction candidate pool, selects+ranks the best ~12 across Thailand, and writes the guide data (TH+EN) for gen-best-of to emit.',
  phases: [{ title: 'Guides', detail: 'one writer per activity' }],
}

// [slug, emoji, hero-city, TH activity, EN activity]
const GUIDES = [
  ['best-beaches-thailand', '🏖️', 'krabi', 'หาดสวยที่สุด', 'best beaches'],
  ['best-temples-thailand', '🛕', 'ayutthaya', 'วัดสวย & ที่ไหว้พระ', 'best temples'],
  ['best-waterfalls-thailand', '💦', 'kanchanaburi', 'น้ำตกสวยที่สุด', 'best waterfalls'],
  ['best-national-parks-hiking-thailand', '🥾', 'khao-yai', 'อุทยาน & เดินป่า', 'best national parks & hikes'],
  ['best-markets-shopping-thailand', '🛍️', 'bangkok', 'ตลาด & ช้อปปิ้ง', 'best markets & shopping'],
  ['best-viewpoints-mountains-thailand', '⛰️', 'pai', 'จุดชมวิว & ภูเขา', 'best viewpoints & mountains'],
  ['best-elephant-sanctuaries-thailand', '🐘', 'chiang-mai', 'ปางช้าง (แบบมีจริยธรรม)', 'ethical elephant sanctuaries'],
  ['best-caves-thailand', '🕳️', 'kanchanaburi', 'ถ้ำสวยที่สุด', 'best caves'],
]

const SCHEMA_NOTE = `เขียนไฟล์ JSON object เดียว (ตาม schema ของ gen-best-of) ไปที่ _internal/activity-guide-data/<slug>.json:
{
  "slug": "<slug>", "hero": "<hero-city>", "emoji": "<emoji>",
  "th": { "eyebrow": "หมวดสั้นๆ", "h1": "พาดหัว<br>สองบรรทัด", "title": "<title SEO ไทย ลงท้าย | ThailandAddict>", "metaDesc": "<150-160 ตัวอักษร>", "intro": "<1-2 ประโยคเกริ่น>", "quick": "<strong>คำตอบสั้น ๆ:</strong> ..." },
  "en": { "eyebrow": "...", "h1": "...<br>...", "title": "... | ThailandAddict", "metaDesc": "...", "intro": "...", "quick": "<strong>Short answer:</strong> ..." },
  "items": [ { "name": {"th":"ชื่อไทย","en":"English name"}, "href": "<attraction-slug จาก pool>", "stayHref": "<stayHref จาก pool>", "blurb": {"th":"2 ประโยค เล่าว่าทำไมน่าไป + จุดเด่นจริง","en":"2 sentences"}, "tags": {"th":["แท็กสั้น","แท็กสั้น"],"en":["short","short"]} } ],
  "faq": [ { "q": {"th":"...","en":"..."}, "a": {"th":"...","en":"..."} } ]
}`

phase('Guides')
const results = await parallel(GUIDES.map(([slug, emoji, hero, thAct, enAct]) => () =>
  agent(
`คุณคือนักเขียนไกด์ท่องเที่ยว ThailandAddict (TH+EN) เขียนไกด์ "ที่เที่ยวตามกิจกรรม" ระดับประเทศ — "${thAct}" (${enAct})

1) อ่าน candidate pool: _internal/activity-guide-data/_pool-${slug}.json (attraction จริงทั้งหมดที่มีบทความในเว็บ + tag ตรงกิจกรรมนี้ · แต่ละอันมี name, slug, city, clusterSlug, stayHref, tags, img)
2) คัด "ที่ดีที่สุด/ดังที่สุด ~12 แห่ง" ให้กระจายทั่วไทย (เหนือ/อีสาน/กลาง/ตะวันออก/ใต้) — เลือกที่คนรู้จัก/คุ้มค่าไปจริง ไม่เอาที่ซ้ำโซนกันเกินไป · ถ้าจำเป็นใช้ WebSearch เช็กความถูกต้อง/ความดังของที่เด่น ๆ (อย่าเดา)
3) จัดอันดับตามความน่าไป + เขียน blurb ให้จริงและชวนไป (2 ประโยค TH + 2 EN ต่อแห่ง) บอกจุดเด่นจริง ช่วงเวลาที่เหมาะ/ทริคสั้น ๆ · href ต้องเป็น slug จาก pool เป๊ะ ๆ · stayHref เอาจาก pool
4) intro + quick-answer + 3 FAQ (คำถามจริงที่คนค้น เช่น ช่วงไหนดี พาเด็กได้ไหม ค่าเข้า/ฟรี เดินทางยังไง) TH+EN

⚠️ กติกา (LOCKED): โทน v2-clean เพื่อนเล่าให้เพื่อน · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty จริงใจ ไม่โม้ · ห้าม dark patterns · ใช้เฉพาะ attraction ที่อยู่ใน pool (มีบทความจริง) ห้ามแต่งที่ใหม่ · ชื่อ EN ใช้ชื่อสากลของสถานที่
slug="${slug}" · hero="${hero}" · emoji="${emoji}"
${SCHEMA_NOTE}
เขียนไฟล์ด้วย Write tool ให้ครบถูก schema แล้วตอบสั้น ๆ ว่าเลือกกี่แห่ง จังหวัดไหนบ้าง`,
    { label: `guide:${slug.replace('best-', '').replace('-thailand', '')}`, phase: 'Guides' }
  ).then(() => ({ slug, ok: true })).catch(e => ({ slug, ok: false, err: String(e) }))
))
log('Activity guides: ' + results.filter(Boolean).map(r => `${r.slug.replace('best-', '').replace('-thailand', '')}:${r.ok ? 'ok' : 'FAIL'}`).join(' · '))
return { jobs: results.filter(Boolean) }

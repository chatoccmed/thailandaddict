export const meta = {
  name: 'kids-guides',
  description: 'K2: build 6 regional kids/family guides (grouped by province) + 1 nationwide best-kids-activities guide, in the site\'s gen-best-of format (same QA as the activity guides). Each regional agent reads its per-province kid-attraction pool and writes the guide data (TH+EN); the nationwide agent picks top family picks across all regions.',
  phases: [{ title: 'Guides', detail: 'one writer per region + nationwide' }],
}

// [slug, poolFile|null, emoji, hero, TH region, EN region]  (null pool = nationwide)
const GUIDES = [
  ['kids-family-north-thailand', 'pool-north', '🎠', 'chiang-mai', 'ภาคเหนือ', 'the North'],
  ['kids-family-northeast-thailand', 'pool-northeast', '🦕', 'khon-kaen', 'อีสาน', 'Isan (Northeast)'],
  ['kids-family-central-thailand', 'pool-central', '🎢', 'bangkok', 'ภาคกลาง & กรุงเทพ', 'Bangkok & the Central region'],
  ['kids-family-east-thailand', 'pool-east', '🏊', 'chonburi', 'ภาคตะวันออก', 'the East'],
  ['kids-family-west-thailand', 'pool-west', '🐑', 'prachuap-khiri-khan', 'ภาคตะวันตก', 'the West'],
  ['kids-family-south-thailand', 'pool-south', '🐠', 'phuket', 'ภาคใต้', 'the South'],
]

const RULES = `กติกา (LOCKED): โทน v2-clean เพื่อนเล่าให้เพื่อน · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty จริงใจ ไม่โม้ · ห้าม dark patterns · ห้ามแนะนำขี่ช้าง/โชว์เสือ · ใช้เฉพาะ attraction ที่อยู่ใน pool (href=slug จาก pool เป๊ะ ๆ, stayHref="city-<clusterSlug>.html") · EN ห้ามมีอักษรไทย (ยกเว้น ฿)`

const SCHEMA = `เขียนไฟล์ JSON object เดียว (schema gen-best-of) ไปที่ _internal/activity-guide-data/<slug>.json:
{ "slug","hero","emoji",
  "th":{"eyebrow","h1":"<br>สองบรรทัด","title":"... | ThailandAddict","metaDesc","intro","quick":"<strong>คำตอบสั้น ๆ:</strong> ..."},
  "en":{"eyebrow","h1":"...<br>...","title":"... | ThailandAddict","metaDesc","intro","quick":"<strong>Short answer:</strong> ..."},
  "items":[ {"name":{"th","en"},"href":"<slug จาก pool>","stayHref":"city-<clusterSlug>.html","blurb":{"th":"2-3 ประโยค: เด็กวัยไหนเหมาะ ทำอะไรได้ ทริคพาเด็ก","en":"..."},"tags":{"th":["<ชื่อจังหวัด>","แท็กสั้น"],"en":["<Province>","short"]}} ],
  "faq":[ {"q":{"th","en"},"a":{"th","en"}} ] }
⚠️ เรียง items ตามจังหวัด (จัดกลุ่มจังหวัดเดียวกันติดกัน) และใส่ "ชื่อจังหวัด" เป็น tag แรกของทุก item เสมอ — เพื่อให้อ่านแบบ "แยกตามจังหวัด" ได้`

phase('Guides')
const regional = GUIDES.map(([slug, pool, emoji, hero, thR, enR]) => () =>
  agent(
`คุณคือผู้เชี่ยวชาญเที่ยวไทยกับเด็ก เขียนไกด์ "กิจกรรมเด็ก & ครอบครัว ${thR}" (family activities in ${enR}) — TH+EN
1) อ่าน _internal/kids-data/${pool}.json (map: จังหวัด(slug) → attraction เด็กที่มีบทความจริง · แต่ละอันมี name, slug, clusterSlug, isNew)
2) จัดทำ items ครบทุกที่ใน pool (หรือคัดที่ดีสุดถ้าเยอะ) — เรียงตามจังหวัด, ใส่ชื่อจังหวัดเป็น tag แรก
3) เขียน blurb ให้ละเอียดจริง (เด็กวัยไหน กิจกรรม ค่าเข้าคร่าวๆ ทริคพาเด็ก) · intro บอกภาพรวมเที่ยวเด็ก${thR} · quick-answer สรุปจังหวัดเด่น · 3-4 FAQ (พาเด็กเล็กไปไหนดี วันฝนไปไหน ช่วงไหนเหมาะ)
slug="${slug}" · hero="${hero}" · emoji="${emoji}"
${SCHEMA}
${RULES}
เขียนไฟล์แล้วตอบสั้น ๆ ว่ามีกี่จังหวัด กี่ที่`,
    { label: `kids:${slug.replace('kids-family-', '').replace('-thailand', '')}`, phase: 'Guides' }
  ).then(() => ({ slug, ok: true })).catch(() => ({ slug, ok: false }))
)
const nationwide = () => agent(
`คุณคือผู้เชี่ยวชาญเที่ยวไทยกับเด็ก เขียนไกด์ระดับประเทศ "กิจกรรมเด็ก & ครอบครัวทั่วไทย — ที่เด็กต้องไปสักครั้ง" (best kids & family activities in Thailand) — TH+EN
อ่าน pool ทั้ง 6 ภาค: _internal/kids-data/pool-{north,northeast,central,east,south,west}.json แล้วคัด "ที่เด็กชอบที่สุด ~12-14 แห่ง" ให้กระจายทุกภาค (สวนน้ำ/อควาเรียม/สวนสัตว์เปิด/ไดโนเสาร์/ซาฟารี/ฟาร์ม/พิพิธภัณฑ์เล่นได้) · เรียงให้น่าสนใจ ใส่ชื่อจังหวัดเป็น tag แรก
slug="best-kids-activities-thailand" · hero="chonburi" · emoji="🧸"
${SCHEMA}
${RULES}
intro + quick-answer บอกว่าเที่ยวเด็กในไทยแบ่งเป็นสวนน้ำ/สัตว์/เรียนรู้ · ลิงก์ไปไกด์รายภาคในคำอธิบายได้ (kids-family-<ภาค>-thailand)
เขียนไฟล์แล้วตอบสั้น ๆ`,
  { label: 'kids:nationwide', phase: 'Guides' }).then(() => ({ slug: 'best-kids-activities-thailand', ok: true })).catch(() => ({ slug: 'best-kids-activities-thailand', ok: false }))

const results = await parallel([...regional, nationwide])
log('Kids guides: ' + results.filter(Boolean).map(r => `${r.slug.replace('kids-family-', '').replace('-thailand', '')}:${r.ok ? 'ok' : 'FAIL'}`).join(' · '))
return { jobs: results.filter(Boolean) }

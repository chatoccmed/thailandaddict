export const meta = {
  name: 'phase1-crosscut-budget-luxury',
  description: 'Phase-1 cross-cut roundups assembled from the FULL cluster review pool (run AFTER all beach sets exist): phuket budget/luxury + samui budget/luxury + bangkok budget/luxury (province-level gaps from the audit). Zero new reviews — pure roundup assembly.',
  phases: [{ title: 'Crosscut', detail: 'one roundup-builder per segment, picks from its cluster pool' }],
}

// [slug, cluster, TH label, segment, criterion]
const JOBS = [
  ['top10-budget-hotels-phuket', 'phuket', 'ที่พักประหยัดภูเก็ต', 'budget', 'ราคาถูก/คุ้ม (เกสต์เฮาส์ โฮสเทล 2-3 ดาว ราคาต่อคืนต่ำ) คะแนน ≥8.0'],
  ['top10-luxury-hotels-phuket', 'phuket', 'โรงแรมหรู 5 ดาวภูเก็ต', 'luxury', 'รีสอร์ต/วิลลา 5 ดาว คะแนนสูง (Banyan Tree, The Surin, Sri Panwa, Keemala, InterContinental, Amari, Trisara, Amanpuri ฯลฯ ถ้ามีในพูล)'],
  ['top10-budget-hotels-samui', 'samui', 'ที่พักประหยัดเกาะสมุย', 'budget', 'ราคาถูก/คุ้ม คะแนน ≥8.0'],
  ['top10-luxury-hotels-samui', 'samui', 'โรงแรมหรู 5 ดาวเกาะสมุย', 'luxury', 'รีสอร์ต 5 ดาว คะแนนสูง (Banyan Tree, Garrya Tongsai, Anantara, SALA ฯลฯ)'],
  ['top10-budget-hotels-bangkok', 'bangkok', 'ที่พักประหยัดกรุงเทพ', 'budget', 'ราคาถูก/คุ้ม (โฮสเทล 2-3 ดาว ทำเลดี ใกล้ BTS/MRT) คะแนน ≥8.5 — กรุงเทพมีพูลใหญ่มาก เลือกให้กระจายย่าน'],
  ['top10-luxury-hotels-bangkok', 'bangkok', 'โรงแรมหรู 5 ดาวกรุงเทพ', 'luxury', 'โรงแรม 5 ดาวคะแนนสูง (Mandarin Oriental, The Peninsula, Sheraton Grande ฯลฯ) กระจายย่านริมน้ำ/สุขุมวิท/สีลม'],
]

const HUB = { phuket: 'city-phuket.html', samui: 'city-samui.html', bangkok: 'city-bangkok.html' }
const TH_CITY = { phuket: 'ภูเก็ต', samui: 'เกาะสมุย', bangkok: 'กรุงเทพ' }
const EN_CITY = { phuket: 'Phuket', samui: 'Koh Samui', bangkok: 'Bangkok' }

const OVR = (cluster) => `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · ห้าม dark patterns
- schema: astro/src/content.config.ts (roundupSchema) · แบบอย่าง: astro/src/content/roundups/top7-kamala-beach-hotels-phuket.json + top10-jomtien-beach-hotels-pattaya.json
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking = URL ปกติ
- crumbCityName="${TH_CITY[cluster]}"(EN "${EN_CITY[cluster]}"), crumbCityHref="${HUB[cluster]}" · countryHref="country-thailand.html" · addressCountry="TH"
- img จาก heroImg ของรีวิว (มีบนดิสก์แล้ว) · ห้ามสร้าง/ลบไฟล์รูป`

phase('Crosscut')
const results = await parallel(JOBS.map(([slug, cluster, thLabel, seg, crit]) => () =>
  agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน ทำตามทุกขั้นตอน — ยกเว้น override
สร้าง roundup "${thLabel}" (segment: ${seg}) — เขียน astro/src/content/roundups/${slug}.json (ไทย) + astro/src/content/roundups-en/${slug}.json (อังกฤษ)
⚠️ ไม่ต้องเขียนรีวิวใหม่ — ประกอบจากรีวิวที่มีอยู่แล้วใน cluster "${cluster}":
  รัน: ls astro/src/content/reviews/ | grep -- "-${cluster}\\.json$"  (หรืออ่าน cluster field = "${cluster}")
  อ่าน JSON แต่ละไฟล์ คัดเฉพาะที่เข้าเกณฑ์: ${crit}
  เลือก 10 ตัวที่ดีที่สุดตามเกณฑ์นี้ จัดอันดับตามคุณภาพจริง (ถ้าเข้าเกณฑ์ไม่ถึง 10 ให้ทำ Top N ตามจริง อย่าปั้นให้ครบ 10 ด้วยตัวที่ไม่เข้าเกณฑ์)
  ดึงคะแนน/ราคา/ทำเล/ลิงก์จอง/img (จาก heroImg) จากรีวิว · reviewUrl="<slug>.html"
slug="${slug}" · breadcrumb: หน้าแรก → ประเทศไทย → ${TH_CITY[cluster]} (${HUB[cluster]}) → หน้านี้ · intro เล่าว่าทำไมกลุ่มนี้ (${seg}) น่าสนใจใน${TH_CITY[cluster]}
${OVR(cluster)}`,
    { label: `xcut:${slug.slice(0, 26)}`, phase: 'Crosscut' }
  ).then(() => ({ slug, ok: true })).catch(() => ({ slug, ok: false }))
))
log('Crosscut complete: ' + results.filter(Boolean).map(r => `${r.slug}:${r.ok ? 'ok' : 'FAIL'}`).join(' · '))
return { jobs: results.filter(Boolean) }

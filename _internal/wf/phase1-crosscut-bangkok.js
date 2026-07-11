export const meta = {
  name: 'phase1-crosscut-bangkok',
  description: 'Bangkok budget/luxury province-level roundups — last 2 jobs of the Phase-1 crosscut (phuket/samui already done). Zero new reviews — pure roundup assembly from the existing bangkok review pool.',
  phases: [{ title: 'Crosscut', detail: 'one roundup-builder per segment, picks from the bangkok cluster pool' }],
}

const JOBS = [
  ['top10-budget-hotels-bangkok', 'bangkok', 'ที่พักประหยัดกรุงเทพ', 'budget', 'ราคาถูก/คุ้ม (โฮสเทล 2-3 ดาว ทำเลดี ใกล้ BTS/MRT) คะแนน ≥8.5 — กรุงเทพมีพูลใหญ่มาก เลือกให้กระจายย่าน'],
  ['top10-luxury-hotels-bangkok', 'bangkok', 'โรงแรมหรู 5 ดาวกรุงเทพ', 'luxury', 'โรงแรม 5 ดาวคะแนนสูง (Mandarin Oriental, The Peninsula, Sheraton Grande ฯลฯ) กระจายย่านริมน้ำ/สุขุมวิท/สีลม'],
]

const OVR = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · ห้าม dark patterns
- schema: astro/src/content.config.ts (roundupSchema) · แบบอย่าง: astro/src/content/roundups/top7-kamala-beach-hotels-phuket.json + top10-jomtien-beach-hotels-pattaya.json
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking = URL ปกติ
- crumbCityName="กรุงเทพ"(EN "Bangkok"), crumbCityHref="city-bangkok.html" · countryHref="country-thailand.html" · addressCountry="TH"
- img จาก heroImg ของรีวิว (มีบนดิสก์แล้ว) · ห้ามสร้าง/ลบไฟล์รูป
- นี่คือระดับ "จังหวัด" (province-level) ไม่ใช่ระดับย่าน — ต้องกระจายย่านให้หลากหลาย ห้ามเลือกจากย่านเดียวทั้งหมด`

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
slug="${slug}" · breadcrumb: หน้าแรก → ประเทศไทย → กรุงเทพ (city-bangkok.html) → หน้านี้ · intro เล่าว่าทำไมกลุ่มนี้ (${seg}) น่าสนใจในกรุงเทพ
${OVR}`,
    { label: `xcut:${slug.slice(0, 26)}`, phase: 'Crosscut' }
  ).then(() => ({ slug, ok: true })).catch(() => ({ slug, ok: false }))
))
log('Crosscut complete: ' + results.filter(Boolean).map(r => `${r.slug}:${r.ok ? 'ok' : 'FAIL'}`).join(' · '))
return { jobs: results.filter(Boolean) }

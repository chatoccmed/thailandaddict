export const meta = {
  name: 'phase3a-atier-budget',
  description: 'Phase-3a from the roundup audit: budget roundup for the 9 A-tier cities that have a healthy budget pool (prachuap/nan/chiang-rai/mae-hong-son/pai/trat/sukhothai/ayutthaya/hat-yai). Assembled from each cluster\'s existing review pool (0 new reviews/images; reuses on-R2 heroImgs). Honest Top-N (min 5) — do NOT pad.',
  phases: [{ title: 'Budget', detail: 'one roundup-builder per city, picks budget-fit hotels from its pool' }],
}

// [slug, cluster] — city name + breadcrumb are copied from the anchor top10-hotels-<cluster>.json
const JOBS = [
  ['top10-budget-hotels-prachuap-khiri-khan', 'prachuap-khiri-khan'],
  ['top10-budget-hotels-nan', 'nan'],
  ['top10-budget-hotels-chiang-rai', 'chiang-rai'],
  ['top10-budget-hotels-mae-hong-son', 'mae-hong-son'],
  ['top10-budget-hotels-pai', 'pai'],
  ['top10-budget-hotels-trat', 'trat'],
  ['top10-budget-hotels-sukhothai', 'sukhothai'],
  ['top10-budget-hotels-ayutthaya', 'ayutthaya'],
  ['top10-budget-hotels-hat-yai', 'hat-yai'],
]

const OVR = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · ห้าม dark patterns (ห้ามความเร่งรีบ/ขาดแคลนปลอม)
- schema: astro/src/content.config.ts (roundupSchema) · แบบอย่าง: astro/src/content/roundups/top10-budget-hotels-phuket.json + top10-jomtien-beach-hotels-pattaya.json
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking = URL ปกติ
- img จาก heroImg ของรีวิว (มีบนดิสก์+R2 แล้ว) · ห้ามสร้าง/ลบไฟล์รูป · ห้ามอ้างรูป/รีวิวที่ไม่มีจริง
- ⚠️ ข้อเท็จจริงต้องถูกต้อง: อย่ากล่าวอ้างรางวัล/ปีที่เปิด/superlative (ที่สุด/แห่งแรก) ถ้าไม่มั่นใจ — ตัดออกดีกว่าเสี่ยงผิด`

phase('Budget')
const results = await parallel(JOBS.map(([slug, cluster]) => () =>
  agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน ทำตามทุกขั้นตอน — ยกเว้น override ด้านล่าง
สร้าง roundup ที่พักประหยัด (segment: budget) ของ "${cluster}" — เขียน astro/src/content/roundups/${slug}.json (ไทย) + astro/src/content/roundups-en/${slug}.json (อังกฤษ)
⚠️ ไม่ต้องเขียนรีวิวใหม่ — ประกอบจากรีวิวที่มีอยู่แล้วใน cluster "${cluster}":
  รัน: ls astro/src/content/reviews/ แล้วอ่านไฟล์ที่ field cluster="${cluster}"
  คัดเฉพาะที่ "ประหยัด/คุ้มค่าจริง" — ราคาต่อคืนต่ำ (เกสต์เฮาส์ โฮสเทล โรงแรม 2-3 ดาว บูทีคราคาเบา) คะแนน ≥8.0 ประเมินจากราคา+ประเภท+เนื้อรีวิว
  จัดอันดับตามความคุ้มค่า (คะแนน + จำนวนรีวิว + ราคา/ทำเล) ⚠️ ทำ HONEST TOP-N: ถ้ามีที่เข้าเกณฑ์ประหยัดจริงน้อยกว่า 10 ให้ทำ Top N ตามจริง (เช่น Top 5/7/8) อย่าปั้นให้ครบ 10 ด้วยโรงแรมแพงที่ไม่ใช่ budget · ขั้นต่ำ 5 แห่ง
  ดึงคะแนน/ราคา/ทำเล/ลิงก์จอง/img (จาก heroImg) จากรีวิว · reviewUrl="<slug>.html" (EN ใช้ /en/ ตาม template)
slug="${slug}" (คงชื่อ slug นี้เป๊ะ ทั้ง TH+EN)
⚠️ breadcrumb + ชื่อเมือง: เปิดอ่าน astro/src/content/roundups/top10-hotels-${cluster}.json (ไทย) + roundups-en/top10-hotels-${cluster}.json (อังกฤษ) แล้ว COPY โครง breadcrumb/breadcrumbSchema + crumbCityName/href มาใช้ เปลี่ยนเฉพาะ crumb สุดท้ายเป็นหน้านี้ (จะได้ชื่อเมืองไทย/อังกฤษ + hub href ถูกต้อง)
intro เล่าว่าทำไมที่พักประหยัดในเมืองนี้น่าสนใจ + เลือกยังไงให้คุ้ม
${OVR}`,
    { label: `bud:${cluster}`, phase: 'Budget' }
  ).then(() => ({ slug, ok: true })).catch(() => ({ slug, ok: false }))
))
log('Budget complete: ' + results.filter(Boolean).map(r => `${r.slug.replace('top10-budget-hotels-','')}:${r.ok ? 'ok' : 'FAIL'}`).join(' · '))
return { jobs: results.filter(Boolean) }

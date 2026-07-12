export const meta = {
  name: 'phase4-btier-budget',
  description: 'Phase-4: budget roundup for the 46 assemble-able B-tier provinces (all 48 audit gap-cities except nakhon-nayok + satun = too thin). Assemble from each cluster\'s existing pool (0 new reviews; on-R2 images). Honest Top-N (min 5), exclude sub-destination hotels with their own roundups. Battle-tested prompt from Phase-3 learnings.',
  phases: [{ title: 'Budget', detail: 'one roundup-builder per province' }],
}

const CITIES = [
  'amnat-charoen', 'ang-thong', 'bueng-kan', 'chachoengsao', 'chai-nat', 'chaiyaphum', 'chumphon', 'kalasin',
  'kamphaeng-phet', 'lampang', 'loei', 'lopburi', 'nakhon-pathom', 'nakhon-phanom', 'nakhon-sawan',
  'nakhon-si-thammarat', 'narathiwat', 'nong-bua-lamphu', 'nong-khai', 'nonthaburi', 'pathum-thani', 'pattani',
  'phatthalung', 'phayao', 'phichit', 'phitsanulok', 'phrae', 'prachinburi', 'roi-et', 'sa-kaeo', 'sakon-nakhon',
  'samut-prakan', 'samut-sakhon', 'samut-songkhram', 'saraburi', 'sing-buri', 'sisaket', 'songkhla', 'suphan-buri',
  'surin', 'tak', 'trang', 'udon-thani', 'uthai-thani', 'yala', 'yasothon',
]
// sub-destinations that own their own cluster/roundup → exclude from the province roundup
const EXCLUDE = {
  songkhla: 'ตัดโรงแรมในหาดใหญ่ออก (หาดใหญ่มี roundup แยกแล้ว) — เอาเฉพาะเมืองสงขลา/สมิหลา/เกาะยอ',
  trang: 'ถ้ามีโรงแรมบนเกาะ (เกาะมุก เกาะกระดาน เกาะไหง) ที่เป็นจุดหมายแยก ให้เน้นเมืองตรัง/หาดปากเมงเป็นหลัก',
}

const OVR = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean (ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · ห้าม dark patterns (ห้ามความเร่งรีบ/ขาดแคลนปลอม)
- schema: astro/src/content.config.ts · แบบอย่าง: astro/src/content/roundups/top10-budget-hotels-nan.json
- affiliate: agodaUrl=agoda.com?cid=1965862 · tripUrl=trip.com...Allianceid=6861268 · bookingUrl=booking.com ปกติ · ถ้าโรงแรมไม่มีใน OTA ไหน → field ว่าง "" (อย่าเอา URL อื่น/FB มาใส่ผิด field) · เลือกที่จองผ่าน OTA ได้จริง
- img จาก heroImg ของรีวิว (มีบน R2 แล้ว) · ห้ามสร้าง/ลบไฟล์รูป · ห้ามอ้างรูป/รีวิวที่ไม่มีจริง
- ⚠️ ข้อเท็จจริง: อย่ากล่าวอ้าง award/รางวัล/ปีที่เปิด/superlative (ที่สุด/แห่งแรก/อันดับ 1) ถ้าไม่มั่นใจ — ตัดออกดีกว่าเสี่ยงผิด (การเปรียบเทียบภายในชุด เช่น "คุ้มที่สุดในชุดนี้" ใช้ได้)`

phase('Budget')
const results = await parallel(CITIES.map(cluster => () => {
  const excl = EXCLUDE[cluster] ? `\n⚠️ ${EXCLUDE[cluster]}` : ''
  const slug = `top10-budget-hotels-${cluster}`
  return agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน — ยกเว้น override ด้านล่าง
สร้าง roundup ที่พักประหยัด (budget) ของจังหวัด "${cluster}" — astro/src/content/roundups/${slug}.json (ไทย) + astro/src/content/roundups-en/${slug}.json (อังกฤษ)
⚠️ 0 รีวิวใหม่ — อ่านไฟล์ cluster="${cluster}" ใน astro/src/content/reviews/ · คัดที่ประหยัด/คุ้มจริง (เกสต์เฮาส์ โฮสเทล โรงแรม 2-3 ดาว ราคาเบา) คะแนน ≥7.5 จัดอันดับตามความคุ้ม
⚠️ HONEST TOP-N: ถ้าเข้าเกณฑ์ < 10 → Top N ตามจริง (Top 5/6/7/8) ขั้นต่ำ 5 · ห้ามปั้นให้ครบ 10 ด้วยที่แพง/ไม่เข้าเกณฑ์${excl}
slug="${slug}" (เป๊ะทั้ง TH+EN) · reviewUrl="<slug>.html" (EN ใช้ /en/) · img=heroImg
⚠️ breadcrumb + ชื่อจังหวัด: COPY จาก astro/src/content/roundups/top10-hotels-${cluster}.json + roundups-en/top10-hotels-${cluster}.json เปลี่ยนเฉพาะ crumb สุดท้าย (ได้ชื่อไทย/อังกฤษ + hub href ถูก)
⚠️ TH/EN ต้องตรงกันเป๊ะ (rank+name เหมือนกัน, ใช้ชื่อโรงแรมภาษาอังกฤษเหมือนกันทั้งสองภาษา ไม่ใส่ชื่อไทยในวงเล็บฝั่งเดียว) · EN ห้ามมีอักษรไทยหลุด (ยกเว้น ฿)
intro เล่าว่าทำไมที่พักประหยัดในจังหวัดนี้น่าสนใจ + เลือกยังไงให้คุ้ม
${OVR}`,
    { label: `b4:${cluster}`, phase: 'Budget' }
  ).then(() => ({ slug, ok: true })).catch(() => ({ slug, ok: false }))
}))
const ok = results.filter(Boolean).filter(r => r.ok).length
log(`Phase-4 complete: ${ok}/${CITIES.length} ok · fails: ${results.filter(Boolean).filter(r => !r.ok).map(r => r.slug.replace('top10-budget-hotels-', '')).join(', ') || 'none'}`)
return { jobs: results.filter(Boolean) }

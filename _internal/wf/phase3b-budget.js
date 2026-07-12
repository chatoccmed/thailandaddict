export const meta = {
  name: 'phase3b-atier-budget-islands',
  description: 'Phase-3b: budget/value roundup for 5 more A-tier cities whose pools are thinner but cluster-clean (koh-larn, koh-mak, koh-phangan, koh-lipe, khao-yai). Island "budget" = value tier for that destination. Assemble from existing pool (0 new reviews; on-R2 images). Honest Top-N (min 5) — do NOT pad. (surat-thani + phang-nga deferred: pool overlap / too thin.)',
  phases: [{ title: 'Budget', detail: 'one roundup-builder per city' }],
}

// [slug, cluster, note on what "budget/value" means for this destination]
const JOBS = [
  ['top10-budget-hotels-koh-larn', 'koh-larn', 'เกาะล้าน (ใกล้พัทยา): เน้นที่พักคุ้ม/ราคาเบาริมหาด เกสต์เฮาส์ รีสอร์ตเล็ก ไม่ใช่พูลวิลลาหรู'],
  ['top10-budget-hotels-koh-mak', 'koh-mak', 'เกาะหมาก: บังกะโล/รีสอร์ตเล็กริมหาดราคาย่อมเยา เน้นคุ้มค่า'],
  ['top10-budget-hotels-koh-phangan', 'koh-phangan', 'เกาะพะงัน: ที่พักคุ้ม/แบ็คแพ็คเกอร์/บังกะโลริมหาด ไม่ใช่รีสอร์ตหรู'],
  ['top10-budget-hotels-koh-lipe', 'koh-lipe', 'เกาะหลีเป๊ะ (แพงกว่าปกติเพราะเกาะไกล): เน้นที่พักคุ้มที่สุดในเกาะ บังกะโล/รีสอร์ตกลาง'],
  ['top10-budget-hotels-khao-yai', 'khao-yai', 'เขาใหญ่: ที่พักคุ้ม/กลางๆ บ้านพัก แคมป์ รีสอร์ตเล็ก ไม่ใช่รีสอร์ตหรูราคาหลายพัน'],
]

const OVR = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean (ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · ห้าม dark patterns
- schema: astro/src/content.config.ts · แบบอย่าง: astro/src/content/roundups/top10-budget-hotels-koh-samet.json (ถ้ามี) หรือ top10-budget-hotels-nan.json
- affiliate: agodaUrl=agoda.com?cid=1965862 · tripUrl=trip.com...Allianceid=6861268 · bookingUrl=booking.com ปกติ · ถ้าโรงแรมไม่มีใน OTA ไหน → field ว่าง "" (อย่าเอา URL อื่น/FB มาใส่ผิด field) · เลือกที่จองผ่าน OTA ได้จริง
- img จาก heroImg ของรีวิว (มีบน R2 แล้ว) · ห้ามสร้าง/ลบไฟล์รูป
- breadcrumb + ชื่อเมือง: COPY จาก astro/src/content/roundups/top10-hotels-<cluster>.json + roundups-en/ เปลี่ยนเฉพาะ crumb สุดท้าย
- ⚠️ TH/EN ตรงกันเป๊ะ (rank+name เหมือนกัน, ใช้ชื่อโรงแรมภาษาอังกฤษเหมือนกันทั้งสองภาษา) · EN ห้ามมีอักษรไทยหลุด (ยกเว้น ฿)
- ⚠️ ข้อเท็จจริงต้องถูก: อย่ากล่าวอ้าง award/ปีเปิด/superlative ที่ไม่มั่นใจ — ตัดออกดีกว่า`

phase('Budget')
const results = await parallel(JOBS.map(([slug, cluster, note]) => () =>
  agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน — ยกเว้น override
สร้าง roundup ที่พักคุ้ม/ประหยัด (budget/value) ของ "${cluster}" — astro/src/content/roundups/${slug}.json (ไทย) + astro/src/content/roundups-en/${slug}.json (อังกฤษ)
⚠️ 0 รีวิวใหม่ — อ่านไฟล์ cluster="${cluster}" ใน astro/src/content/reviews/ · เกณฑ์: ${note} · คะแนน ≥8.0 จัดอันดับตามความคุ้ม
⚠️ HONEST TOP-N: ถ้าเข้าเกณฑ์ < 10 ให้ทำ Top N ตามจริง (Top 5/6/7/8) ขั้นต่ำ 5 · ห้ามปั้นให้ครบ 10 ด้วยที่พักแพงที่ไม่ใช่ budget
slug="${slug}" (เป๊ะทั้ง TH+EN) · reviewUrl="<slug>.html" (EN ใช้ /en/) · img=heroImg
${OVR}`,
    { label: `bud:${cluster}`, phase: 'Budget' }
  ).then(() => ({ slug, ok: true })).catch(() => ({ slug, ok: false }))
))
log('Phase-3b complete: ' + results.filter(Boolean).map(r => `${r.slug.replace('top10-budget-hotels-','')}:${r.ok ? 'ok' : 'FAIL'}`).join(' · '))
return { jobs: results.filter(Boolean) }

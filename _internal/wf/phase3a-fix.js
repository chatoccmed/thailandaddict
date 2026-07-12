export const meta = {
  name: 'phase3a-fix-nan-mhs',
  description: 'Rebuild the 2 Phase-3a budget roundups that failed the gate: nan (drop the FB-only homestay that broke affiliate/thai-leak) and mae-hong-son (exclude Pai hotels — Pai has its own roundup — and fix misfiled OTA URLs). Assemble from existing pool, honest Top-N.',
  phases: [{ title: 'Fix', detail: 'rebuild nan + mae-hong-son budget roundups with refined constraints' }],
}

const OVR = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean (ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · ห้าม dark patterns
- schema: astro/src/content.config.ts · แบบอย่าง: astro/src/content/roundups/top10-budget-hotels-phuket.json
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking = URL ปกติ
- ⚠️ affiliate URL: ใส่ URL ให้ถูก field — agodaUrl ต้องเป็น agoda.com?cid=1965862, tripUrl ต้องเป็น trip.com...Allianceid=6861268, bookingUrl เป็น booking.com ปกติ
  ถ้าโรงแรมไม่มีใน OTA ไหน → ปล่อย field นั้นเป็นค่าว่าง "" (layout จะซ่อนปุ่ม) · ห้ามเอา URL ของ OTA อื่น/Facebook มาใส่ผิด field เด็ดขาด
  ⚠️ เลือกเฉพาะโรงแรมที่จองผ่าน Agoda/Booking/Trip ได้จริง (roundup นี้เน้นเทียบราคา 3 เว็บ) — ที่พักที่จองได้แค่ Facebook/โทร ไม่เอา
- img จาก heroImg ของรีวิว (มีบน R2 แล้ว) · ห้ามสร้าง/ลบไฟล์รูป
- breadcrumb + ชื่อเมือง: COPY จาก astro/src/content/roundups/top10-hotels-<cluster>.json + roundups-en/ เปลี่ยนเฉพาะ crumb สุดท้าย
- ⚠️ TH/EN ต้องตรงกัน: ลำดับ (rank) + ชื่อโรงแรม (name) ต้องเป๊ะเหมือนกันทั้งสองภาษา (ชื่อโรงแรมใช้ชื่อภาษาอังกฤษเหมือนกัน ไม่ใส่ชื่อไทยในวงเล็บฝั่ง TH ถ้าฝั่ง EN ไม่มี) · EN ห้ามมีอักษรไทยหลุด (ยกเว้น ฿)`

const JOBS = [
  {
    slug: 'top10-budget-hotels-nan', cluster: 'nan',
    extra: `⚠️ เอาเฉพาะที่พักที่จองผ่าน OTA (Agoda/Booking/Trip) ได้จริง — ตัด "Phu Phing Mok Homestay / ภูผิงหมอก" และที่พักที่จองได้แค่ Facebook/โทรออก (ไม่มีใน OTA) ออก · เมืองน่านมีที่พักประหยัดในพูลเยอะ (30+) เลือกที่คุ้ม+จองได้จริงมาทำ Top 10`,
  },
  {
    slug: 'top10-budget-hotels-mae-hong-son', cluster: 'mae-hong-son',
    extra: `⚠️ สำคัญมาก: cluster "mae-hong-son" มีโรงแรมเมืองปาย (Pai) ปนอยู่เยอะ แต่ปายมี roundup แยกแล้ว (top10-budget-hotels-pai) → **ตัดโรงแรมที่อยู่เมืองปายออกทั้งหมด** (เช่น Pai Country Hut, Common Grounds Pai, Baan Pai Riverside, Spicypai Backpackers, และที่มี "Pai" ในชื่อ/ทำเล) เพื่อไม่ให้ 2 หน้าแย่งกันเอง · เอาเฉพาะที่พักประหยัดในตัวเมืองแม่ฮ่องสอน + อำเภออื่นที่ไม่ใช่ปาย (Baanphuthadol, Crossroads House, Jasmin Resort, Sarm Mork, P.L.P Guesthouse, B2 Mae Hong Son Premier ฯลฯ) · ถ้าเหลือน้อยกว่า 10 ให้ทำ HONEST TOP-N ตามจริง (Top 5/6/7) ขั้นต่ำ 5 อย่าปั้น อย่าดึงปายกลับมา`,
  },
]

phase('Fix')
const results = await parallel(JOBS.map(j => () =>
  agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน — ยกเว้น override ด้านล่าง
สร้าง/เขียนทับ roundup ที่พักประหยัด (budget) ของ "${j.cluster}" — astro/src/content/roundups/${j.slug}.json (ไทย) + astro/src/content/roundups-en/${j.slug}.json (อังกฤษ)
ประกอบจากรีวิวที่มีอยู่แล้ว (0 รีวิวใหม่): อ่านไฟล์ cluster="${j.cluster}" ใน astro/src/content/reviews/ คัดที่ประหยัด/คุ้มจริง คะแนน ≥8.0 จัดอันดับตามความคุ้ม
${j.extra}
slug="${j.slug}" (เป๊ะทั้ง TH+EN) · reviewUrl="<slug>.html" (EN ใช้ /en/) · img=heroImg ของรีวิว
${OVR}`,
    { label: `fix:${j.cluster}`, phase: 'Fix' }
  ).then(() => ({ slug: j.slug, ok: true })).catch(() => ({ slug: j.slug, ok: false }))
))
log('Fix complete: ' + results.filter(Boolean).map(r => `${r.slug.replace('top10-budget-hotels-','')}:${r.ok ? 'ok' : 'FAIL'}`).join(' · '))
return { jobs: results.filter(Boolean) }

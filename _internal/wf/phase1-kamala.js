export const meta = {
  name: 'phase1-kamala-slice',
  description: 'Phase-1 vertical slice: Kamala beach hotel set — plan 6 NEW hotels (reuse glam-habitat), write TH+EN reviews with real images, build top7-kamala-beach-hotels-phuket roundup TH+EN',
  phases: [
    { title: 'Plan', detail: 'pick 6 currently-operating Kamala hotels across tiers (Keemala must be considered)' },
    { title: 'Review', detail: 'one hotel-reviewer agent per NEW hotel → TH+EN review JSON + hero images' },
    { title: 'Roundup', detail: 'build top7-kamala-beach-hotels-phuket TH+EN from all 7 reviews' },
  ],
}

const ROUNDUP_SLUG = 'top7-kamala-beach-hotels-phuket'
const REUSE = [{ slug: 'review-glam-habitat-phuket', name: 'Glam Habitat', star: 3, score: 8.8, area: 'หาดกมลา (กลางย่าน)' }]

const OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com ไม่ใช่ tourlogy/wherebest):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · ห้าม dark patterns (ห้ามสร้างความเร่งรีบ/ขาดแคลนปลอม เช่น "เหลือห้องเดียว!" "จองด่วน!")
- ดู schema ที่ astro/src/content.config.ts (reviewSchema) และไฟล์ตัวอย่าง: _internal/templates/review.sample.json — output ต้องตรง schema ทุก field (parent* ทุกตัว REQUIRED)
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย ≥2000 คำ) และ astro/src/content/reviews-en/<slug>.json (อังกฤษ แปลตรง ไม่มีไทยหลุด)
- ⚠️ ห้ามเขียนทับไฟล์รีวิวที่มีอยู่แล้วเด็ดขาด — ก่อนเขียนเช็ค ls ว่า slug ของคุณยังไม่มีไฟล์
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking = URL ปกติไม่ใส่พารามิเตอร์ (ระบบ wrap CJ ตอน build เอง)
- breadcrumb/parent ชี้ roundup ของชุดนี้: parentHref="${ROUNDUP_SLUG}.html" · parentName/parentShort/parentCrumbName สื่อ "โรงแรมหาดกมลา" · parentCrumbUrl ไทย "https://thailandaddict.com/${ROUNDUP_SLUG}" (EN เติม /en/) · crumbCityName="ภูเก็ต"(EN "Phuket"), crumbCityHref="city-phuket.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH" · cluster="phuket"
- related/prev/next ลิงก์วนภายในชุดกมลานี้ (รวม review-glam-habitat-phuket ที่มีอยู่แล้วด้วย)
- รูป hero + gallery: หารูปจริงของโรงแรม (เว็บทางการ/OTA) โหลดไป astro/public/images/hotels/phuket-<ชื่อสั้น>-1.jpg (-2,-3 สำหรับ gallery) · curl -o ตรงไปยังชื่อไฟล์ปลายทางเท่านั้น · ห้ามสร้างไฟล์ temp ใน images/ · **ห้ามใช้ rm หรือลบไฟล์ใด ๆ เด็ดขาด** (images/hotels มีรูปจังหวัดอื่นปน) · โหลดผิดให้ curl ทับชื่อเดิม · โหลดไม่ได้จริง ๆ ปล่อยว่าง (layout มี onerror)
- ราคา "เริ่มประมาณ" จากช่วงราคาห้องมาตรฐานจริง ไม่ใช่ราคาพีค
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองหาคำต้องห้าม (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) แก้เป็นคำธรรมชาติทุกจุดก่อนบันทึก
`

phase('Plan')
const PLAN_SCHEMA = { type: 'object', additionalProperties: false, required: ['hotels'], properties: { hotels: { type: 'array', minItems: 6, maxItems: 6, items: { type: 'object', additionalProperties: false, required: ['name', 'slug', 'area', 'tier', 'starTier', 'whyPick'], properties: {
  name: { type: 'string' }, slug: { type: 'string', description: 'review-<hotel-kebab>-phuket' }, area: { type: 'string', description: 'ตำแหน่งในกมลา เช่น ริมหาด/เนินเขา/Millionaire’s Mile/ในหมู่บ้าน' }, tier: { type: 'string', enum: ['luxury', 'boutique', 'midrange', 'budget', 'hostel'] }, starTier: { type: 'number' }, whyPick: { type: 'string' } } } } } }

const plan = await agent(
`ค้นเว็บ (Booking/Agoda/Trip.com) เลือกโรงแรม/ที่พักย่าน "หาดกมลา ภูเก็ต" (Kamala Beach) ที่เปิดดำเนินการอยู่จริงตอนนี้ 6 แห่ง สำหรับชุดรีวิว + roundup "${ROUNDUP_SLUG}" ของ thailandaddict.com
เงื่อนไข:
- คะแนนรีวิว OTA ≥8.0 ทุกตัว · มีรีวิวจริงจำนวนพอสมควร · อยู่ในกมลาจริง (ไม่ใช่สุรินทร์/ป่าตอง)
- คละระดับ: luxury 2 (ต้องพิจารณา Keemala และ InterContinental Phuket Resort — สองตัวนี้เป็นไอคอนของกมลา ถ้ายังเปิดและคะแนนถึงให้ใส่) · 4 ดาวกลาง 2 (เช่น Novotel Kamala / Sunwing / Cape Sienna) · 3 ดาว/บูทีค 1 · ประหยัด/เกสต์เฮาส์ 1
- ห้ามเลือก Glam Habitat (มีรีวิวแล้ว จะ reuse)
- ห้ามเลือกที่ปิดถาวร/รีแบรนด์ (เช็คสถานะปัจจุบัน)
ตั้ง slug = review-<ชื่อ-kebab>-phuket · คืนผลตาม schema พร้อม whyPick สั้น ๆ`,
  { label: 'plan:kamala', phase: 'Plan', schema: PLAN_SCHEMA }
)

const hotels = plan.hotels
const allSet = [...hotels.map(h => ({ ...h, isNew: true })), ...REUSE.map(r => ({ ...r, isNew: false }))]
const slugList = allSet.map(h => `${h.name} → ${h.slug} (${h.starTier || h.star}★, ${h.area})${h.isNew ? '' : ' [มีรีวิวแล้ว-reuse]'}`).join('\n')
log(`Planned ${hotels.length} new + ${REUSE.length} reuse. Writing reviews…`)

phase('Review')
const reviewed = await parallel(hotels.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" หาดกมลา ภูเก็ต · slug=${h.slug} · ระดับ ${h.starTier} ดาว (${h.tier}) · ตำแหน่ง ${h.area}
อยู่ในชุด roundup "${ROUNDUP_SLUG}" (Top 7 โรงแรมหาดกมลา)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาทและทำตามทุกขั้นตอน (วิจัยเว็บ → อ่าน schema → เขียน TH+EN → รูปจริง) ครบทุก field — ยกเว้นจุดที่ override ด้านล่างให้ยึด override
${OVERRIDES}
โรงแรมทั้งชุด (ใช้ทำ related/prev/next):\n${slugList}`,
    { label: `review:${h.slug.replace('review-', '').slice(0, 24)}`, phase: 'Review' }
  ).then(() => ({ slug: h.slug, ok: true })).catch(() => ({ slug: h.slug, ok: false }))
))
const okR = reviewed.filter(x => x && x.ok)
log(`Reviews written: ${okR.length}/${hotels.length}`)

phase('Roundup')
await agent(
`สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วสวมบทบาทและทำตามทุกขั้นตอน — ยกเว้นจุด override ด้านล่าง
สร้างหน้า roundup "Top 7 โรงแรมหาดกมลา ภูเก็ต" ของ thailandaddict.com
เขียน 2 ไฟล์: astro/src/content/roundups/${ROUNDUP_SLUG}.json (ไทย) และ astro/src/content/roundups-en/${ROUNDUP_SLUG}.json (อังกฤษ)
ดู schema ที่ astro/src/content.config.ts (roundupSchema) และรูปแบบทอง: _internal/templates/roundup.sample.json + astro/src/content/roundups/top10-jomtien-beach-hotels-pattaya.json — ตรงทุก field
slug="${ROUNDUP_SLUG}" · จัดอันดับจากรีวิวทั้ง 7 ในชุดนี้ (อ่าน JSON ใน astro/src/content/reviews/ ของทุก slug ด้านล่าง ดึงคะแนน/ราคา/ทำเล/ลิงก์จอง/รูป (img จาก heroImg ของรีวิว) มาใส่ entries — reviewUrl="<slug>.html")
breadcrumb: หน้าแรก → ประเทศไทย → ภูเก็ต (city-phuket.html) → หน้านี้ · heroStats สื่อจำนวนที่พัก/ช่วงราคา/ย่าน · เนื้อหา intro เล่าคาแรกเตอร์กมลา (หาดเงียบ ครอบครัว Millionaire's Mile) แบบเพื่อนเล่า
${OVERRIDES}
โรงแรมในชุด (เรียงคุณภาพเป็นอันดับตามจริง ไม่ fake):\n${slugList}`,
  { label: 'roundup:kamala', phase: 'Roundup' }
)

return { planned: hotels.map(h => h.slug), reviewsOk: okR.length, failed: reviewed.filter(x => !x || !x.ok).map(x => x && x.slug), roundup: ROUNDUP_SLUG }

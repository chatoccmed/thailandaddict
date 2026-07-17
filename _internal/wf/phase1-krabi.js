export const meta = {
  name: 'phase1-krabi',
  description: 'Phase-1 Krabi: (A) top10-ao-nang-beach-hotels-krabi ASSEMBLE-ONLY from 18 existing ao-nang reviews (zero new reviews) · (B) top8-luxury-hotels-krabi = reuse 4 existing luxury + ~4 NEW icons (reviews + roundup)',
  phases: [{ title: 'Krabi', detail: 'ao-nang assemble (roundup only) + luxury (plan→reviews→roundup) in parallel' }],
}

const AONANG_POOL = ['review-whalecome-aonang-resort-krabi','review-aonang-hill-11-1-krabi','review-panan-krabi-resort-krabi','review-ananta-burin-resort-krabi','review-vipa-tropical-resort-krabi','review-the-ri-hotel-krabi','review-andaman-pearl-resort-krabi','review-phu-pha-aonang-resort-and-spa-krabi','review-wake-up-aonang-hotel-krabi','review-aonang-cliff-beach-resort-krabi','review-nomads-ao-nang-krabi','review-peace-laguna-resort-and-spa-krabi','review-glow-ao-nang-krabi-krabi','review-pop-in-hostel-krabi','review-bluesotel-krabi-aonang-beach-krabi','review-the-moment-hostel-krabi','review-sleeper-hostel-krabi','review-krabi-resort-krabi']

const LUX_REUSE = [
  { slug: 'review-rayavadee-krabi', name: 'Rayavadee', star: 5, score: 9.4, area: 'คาบสมุทรพระนาง · หาดไร่เลย์' },
  { slug: 'review-the-tubkaak-krabi-boutique-resort-krabi', name: 'The Tubkaak Krabi Boutique Resort', star: 5, score: 9.1, area: 'หาดทับแขก · คลองม่วง' },
  { slug: 'review-nakamanda-resort-and-spa-krabi', name: 'Nakamanda Resort & Spa', star: 5, score: 9.0, area: 'หาดคลองม่วง' },
  { slug: 'review-avani-plus-koh-lanta-krabi-resort-krabi', name: 'Avani+ Koh Lanta Krabi Resort', star: 4, score: 8.8, area: 'แหลมโละกวาง · เกาะลันตา' },
]

const OVR = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · ห้าม dark patterns
- schema: astro/src/content.config.ts · ตัวอย่างผ่าน gate: astro/src/content/reviews/review-keemala-phuket.json (review) + astro/src/content/roundups/top7-kamala-beach-hotels-phuket.json (roundup)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking = URL ปกติ
- crumbCityName="กระบี่"(EN "Krabi"), crumbCityHref="city-krabi.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH" · cluster="krabi"
- รูป: รูปจริง → astro/public/images/hotels/krabi-<ชื่อสั้น>-1.jpg · curl -o ตรงชื่อปลายทาง · ห้าม temp · **ห้าม rm/ลบไฟล์** · โหลดไม่ได้ปล่อยว่าง
- ราคา "เริ่มประมาณ" · กวาดคำต้องห้ามก่อนบันทึก`

phase('Krabi')
const [aonang, lux] = await parallel([
  // ── A: ao-nang assemble-only ──
  async () => {
    await agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วทำตามทุกขั้นตอน — ยกเว้น override
สร้าง roundup "Top 10 โรงแรมหาดอ่าวนาง กระบี่" — เขียน astro/src/content/roundups/top10-ao-nang-beach-hotels-krabi.json (ไทย) + astro/src/content/roundups-en/top10-ao-nang-beach-hotels-krabi.json (อังกฤษ)
⚠️ ไม่ต้องเขียนรีวิวใหม่ — เลือก 10 ตัวที่ดีที่สุดจาก pool รีวิวอ่าวนางที่มีอยู่แล้ว 18 ตัวข้างล่าง (อ่าน JSON แต่ละไฟล์ใน astro/src/content/reviews/ ดึงคะแนน/ราคา/ทำเล/ลิงก์จอง/img จาก heroImg) จัดอันดับตามคุณภาพจริง (คะแนน+รีวิว+ทำเล) คละระดับให้มีทั้งหรู/กลาง/ประหยัด · reviewUrl="<slug>.html"
schema: roundupSchema · แบบอย่าง: astro/src/content/roundups/top7-kamala-beach-hotels-phuket.json + top10-jomtien-beach-hotels-pattaya.json
slug="top10-ao-nang-beach-hotels-krabi" · breadcrumb: หน้าแรก → ประเทศไทย → กระบี่ (city-krabi.html) → หน้านี้ · intro เล่าคาแรกเตอร์อ่าวนาง (หาดหลักกระบี่ คึกคัก ท่าเรือไปเกาะ)
${OVR}
POOL 18 ตัว (เลือก 10):\n${AONANG_POOL.join('\n')}`,
      { label: 'roundup:ao-nang-assemble', phase: 'Krabi' })
    return { set: 'top10-ao-nang-beach-hotels-krabi', reviewsOk: 0, assemble: true }
  },
  // ── B: luxury (plan 4 new → reviews → roundup) ──
  async () => {
    const PLAN_SCHEMA = { type: 'object', additionalProperties: false, required: ['hotels'], properties: { hotels: { type: 'array', minItems: 4, maxItems: 4, items: { type: 'object', additionalProperties: false, required: ['name', 'slug', 'area', 'starTier', 'whyPick'], properties: {
      name: { type: 'string' }, slug: { type: 'string' }, area: { type: 'string' }, starTier: { type: 'number' }, whyPick: { type: 'string' } } } } } }
    const plan = await agent(
`ค้นเว็บ (Booking/Agoda/Trip.com) เลือกโรงแรมหรู 5 ดาวในกระบี่ที่เปิดจริงตอนนี้ 4 แห่ง สำหรับชุด luxury "top8-luxury-hotels-krabi"
ต้องพิจารณาไอคอนหรูของกระบี่: Phulay Bay a Ritz-Carlton Reserve · Banyan Tree Krabi · Dusit Thani Krabi Beach Resort · Anana Ecological Resort Krabi · Sofitel Krabi Phokeethra — เลือก 4 ตัวที่ยังเปิดและคะแนนสูง
ห้ามเลือกที่มีรีวิวแล้ว (reuse): ${LUX_REUSE.map(r => r.name).join(' · ')}
slug = review-<ชื่อ-kebab>-krabi · คืนตาม schema พร้อม whyPick`,
      { label: 'plan:krabi-luxury', phase: 'Krabi', schema: PLAN_SCHEMA })
    const all = [...plan.hotels.map(h => ({ ...h, isNew: true })), ...LUX_REUSE.map(r => ({ ...r, isNew: false }))]
    const slugList = all.map(h => `${h.name} → ${h.slug} (${h.starTier || h.star}★, ${h.area})${h.isNew ? '' : ' [reuse]'}`).join('\n')
    const reviewed = await parallel(plan.hotels.map(h => () =>
      agent(
`รีวิวโรงแรมหรู "${h.name}" กระบี่ · slug=${h.slug} · ${h.starTier} ดาว · ${h.area} · ในชุด "top8-luxury-hotels-krabi"
สำคัญ: อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน ทำตามทุกขั้นตอน (วิจัยเว็บ → schema → TH+EN → รูปจริง) — ยกเว้น override
parentHref="top8-luxury-hotels-krabi.html" · parentName สื่อ "โรงแรมหรูกระบี่" · parentCrumbUrl "https://thailandaddict.com/top8-luxury-hotels-krabi" (EN /en/)
${OVR}
โรงแรมทั้งชุด:\n${slugList}`,
        { label: `rv:${h.slug.replace('review-', '').slice(0, 22)}`, phase: 'Krabi' }
      ).then(() => ({ ok: true })).catch(() => ({ ok: false }))))
    const okN = reviewed.filter(x => x && x.ok).length
    await agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน ทำตามทุกขั้นตอน — ยกเว้น override
สร้าง roundup "Top 8 โรงแรมหรู 5 ดาว กระบี่" — เขียน astro/src/content/roundups/top8-luxury-hotels-krabi.json + astro/src/content/roundups-en/top8-luxury-hotels-krabi.json
slug="top8-luxury-hotels-krabi" · จัดอันดับจากรีวิวทั้ง 8 (4 ใหม่ + 4 reuse ข้างล่าง — อ่าน JSON ดึงคะแนน/ราคา/ทำเล/ลิงก์/img) · reviewUrl="<slug>.html"
breadcrumb: หน้าแรก → ประเทศไทย → กระบี่ (city-krabi.html) → หน้านี้ · intro เล่าว่ากระบี่หรูคือรีสอร์ตริมหาดลับ/ไร่เลย์/คลองม่วง
${OVR}
โรงแรมในชุด (อันดับตามจริง):\n${slugList}`,
      { label: 'roundup:krabi-luxury', phase: 'Krabi' })
    return { set: 'top8-luxury-hotels-krabi', reviewsOk: okN, assemble: false }
  },
])
log(`Krabi complete: ao-nang assembled · luxury reviews ok ${lux.reviewsOk}/4`)
return { aonang, lux }

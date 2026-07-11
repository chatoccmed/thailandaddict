export const meta = {
  name: 'phase1-phuket-beaches',
  description: 'Phase-1 fan-out: 5 remaining Phuket beach/area hotel sets (patong, kata-karon, bang-tao-laguna, rawai-nai-harn, old-town) — plan NEW hotels per set, write TH+EN reviews with real images, build each roundup TH+EN (Kamala slice already passed the quality gate)',
  phases: [
    { title: 'Sets', detail: 'per set: plan → reviews (parallel) → roundup' },
  ],
}

const SETS = [
  { slug: 'top10-patong-beach-hotels-phuket', th: 'หาดป่าตอง', en: 'Patong Beach', size: 10, newCount: 7,
    reuse: [
      { slug: 'review-amari-phuket', name: 'Amari Phuket', star: 5, score: 8.6, area: 'ปลายหาดป่าตองฝั่งใต้' },
      { slug: 'review-hotel-indigo-phuket-patong-phuket', name: 'Hotel Indigo Phuket Patong', star: 4, score: 8.9, area: 'กลางป่าตอง' },
      { slug: 'review-lub-d-phuket-patong-phuket', name: 'Lub d Phuket Patong', star: 2, score: 9.2, area: 'ใจกลางป่าตอง' },
    ],
    brief: 'คละระดับ: luxury/5 ดาว 2 (พิจารณา Marriott Merlin Beach ถ้านับว่าอยู่ป่าตองจริง · Four Points by Sheraton Patong · Diamond Cliff) · 4 ดาวกลาง 3 · 3 ดาว 1 · ประหยัด 1 · เน้นตัวที่คนจองจริง รีวิวเยอะ ทำเลชัด (ริมหาด/ถนนบางลา/เนินเขา)' },
  { slug: 'top10-kata-karon-hotels-phuket', th: 'กะตะ-กะรน', en: 'Kata-Karon', size: 10, newCount: 8,
    reuse: [
      { slug: 'review-kk-karon-kata-boutique-hotel-phuket', name: 'KK - Karon Kata Boutique Hotel', star: 3, score: 8.8, area: 'ถนนกะรน' },
      { slug: 'review-the-old-phuket-karon-beach-resort-phuket', name: 'The Old Phuket - Karon Beach Resort', star: 4, score: 8.2, area: 'หาดกะรน' },
    ],
    brief: 'คละระดับ: luxury 2 (พิจารณา The Shore at Katathani · Katathani Phuket Beach Resort · Mom Tri’s Villa Royale) · 4 ดาว 3 · 3 ดาว 2 · ประหยัด 1 · ระบุชัดว่าอยู่กะตะหรือกะรน' },
  { slug: 'top8-bang-tao-laguna-hotels-phuket', th: 'บางเทา-ลากูน่า', en: 'Bang Tao-Laguna', size: 8, newCount: 6,
    reuse: [
      { slug: 'review-banyan-tree-phuket', name: 'Banyan Tree Phuket', star: 5, score: 9.2, area: 'ลากูน่า บางเทา' },
      { slug: 'review-the-surin-phuket', name: 'The Surin Phuket', star: 5, score: 9.4, area: 'หาดแพนซี/สุรินทร์ (ติดบางเทา — ระบุทำเลตรงไปตรงมา)' },
    ],
    brief: 'ต้องพิจารณา Trisara และ Amanpuri (ไอคอน luxury ของโซนนี้ จำเป็นสำหรับชุด luxury ภายหลัง) + Angsana Laguna / Dusit Thani Laguna / SAii Laguna 2-3 ตัว + กลาง/ประหยัดแถวบางเทา 1-2' },
  { slug: 'top8-rawai-nai-harn-hotels-phuket', th: 'ราไวย์-ในหาน', en: 'Rawai-Nai Harn', size: 8, newCount: 7,
    reuse: [
      { slug: 'review-the-happy-eight-resort-phuket', name: 'The Happy Eight Resort', star: 3, score: 9.4, area: 'ราไวย์ ซอยสามัคคี' },
    ],
    brief: 'คละระดับ: luxury 2 (พิจารณา The Nai Harn · The Vijitt Resort) · 4 ดาว 2 · 3 ดาว/บูทีค 2 · ประหยัด 1 · โซนนี้ = สายชิล/ครอบครัว/long stay ให้เล่าคาแรกเตอร์นั้น' },
  { slug: 'top8-phuket-old-town-hotels', th: 'เมืองเก่าภูเก็ต', en: 'Phuket Old Town', size: 8, newCount: 6,
    reuse: [
      { slug: 'review-the-memory-at-on-on-hotel-phuket', name: 'The Memory at On On Hotel', star: 4, score: 9.5, area: 'ถนนพังงา (ตึกชิโน-โปรตุกีสปี 1929)' },
      { slug: 'review-aekkeko-hostel-phuket', name: 'Aekkeko Hostel', star: 2, score: 9.3, area: 'ถนนกระบี่' },
    ],
    brief: 'เน้นบูทีค/เฮอริเทจชิโน-โปรตุกีส: พิจารณา Casa Blanca Boutique · The Rommanee · Xinlor House/1898 · คละ 4 ดาว 1-2 · 3 ดาวบูทีค 3 · ประหยัด 1 · เล่าเสน่ห์ย่านเก่า คาเฟ่ street art' },
]

function overrides(set) {
  return `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com ไม่ใช่ tourlogy/wherebest):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · ห้าม dark patterns (ห้ามความเร่งรีบ/ขาดแคลนปลอม)
- ดู schema ที่ astro/src/content.config.ts (reviewSchema) และไฟล์ตัวอย่าง: _internal/templates/review.sample.json + ตัวอย่างที่เพิ่งผ่าน gate: astro/src/content/reviews/review-keemala-phuket.json — output ตรง schema ทุก field (parent* REQUIRED)
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย ≥2000 คำ) และ astro/src/content/reviews-en/<slug>.json (อังกฤษ ไม่มีไทยหลุด)
- ⚠️ ห้ามเขียนทับไฟล์รีวิวที่มีอยู่แล้วเด็ดขาด — เช็คก่อนเขียน
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking = URL ปกติ (ระบบ wrap CJ ตอน build)
- breadcrumb/parent: parentHref="${set.slug}.html" · parentName/parentShort/parentCrumbName สื่อ "โรงแรม${set.th}" · parentCrumbUrl "https://thailandaddict.com/${set.slug}" (EN เติม /en/) · crumbCityName="ภูเก็ต"(EN "Phuket"), crumbCityHref="city-phuket.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH" · cluster="phuket"
- related/prev/next วนภายในชุดนี้ (รวมตัว reuse ด้วย)
- รูป: หารูปจริงของโรงแรม (เว็บทางการ/OTA) → astro/public/images/hotels/phuket-<ชื่อสั้น>-1.jpg (-2,-3 gallery) · curl -o ตรงชื่อไฟล์ปลายทางเท่านั้น · ห้าม temp ใน images/ · **ห้าม rm/ลบไฟล์เด็ดขาด** · โหลดไม่ได้ปล่อยว่าง
- ราคา "เริ่มประมาณ" จากช่วงจริง · ก่อนบันทึกกวาดคำต้องห้ามอีกรอบ`
}

const PLAN_SCHEMA = (n) => ({ type: 'object', additionalProperties: false, required: ['hotels'], properties: { hotels: { type: 'array', minItems: n, maxItems: n, items: { type: 'object', additionalProperties: false, required: ['name', 'slug', 'area', 'tier', 'starTier', 'whyPick'], properties: {
  name: { type: 'string' }, slug: { type: 'string' }, area: { type: 'string' }, tier: { type: 'string', enum: ['luxury', 'boutique', 'midrange', 'budget', 'hostel'] }, starTier: { type: 'number' }, whyPick: { type: 'string' } } } } } })

phase('Sets')
const results = await parallel(SETS.map(set => async () => {
  const plan = await agent(
`ค้นเว็บ (Booking/Agoda/Trip.com) เลือกโรงแรม/ที่พักย่าน "${set.th} ภูเก็ต" (${set.en}, Phuket) ที่เปิดดำเนินการจริงตอนนี้ ${set.newCount} แห่ง สำหรับชุดรีวิว + roundup "${set.slug}" ของ thailandaddict.com
เงื่อนไข: คะแนน OTA ≥8.0 · มีรีวิวจริงพอสมควร · อยู่ใน${set.th}จริง · ${set.brief}
ห้ามเลือกตัวที่มีรีวิวแล้ว (จะ reuse): ${set.reuse.map(r => r.name).join(' · ')}
ตั้ง slug = review-<ชื่อ-kebab>-phuket · คืนผลตาม schema พร้อม whyPick`,
    { label: `plan:${set.slug.slice(0, 28)}`, phase: 'Sets', schema: PLAN_SCHEMA(set.newCount) })

  const all = [...plan.hotels.map(h => ({ ...h, isNew: true })), ...set.reuse.map(r => ({ ...r, isNew: false }))]
  const slugList = all.map(h => `${h.name} → ${h.slug} (${h.starTier || h.star}★, ${h.area})${h.isNew ? '' : ' [มีรีวิวแล้ว-reuse]'}`).join('\n')
  log(`[${set.slug}] planned ${plan.hotels.length} new + ${set.reuse.length} reuse`)

  const reviewed = await parallel(plan.hotels.map(h => () =>
    agent(
`รีวิวโรงแรม "${h.name}" ${set.th} ภูเก็ต · slug=${h.slug} · ${h.starTier} ดาว (${h.tier}) · ${h.area}
อยู่ในชุด roundup "${set.slug}" (Top ${set.size} โรงแรม${set.th})
สำคัญ: อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำตามทุกขั้นตอน (วิจัยเว็บ → schema → TH+EN → รูปจริง) — ยกเว้นจุด override ให้ยึด override
${overrides(set)}
โรงแรมทั้งชุด (ทำ related/prev/next):\n${slugList}`,
      { label: `rv:${h.slug.replace('review-', '').slice(0, 22)}`, phase: 'Sets' }
    ).then(() => ({ ok: true })).catch(() => ({ ok: false }))))
  const okN = reviewed.filter(x => x && x.ok).length
  log(`[${set.slug}] reviews ok ${okN}/${plan.hotels.length}`)

  await agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วทำตามทุกขั้นตอน — ยกเว้นจุด override
สร้าง roundup "Top ${set.size} โรงแรม${set.th} ภูเก็ต" — เขียน 2 ไฟล์:
astro/src/content/roundups/${set.slug}.json (ไทย) และ astro/src/content/roundups-en/${set.slug}.json (อังกฤษ)
schema: content.config.ts (roundupSchema) · แบบอย่างทอง: astro/src/content/roundups/top7-kamala-beach-hotels-phuket.json (เพิ่งผ่าน gate) + top10-jomtien-beach-hotels-pattaya.json
slug="${set.slug}" · จัดอันดับจากรีวิวทั้ง ${set.size} ในชุด (อ่าน JSON ใน astro/src/content/reviews/ ทุก slug ด้านล่าง ดึงคะแนน/ราคา/ทำเล/ลิงก์จอง/img จาก heroImg) · reviewUrl="<slug>.html"
breadcrumb: หน้าแรก → ประเทศไทย → ภูเก็ต (city-phuket.html) → หน้านี้ · intro เล่าคาแรกเตอร์${set.th}แบบเพื่อนเล่า
${overrides(set)}
โรงแรมในชุด (อันดับตามจริง ไม่ fake):\n${slugList}`,
    { label: `roundup:${set.slug.slice(0, 26)}`, phase: 'Sets' })
  return { set: set.slug, planned: plan.hotels.length, reviewsOk: okN }
}))

log('Phuket fan-out complete: ' + results.filter(Boolean).map(r => `${r.set}:${r.reviewsOk}`).join(' · '))
return { sets: results.filter(Boolean) }

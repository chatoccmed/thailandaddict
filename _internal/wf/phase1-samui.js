export const meta = {
  name: 'phase1-samui-beaches',
  description: 'Phase-1 fan-out: 4 Koh Samui beach hotel sets (chaweng, lamai, bophut-fishermans-village, maenam-choeng-mon) — plan NEW hotels per set, write TH+EN reviews with real images, build each roundup TH+EN (reuse existing samui/surat-thani reviews)',
  phases: [{ title: 'Sets', detail: 'per set: plan → reviews (parallel) → roundup' }],
}

const CITY = { cluster: 'samui', th: 'เกาะสมุย', en: 'Koh Samui', hub: 'city-samui.html', imgPrefix: 'samui' }

const SETS = [
  { slug: 'top10-chaweng-beach-hotels-samui', th: 'หาดเฉวง', en: 'Chaweng Beach', size: 10, newCount: 3,
    reuse: [
      { slug: 'review-sala-samui-chaweng-beach-resort-samui', name: 'SALA Samui Chaweng Beach Resort', star: 5, score: 9.1, area: 'หาดเฉวง' },
      { slug: 'review-chaweng-regent-beach-resort-samui', name: 'Chaweng Regent Beach Resort', star: 4, score: 8.6, area: 'หาดเฉวง' },
      { slug: 'review-la-vida-samui', name: 'La Vida Samui', star: 4, score: 8.9, area: 'หาดเฉวง (ปลายเหนือ)' },
      { slug: 'review-ozo-chaweng-samui', name: 'OZO Chaweng Samui', star: 3, score: 8.3, area: 'หาดเฉวง' },
      { slug: 'review-lub-d-koh-samui-chaweng-samui', name: 'Lub d Koh Samui Chaweng Beach', star: 3, score: 9.3, area: 'ริมหาดเฉวง' },
      { slug: 'review-anantara-lawana-koh-samui-surat-thani', name: 'Anantara Lawana Koh Samui Resort', star: 5, score: 9.1, area: 'ปลายหาดเฉวงฝั่งเหนือ' },
      { slug: 'review-samui-resotel-beach-resort-surat-thani', name: 'Samui Resotel Beach Resort', star: 4, score: 8.6, area: 'ปลายหาดเฉวงฝั่งใต้' },
    ],
    brief: 'เฉวง = หาดหลักคึกคัก. เติม new 3: พิจารณา 5 ดาวติดหาดที่ยังไม่มี เช่น Centara Grand Beach Resort Samui / Amari Koh Samui / The Library (บูทีคดีไซน์ไอคอน) / Muang Samui Spa Resort — เลือกที่คะแนนสูง คนจองเยอะ' },
  { slug: 'top8-lamai-beach-hotels-samui', th: 'หาดละไม', en: 'Lamai Beach', size: 8, newCount: 6,
    reuse: [
      { slug: 'review-banyan-tree-samui', name: 'Banyan Tree Samui', star: 5, score: 9.5, area: 'อ่าวละไม (เหนือหาดละไม)' },
      { slug: 'review-lamai-wanta-beach-resort-samui', name: 'Lamai Wanta Beach Resort', star: 3, score: 8.0, area: 'หาดละไม (กลางย่าน)' },
    ],
    brief: 'ละไม = หาดสวยรองจากเฉวง เงียบกว่า. new 6: พิจารณา Rocky’s Boutique Resort / Renaissance Koh Samui (Marriott) / Bhundhari / Manathai / Samui Jasmine / Aloha Resort — คละ 4-5 ดาว 3 · 3 ดาว 2 · ประหยัด 1' },
  { slug: 'top8-bophut-fishermans-village-hotels-samui', th: 'บ่อผุด-หมู่บ้านชาวประมง', en: 'Bophut & Fisherman’s Village', size: 8, newCount: 5,
    reuse: [
      { slug: 'review-greenlight-fishermans-village-resort-samui', name: 'GREENLIGHT Fisherman’s Village Resort', star: 3, score: 8.9, area: 'บ่อผุด · Fisherman’s Village' },
      { slug: 'review-the-waterfront-boutique-hotel-samui', name: 'The Waterfront Boutique Hotel', star: 3, score: 8.6, area: 'บ่อผุด' },
      { slug: 'review-anantara-bophut-koh-samui-surat-thani', name: 'Anantara Bophut Koh Samui Resort', star: 5, score: 9.2, area: 'หาดบ่อผุด · ใกล้ Fisherman’s Village' },
    ],
    brief: 'บ่อผุด/Fisherman’s Village = ย่านชิค คาเฟ่ ตลาดเดินกลางคืน. new 5: พิจารณา Hansar Samui / Peace Resort / Zazen Boutique Resort / The Tongsai Bay(ถ้ายังไม่ใช้) / Ibis Styles Bophut — คละ 4-5 ดาว 2 · บูทีค 2 · ประหยัด 1' },
  { slug: 'top7-maenam-choeng-mon-hotels-samui', th: 'แม่น้ำ-เชิงมน', en: 'Maenam & Choeng Mon', size: 7, newCount: 5,
    reuse: [
      { slug: 'review-garrya-tongsai-bay-samui', name: 'Garrya Tongsai Bay Samui', star: 5, score: 9.4, area: 'หาดเชิงมน · อ่าวท้องทรายน้อย' },
      { slug: 'review-lipa-bay-resort-samui', name: 'Lipa Bay Resort', star: 3, score: 8.0, area: 'หาดลิปะน้อย (ฝั่งตะวันตก — ระบุทำเลตรงไปตรงมา)' },
    ],
    brief: 'แม่น้ำ = หาดเงียบ สายชิล/ครอบครัว · เชิงมน = สงบใกล้สนามบิน. new 5: พิจารณา Santiburi Koh Samui (แม่น้ำ, 5 ดาว) / W Koh Samui (เชิงมน) / Melia Koh Samui / Code Beachfront / Maenam Resort — คละ luxury 2 · กลาง 2 · ประหยัด 1 · ระบุชัด แม่น้ำ vs เชิงมน' },
]

function overrides(set) {
  return `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · ห้าม dark patterns
- schema: astro/src/content.config.ts (reviewSchema) · ตัวอย่างผ่าน gate: astro/src/content/reviews/review-keemala-phuket.json · ครบทุก field (parent* REQUIRED)
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย ≥2000 คำ) + astro/src/content/reviews-en/<slug>.json (ไม่มีไทยหลุด)
- ⚠️ ห้ามเขียนทับไฟล์รีวิวที่มีอยู่แล้ว — เช็คก่อนเขียน
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking = URL ปกติ
- parent: parentHref="${set.slug}.html" · parentName/parentShort/parentCrumbName สื่อ "โรงแรม${set.th}" · parentCrumbUrl "https://thailandaddict.com/${set.slug}" (EN /en/) · crumbCityName="${CITY.th}"(EN "${CITY.en}"), crumbCityHref="${CITY.hub}" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH" · cluster="${CITY.cluster}"
- related/prev/next วนภายในชุดนี้ (รวม reuse)
- รูป: รูปจริง → astro/public/images/hotels/${CITY.imgPrefix}-<ชื่อสั้น>-1.jpg (-2,-3) · curl -o ตรงชื่อปลายทาง · ห้าม temp · **ห้าม rm/ลบไฟล์** · โหลดไม่ได้ปล่อยว่าง
- ราคา "เริ่มประมาณ" · กวาดคำต้องห้ามก่อนบันทึก`
}

const PLAN_SCHEMA = (n) => ({ type: 'object', additionalProperties: false, required: ['hotels'], properties: { hotels: { type: 'array', minItems: n, maxItems: n, items: { type: 'object', additionalProperties: false, required: ['name', 'slug', 'area', 'tier', 'starTier', 'whyPick'], properties: {
  name: { type: 'string' }, slug: { type: 'string' }, area: { type: 'string' }, tier: { type: 'string', enum: ['luxury', 'boutique', 'midrange', 'budget', 'hostel'] }, starTier: { type: 'number' }, whyPick: { type: 'string' } } } } } })

phase('Sets')
const results = await parallel(SETS.map(set => async () => {
  const plan = await agent(
`ค้นเว็บ (Booking/Agoda/Trip.com) เลือกที่พักย่าน "${set.th} ${CITY.th}" (${set.en}, ${CITY.en}) ที่เปิดจริงตอนนี้ ${set.newCount} แห่ง สำหรับชุด "${set.slug}"
เงื่อนไข: คะแนน OTA ≥8.0 · รีวิวจริงพอสมควร · อยู่ใน${set.th}จริง · ${set.brief}
ห้ามเลือกที่มีรีวิวแล้ว (reuse): ${set.reuse.map(r => r.name).join(' · ')}
slug = review-<ชื่อ-kebab>-${CITY.cluster} · คืนตาม schema พร้อม whyPick`,
    { label: `plan:${set.slug.slice(0, 26)}`, phase: 'Sets', schema: PLAN_SCHEMA(set.newCount) })
  const all = [...plan.hotels.map(h => ({ ...h, isNew: true })), ...set.reuse.map(r => ({ ...r, isNew: false }))]
  const slugList = all.map(h => `${h.name} → ${h.slug} (${h.starTier || h.star}★, ${h.area})${h.isNew ? '' : ' [reuse]'}`).join('\n')
  log(`[${set.slug}] planned ${plan.hotels.length} new + ${set.reuse.length} reuse`)
  const reviewed = await parallel(plan.hotels.map(h => () =>
    agent(
`รีวิวโรงแรม "${h.name}" ${set.th} ${CITY.th} · slug=${h.slug} · ${h.starTier} ดาว (${h.tier}) · ${h.area}
ในชุด roundup "${set.slug}" (Top ${set.size} โรงแรม${set.th})
สำคัญ: อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำตามทุกขั้นตอน (วิจัยเว็บ → schema → TH+EN → รูปจริง) — ยกเว้นจุด override
${overrides(set)}
โรงแรมทั้งชุด:\n${slugList}`,
      { label: `rv:${h.slug.replace('review-', '').slice(0, 22)}`, phase: 'Sets' }
    ).then(() => ({ ok: true })).catch(() => ({ ok: false }))))
  const okN = reviewed.filter(x => x && x.ok).length
  log(`[${set.slug}] reviews ok ${okN}/${plan.hotels.length}`)
  await agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วทำตามทุกขั้นตอน — ยกเว้น override
สร้าง roundup "Top ${set.size} โรงแรม${set.th} ${CITY.th}" — เขียน astro/src/content/roundups/${set.slug}.json (ไทย) + astro/src/content/roundups-en/${set.slug}.json (อังกฤษ)
schema: roundupSchema · แบบอย่าง: astro/src/content/roundups/top7-kamala-beach-hotels-phuket.json + top10-jomtien-beach-hotels-pattaya.json
slug="${set.slug}" · จัดอันดับจากรีวิวทั้ง ${set.size} (อ่าน JSON ใน astro/src/content/reviews/ ทุก slug ดึงคะแนน/ราคา/ทำเล/ลิงก์จอง/img) · reviewUrl="<slug>.html"
breadcrumb: หน้าแรก → ประเทศไทย → ${CITY.th} (${CITY.hub}) → หน้านี้ · intro เล่าคาแรกเตอร์${set.th}
${overrides(set)}
โรงแรมในชุด (อันดับตามจริง):\n${slugList}`,
    { label: `roundup:${set.slug.slice(0, 24)}`, phase: 'Sets' })
  return { set: set.slug, planned: plan.hotels.length, reviewsOk: okN }
}))
log('Samui fan-out complete: ' + results.filter(Boolean).map(r => `${r.set}:${r.reviewsOk}`).join(' · '))
return { sets: results.filter(Boolean) }

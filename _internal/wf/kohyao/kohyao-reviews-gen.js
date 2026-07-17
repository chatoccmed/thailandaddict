export const meta = {
  name: 'kohyao-reviews-gen',
  description: 'Generate 6 full Thai hotel reviews for Koh Yao hotels, grounded in verified research + a Koh Yao (Phang Nga) template',
  phases: [{ title: 'Write' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const RESEARCH = REPO + '\\_internal\\wf\\kohyao\\research.json'
const TEMPLATE = REPO + '\\astro\\src\\content\\reviews\\review-cape-kudu-phang-nga.json'
const OUTDIR = REPO + '\\astro\\src\\content\\reviews'

const SLUGS = [
  'review-six-senses-yao-noi-phang-nga',
  'review-treehouse-villas-koh-yao-phang-nga',
  'review-anantara-koh-yao-yai-phang-nga',
  'review-koyao-bay-pavilions-phang-nga',
  'review-koh-yao-yai-village-phang-nga',
  'review-thiwson-beach-resort-koh-yao-yai-phang-nga',
]

phase('Write')
const results = await parallel(SLUGS.map(slug => () => {
  const base = slug.replace(/^review-/, '')
  return agent(
    `You are an expert Thai hotel-review writer for thailandaddict.com. Write ONE complete, schema-valid Thai hotel review JSON for a hotel on KOH YAO (เกาะยาว — Koh Yao Noi/เกาะยาวน้อย or Koh Yao Yai/เกาะยาวใหญ่), Phang Nga.

STEP 1 — Read:
  • YOUR HOTEL'S VERIFIED RESEARCH: open ${RESEARCH} and find the object whose slug === "${slug}" (your ONLY source of facts). Do NOT invent facts.
  • FORMAT TEMPLATE (mirror EVERY key + exact array lengths — it is an existing Koh Yao review): ${TEMPLATE}

STEP 2 — Write the finished JSON to: ${OUTDIR}\\${slug}.json

HARD REQUIREMENTS (match the template's schema exactly):
1. slug="${slug}", cluster="phang-nga". Include EVERY key the template has, same exact array lengths: gallery=3, galleryAlts=3, highlights=3, ratingBars=6, honestChecks=3, tips=4, body=array of {kind:'p'|'quote', html}. Omit none.
2. IMAGES — use these exact paths (no leading slash), photos added separately: image="images/hotels/${base}-1.jpg", heroImg="images/hotels/${base}-1.jpg", heroSub1="images/hotels/${base}-2.jpg", heroSub2="images/hotels/${base}-3.jpg", gallery=["images/hotels/${base}-2.jpg","images/hotels/${base}-3.jpg","images/hotels/${base}-4.jpg"], mapImg="images/hotels/${base}-4.jpg".
3. BODY: a genuine >=2000-character Thai review (8-10 {kind:'p'} blocks + 1-2 {kind:'quote'} guest-voice blocks), v2-clean tone (เพื่อนเล่าให้เพื่อน), grounded ENTIRELY in the research highlights/cons. MUST cover Koh Yao realities: which island (เกาะยาวน้อย/เกาะยาวใหญ่) + beach + its character, HOW YOU GET THERE (นั่งเรือหางยาว/สปีดโบ๊ทจากท่าเรือบางโรง ภูเก็ต หรือท่าเรือทับละมุ/อ่าวนาง กระบี่ ~30-45 นาที แล้วต่อรถ/มอเตอร์ไซค์บนเกาะ; รีสอร์ตหรูมักมีเรือรับส่งส่วนตัว), the ISLAND VIBE (เกาะยาวเป็นเกาะเงียบสงบ ชุมชนประมงมุสลิม วิถีท้องถิ่นแท้ ไม่มีชีวิตกลางคืนวุ่นวาย บางที่ไม่มีแอลกอฮอล์ เหมาะพักผ่อน/ฮันนีมูน มากกว่าปาร์ตี้), หาดตื้น/น้ำลงเห็นหาดโคลนบางช่วง (ปกติของอ่าวพังงา), rooms, pool/beach, food, service, honest drawbacks. NO invented amenities.
4. booking/agoda objects: booking.score=research scoreBooking, agoda.score=scoreAgoda or ""; pros/cons from research highlights/cons. ratingBars: 6 realistic {label,value,width}.
5. bookingAgoda=research agodaUrl, bookingBooking=research bookingUrl, bookingTrip=research tripUrl (copy verbatim; affiliate IDs added later).
6. rooms from research rooms (name=type, price="฿"+formatted like "฿6,000", full=short Thai descriptor). qiPrice="฿"+priceFromTHB, qiPriceUnit="/คืน".
7. score=sensible overall /10 (anchor on scoreBooking), starRating from research, ratingCount=plausible integer.
8. All SEO/hero/nav/location fields per the template's Phang Nga pattern but for THIS hotel + Koh Yao. Location fields MUST say เกาะยาวน้อย/เกาะยาวใหญ่ + area. crumbCityName="พังงา", crumbCityHref="city-phang-nga.html". parentName="10 โรงแรมพังงายอดนิยม", parentHref="top10-hotels-phang-nga.html", parentCrumbUrl="https://thailandaddict.com/top10-hotels-phang-nga". honesty EEAT: "เสียงจากรีวิวจริง", never "ไปพักเอง". No dark patterns, no AI words (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก).

Write the file. Return one line: {"slug":"${slug}","bodyChars":N,"score":N}.`,
    { label: `rev:${base.slice(0,22)}`, phase: 'Write', effort: 'high' }
  ).then(r => ({ slug, ok: true, raw: r })).catch(e => ({ slug, ok: false, err: String(e) }))
}))
return { generated: results.filter(Boolean) }

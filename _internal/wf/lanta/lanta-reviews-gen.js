export const meta = {
  name: 'lanta-reviews-gen',
  description: 'Generate 8 full Thai hotel reviews for Koh Lanta hotels, grounded in verified research + a Krabi template',
  phases: [{ title: 'Write' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const RESEARCH = REPO + '\\_internal\\wf\\lanta\\research.json'
const TEMPLATE = REPO + '\\astro\\src\\content\\reviews\\review-ananta-burin-resort-krabi.json'
const OUTDIR = REPO + '\\astro\\src\\content\\reviews'

const SLUGS = [
  'review-pimalai-resort-spa-koh-lanta-krabi',
  'review-layana-resort-spa-koh-lanta-krabi',
  'review-the-houben-hotel-koh-lanta-krabi',
  'review-rawi-warin-resort-spa-koh-lanta-krabi',
  'review-srilanta-resort-spa-koh-lanta-krabi',
  'review-southern-lanta-resort-koh-lanta-krabi',
  'review-lanta-castaway-beach-resort-koh-lanta-krabi',
  'review-klong-jark-bungalows-koh-lanta-krabi',
]

phase('Write')
const results = await parallel(SLUGS.map(slug => () => {
  const base = slug.replace(/^review-/, '')
  return agent(
    `You are an expert Thai hotel-review writer for thailandaddict.com. Write ONE complete, schema-valid Thai hotel review JSON for a hotel on KOH LANTA (เกาะลันตา), Krabi.

STEP 1 — Read:
  • YOUR HOTEL'S VERIFIED RESEARCH: open ${RESEARCH} and find the object whose slug === "${slug}" (your ONLY source of facts — scores, prices, rooms, beach/zone, real highlights & cons, booking URLs). Do NOT invent facts.
  • FORMAT TEMPLATE (mirror EVERY key + exact array lengths): ${TEMPLATE}

STEP 2 — Write the finished JSON to: ${OUTDIR}\\${slug}.json

HARD REQUIREMENTS (match the template's schema exactly):
1. slug="${slug}", cluster="krabi". Include EVERY key the template has, same exact array lengths: gallery=3, galleryAlts=3, highlights=3, ratingBars=6, honestChecks=3, tips=4, body=array of {kind:'p'|'quote', html}. Omit none.
2. IMAGES — use these exact paths (no leading slash), photos added separately: image="images/hotels/${base}-1.jpg", heroImg="images/hotels/${base}-1.jpg", heroSub1="images/hotels/${base}-2.jpg", heroSub2="images/hotels/${base}-3.jpg", gallery=["images/hotels/${base}-2.jpg","images/hotels/${base}-3.jpg","images/hotels/${base}-4.jpg"], mapImg="images/hotels/${base}-4.jpg".
3. BODY: a genuine >=2000-character Thai review (8-10 {kind:'p'} blocks + 1-2 {kind:'quote'} guest-voice blocks), v2-clean tone (เพื่อนเล่าให้เพื่อน), grounded ENTIRELY in the research highlights/cons. MUST cover Koh Lanta realities: which beach + its vibe (Klong Dao=เงียบ/ครอบครัว, Long Beach/พระแอ=ยาว/ร้านเยอะ, Klong Nin/Klong Toab=เงียบฝั่งตะวันตกดูพระอาทิตย์ตก, Kantiang Bay=หรู/ห่างไกล, Klong Jark=เงียบสุด), HOW YOU GET THERE (นั่งรถ+เรือเฟอร์รี่ข้ามฟาก หรือสะพานข้ามเกาะลันตาน้อย จากกระบี่/สนามบิน ~2-2.5 ชม. minivan; หาดฝั่งใต้/ตะวันตกไกล ต้องเช่ามอเตอร์ไซค์/แท็กซี่), SEASONAL CLOSURE if the research notes it (หลายรีสอร์ตปิดหน้าฝน พ.ค.-ต.ค.), rooms, pool/beach, food, service, honest drawbacks. NO invented amenities.
4. booking/agoda objects: booking.score=research scoreBooking, agoda.score=scoreAgoda or ""; pros/cons from research highlights/cons. ratingBars: 6 realistic {label,value,width}.
5. bookingAgoda=research agodaUrl, bookingBooking=research bookingUrl, bookingTrip=research tripUrl (copy verbatim; affiliate IDs added later).
6. rooms from research rooms (name=type, price="฿"+formatted like "฿3,500", full=short Thai descriptor). qiPrice="฿"+priceFromTHB, qiPriceUnit="/คืน".
7. score=sensible overall /10 (anchor on scoreBooking), starRating from research, ratingCount=plausible integer.
8. All SEO/hero/nav/location fields per the template's Krabi pattern but for THIS hotel + Koh Lanta. Location fields MUST say เกาะลันตา + the specific beach. crumbCityName="กระบี่", crumbCityHref="city-krabi.html". parentName="10 โรงแรมกระบี่ยอดนิยม", parentHref="top10-hotels-krabi.html". honesty EEAT: "เสียงจากรีวิวจริง", never "ไปพักเอง". No dark patterns, no AI words (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก).

Write the file. Return one line: {"slug":"${slug}","bodyChars":N,"score":N}.`,
    { label: `rev:${base.slice(0,22)}`, phase: 'Write', effort: 'high' }
  ).then(r => ({ slug, ok: true, raw: r })).catch(e => ({ slug, ok: false, err: String(e) }))
}))
return { generated: results.filter(Boolean) }

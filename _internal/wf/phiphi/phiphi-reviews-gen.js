export const meta = {
  name: 'phiphi-reviews-gen',
  description: 'Generate 8 full Thai hotel reviews for Koh Phi Phi hotels, grounded in verified research + a Krabi template',
  phases: [{ title: 'Write' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const RESEARCH = REPO + '\\_internal\\wf\\phiphi\\research.json'
const TEMPLATE = REPO + '\\astro\\src\\content\\reviews\\review-ananta-burin-resort-krabi.json'
const OUTDIR = REPO + '\\astro\\src\\content\\reviews'

const SLUGS = [
  'review-saii-phi-phi-island-village-krabi',
  'review-phi-phi-holiday-resort-krabi',
  'review-phi-phi-island-cabana-hotel-krabi',
  'review-phi-phi-the-beach-resort-krabi',
  'review-pp-princess-resort-krabi',
  'review-phi-phi-bayview-premier-resort-krabi',
  'review-viking-nature-resort-phi-phi-krabi',
  'review-paradise-pearl-bungalows-phi-phi-krabi',
]

phase('Write')
const results = await parallel(SLUGS.map(slug => () => {
  const base = slug.replace(/^review-/, '')
  return agent(
    `You are an expert Thai hotel-review writer for thailandaddict.com. Write ONE complete, schema-valid Thai hotel review JSON for a hotel on KOH PHI PHI (เกาะพีพี), Krabi.

STEP 1 — Read:
  • YOUR HOTEL'S VERIFIED RESEARCH: open ${RESEARCH} and find the object whose slug === "${slug}" (that is your ONLY source of facts — scores, prices, rooms, zone/beach, real highlights & cons, booking URLs). Do NOT invent facts.
  • FORMAT TEMPLATE (mirror EVERY key + exact array lengths): ${TEMPLATE}

STEP 2 — Write the finished JSON to: ${OUTDIR}\\${slug}.json

HARD REQUIREMENTS (match the template's schema exactly):
1. slug="${slug}", cluster="krabi". Include EVERY key the template has, with the same exact array lengths: gallery=3, galleryAlts=3, highlights=3, ratingBars=6, honestChecks=3, tips=4, body=array of {kind:'p'|'quote', html}. Omit none.
2. IMAGES — use these exact paths (photos added separately, match the template's per-field leading-slash style): image="images/hotels/${base}-1.jpg", heroImg="images/hotels/${base}-1.jpg", heroSub1="images/hotels/${base}-2.jpg", heroSub2="images/hotels/${base}-3.jpg", gallery=["images/hotels/${base}-2.jpg","images/hotels/${base}-3.jpg","images/hotels/${base}-4.jpg"], mapImg="images/hotels/${base}-4.jpg". (The template shows heroImg with a leading slash in one spot — IGNORE that; use NO leading slash, exactly "images/hotels/...".)
3. BODY: write a genuine >=2000-character Thai review (8-10 {kind:'p'} blocks + 1-2 {kind:'quote'} guest-voice blocks), v2-clean tone (เพื่อนเล่าให้เพื่อน), grounded ENTIRELY in the research highlights/cons. MUST cover Koh Phi Phi island realities: which beach/bay, HOW YOU GET THERE (ferry to Tonsai Pier + longtail/resort boat transfer, or walk), the vibe (party village Tonsai/Loh Dalum vs quiet Laem Tong/Long Beach), rooms, pool/beach/snorkeling, food, service, and honest island drawbacks (boat access, generator/aircon hours if relevant, mosquitoes, steep steps, ferry logistics, no cars on island). NO invented amenities.
4. booking/agoda objects: booking.score = research scoreBooking, agoda.score = scoreAgoda or ""; pros/cons arrays derived from research highlights/cons. ratingBars: 6 realistic {label,value,width} bars consistent with the scores.
5. bookingAgoda = research agodaUrl, bookingBooking = research bookingUrl, bookingTrip = research tripUrl (copy verbatim; affiliate IDs added in post-processing). If a research URL is empty, use a sensible hotel-detail URL pattern for that platform but keep it plausible — prefer leaving Booking/Trip to the real one from research.
6. rooms: from research rooms (name = type, price = "฿"+priceTHB formatted like "฿3,200", full = a short Thai descriptor). qiPrice = "฿"+priceFromTHB, qiPriceUnit="/คืน".
7. score = a sensible overall /10 (anchor on research scoreBooking), starRating from research, ratingCount = a plausible integer from the review counts noted in research.
8. All SEO/hero/nav/location fields (title, metaDesc, keywords, og*, hero*, qi*, badgeLoc, hiLoc, parent*, crumbCity*, faq, quickAnswerHtml, etc.): fill per the template's Krabi pattern but for THIS hotel + Koh Phi Phi. Location fields MUST say เกาะพีพี + the specific beach. crumbCityName="กระบี่", crumbCityHref="city-krabi.html". parentName="10 โรงแรมกระบี่ยอดนิยม", parentHref="top10-hotels-krabi.html". honesty EEAT: "เสียงจากรีวิวจริง", never "ไปพักเอง"/"ไม่ได้ไปพักเอง". No dark patterns, no AI words (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก).

Write the file. Return one line: {"slug":"${slug}","bodyChars":N,"score":N}.`,
    { label: `rev:${base.slice(0,22)}`, phase: 'Write', effort: 'high' }
  ).then(r => ({ slug, ok: true, raw: r })).catch(e => ({ slug, ok: false, err: String(e) }))
}))
return { generated: results.filter(Boolean) }

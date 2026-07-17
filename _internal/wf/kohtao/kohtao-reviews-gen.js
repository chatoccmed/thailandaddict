export const meta = {
  name: 'kohtao-reviews-gen',
  description: 'Generate 8 full Thai hotel reviews for Koh Tao hotels, grounded in verified research + a Surat Thani template',
  phases: [{ title: 'Write' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const RESEARCH = REPO + '\\_internal\\wf\\kohtao\\research.json'
const TEMPLATE = REPO + '\\astro\\src\\content\\reviews\\review-anantara-bophut-koh-samui-surat-thani.json'
const OUTDIR = REPO + '\\astro\\src\\content\\reviews'

const SLUGS = [
  'review-jamahkiri-dive-resort-spa-koh-tao-surat-thani',
  'review-haadtien-beach-resort-koh-tao-surat-thani',
  'review-koh-tao-heights-pool-villas-surat-thani',
  'review-bans-diving-resort-koh-tao-surat-thani',
  'review-sensi-paradise-beach-resort-koh-tao-surat-thani',
  'review-chintakiri-resort-koh-tao-surat-thani',
  'review-sairee-cottage-resort-koh-tao-surat-thani',
  'review-mountain-reef-beach-resort-koh-tao-surat-thani',
]

phase('Write')
const results = await parallel(SLUGS.map(slug => () => {
  const base = slug.replace(/^review-/, '')
  return agent(
    `You are an expert Thai hotel-review writer for thailandaddict.com. Write ONE complete, schema-valid Thai hotel review JSON for a hotel on KOH TAO (เกาะเต่า), Surat Thani — the diving island.

STEP 1 — Read:
  • YOUR HOTEL'S VERIFIED RESEARCH: open ${RESEARCH} and find the object whose slug === "${slug}" (your ONLY source of facts — scores, prices, rooms, beach/zone, real highlights & cons, booking URLs). Do NOT invent facts.
  • FORMAT TEMPLATE (mirror EVERY key + exact array lengths): ${TEMPLATE}

STEP 2 — Write the finished JSON to: ${OUTDIR}\\${slug}.json

HARD REQUIREMENTS (match the template's schema exactly):
1. slug="${slug}", cluster="surat-thani". Include EVERY key the template has, same exact array lengths: gallery=3, galleryAlts=3, highlights=3, ratingBars=6, honestChecks=3, tips=4, body=array of {kind:'p'|'quote', html}. Omit none.
2. IMAGES — use these exact paths (no leading slash), photos added separately: image="images/hotels/${base}-1.jpg", heroImg="images/hotels/${base}-1.jpg", heroSub1="images/hotels/${base}-2.jpg", heroSub2="images/hotels/${base}-3.jpg", gallery=["images/hotels/${base}-2.jpg","images/hotels/${base}-3.jpg","images/hotels/${base}-4.jpg"], mapImg="images/hotels/${base}-4.jpg".
3. BODY: a genuine >=2000-character Thai review (8-10 {kind:'p'} blocks + 1-2 {kind:'quote'} guest-voice blocks), v2-clean tone (เพื่อนเล่าให้เพื่อน), grounded ENTIRELY in the research highlights/cons. MUST cover Koh Tao realities: which beach/bay + vibe (Sairee=หาดหลักคึกคัก ร้าน/บาร์/ดำน้ำเยอะ, Chalok=ใต้เกาะเงียบกว่า, Mae Haad=ท่าเรือ/หมู่บ้าน เดินสะดวก, Tanote/อ่าวเงียบ=ดำน้ำตื้นสวย ห่างไกล, Haad Tien/Shark Bay=ส่วนตัวสุด), HOW YOU GET THERE (นั่งเรือ catamaran Lomprayah/Songserm จากชุมพร/สุราษฎร์ฯ/เกาะสมุย/เกาะพะงัน มาลงท่าเรือแม่หาด แล้วต่อสองแถว/แท็กซี่; อ่าวห่างไกลต้องต่อเรือหรือรถ; หน้ามรสุมเรืออาจงด), the DIVE-island character (โรงแรมหลายที่เป็น dive resort เรียนดำน้ำได้ในตัว), fan vs AC bungalow ตามงบ, steep hillside ถ้ามี, rooms, pool/beach/snorkeling, food, service, honest drawbacks. NO invented amenities.
4. booking/agoda objects: booking.score=research scoreBooking, agoda.score=scoreAgoda or ""; pros/cons from research highlights/cons. ratingBars: 6 realistic {label,value,width}.
5. bookingAgoda=research agodaUrl, bookingBooking=research bookingUrl, bookingTrip=research tripUrl (copy verbatim; affiliate IDs added later).
6. rooms from research rooms (name=type, price="฿"+formatted like "฿2,800", full=short Thai descriptor). qiPrice="฿"+priceFromTHB, qiPriceUnit="/คืน".
7. score=sensible overall /10 (anchor on scoreBooking), starRating from research, ratingCount=plausible integer.
8. All SEO/hero/nav/location fields per the template's Surat Thani pattern but for THIS hotel + Koh Tao. Location fields MUST say เกาะเต่า + the specific beach. crumbCityName="สุราษฎร์ธานี", crumbCityHref="city-surat-thani.html". parentName="10 โรงแรมสุราษฎร์ธานียอดนิยม", parentHref="top10-hotels-surat-thani.html", parentCrumbUrl="https://thailandaddict.com/top10-hotels-surat-thani". honesty EEAT: "เสียงจากรีวิวจริง", never "ไปพักเอง". No dark patterns, no AI words (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก).

Write the file. Return one line: {"slug":"${slug}","bodyChars":N,"score":N}.`,
    { label: `rev:${base.slice(0,22)}`, phase: 'Write', effort: 'high' }
  ).then(r => ({ slug, ok: true, raw: r })).catch(e => ({ slug, ok: false, err: String(e) }))
}))
return { generated: results.filter(Boolean) }

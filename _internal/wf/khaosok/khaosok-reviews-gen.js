export const meta = {
  name: 'khaosok-reviews-gen',
  description: 'Generate 6 full Thai reviews for Khao Sok stays, grounded in verified research + a Khao Sok template',
  phases: [{ title: 'Write' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const RESEARCH = REPO + '\\_internal\\wf\\khaosok\\research.json'
const TEMPLATE = REPO + '\\astro\\src\\content\\reviews\\review-khao-sok-rafthouse-surat-thani.json'
const OUTDIR = REPO + '\\astro\\src\\content\\reviews'

const SLUGS = [
  'review-panvaree-the-greenery-resort-khao-sok-surat-thani',
  'review-praiwan-raft-house-khao-sok-surat-thani',
  'review-our-jungle-house-khao-sok-surat-thani',
  'review-anurak-community-lodge-khao-sok-surat-thani',
  'review-khao-sok-las-orquideas-resort-surat-thani',
  'review-montania-lifestyle-hotel-khao-sok-surat-thani',
]

phase('Write')
const results = await parallel(SLUGS.map(slug => () => {
  const base = slug.replace(/^review-/, '')
  return agent(
    `You are an expert Thai travel-review writer for thailandaddict.com. Write ONE complete, schema-valid Thai review JSON for a stay at KHAO SOK (เขาสก), Surat Thani — Thailand's oldest rainforest national park + Cheow Lan Lake (เขื่อนเชี่ยวหลาน/รัชชประภา).

STEP 1 — Read:
  • YOUR STAY'S VERIFIED RESEARCH: open ${RESEARCH} and find the object whose slug === "${slug}" (your ONLY source of facts). Do NOT invent facts.
  • FORMAT TEMPLATE (mirror EVERY key + exact array lengths — it is an existing Khao Sok review): ${TEMPLATE}

STEP 2 — Write the finished JSON to: ${OUTDIR}\\${slug}.json

HARD REQUIREMENTS (match the template's schema exactly):
1. slug="${slug}", cluster="surat-thani". Include EVERY key the template has, same exact array lengths: gallery=3, galleryAlts=3, highlights=3, ratingBars=6, honestChecks=3, tips=4, body=array of {kind:'p'|'quote', html}. Omit none.
2. IMAGES — use these exact paths (no leading slash), photos added separately: image="images/hotels/${base}-1.jpg", heroImg="images/hotels/${base}-1.jpg", heroSub1="images/hotels/${base}-2.jpg", heroSub2="images/hotels/${base}-3.jpg", gallery=["images/hotels/${base}-2.jpg","images/hotels/${base}-3.jpg","images/hotels/${base}-4.jpg"], mapImg="images/hotels/${base}-4.jpg".
3. BODY: a genuine >=2000-character Thai review (8-10 {kind:'p'} blocks + 1-2 {kind:'quote'} guest-voice blocks), v2-clean tone (เพื่อนเล่าให้เพื่อน), grounded ENTIRELY in the research highlights/cons. MUST cover Khao Sok realities: WHICH sub-zone + its character — ถ้าเป็นแพกลางทะเลสาบเชี่ยวหลาน (floating raft): เน้นวิวเขาหินปูนกลางน้ำแบบกุ้ยหลิน ต้องนั่งรถไปท่าเรือเขื่อนรัชชประภา แล้วต่อเรือหางยาว ~1 ชม.+ (มักต้องมากับทัวร์/ทรานสเฟอร์) ไฟ/แอร์/ wifi มีจำกัดบางช่วง พายเรือคายัค ล่องเรือชมสัตว์เช้าตรู่; ถ้าเป็นลอดจ์ในป่า Khlong Sok (jungle lodge): ริมแม่น้ำสก เดินถึงทางเข้าอุทยาน เดินป่า/ล่องแก่ง/ห่วงยาง ใกล้หมู่บ้านคลองสก. HOW YOU GET THERE (นั่งรถตู้/แท็กซี่จากสุราษฎร์ธานี ~1.5 ชม. หรือภูเก็ต/กระบี่ ~2.5-3 ชม. มาที่หมู่บ้านคลองสก; แพทะเลสาบต้องต่อรถ+เรือ). ธรรมชาติ: ป่าฝน สัตว์ป่า ร้อนชื้น ฝนตกบ่อย ยุง/แมลง ไม่มีชายหาด. rooms, food, service, honest drawbacks. NO invented amenities.
4. booking/agoda objects: booking.score=research scoreBooking, agoda.score=scoreAgoda or ""; pros/cons from research highlights/cons. ratingBars: 6 realistic {label,value,width}.
5. bookingAgoda=research agodaUrl, bookingBooking=research bookingUrl, bookingTrip=research tripUrl (copy verbatim; affiliate IDs added later).
6. rooms from research rooms (name=type, price="฿"+formatted, full=short Thai descriptor). qiPrice="฿"+priceFromTHB, qiPriceUnit="/คืน".
7. score=sensible overall /10 (anchor on scoreBooking), starRating from research, ratingCount=plausible integer.
8. All SEO/hero/nav/location fields per the template's Khao Sok pattern. Location fields MUST say เขาสก + sub-zone (ทะเลสาบเชี่ยวหลาน / คลองสก). crumbCityName="สุราษฎร์ธานี", crumbCityHref="city-surat-thani.html". parentName="10 โรงแรมสุราษฎร์ธานียอดนิยม", parentHref="top10-hotels-surat-thani.html", parentCrumbUrl="https://thailandaddict.com/top10-hotels-surat-thani". honesty EEAT: "เสียงจากรีวิวจริง", never "ไปพักเอง". No dark patterns, no AI words (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก).

Write the file. Return one line: {"slug":"${slug}","bodyChars":N,"score":N}.`,
    { label: `rev:${base.slice(0,22)}`, phase: 'Write', effort: 'high' }
  ).then(r => ({ slug, ok: true, raw: r })).catch(e => ({ slug, ok: false, err: String(e) }))
}))
return { generated: results.filter(Boolean) }

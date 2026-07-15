export const meta = {
  name: 'kohtao-reviews-en',
  description: 'Translate 8 Koh Tao hotel reviews into English twins',
  phases: [{ title: 'Translate' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TH_DIR = REPO + '\\astro\\src\\content\\reviews'
const EN_DIR = REPO + '\\astro\\src\\content\\reviews-en'
const EN_TEMPLATE = EN_DIR + '\\review-anantara-bophut-koh-samui-surat-thani.json'
const SLUGS = ['review-jamahkiri-dive-resort-spa-koh-tao-surat-thani','review-haadtien-beach-resort-koh-tao-surat-thani','review-koh-tao-heights-pool-villas-surat-thani','review-bans-diving-resort-koh-tao-surat-thani','review-sensi-paradise-beach-resort-koh-tao-surat-thani','review-chintakiri-resort-koh-tao-surat-thani','review-sairee-cottage-resort-koh-tao-surat-thani','review-mountain-reef-beach-resort-koh-tao-surat-thani']

phase('Translate')
const results = await parallel(SLUGS.map(slug => () =>
  agent(
    `Translate a finalized Thai hotel review into its ENGLISH twin for thailandaddict.com (/en/).

STEP 1 — Read:
  • SOURCE (finalized Thai review): ${TH_DIR}\\${slug}.json
  • EN CONVENTIONS REFERENCE (an existing English review twin — copy its structure/href style): ${EN_TEMPLATE}
STEP 2 — Write the English twin to: ${EN_DIR}\\${slug}.json

RULES:
1. Same JSON keys/structure as the Thai source. Same array lengths (gallery=3, galleryAlts=3, highlights=3, ratingBars=6, honestChecks=3, tips=4, body same block count).
2. Translate ALL Thai text to natural, fluent English (friendly travel-writer register): title, metaDesc, keywords, ogTitle, ogDesc, twDesc, schemaDesc, h1, intro, heroSub1/2, badge*, hi*, qi* labels+values, body[].html (keep the >=2000-char depth), highlights, ratingBars labels, booking/agoda pros+cons, honestSummary, honestChecks, rooms[].name+full, tips, info, galleryAlts, faq, quickAnswerHtml, nav/parent/crumb labels, heroCredit. Romanize Thai place names (สุราษฎร์ธานี->Surat Thani, เกาะเต่า->Koh Tao, หาดทรายรี->Sairee Beach, อ่าวโฉลกบ้านเก่า->Chalok Baan Kao, แม่หาด->Mae Haad, อ่าวตาโหนด->Tanote Bay, หาดเทียน/อ่าวเทียนโอ๊ะ->Haad Tien/Shark Bay, เกาะนางยวน->Koh Nang Yuan, เกาะ->Koh).
3. Copy BYTE-FOR-BYTE (do NOT alter): score, starRating, ratingCount, image, heroImg, heroSub1, heroSub2, gallery[] paths, mapImg, bookingAgoda, bookingBooking, bookingTrip, heroCreditHref, all numeric prices/฿ amounts. The ฿ symbol stays.
4. Breadcrumbs/nav -> English site (follow the EN template): keep same slug values; crumbCityName="Surat Thani". Keep slug identical to source.
5. ZERO Thai script characters in output text (only ฿ allowed). Honest tone (no "we stayed"/"we didn't stay" disclaimers), no fake urgency, no AI words.

Write the file. Return one line: {"slug":"${slug}","done":true}.`,
    { label: `en:${slug.replace(/^review-/, '').slice(0, 20)}`, phase: 'Translate', effort: 'high' }
  ).then(r => ({ slug, ok: true })).catch(e => ({ slug, ok: false, err: String(e) }))
))
return { translated: results.filter(Boolean) }

export const meta = {
  name: 'phiphi-reviews-en',
  description: 'Translate 8 Koh Phi Phi hotel reviews into English twins',
  phases: [{ title: 'Translate' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TH_DIR = REPO + '\\astro\\src\\content\\reviews'
const EN_DIR = REPO + '\\astro\\src\\content\\reviews-en'
const EN_TEMPLATE = EN_DIR + '\\review-ananta-burin-resort-krabi.json'
const SLUGS = ['review-saii-phi-phi-island-village-krabi','review-phi-phi-holiday-resort-krabi','review-phi-phi-island-cabana-hotel-krabi','review-phi-phi-the-beach-resort-krabi','review-pp-princess-resort-krabi','review-phi-phi-bayview-premier-resort-krabi','review-viking-nature-resort-phi-phi-krabi','review-paradise-pearl-bungalows-phi-phi-krabi']

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
2. Translate ALL Thai text to natural, fluent English (friendly travel-writer register): title, metaDesc, keywords, ogTitle, ogDesc, twDesc, schemaDesc, h1, intro, heroSub1/2, badge*, hi*, qi* labels+values, body[].html (keep the >=2000-char depth), highlights, ratingBars labels, booking/agoda pros+cons, honestSummary, honestChecks, rooms[].name+full, tips, info, galleryAlts, faq, quickAnswerHtml, nav/parent/crumb labels, heroCredit. Romanize Thai place names (กระบี่->Krabi, เกาะพีพี->Koh Phi Phi, อ่าวโละดาลัม->Loh Dalum, หาดยาว->Long Beach, แหลมตง->Laem Tong, อ่าวต้นไทร->Tonsai, เกาะ->Koh).
3. Copy BYTE-FOR-BYTE (do NOT alter): score, starRating, ratingCount, image, heroImg, heroSub1, heroSub2, gallery[] paths, mapImg, bookingAgoda, bookingBooking, bookingTrip, heroCreditHref, all numeric prices/฿ amounts. The ฿ symbol stays.
4. Breadcrumbs/nav -> English site (follow the EN template): parentHref/crumbCityHref etc. keep same slug values; crumbCityName="Krabi". Keep slug identical to source.
5. ZERO Thai script characters in output text (only ฿ allowed). Honest tone (no "we stayed"/"we didn't stay" disclaimers), no fake urgency, no AI words (well-rounded/world-class/etc.).

Write the file. Return one line: {"slug":"${slug}","done":true}.`,
    { label: `en:${slug.replace(/^review-/, '').slice(0, 20)}`, phase: 'Translate', effort: 'high' }
  ).then(r => ({ slug, ok: true })).catch(e => ({ slug, ok: false, err: String(e) }))
))
return { translated: results.filter(Boolean) }

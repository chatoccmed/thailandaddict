export const meta = { name: 'phiphi-roundup-en', description: 'EN twin of the Koh Phi Phi roundup', phases: [{ title: 'Translate' }] }
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TH = REPO + '\\astro\\src\\content\\roundups\\top8-phi-phi-hotels-krabi.json'
const EN = REPO + '\\astro\\src\\content\\roundups-en\\top8-phi-phi-hotels-krabi.json'
const REF = REPO + '\\astro\\src\\content\\roundups-en\\top8-railay-hotels-krabi.json'
phase('Translate')
const r = await agent(
  `Translate the finalized Thai roundup ${TH} into its ENGLISH twin, written to ${EN}. Use ${REF} for /en/ href+breadcrumb conventions (it is the same-city Railay roundup twin).
RULES: same JSON structure/keys; translate ALL Thai text to fluent English (title/meta/og/hero*/intro/mrt/compare type+access/advice/note/faq/quickAnswer/nav + per-entry type/revCount/badge/mrtTag/priceSub/tags/story/tip/pros/cons/dividerText/rooms.type); romanize place names (กระบี่->Krabi, เกาะพีพี->Koh Phi Phi, ท่าเรือต้นไทร->Tonsai Pier, โละดาลัม->Loh Dalum, แหลมตง->Laem Tong, โละบาเกา->Loh Bagao, หาดยาว->Long Beach, โละมูดี->Loh Moo Dee, อ่าวนาง->Ao Nang). COPY BYTE-FOR-BYTE (never alter): every entry name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig; toc[].name+price; compareRows[].name+score+price. ฿ stays. breadcrumb[0].href="/en/"; breadcrumbSchema items -> /en/ form; slug + navReviewHref identical. ZERO Thai script in output text (only ฿). No "we (didn't) stay" disclaimers, no AI words. Return {"done":true}.`,
  { label: 'en:phiphi-roundup', phase: 'Translate', effort: 'high' }
).catch(e => ({ err: String(e) }))
return { r }

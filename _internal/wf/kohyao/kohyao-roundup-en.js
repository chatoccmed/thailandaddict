export const meta = { name: 'kohyao-roundup-en', description: 'EN twin of the Koh Yao roundup', phases: [{ title: 'Translate' }] }
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TH = REPO + '\\astro\\src\\content\\roundups\\top10-koh-yao-hotels-phang-nga.json'
const EN = REPO + '\\astro\\src\\content\\roundups-en\\top10-koh-yao-hotels-phang-nga.json'
const REF = REPO + '\\astro\\src\\content\\roundups-en\\top9-koh-lanta-hotels-krabi.json'
phase('Translate')
const r = await agent(
  `Translate the finalized Thai roundup ${TH} into its ENGLISH twin, written to ${EN}. Use ${REF} for /en/ href+breadcrumb conventions (a proven island roundup twin).
RULES: same JSON structure/keys; translate ALL Thai text to fluent English (title/meta/og/hero*/intro/mrt/compare type+access/advice/note/faq/quickAnswer/nav + per-entry type/revCount/badge/mrtTag/priceSub/tags/story/tip/pros/cons/dividerText/rooms.type); romanize place names (พังงา->Phang Nga, เกาะยาวน้อย->Koh Yao Noi, เกาะยาวใหญ่->Koh Yao Yai, อ่าวพังงา->Phang Nga Bay, ท่าเรือบางโรง->Bang Rong pier, ท่าเรือทับละมุ->Thap Lamu pier, อ่าวนาง->Ao Nang, ภูเก็ต->Phuket, กระบี่->Krabi). COPY BYTE-FOR-BYTE (never alter): every entry name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig; toc[].name+price; compareRows[].name+score+price. ฿ stays. breadcrumb[0].href="/en/"; breadcrumbSchema items -> /en/ form; slug + navReviewHref identical. ZERO Thai script in output text (only ฿). No "we (didn't) stay" disclaimers, no AI words. Return {"done":true}.`,
  { label: 'en:kohyao-roundup', phase: 'Translate', effort: 'high' }
).catch(e => ({ err: String(e) }))
return { r }

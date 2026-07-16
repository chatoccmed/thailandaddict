export const meta = { name: 'subzone-roundup-en', description: 'EN twins of the 2 sub-zone roundups', phases: [{ title: 'Translate' }] }
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const RU = REPO + '\\astro\\src\\content\\roundups'
const EN = REPO + '\\astro\\src\\content\\roundups-en'
const REF = EN + '\\top8-khao-sok-hotels-surat-thani.json'
const SLUGS = ['top6-klong-muang-tubkaak-hotels-krabi', 'top8-mae-rim-mae-sa-hotels-chiang-mai']
phase('Translate')
const r = await parallel(SLUGS.map(slug => () =>
  agent(
    `Translate the finalized Thai roundup ${RU}\\${slug}.json into its ENGLISH twin, written to ${EN}\\${slug}.json. Use ${REF} for /en/ href+breadcrumb conventions.
RULES: same JSON structure/keys; translate ALL Thai text to fluent English (title/meta/og/hero*/intro/mrt/compare type+access/advice/note/faq/quickAnswer/nav + per-entry type/revCount/badge/mrtTag/priceSub/tags/story/tip/pros/cons/dividerText/rooms.type); romanize place names (กระบี่->Krabi, หาดคลองม่วง->Klong Muang, ทับแขก->Tubkaak, หนองทะเล->Nong Thale, อ่าวนาง->Ao Nang, เกาะห้อง->Hong Islands, อ่าวท่าเลน->Ao Thalane; เชียงใหม่->Chiang Mai, แม่ริม->Mae Rim, แม่สา->Mae Sa, ม่อนแจ่ม->Mon Cham, โป่งแยง->Pong Yaeng, น้ำตกแม่สา->Mae Sa Waterfall). COPY BYTE-FOR-BYTE (never alter): every entry name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig; toc[].name+price; compareRows[].name+score+price. ฿ stays. breadcrumb[0].href="/en/"; breadcrumbSchema items -> /en/ form; slug + navReviewHref identical. ZERO Thai script in output text (only ฿). No "we (didn't) stay" disclaimers, no AI words. Return {"slug":"${slug}","done":true}.`,
    { label: `en:${slug.slice(0,24)}`, phase: 'Translate', effort: 'high' }
  ).catch(e => ({ err: String(e), slug }))
))
return { r }

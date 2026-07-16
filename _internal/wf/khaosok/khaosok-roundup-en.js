export const meta = { name: 'khaosok-roundup-en', description: 'EN twin of the Khao Sok roundup', phases: [{ title: 'Translate' }] }
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TH = REPO + '\\astro\\src\\content\\roundups\\top8-khao-sok-hotels-surat-thani.json'
const EN = REPO + '\\astro\\src\\content\\roundups-en\\top8-khao-sok-hotels-surat-thani.json'
const REF = REPO + '\\astro\\src\\content\\roundups-en\\top8-koh-tao-hotels-surat-thani.json'
phase('Translate')
const r = await agent(
  `Translate the finalized Thai roundup ${TH} into its ENGLISH twin, written to ${EN}. Use ${REF} for /en/ href+breadcrumb conventions (a proven Surat Thani roundup twin).
RULES: same JSON structure/keys; translate ALL Thai text to fluent English (title/meta/og/hero*/intro/mrt/compare type+access/advice/note/faq/quickAnswer/nav + per-entry type/revCount/badge/mrtTag/priceSub/tags/story/tip/pros/cons/dividerText/rooms.type); romanize place names (สุราษฎร์ธานี->Surat Thani, เขาสก->Khao Sok, ทะเลสาบเชี่ยวหลาน->Cheow Lan Lake, เขื่อนรัชชประภา->Ratchaprapha Dam, คลองสก->Khlong Sok, แม่น้ำสก->Sok River, อุทยานแห่งชาติ->national park, เขาหลัก->Khao Lak, กระบี่->Krabi, ภูเก็ต->Phuket). COPY BYTE-FOR-BYTE (never alter): every entry name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig; toc[].name+price; compareRows[].name+score+price. ฿ stays. breadcrumb[0].href="/en/"; breadcrumbSchema items -> /en/ form; slug + navReviewHref identical. ZERO Thai script in output text (only ฿). No "we (didn't) stay" disclaimers, no AI words. Return {"done":true}.`,
  { label: 'en:khaosok-roundup', phase: 'Translate', effort: 'high' }
).catch(e => ({ err: String(e) }))
return { r }

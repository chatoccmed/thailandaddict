export const meta = { name: 'kohtao-roundup-en', description: 'EN twin of the Koh Tao roundup', phases: [{ title: 'Translate' }] }
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TH = REPO + '\\astro\\src\\content\\roundups\\top8-koh-tao-hotels-surat-thani.json'
const EN = REPO + '\\astro\\src\\content\\roundups-en\\top8-koh-tao-hotels-surat-thani.json'
const REF = REPO + '\\astro\\src\\content\\roundups-en\\top9-koh-lanta-hotels-krabi.json'
phase('Translate')
const r = await agent(
  `Translate the finalized Thai roundup ${TH} into its ENGLISH twin, written to ${EN}. Use ${REF} for /en/ href+breadcrumb conventions (a proven island roundup twin).
RULES: same JSON structure/keys; translate ALL Thai text to fluent English (title/meta/og/hero*/intro/mrt/compare type+access/advice/note/faq/quickAnswer/nav + per-entry type/revCount/badge/mrtTag/priceSub/tags/story/tip/pros/cons/dividerText/rooms.type); romanize place names (สุราษฎร์ธานี->Surat Thani, เกาะเต่า->Koh Tao, หาดทรายรี->Sairee Beach, อ่าวโฉลกบ้านเก่า->Chalok Baan Kao, แม่หาด->Mae Haad, อ่าวตาโหนด->Tanote Bay, หาดเทียน->Haad Tien, อ่าวฉลาม->Shark Bay, เกาะนางยวน->Koh Nang Yuan, ชุมพร->Chumphon, เกาะสมุย->Koh Samui, เกาะพะงัน->Koh Phangan). COPY BYTE-FOR-BYTE (never alter): every entry name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig; toc[].name+price; compareRows[].name+score+price. ฿ stays. breadcrumb[0].href="/en/"; breadcrumbSchema items -> /en/ form; slug + navReviewHref identical. ZERO Thai script in output text (only ฿). No "we (didn't) stay" disclaimers, no AI words. Return {"done":true}.`,
  { label: 'en:kohtao-roundup', phase: 'Translate', effort: 'high' }
).catch(e => ({ err: String(e) }))
return { r }

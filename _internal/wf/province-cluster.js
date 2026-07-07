export const meta = {
  name: 'province-cluster',
  description: 'Generic per-province Klook activity cluster: A1 cards (scratchpad) + wave2 (disk) + adversarial QA. Config via args.',
  phases: [
    { title: 'A1 research', detail: 'bookable activity cards → scratchpad' },
    { title: 'Wave2', detail: 'compares + getting-around + hero → disk' },
    { title: 'QA', detail: 'adversarial re-read of wave2 files' },
  ],
}

const c = (typeof args === 'string') ? JSON.parse(args) : args // { prefix, cluster, crumbCity, crumbCityHref, regionLabel, regionHref, stayHref, stayLabel, railJson, relatedJson, a1:[[rank,name,note]], wave2:[{slug,label,body}] }
const SP = 'C:\\Users\\Imac\\AppData\\Local\\Temp\\claude\\C--Users-Imac-Thailandaddict\\1bb3cb4f-ad84-442c-9763-4b413b84d50b\\scratchpad\\'
const ART = 'C:\\Users\\Imac\\Thailandaddict\\astro\\src\\content\\articles\\'

const RULES = `RULES (locked): tone v2-clean (เพื่อนเล่าให้เพื่อน); FORBIDDEN slang อ่ะ/ปะ/แหละ/ล่ะ + AI words ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน; NO first-person. EVIDENCE-BASED — real rating + cited platform (Klook/TripAdvisor/Google) in ratingSrc, or OMIT rating+ratingSrc (never invent). Images ONLY Wikimedia Commons CC via API https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=TERM&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1280&format=json — thumburl + credit "ภาพ: <artist> · <license>" + creditHref (file page) EVERY image; generic alt "(ภาพประกอบ)"; VERIFY each URL 200. bookHref Klook search-link with aid=121442; bookProvider "Klook"; stayHref "${c.stayHref}"; stayLabel "${c.stayLabel}". HTML LITERAL. Re-read & JSON.parse to confirm.`
const CARDSHAPE = `Return a single "restaurant" block card: kind "restaurant" · rank <RANK> · name · area · zone · foodType · rating(if real)+ratingSrc ELSE omit · bestFor · duration · priceRange (THB) · tags[3] · img+alt+credit+creditHref + gallery[2] (Wikimedia CC, verified 200) · mapHref · descHtml (3 <p>, ≥700 Thai chars) · tipHtml · pros[4] · cons[3]. READ C:\\Users\\Imac\\Thailandaddict\\astro\\src\\content\\articles\\top10-activities-koh-chang.json for the exact card shape.`

const a1 = await parallel(c.a1.map(([rk, name, note]) => () =>
  agent(
    `Thai travel writer for thailandaddict.com. Research ONE bookable activity/attraction and WRITE ONE JSON card to ${SP}${c.prefix}-${rk}.json\nPRODUCT (rank "${rk}"): ${name}. Location: ${c.crumbCity}. ${note || ''}\n${CARDSHAPE.replace('<RANK>', rk)}\nbookHref Klook search-link + aid=121442 (query relevant to the product + "${c.crumbCity}").\n${RULES}\nFinal message: 3 lines (file, rating+source or OMITTED, #images verified 200).`,
    { label: `${c.prefix}-${rk}`, phase: 'A1 research' }
  ).catch(() => null)
))

const W2COMMON = `crumbCity "${c.crumbCity}" · crumbCityHref "${c.crumbCityHref}" · regionLabel "${c.regionLabel}" · regionHref "${c.regionHref}" · publishedDate "2026-07-01" · modifiedDate "2026-07-01". ${RULES} rail (verbatim): ${c.railJson}. related=${c.relatedJson}. Must include experiences (3 Klook aid=121442) + staycta (Agoda cid=1965862) + tip + cta (href "${c.stayHref}") + faq 4-5.`

const qa = await pipeline(
  c.wave2,
  (w) => agent(`Thai travel writer for thailandaddict.com. ${w.body}\nWRITE VALID pretty JSON to ${ART}${w.slug}.json — ${W2COMMON}\nFinal message: 3 lines.`, { label: w.label, phase: 'Wave2' }),
  (r, w) => agent(`Adversarially QA ${ART}${w.slug}.json (READ it, report only). PASS/FAIL each: JSON.parse valid; no banned AI words/standalone slang; no literal HTML entities (&lt; &gt; &amp; &quot;); every Klook href has aid=121442; any rating numeric 0<r<=5 with real ratingSrc (flag invented/borrowed — on a compare card that groups multiple sites, a single rating is misleading, flag it); each card descHtml >=2 <p> & >=700 Thai chars; spot-check 3 image URLs HTTP 200 (429=ok). Compact report with exact offending text if any.`, { label: `qa:${w.slug}`, phase: 'QA' }).catch(() => null)
)

return { prefix: c.prefix, a1_written: a1.filter(Boolean).length, wave2: c.wave2.map(w => w.slug), qa }

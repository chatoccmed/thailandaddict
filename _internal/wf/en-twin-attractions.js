export const meta = {
  name: 'en-twin-attractions',
  description: 'Translate the 23 remaining TH-only top10-attractions-<province> articles into English twins (articles-en/). One faithful one-file-per-agent translator each; returns compact per-file status. Facts/links are re-forced + validated by Node scripts AFTER this workflow, so translators focus on faithful prose.',
  phases: [{ title: 'Translate', detail: 'one translator agent per province attractions article' }],
}

// 23 provinces confirmed TH-only via comm -23 (2026-07-01). Re-verify before launch.
const FILES = [
  'top10-attractions-amnat-charoen.json', 'top10-attractions-bueng-kan.json', 'top10-attractions-chaiyaphum.json',
  'top10-attractions-kalasin.json', 'top10-attractions-kamphaeng-phet.json', 'top10-attractions-maha-sarakham.json',
  'top10-attractions-mukdahan.json', 'top10-attractions-nakhon-phanom.json', 'top10-attractions-narathiwat.json',
  'top10-attractions-nong-bua-lamphu.json', 'top10-attractions-pattani.json', 'top10-attractions-phatthalung.json',
  'top10-attractions-phichit.json', 'top10-attractions-phrae.json', 'top10-attractions-roi-et.json',
  'top10-attractions-sakon-nakhon.json', 'top10-attractions-sisaket.json', 'top10-attractions-surin.json',
  'top10-attractions-tak.json', 'top10-attractions-uthai-thani.json', 'top10-attractions-uttaradit.json',
  'top10-attractions-yala.json', 'top10-attractions-yasothon.json',
]

const R = 'C:/Users/Imac/Thailandaddict'   // REAL repo root (the en-twin-spec.md path is stale/nested — ignore it)
const RULES = `
You translate ONE Thai travel-ranking article to an English twin for thailandaddict.com
(bilingual Thailand travel site, brand voice "Explore Thailand Like a Local"). Faithful,
idiomatic — never invent a fact, never drop a fact.

PATHS (use these EXACT absolute paths — the spec file's nested path is stale):
- Read TH source:  ${R}/astro/src/content/articles/<FILE>
- Write EN twin to: ${R}/astro/src/content/articles-en/<FILE>   (same filename; NEVER touch the TH source)
- Style reference (read once): ${R}/astro/src/content/articles-en/top10-attractions-ang-thong.json (a finished, validated attraction twin — match its tone + romanization)

ABSOLUTE RULES
A. SAME STRUCTURE — identical JSON keys, same nesting, same array lengths, same block order, same block "kind"/"type" values. Never add or remove a field. Keep every field the TH file has (igPost, fbPage, libImg, libCredit, libCreditHref, gallery, heroCredit, etc.).
B. BYTE-IDENTICAL (never translate/alter): slug, type, cluster, every URL/href (creditHref, mapHref, stayHref, crumbCityHref, regionHref, heroCreditHref, related[].href, igPost, fbPage, embed/video urls), heroImg, img, image, libImg, gallery[].src, heroEmoji, publishedDate, modifiedDate, ALL numbers (rating, ratingCount, lat, lng, rank), booleans, and source SITE names in ratingSrc/credit/libCredit (keep "Google","Wongnai","TripAdvisor","Wikimedia" — but translate Thai words around them).
   ⚠️ mapHref contains a URL-encoded Thai place name — copy it byte-for-byte, do NOT re-encode or swap in English.
C. TRANSLATE to natural English every other string: title, metaDesc, keywords, ogTitle, ogDesc, eyebrow, h1 (keep <br> and <span class="hi">…</span> tags — render "…Attractions in <Place>"), intro, chips[], quickAnswerHtml (keep all HTML tags), readTime ("12 นาที"→"12 min read"). crumbCity: Thai province → English (e.g. "ร้อยเอ็ด"→"Roi Et","ตาก"→"Tak"). regionLabel: ภาคเหนือ→"Northern Thailand"; ภาคกลาง→"Central Thailand"; ภาคใต้→"Southern Thailand"; ภาคอีสาน/ภาคตะวันออกเฉียงเหนือ→"Northeastern Thailand (Isan)"; ภาคตะวันออก→"Eastern Thailand"; ภาคตะวันตก→"Western Thailand".
   Inside each block: name (ROMANIZE Thai proper nouns to standard English, e.g. "วัดใหญ่ชัยมงคล"→"Wat Yai Chai Mongkhon" — NO Thai in parentheses), area, signature, descHtml (translate prose, keep every HTML tag), mustOrder[], tags[], bestFor, zone, stayLabel, alt, credit/libCredit (translate Thai note, keep site name), foodType/type-of-place (e.g. "วัด"→"Temple","ตลาดน้ำ"→"Floating market","น้ำตก"→"Waterfall","อุทยานแห่งชาติ"→"National park","จุดชมวิว"→"Viewpoint","โบราณสถาน"→"Heritage site"), hours ("09:00–17:00 ทุกวัน"→"09:00–17:00 daily"; day abbrevs จ.อ.พ.พฤ.ศ.ส.อา.→Mon–Sun; "ปิดวันจันทร์"→"Closed Mondays"), priceRange / Thai parts of priceUsd ("฿40"→"40 THB"; "คนไทยฟรี · ต่างชาติ ฿30"→"Free for Thais · 30 THB for foreigners"). faq[]: translate every q and a. p/staycta/foodexp/localtips/tip/cta blocks: translate visible text (heading/title/body/label/items/note), keep hrefs + structure.
D. ZERO Thai characters anywhere in the output (URL-encoded Thai inside an unchanged href is ASCII — fine).
E. Prices: write "THB" not the ฿ symbol in visible text. Keep "$…" numeric in priceUsd; translate only its Thai annotation.
F. HONESTY-FIRST — never add disclaimers ("we didn't visit","based on reviews","prices may vary"). Invent nothing. BANNED clichés: "nestled","hidden gem","boasts","a testament to","whether you're … or …","in the heart of","must-visit","bustling","vibrant tapestry","stunning","elevate".
G. VALID JSON — UTF-8, no BOM, no trailing commas, proper escaping. Write the file to disk; do NOT return its contents.

You have NO sub-agents — do the translation yourself, do not delegate. After writing, reply in <40 words: "OK <FILE>", EN crumbCity, EN regionLabel, block count, and anything you were unsure about.
`

const RET = { type:'object', additionalProperties:false, required:['file','ok'], properties:{
  file:{type:'string'}, ok:{type:'boolean'}, crumbCity:{type:'string'}, regionLabel:{type:'string'}, blocks:{type:'number'}, note:{type:'string'} } }

phase('Translate')
const results = await parallel(FILES.map(f => () =>
  agent(
`Translate this ONE file: <FILE> = ${f}
${RULES.replace(/<FILE>/g, f)}
Return { file:"${f}", ok:true, crumbCity, regionLabel, blocks, note } when the EN twin is written.`,
    { label:`tr:${f.replace('top10-attractions-','').replace('.json','')}`, phase:'Translate', schema: RET }
  ).then(r => r || ({ file:f, ok:false, note:'null return' })).catch(e => ({ file:f, ok:false, note:String(e).slice(0,80) }))
))

const ok = results.filter(x => x && x.ok)
return { total: FILES.length, okCount: ok.length, results: results.map(r => ({ file:r.file, ok:!!(r&&r.ok), crumbCity:r&&r.crumbCity, note:r&&r.note })), failed: results.filter(x=>!x||!x.ok).map(x=>x&&x.file) }

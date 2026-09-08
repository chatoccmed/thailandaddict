export const meta = {
  name: 'translate-articles-plan-b',
  description: 'Translate deep tourism-city articles (attraction/food/eat-ranking/itinerary/prep/guide) from EN into a Tier-1 language, one agent per article',
  phases: [{ title: 'Translate' }],
};

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';
const lang = "zh";
const slugs = ["michelin-rasik-local-kitchen","michelin-sow-jeck","pattaya-food-guide","pattaya-international-food","pattaya-jomtien-beach","pattaya-khao-chi-chan","pattaya-korean-japanese-food","pattaya-local-thai-food","pattaya-night-market","pattaya-nong-nooch-garden","pattaya-pratamnak-viewpoint","pattaya-restaurants","pattaya-rooftop-bars","pattaya-sanctuary-of-truth","pattaya-seafood","pattaya-street-food","pattaya-temples-culture","pattaya-tiffany-cabaret-show","pattaya-vegan-healthy","pattaya-viewpoint-guide","pattaya-walking-street","pattaya-water-parks","petrified-wood-museum","phaeng-waterfall-viewpoint","phang-nga-attractions","phang-nga-bay-james-bond","phang-nga-bay-tour","phang-nga-cafe-guide","phang-nga-dessert-souvenir","phang-nga-food-guide","phang-nga-hokkien-mee","phang-nga-khanom-jeen","phang-nga-local-breakfast","phang-nga-mookata-buffet","phang-nga-sea-canoe","phang-nga-seafood","phang-nga-southern-food","phang-nga-waterfalls","phetchabun-attractions","phetchabun-city-guide","phetchabun-city-noodles","phetchabun-food-guide","phetchabun-isan-food","phetchabun-local-breakfast","phetchabun-mookata-buffet","phetchabun-tamarind-souvenir","phetchabun-waterfalls","phi-phi-island-tour","phimai-historical-park","phra-borommathat-chaiya","phra-that-doi-kong-mu","phraya-nakhon-cave-guide","phu-chi-fa-guide","phu-hin-rong-kla","phu-thap-boek-guide","phu-thap-boek-hmong-food","phuket-aquarium","phuket-attractions","phuket-beach-bars-dining","phuket-beaches-guide","phuket-dim-sum-breakfast","phuket-food-guide","phuket-hokkien-mee","phuket-island-hopping-guide","phuket-local-sweets","phuket-michelin-fine-dining","phuket-mookata-buffet","phuket-old-town-cafe","phuket-old-town-guide","phuket-roti-tea","phuket-seafood","phuket-southern-food","phuket-street-food-markets","phuket-viewpoints","pongyang-jungle-coaster-chiang-mai","prachuap-attractions","prachuap-food-guide","prachuap-mookata-buffet","prachuap-pineapple-souvenir","prachuap-pla-tu","prachuap-saam-ao-guide","prachuap-town-food","prasat-muang-sing","promthep-cape-guide","pua-cafe-rice-fields","pua-tai-lue-guide","railay-beach-guide","rajabhakti-park-guide","ramayana-water-park-pattaya","ramkhamhaeng-national-park","rattanakosin-old-town","rayong-aquarium","rayong-attractions","rayong-cafe-guide","rayong-dessert-souvenir","rayong-food-guide","rayong-fruit-orchards","rayong-local-breakfast","rayong-mookata-buffet","rayong-noodles-local","rayong-seafood","rayong-street-food","road-1256-skyroad","roti-sai-mai-guide","safari-world-bangkok","sai-yok-national-park","samet-nangshe-viewpoint","samila-beach-trip","samui-attractions","samui-beach-clubs","samui-cafe-guide","samui-coconut-dessert","samui-fisherman-village-food","samui-food-guide","samui-international-food","samui-local-breakfast","samui-night-market","samui-seafood","samui-snorkeling-diving","samui-southern-food","samui-souvenir-food","samui-temples-culture","samui-vegan-health","samui-viewpoints","sanctuary-of-truth-guide","sangkhalok-kilns-museum","sangkhlaburi-mon-bridge","sangkhlaburi-mon-food","sao-din-na-noi","sattahip-beaches-guide","sea-life-bangkok-ocean-world","si-satchanalai-historical-park","si-thep-ancient-city","siam-amazing-park-bangkok","siam-ratchaprasong-shopping","similan-islands-guide","singha-park-chiang-rai","songkhla-old-town-trip","srinakarin-dam-guide","sriracha-guide","sriracha-japanese-food","suan-mokkh-guide","sukhothai-attractions","sukhothai-best-temples","sukhothai-cafe-guide","sukhothai-food-guide","sukhothai-historical-park-guide","sukhothai-khao-poep","sukhothai-local-breakfast","sukhothai-loy-krathong-festival","sukhothai-mookata-buffet","sukhothai-morning-market-food","sukhothai-new-city-guide","sukhothai-northern-food","sukhothai-old-city-cycling","sukhothai-souvenir-sangkhalok","sunthorn-phu-monument","surat-thani-attractions","surat-thani-cafe-guide","surat-thani-food-guide","surat-thani-khanom-jeen","surat-thani-local-breakfast","surat-thani-mookata-buffet","surat-thani-night-market","surat-thani-oyster","surat-thani-riverside-dining","surat-thani-seafood","surat-thani-southern-food","surin-islands-guide","takua-pa-old-town-food","takua-pa-old-town-guide","tapi-river-city-guide","tham-lod-cave-guide","than-sadet-waterfall","thao-suranari-monument","top-khao-soi-chiang-mai","top-khao-soi-nam-ngiao-mae-hong-son","top-pad-mee-korat","top10-attractions-ayutthaya","top10-attractions-chiang-mai","top10-attractions-chiang-rai","top10-attractions-chonburi","top10-attractions-kanchanaburi","top10-attractions-krabi","top10-attractions-mae-hong-son","top10-attractions-nakhon-ratchasima","top10-attractions-nan","top10-attractions-phang-nga","top10-attractions-phetchabun","top10-attractions-phuket","top10-attractions-prachuap-khiri-khan","top10-attractions-rayong","top10-attractions-sukhothai","top10-attractions-surat-thani","top10-attractions-trat","top10-popular-restaurants-ayutthaya","top10-popular-restaurants-bangkok","top10-popular-restaurants-chiang-mai","top10-popular-restaurants-chiang-rai","top10-popular-restaurants-chonburi","top10-popular-restaurants-kanchanaburi","top10-popular-restaurants-krabi","top10-popular-restaurants-mae-hong-son","top10-popular-restaurants-nakhon-ratchasima","top10-popular-restaurants-nan","top10-popular-restaurants-phang-nga","top10-popular-restaurants-phetchabun","top10-popular-restaurants-phuket","top10-popular-restaurants-prachuap-khiri-khan","top10-popular-restaurants-rayong","top10-popular-restaurants-sukhothai","top10-popular-restaurants-surat-thani","top10-popular-restaurants-trat","tours-activities-bangkok","tours-activities-chiang-mai","tours-activities-hua-hin","tours-activities-krabi","tours-activities-pattaya","tours-activities-phuket","tours-activities-samui","trat-attractions","trat-beach-bbq-seafood","trat-cafe-guide","trat-dessert-souvenir","trat-food-guide","trat-fruit-orchards","trat-kapi-dried-seafood","trat-local-breakfast","trat-mookata-buffet","trat-old-town-bang-phra","trat-seafood","trat-snorkeling-islands","trat-town-food","vana-nava-water-jungle-hua-hin","wat-arun-guide","wat-ban-rai-korat","wat-buppharam-trat","wat-chaiwatthanaram-guide","wat-chalong-guide","wat-chong-kham-chong-klang","wat-hat-yai-nai","wat-huay-pla-kang-guide","wat-khao-chong-krachok","wat-khunaram-mummified-monk","wat-lokayasutharam-guide","wat-mahathat-guide","wat-mahathat-sukhothai","wat-pha-sorn-kaew","wat-pho-guide","wat-phra-si-sanphet-guide","wat-phrathat-chae-haeng","wat-phumin-guide","wat-phutthaisawan-guide","wat-rong-khun-guide","wat-rong-suea-ten-guide","wat-sa-si-guide","wat-si-chum-guide","wat-tham-suea-guide","wat-tham-suwan-kuha","wat-yai-chai-mongkhon-guide","yom-chinda-old-street"];

const LANG_META = {
  zh: { name: 'Chinese (Simplified)', script: 'Hanzi', notes: 'Natural Mainland Chinese travel-content register, matching Ctrip/Mafengwo conventions. Simplified characters only.' },
  ru: { name: 'Russian', script: 'Cyrillic', notes: 'Informal "ты" register, consistent with earlier site translations. Transliterate place/dish names phonetically.' },
  ko: { name: 'Korean', script: 'Hangul', notes: 'Natural Korean travel-content register, matching Yanolja/Klook Korean conventions.' },
  ja: { name: 'Japanese', script: 'mixed kanji/kana', notes: 'Katakana for place/dish names, natural warm tone, not overly formal keigo.' },
  hi: { name: 'Hindi', script: 'Devanagari', notes: 'Natural Hindi Devanagari, matching MakeMyTrip/Goibibo conventions. Do NOT leave stray Thai-script place-name fragments untranslated.' },
  he: { name: 'Hebrew', script: 'Hebrew (RTL)', notes: 'Natural modern Hebrew. Page renders dir="rtl" — do not add manual RTL/LRM marks or reorder HTML tags/arrows.' },
  ar: { name: 'Arabic', script: 'Arabic (RTL)', notes: 'Modern Standard Arabic. Page renders dir="rtl" — do not add manual RTL/LRM marks or reorder HTML tags/arrows.' },
};
const L = LANG_META[lang];

const FIELD_RULES = `
FIELD RULES (article schema) — translate these, preserving all HTML tags/entities exactly:
  title, metaDesc, keywords, ogTitle, ogDesc, crumbCity (city display name — translate/transliterate naturally,
    same spirit as a hotel review's crumbCityName), regionLabel, eyebrow, h1 (keep any HTML tags), heroCredit
    (photo-credit caption text, e.g. "Photo: official website X" — translate the words, NOT heroCreditHref),
  intro (keep HTML), chips[] (short filter chips — keep emoji, translate words), readTime (e.g. "5 min read"),
  quickAnswerHtml (keep HTML tags, 40-60 words), quickAnswerH2,
  faq[].q, faq[].a (keep HTML tags), related[].title (KEEP related[].href unchanged),
  rail[].title, rail[].note (KEEP rail[].href/.img unchanged).

  Per BLOCK KIND inside blocks[]:
  - h2: translate .text (KEEP .id unchanged — it is an anchor slug)
  - p: translate .html (keep all tags)
  - image: translate .alt, .caption, .credit (KEEP .src, .creditHref unchanged)
  - restaurant: translate .area, .cuisine, .signature, .descHtml (keep tags), .mustOrder[] (keep authentic
    dish names recognizable — transliterate, don't invent), .tags[] (short descriptive labels e.g. "Halal-friendly" —
    translate), .priceRange (this may be a DESCRIPTIVE phrase like "~400 THB per cocktail" or "50-80 THB" —
    translate the surrounding words naturally, but keep every number/currency exactly as in the source — never
    change a figure), .bestFor, .zone, .foodType (short descriptive labels for display — translate naturally),
    .stayLabel (short CTA label like "Book a stay" — UI text, translate it).
    KEEP UNCHANGED: .rank, .name (restaurant proper name — never translate/rename), .nameEn,
    .score, .img, .creditHref, .mapHref, .fbHref, .fbPage, .igPost, .libImg, .libCreditHref, .stayHref,
    .hours, .priceUsd, .lat, .lng (never touch coordinates), .rating, .ratingCount, .ratingSrc,
    .gallery[].alt (translate), .gallery[].credit (translate), .gallery[].src/.creditHref (unchanged).
  - staycta: translate .title, .text, .links[].label, .links[].note, .ctaLabel (KEEP .img, .links[].href, .ctaHref)
  - foodexp / experiences (same shape): translate .title, .text, .items[].label, .items[].note, .ctaLabel
    (KEEP .items[].href, .items[].provider — brand name like "Klook"/"GetYourGuide" stays Latin, .items[].emoji, .ctaHref)
  - localtips: translate .title, .items[].title, .items[].text (KEEP .items[].icon)
  - list: translate every string in .items[]
  - table: translate .caption, .headers[], and prose cells in .rows[][] — KEEP pure numbers/prices/symbols as-is
  - heatmap: translate .caption, .regions[] (region names), .rows[].m (month label), .legend[]
    (KEEP .rows[].cells[].e — weather emoji, and .rows[].cells[].s — an internal good/ok/bad CSS-class code, NOT display text, never translate .s)
  - tip: translate .title, .html (keep tags)
  - ranked: translate .items[].name (item/place name — descriptive, not a fixed brand — translate it),
    .items[].blurb, .items[].meta, .items[].tags[], .items[].price (this is often a DESCRIPTIVE price phrase
    like "Small bowl ~฿20" or "from ฿40" — translate the surrounding words naturally, but keep every number
    and currency symbol/abbreviation exactly as in the source — never change a figure) (KEEP .items[].rank, .items[].href unchanged)
  - cards: translate .items[].name (unless it is clearly a specific proper-noun business/place, then keep recognizable),
    .items[].blurb, .items[].tag (KEEP .items[].href)
  - day: translate .label (e.g. "Day 1" — translate "Day", keep the number), .title, .items[].activity, .items[].note
    (KEEP .items[].time — a clock time like "09:00")
  - cta: translate .text, .label (KEEP .href)
  - embed: translate .title, .note (KEEP .gmapsQuery, .lat, .lng, .fbPage, .igPost, .mapsLink unchanged —
    these are lookup/link values; a translated map-search query can break the lookup)

DO NOT TOUCH ANYWHERE (copy byte-for-byte): slug, type, cluster, crumbCityHref, regionHref, heroImg, heroEmoji,
  heroCreditHref, image, publishedDate, modifiedDate, lat, lng, tags[] **at the TOP LEVEL of the article only**
  (this is the AI-trip-planner controlled-vocabulary array — copy every entry exactly; do NOT confuse it with the
  translatable restaurant.tags[]/ranked.items[].tags[] which are different, nested, free-text label arrays).
  Numbers, prices (฿ figures), URLs, image paths, hex colors — never touch. Brand/site names (Agoda, Booking.com,
  Trip.com, Klook, GetYourGuide, ThailandAddict) stay Latin.`;

function articlePrompt(slug) {
  const src = `${ROOT}\\astro\\src\\content\\articles-en\\${slug}.json`;
  const dst = `${ROOT}\\astro\\src\\content\\articles-${lang}\\${slug}.json`;
  return `Translate a Thailand travel article into **${L.name} (${lang})** for thailandaddict.com.

Read the English source: ${src}
Write the translated file to: ${dst}

You personally do this with Read + Write. Do NOT delegate or spawn sub-agents.
${FIELD_RULES}

GENERAL RULES:
1. Preserve exact JSON structure: same top-level keys, same block kinds/order/count, same array lengths, same nesting as the English source. Add/remove nothing — if a field is optional and absent in the source, leave it absent in your output too.
2. Natural, fluent ${L.name} (${L.script}) — a real travel writer's register, matching how ${L.name === 'Chinese (Simplified)' ? 'Ctrip/Mafengwo' : L.name === 'Russian' ? 'a Russian travel blog' : L.name === 'Korean' ? 'Yanolja/Klook Korean' : L.name === 'Japanese' ? 'a Japanese travel magazine' : L.name === 'Hindi' ? 'MakeMyTrip/Goibibo' : 'a modern travel site'} would write it. Not a stiff literal translation.
3. ${L.notes}
4. ZERO English words left untranslated in prose (except brand/proper names explicitly listed as DO NOT TOUCH above). ZERO raw Thai-script fragments anywhere.
5. Do not invent facts, prices, or claims not present in the English source. Do not add promotional urgency/scarcity language not in the source.
6. Valid JSON output — the file must parse.

Write the file now. Return one line: {"slug":"${slug}","ok":true}.`;
}

phase('Translate');
const results = await parallel(slugs.map(slug => () =>
  agent(articlePrompt(slug), { label: `${lang}:${slug.slice(0, 24)}`, phase: 'Translate', effort: 'high' })
    .then(() => ({ slug, ok: true }))
    .catch(e => ({ slug, ok: false, err: String(e).slice(0, 150) }))
));
const ok = results.filter(r => r && r.ok).length;
return { lang, requested: slugs.length, ok, failed: results.filter(r => !r || !r.ok).map(r => r?.slug) };

# ZH-twin translation spec (thailandaddict.com)

You translate Thai travel content into Simplified Chinese (Mandarin, mainland-China consumer-travel
register) for thailandaddict.com, a Thailand travel site. Faithful, idiomatic translation — never
invent facts, never drop facts, never fabricate a name/price/fact that isn't in the Thai source.

PROJECT ROOT (absolute): `C:/Users/Imac/Thailandaddict/thailandaddict`

There are THREE content collections, each with its own directory triplet. You will always be told
which collection you're working in.

| Collection | Thai source dir | EN twin dir (reference only) | ZH twin dir (write here) |
|---|---|---|---|
| articles | `astro/src/content/articles/` | `astro/src/content/articles-en/` | `astro/src/content/articles-zh/` |
| reviews  | `astro/src/content/reviews/`  | `astro/src/content/reviews-en/`  | `astro/src/content/reviews-zh/`  |
| roundups | `astro/src/content/roundups/` | `astro/src/content/roundups-en/` | `astro/src/content/roundups-zh/` |

For EACH file you are given (a bare filename like `top10-popular-restaurants-trat.json` + which collection):
1. Read the Thai source (source of truth for every fact).
2. Read the existing EN twin at the same filename in the EN dir, IF it exists — use it ONLY as your
   reference for how proper nouns (hotel names, restaurant names, place names, person names) were
   already romanized. This keeps names consistent across languages and stops you from inventing a
   new transliteration. If no EN twin exists, romanize/transliterate the name yourself the way a
   real Chinese travel site (Ctrip/Fliggy/Qunar) would.
3. Write the ZH twin to the ZH dir (same filename). NEVER modify the Thai source or the EN twin.

## ABSOLUTE RULES

**A. SAME STRUCTURE** — identical JSON keys, same nesting, same array lengths, same block/entry
order, same `kind` / `type` discriminator values. Do not add or remove any field. Whatever fields
the Thai file has, the ZH file has exactly those fields (same optional fields present/absent).

**B. KEEP BYTE-IDENTICAL** (copy verbatim from the Thai source, never translate or alter):
`slug`, `cluster`, every URL/href field (`creditHref`, `mapHref`, `stayHref`, `crumbCityHref`,
`regionHref`, `heroCreditHref`, `related[].href`, `igPost`, `fbPage`, `agodaUrl`, `bookingUrl`,
`tripUrl`, `reviewUrl`, `bookingAgoda`, `bookingBooking`, `bookingTrip`, embed/video urls),
every image path (`heroImg`, `img`, `image`, `libImg`, `gallery[].src` or `gallery[]` itself,
`mapImg`, `heroSub1`, `heroSub2`), `heroEmoji`, `publishedDate`, `modifiedDate`, ALL numbers
(`rating`, `ratingCount`, `lat`, `lng`, `rank`, `score`, `starRating`, `width`), booleans
(`englishMenu`, `veg`, `halal`), `addressCountry`, `addressLocality` (the Thai source already
keeps this in English/Latin, e.g. `"Bangkok"` — copy it unchanged, do NOT swap in a Chinese
exonym here even though rule C allows exonyms for other display labels — this field feeds a
structured schema.org address block alongside `streetAddress`/`mapAddr`, which stay in Latin, so
it must match them), and source-site names inside `ratingSrc` / `credit` / `libCredit` (e.g. keep
"Google", "Wongnai", "TripAdvisor", "Booking.com", "Agoda", "Trip.com" in Latin script — translate
only Thai words *around* them).

**B2. `type` FIELD — COLLECTION-DEPENDENT, READ CAREFULLY:**
- **articles**: `type` is the page-type discriminator (`food` / `eat-ranking` / `attraction` /
  `itinerary` / `prep` / `guide`) — KEEP BYTE-IDENTICAL, never translate.
- **reviews**: `type` is a human-readable localized short descriptor (schema comment: "Thai short
  type, e.g. โฮสเทล") — TRANSLATE it to natural Chinese (e.g. TH "โฮสเทล" → ZH "青年旅舍", matching
  how the EN twin translates it to "Hostel"). The separate `typeEn` field is the fixed schema.org
  category and stays in English always — do not confuse the two.
- **roundups**: `entries[].type` and `entries[].rooms[].type` are human-readable descriptive text
  (e.g. TH `"Luxury Boutique 5 ดาว"` / EN `"Luxury Boutique 5-Star"`; TH `"...70 ตร.ม."` / EN
  `"...70 sqm"`) — TRANSLATE the Thai words/units (ดาว→星, ตร.ม.→平方米, etc.) while keeping any
  specific room/suite proper name in Latin per rule C (e.g. "Rajah Brooke Suite" stays Latin, only
  the size annotation after it gets translated).

**C. NAMES — read this rule twice. Pilot testing found this is where translators go wrong most often
(5 of 10 defective pilot files were exactly this mistake — inventing garbled/wrong Chinese
transliterations for places that should have stayed in Latin script).**

DEFAULT RULE: every proper name — hotel names, restaurant names, temples, streets, neighborhoods/
sub-districts, landmarks, zoos, gardens, tea plantations, markets, rivers, mountains, literally
anything with a specific name that isn't on the whitelist below — STAYS IN LATIN SCRIPT, spelled
exactly as the EN twin spells it (see step 2). Do NOT invent a Chinese transliteration. Do NOT
"improve" or "localize" a name that isn't on the whitelist, even if you think you know a common
Chinese rendering — if you are not 100% certain a name has a universally-standard, well-established
Chinese exonym (the kind every Chinese travel site uses identically), leave it in Latin script.
When genuinely unsure, Latin script is always the safe choice; an invented transliteration is not.

THE ONLY EXCEPTION — a short whitelist of macro-scale places with universally-established Chinese
exonyms, used ONLY for generic display/breadcrumb/region labels (`crumbCity`, `regionLabel`, and
the region-name portions of `intro`/`storyHtml`/prose — NOT for `addressLocality`, see rule B):
- Countries/macro-regions: Thailand=泰国
- Regions: ภาคเหนือ=北部/泰国北部, ภาคอีสาน=东北部(伊善), ภาคกลาง=中部, ภาคตะวันออก=东部, ภาคตะวันตก=西部, ภาคใต้=南部
- Major cities/provinces commonly exonymed: Bangkok=曼谷, Chiang Mai=清迈, Chiang Rai=清莱, Phuket=
  普吉岛, Krabi=甲米, Pattaya=芭提雅, Koh Samui=苏梅岛, Koh Phi Phi=皮皮岛, Koh Tao=涛岛, Koh Phangan=
  帕岸岛/帕安岛, Ayutthaya=大城, Hua Hin=华欣, Pai=拜县

That whitelist is EXHAUSTIVE for this spec — if a place name is not on it, it is NOT a generic
label and rule C's default (Latin script) applies, even if the place is a well-known landmark,
temple, zoo, market, street, or district WITHIN one of those whitelisted cities. Concretely:
temple names (Wat Ketkaram, Wat Jed Yod, Wat Arun, ...), streets (Nimmanhaemin Road, Tha Phae Gate,
Khaosan Road, ...), Bangkok sub-districts (Khlong San, Samphanthawong, Bang Rak, Pom Prap Sattru
Phai, Talat Noi, ...), and named attractions (Doi Tung, Mae Fah Luang Garden, Dusit Zoo, Choui Fong
tea plantation, ...) are ALL specific names, not on the whitelist, and MUST stay in Latin script
exactly as the EN twin spells them — never transliterated, never guessed. If you want to help a
Chinese reader recognize a whitelisted-adjacent name, you may add a short Chinese descriptor word
next to the Latin name (e.g. "Nimmanhaemin Road 街区"), but the proper name itself stays Latin.

**C2. THE EN TWIN IS A SPELLING REFERENCE ONLY — never a content/fact source.** Use it exclusively
to look up how a proper name was already romanized (rule C). Never copy its sentence structure,
never copy a fact/price/detail from the EN twin's wording instead of translating the actual Thai
sentence. Pilot testing caught a case where a translator copied an EN-twin `pros[]` item's wording
wholesale, which silently dropped a price fact that was in the Thai source and substituted a
different, EN-only fact instead. Always translate what the THAI SOURCE actually says at that exact
array position — the EN twin is never the thing you're translating.

**C3. PRESERVE TERM DISTINCTIONS.** If the Thai source (or the EN twin) uses two different words for
two different things (e.g. two different herb/ingredient varieties, two different room types, two
different neighborhoods), your Chinese must also use two different, distinct terms — never collapse
two source-distinct things into the same Chinese word just because they sound similar or you're
unsure of the precise botanical/technical distinction. When genuinely unsure of a precise technical
term (e.g. a specific herb species) and no single existing Chinese word safely and uniquely names
it, do NOT reach for an existing named herb/dish/ingredient term that actually refers to something
else (pilot testing found two different failed attempts at translating "hairy basil" collide with
two DIFFERENT existing herbs, "holy basil" and then "kra pao/pad kra pao basil"). Prefer a plain
descriptive gloss with the Thai/romanized name kept alongside as a disambiguator, e.g.
"罗勒(bai maeng lak)" rather than committing to any specific named Chinese herb term you're not
certain is correct.

**C4. IF YOU ARE GIVEN A NAME GLOSSARY, IT IS MANDATORY AND EXHAUSTIVE.** When your translation task
includes a glossary of specific names found in the document (extracted by a prior pass that read
the WHOLE file), you must use the exact spelling/treatment given for that name EVERY time it
appears anywhere in the document — in structured fields, in body/story/tip HTML prose, in FAQ
answers, everywhere. Pilot testing found that a single fix applied to one field (e.g. `nearby[]`)
routinely left the identical wrong name unfixed elsewhere in the same file (e.g. `body[]` prose
describing the same landmark two paragraphs later) — treat the glossary as ground truth for that
whole document, not just the field where the name was first noticed.

**D. TRANSLATE to natural, warm Simplified Chinese** every other human-readable string: titles,
`metaDesc`/`ogDesc`/`twDesc`/`schemaDesc`, `keywords`, `eyebrow`, `h1` (keep any `<br>` /
`<span class="hi">…</span>` / other HTML tags — translate only the words inside them), `intro`,
`chips[]`, `quickAnswerHtml` (keep all HTML tags), body prose (`body[].html`, `descHtml`,
`storyHtml`, `tipHtml`, `honestSummary`, `honestChecks[]`, `introHtml`, `mrtHtml`, `noteHtml`,
`methodologyHtml`, `lastVerifiedHtml`, `disclosureHtml`, `compareInsightsHtml`,
`personaClosingHtml`), list/tag arrays (`mustOrder[]`, `tags[]`, `pros[]`, `cons[]`), `faq[].q`/
`faq[].a`, table `headers[]`/`rows[][]`, `highlights[].title`/`.text`, `tips[].title`/`.body`,
`advice[].head`/`.bodyHtml`, `nearby[].n`/`.d`, `info[].k`/`.v` (translate the label/value text,
keep any embedded identical-key data), `related[].title`/`.name` (title = translate; but if
`related` points to a specific hotel/place *name* field, apply rule C), sidebar labels, badge
text, breadcrumb `name` fields (region/city labels → rule C exonym policy), CTA `label`/`text`,
`bestFor`, `zone`, `foodType`, `stayLabel`, alt text, `credit`/`libCredit` prose (keep the site name
per rule B), `hours` (translate Thai day names/"ทุกวัน"/"ปิดวันจันทร์" etc.), `priceRange` and the
Thai words inside `priceUsd`/`qiPrice` (keep the ฿ symbol and numbers unchanged, translate only
surrounding Thai words — e.g. "คนไทยฟรี · ต่างชาติ ฿30" → "泰国人免费 · 外国人 ฿30"), `spice`,
`addr` (roundup entry addresses — translate the city-name word at the end using the rule C
whitelist, e.g. "...Bang Rak, กรุงเทพ" → "...Bang Rak, 曼谷"; keep the street/sub-district portion
in Latin script per rule C since those are specific names, not on the whitelist — do NOT leave any
raw Thai word anywhere in this field).

**E. FAQ** — translate every `q` and `a` faithfully; do not add or remove FAQ entries.

**F. PRICE CONVENTION** — keep the ฿ symbol as-is in visible price text (it is an internationally
recognized currency mark and matches the site's established EN/UI-chrome convention — do NOT
convert to "¥" or "元" or spell out "泰铢" unless the Thai source itself spells out the currency
name in words, in which case translate that word).

**G. VOICE** — confident, warm, like a well-traveled friend giving real advice; matches the register
already established in `astro/src/i18n/ui.zh.json` (see that file for terminology precedent —
e.g. "住宿"=stay/accommodation, "点评"=review, "行程"=trip/itinerary). Mainland-China consumer-travel
register ONLY — no Taiwan/Hong Kong slang or financial-market jargon (e.g. do NOT use "加碼" for
"add on/extend"; use plain mainland phrasing like "顺游"/"延伸行程"). HONESTY-FIRST: never add
disclaimers ("我们没有亲自去过" / "根据网上评价" / "无法保证" etc.) that aren't in the Thai source.
Translate only what's there; invent nothing. Do NOT manufacture urgency/scarcity language that
isn't in the Thai source (see `_internal/lint-dark-patterns.mjs` policy — e.g. do not add "仅剩一间"
unless the Thai source genuinely says that).

**H. VALID JSON** — UTF-8, no BOM, no trailing commas, proper escaping of quotes/newlines inside
strings. Write the file to disk; do NOT return its contents in your final message (just confirm
done + anything you were unsure about).

## ⚠️ COMMON MISTAKES — do NOT make these (auto-checked, will be rejected)
1. **Never re-encode or "clean" a `mapHref`, `gallery[].src`, or any URL.** Copy the exact string
   from the Thai source, byte for byte.
2. **Never change a number.** `rating`, `ratingCount`, `lat`, `lng`, `rank`, `score`, `starRating`
   must equal the Thai source exactly.
3. **Never invent a new Chinese transliteration for ANY specific name not on the rule-C whitelist**
   (temples, streets, sub-districts, landmarks, attractions, hotels, restaurants) — copy the EN
   twin's Latin spelling instead. This was the single most common defect in pilot testing — when in
   doubt, Latin script, never a guessed transliteration.
4. **`addressLocality` always stays byte-identical to the Thai source** (which is already in
   English) — never swap in a Chinese exonym here even though rule C allows exonyms elsewhere.
5. **`type` is byte-identical ONLY in the `articles` collection** — in `reviews`/`roundups` it is
   translatable display text (rule B2). Don't apply the articles rule to the wrong collection.
6. **Array lengths must match exactly** — translate each item of every array IN PLACE (`faq`,
   `highlights`, `tips`, `related`, `gallery`, `entries`, `body`, `blocks`, etc.). Never add, merge,
   split, or drop an item.
7. **Do not add or remove fields.** If a block/entry lacks an optional field in the Thai source, the
   ZH version must also lack it.
8. **Zero raw Thai characters may remain** anywhere in translated text (proper nouns handled per
   rule C, not left in Thai script) — check every `addr` field specifically; this is where leftover
   Thai city names were missed in pilot testing.
9. **Never translate from the EN twin's wording** (rule C2) — always translate the Thai source's
   actual sentence/fact at that position.
10. The only things you change are human-readable WORDS (per rules C/D). Everything else (rule B) is
    a byte-for-byte copy.

After writing all your files, reply in under 100 words: for each file → "OK" + anything you were
genuinely unsure about (e.g. no EN twin existed for a name, so you had to romanize/transliterate
it yourself).

# Bangkok ย่าน Scale-Out — Progress Log

Owner-requested running log (บันทึกการทำงานเป็นระยะ). Auto-updated as each ย่าน ships.
**Goal:** 33 Bangkok ย่าน × 5 dimensions each, TH+EN — (1) 10 hotels · (2) 5 value-budget hotels · (3) 10 restaurants · (4) 10 cafes · (5) 10 attractions.

## Locked standards
- **Value-budget hotels** (the old "ม่านรูด" slot): 5 popular **2–3★** hotels from Agoda/Booking/Trip, value-for-money style ("ค้างคืน/ชั่วคราวก็คุ้ม"), **NO day-use/Dayuse**; "ม่านรูด" kept only in hidden TH metaDesc/ogDesc. (memory: `short-stay-value-hotel-standard`)
- **Attractions:** every card gets a real Wikimedia-CC photo; hero = a `<ย่าน>` cityscape (never a food placeholder).
- Each ย่าน: build hotels FIRST (eat-ranking rail points at the hotel roundup), then value, then restaurants→cafes→attractions (one eat-ranking Workflow at a time), EN for all, then deploy the whole ย่าน + log here.

---

## ✅ Done
### 1. Sukhumvit — 2026-06-24 (LIVE, TH+EN)
- 🏨 https://thailandaddict.com/top10-hotels-sukhumvit-bangkok
- 💰 https://thailandaddict.com/top5-love-hotels-sukhumvit-bangkok
- 🍜 https://thailandaddict.com/top10-popular-restaurants-sukhumvit
- ☕ https://thailandaddict.com/top10-popular-cafes-sukhumvit
- 📸 https://thailandaddict.com/top10-attractions-sukhumvit
- Notes: passed 3 owner-feedback rounds (discreet name · real attraction images · value-hotel reframe). Established all reusable engines + the value-hotel standard.

### 2. Silom–Sathorn — 2026-06-25 (LIVE, TH+EN)
- 🏨 https://thailandaddict.com/top10-hotels-silom-sathorn-bangkok — 10 hotels (Sukhothai/COMO/Eastin Grand/Crowne Plaza/Pullman/W + reuse)
- 💰 https://thailandaddict.com/top5-love-hotels-silom-sathorn-bangkok — 5 value 2-3★ (ibis Styles/ibis Sathorn/Lub d/Le Siam/The Inn)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-silom-sathorn — Eat Me, Le Du, Prachak duck, Somtum Der, Baan Phadthai...
- ☕ https://thailandaddict.com/top10-popular-cafes-silom-sathorn — Rocket, Roots, La Cabra, Luka, Pacamara...
- 📸 https://thailandaddict.com/top10-attractions-silom-sathorn — Mahanakhon SkyWalk, Lumpini, Asiatique, Sky Bar, Wat Khaek...
- Notes: 6 new hotel reviews + 4 reuse. Cafes Workflow hung once at Plan phase → killed+relaunched (transient API stall). 3 real Wikimedia-CC attraction photos (Lumpini Park, M.R. Kukrit's home, Silom cityscape hero).

### 3. Thong Lo–Ekkamai — 2026-06-25 (LIVE, TH+EN)
- 🏨 https://thailandaddict.com/top10-hotels-thong-lo-bangkok — 10 hotels (Nikko/Grande Centre Point/MUU/137 Pillars/Wyndham42 + reuse)
- 💰 https://thailandaddict.com/top5-love-hotels-thong-lo-bangkok — 5 value 2-3★ (La Petite Salil/THA City Loft/PlayHaus/63 Ekamai/S33)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-thong-lo — Wattana Panich, Sabai Jai, Supanniga, Thong Smith, After You...
- ☕ https://thailandaddict.com/top10-popular-cafes-thong-lo — Roots, Roast, Phil, Kurasu, Bartels, PACAMARA...
- 📸 https://thailandaddict.com/top10-attractions-thong-lo — theCOMMONS, Donki, Wat That Thong, Gateway Ekamai, Dog in Town...
- Notes: 11 new hotel reviews + 3 reuse. Swapped CLOSED Ink&Lion→Bartels (cafes rank5). 2 Wikimedia-CC photos (Thong Lo cityscape hero, Sukhumvit street food). LESSON: `npx astro sync` now needs `NODE_OPTIONS=--max-old-space-size=8192` (collection grew past default heap).

## ⏳ In progress
### 4. Ari (อารีย์) — starting 2026-06-25

## 📋 Queue (30 more, popular-first)
ari · khao-san · chinatown · siam-pratunam · samyan · chidlom · ploenchit · phrom-phong · riverside · ratchathewi · rama9 · ratchada · on-nut · victory-monument · charoen-krung · saphan-taksin · mochit-chatuchak · ladprao · central-ladprao · ramkhamhaeng · bangkapi · bangna · srinakarin · pinklao · talat-phlu · bang-sue · bang-khen · kaset · chaeng-watthana · sai-tai

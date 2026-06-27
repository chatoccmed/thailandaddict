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

### 4. Ari (อารีย์) — 2026-06-25 (LIVE, TH+EN)
- 🏨 https://thailandaddict.com/top11-ari-bts-hotels-bangkok — 11 hotels (REUSED existing roundup — Craftsman/Quarter Ari/Josh + budget)
- 💰 https://thailandaddict.com/top5-love-hotels-ari-bangkok — 5 value 2-3★ (Yard Hostel 9.4/2868 / LAF Aree / Ritz Aree / 19A / Lost&Found — reused existing reviews)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-ari — Thani Khao Moo Daeng, Ongtong Khaosoi (Michelin), Lay Lao, Khua Kling Pak Sod, Thong Smith...
- ☕ https://thailandaddict.com/top10-popular-cafes-ari — NANA Coffee Roasters, Peace Oriental Teahouse, MTCH matcha, Thongyoy, Roots, Guss Damn Good...
- 📸 https://thailandaddict.com/top10-attractions-ari — Café Amazon flagship, Pearl Art Space, Samsennai Philatelic Museum, Vanit Village, glow street art...
- Notes: ⚡ FAST — both hotels + value REUSED existing Ari content (top11-ari-bts + 8 existing 2-3★ reviews), zero new hotel reviewers. Hit weekly limit mid-build (resumed after 5am reset). 4 Wikimedia-CC attraction photos (representative). Only new content deployed: value roundup + 3 articles + images/food/ari.

### 5. Khao San–Old Town (ข้าวสาร-เมืองเก่า) — 2026-06-25 (LIVE, TH+EN)
- 🏨 https://thailandaddict.com/top10-hotels-khao-san-bangkok — 10 hotels (Riva Surya/Sala Rattanakosin Wat Arun-view/Casa Nithra/Old Capital Bike Inn 9.5...)
- 💰 https://thailandaddict.com/top5-love-hotels-khao-san-bangkok — 5 value 2-3★ (Rambuttri Village/Suneta Hostel 9.2/D&D Inn/Khaosan Palace/Villa Cha-Cha)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-khao-san — Thipsamai Michelin pad thai, Methavalai royal cuisine, Krua Apsorn, Karim Mataba...
- ☕ https://thailandaddict.com/top10-popular-cafes-khao-san — Mont Nomsod, Blue Whale (butterfly-pea latte), Elefin, Floral Cafe at Napasorn...
- 📸 https://thailandaddict.com/top10-attractions-khao-san — Golden Mount, Giant Swing, Loha Prasat, Phra Sumen Fort, Khao San Rd...
- Notes: 13 new hotel reviews (Workflow-fanout). Cafes hung 2× from rally-overload → fixed by resume (cached agents) after dialing back to ~2 concurrent workflows. Swapped CLOSED Jaywalk Cafe → Floral Cafe at Napasorn (+ scrubbed 9 stray refs). Golden Mount CC hero.

### 6. Chinatown–Yaowarat (เยาวราช) — 2026-06-25 (LIVE, TH+EN)
- 🏨 https://thailandaddict.com/top10-hotels-chinatown-bangkok — 10 hotels (Shanghai Mansion/ASAI/Grand China/Loftel 22 + 3 reuse)
- 💰 https://thailandaddict.com/top5-love-hotels-chinatown-bangkok — 5 value 2-3★ (Loftel 22 9.4/Lhong Yaowarat/W22/Prince Theatre/China Town Hotel)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-chinatown — Hua Seng Hong, Nai Ek (Michelin), Nai Mong oyster, Jek Pui musical-chairs curry...
- ☕ https://thailandaddict.com/top10-popular-cafes-chinatown — Wallflowers, Lhong Tou, La Cabra Talat Noi, Ear Sae 90yr, Mother Roaster riverside...
- 📸 https://thailandaddict.com/top10-attractions-chinatown — Wat Traimit Golden Buddha, Wat Mangkon, Yaowarat Rd, Talat Noi street art, Sampheng...
- Notes: rally-pipelined (built ahead during khao-san). 11 hotel reviews (8 new + 3 reuse). 3 CC photos. **+ FEATURE: added per-hotel "🔖 เก็บลงแผน" save-to-plan button to RoundupLayout (all hotel roundups sitewide) — owner-requested; was missing on roundups (food articles + review pages already had it).**

### 7. Sam Yan–Chula (สามย่าน) — 2026-06-27 (LIVE, TH+EN)
- 🏨 https://thailandaddict.com/top10-hotels-samyan-bangkok — 10 hotels (Triple Y Mitrtown/dusitD2 9.3/Mandarin CP/Pathumwan Princess + 5 reuse from chula-hospital)
- 💰 https://thailandaddict.com/top5-love-hotels-samyan-bangkok — 5 value 2-3★ (Samyan Serene/Bed By Sam-Yan/Forgotten Hostel/At Hua Lamphong/Banthat Thong Hostel)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-samyan — Jeh O Chula (Michelin mama), Longleng fishball 40yr, Tang Sui Heng duck (Michelin), Somboon crab curry...
- ☕ https://thailandaddict.com/top10-popular-cafes-samyan — Lhong Tou (Thai-tea Chinese cafe), PRYM Brunch (colonial house), Labyrinth slow bar, YAMA Matcha, Cacao Everywhere, findfoundfounded sourdough, Sun-kissed, ABBA...
- 📸 https://thailandaddict.com/top10-attractions-samyan — Samyan Mitrtown (24h zone), Chula Centenary Park, Banthat Thong food street, House Samyan arthouse cinema, Wat Hua Lamphong, Chamchuri Square, I'm Park, Slowcombo, Brahma Shrine...
- Notes: 9 new hotel reviews (Workflow-fanout) + 5 reuse. Deploy Version e20c7bfe. cafes workflow died with prior session → relaunched (`wf_4ad72c99`) + reusable hang-poller `_internal/wf/poll-wf.sh`; all 10 cafes had social embeds (0 CC). 2 Wikimedia-CC attraction photos (Chamchuri Square hero, Erawan Brahma for the no-social shrine card). Concurrent-builder-race: commit 4acba155 (another loop) had an incomplete attractions (missing r10 img) → fixed in 7f834d5a; verified HEAD = full correct set before deploy. (⚠️ the cafes/attractions names in an earlier draft of this entry were stale — corrected to the live set.)

### 8. Siam–Pratunam (สยาม-ประตูน้ำ) — 2026-06-27 (LIVE, TH+EN · ⚙ central-core loop)
- 🏨 https://thailandaddict.com/top10-hotels-siam-pratunam-bangkok — 10 hotels (Grand Hyatt Erawan/Centara Grand CentralWorld/Anantara Siam/InterContinental/Renaissance Ratchaprasong/Amari/Grande Centre Point Ratchadamri/Pathumwan Princess/Novotel Siam Square/Siam@Siam — 5 new + 5 reuse)
- 💰 https://thailandaddict.com/top5-love-hotels-siam-pratunam-bangkok — 5 value 2-3★ (ibis Siam/Golden House Chidlom/Siam Swana/Siam Nitra/Lub d Siam — all reuse)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-siam-pratunam — Go-Ang Pratunam chicken rice (Michelin), Inter Restaurant grandma's fried rice, Saneh Jaan (Michelin Thai), After You, Erawan Tea Room...
- ☕ https://thailandaddict.com/top10-popular-cafes-siam-pratunam — % Arabica CentralWorld, Gallery Drip Coffee (BACC), Brave Roasters, Karun Thai Tea, Thongyoy, Cheevit Cheeva bingsu...
- 📸 https://thailandaddict.com/top10-attractions-siam-pratunam — Siam Paragon+SEA LIFE, CentralWorld, Erawan Shrine, MBK, BACC, Jim Thompson House, Platinum Mall...
- Notes: 5 NEW flagship reviews (Workflow-fanout) + 5 reuse + Pathumwan Princess reused from samyan. restaurants hung at Frame→Assemble (poller caught 14min) → resume recovered. CentralWorld-night CC hero + Erawan-dance CC card. SELECTIVE git add (other loop building phrom-phong in same tree).

### 9. Chidlom–Ploenchit–Langsuan (ชิดลม-เพลินจิต) — 2026-06-27 (LIVE, TH+EN · ⚙ central-core loop)
- 🏨 https://thailandaddict.com/top10-hotels-chidlom-bangkok — 10 LUXURY (Park Hyatt/Waldorf Astoria/The Athenee/Okura Prestige/Conrad/Sindhorn Kempinski/Grande Centre Point Ploenchit/Sindhorn Midtown/Hansar/Mövenpick BDMS — 9 new + Waldorf reuse)
- 💰 https://thailandaddict.com/top5-love-hotels-chidlom-bangkok — 5 value 2-3★ (The Quart Ruamrudee/Golden House Chidlom/Nantra Ploenchit/Bangkok City Inn/Wish Inn Chidlom)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-chidlom — Gaggan Anand (Asia #3 / Michelin), Polo Fried Chicken (Bib), Saneh Jaan & Royal Osha (royal Thai), Somboon, La Monita...
- ☕ https://thailandaddict.com/top10-popular-cafes-chidlom — Erawan Tea Room (Michelin afternoon tea), Sarnies Roastery, The Coffee Academics, Open House (Central Embassy), Samantao riverside...
- 📸 https://thailandaddict.com/top10-attractions-chidlom — Erawan Shrine, CentralWorld, Central Embassy+Open House, Central Chidlom, Lumpini Park, Velaa Sindhorn, Gaysorn+Lakshmi, Trimurti shrine...
- Notes: 13 NEW reviews (Workflow-fanout, all parsed + star-verified — 9×5★ luxury + 4×2-3★ value). attractions hung at Frame→Assemble (poller caught 14min) → resume recovered (253K tok). CentralWorld-facade CC hero + Trimurti-shrine CC card. SELECTIVE git add. **ploenchit #10 = FOLDED into chidlom (near-100% overlap, same Ploenchit Rd) — skip to avoid duplicate content.**

### 11. Phrom Phong (พร้อมพงษ์) — 2026-06-27 (LIVE, TH+EN · ⚙ this loop · Version 5db56567)
- 🏨 https://thailandaddict.com/top10-hotels-phrom-phong-bangkok — 10 hotels (Emporium Suites by Chatrium/SKYVIEW/Oakwood Suites/Marriott Exec Apt + DoubleTree & Marriott Marquis reuse + Holiday Inn/Davis/Maitria/Park Plaza 4★)
- 💰 https://thailandaddict.com/top5-love-hotels-phrom-phong-bangkok — 5 value 2-3★ (Tints of Blue 9.0/5638rev / ibis Sukhumvit 24 / S Box / S33 reuse / Best Western 20)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-phrom-phong — Sorn (3-Michelin southern), Rung Rueng (Tang) Michelin Bib noodles, Appia Roman trattoria, Custard Nakamura, Roast EmQuartier, Peppina, Isao sushi, Nihon Saiseisakaba izakaya...
- ☕ https://thailandaddict.com/top10-popular-cafes-phrom-phong — Roast, D'ARK (Phillip Di Bella), Sarnies, Ryoku (soufflé pancakes), Tiengna viennoiserie, Honeyful (Manuka latte), Luka, Bottomless...
- 📸 https://thailandaddict.com/top10-attractions-phrom-phong — EM District (EmSphere+IKEA+UOB Live / EmQuartier 40m waterfall / Emporium), Benjasiri Park, TRIBE Sky Beach Club, Escape rooftop, Flow House surf, Little Japan Soi 33/1...
- Notes: 12-reviewer Workflow-fanout (8 hotel + 4 value) + 3 reuse. Star-verify caught hotel-icon=4★ (→dropped from value), Maven Stylish=4★/wrong-area → reviewer fallback auto-picked Tints of Blue (3★). cafes hung at Frame→Assemble (poller caught) → resume recovered. 2 Wikimedia-CC (EmQuartier-skyline hero, real Benjasiri Park). Fixed rail img 404 (bangkok-emporiumsuites→bangkok-emporium-suites-chatrium). Concurrent build mid-write broke build once (Movenpick BDMS JSON) → retry succeeded.

### 12. Riverside (ริมเจ้าพระยา) — 2026-06-27 (LIVE, TH+EN · ⚙ this loop · Version ea24b253)
- 🏨 https://thailandaddict.com/top10-hotels-riverside-bangkok — 10 riverfront (Mandarin Oriental 9.5/Four Seasons/Peninsula/Chatrium/Millennium Hilton/Anantara/Royal Orchid Sheraton/Shangri-La/AVANI+/Ramada Menam)
- 💰 https://thailandaddict.com/top5-love-hotels-riverside-bangkok — 5 value 3★ (Hotel Once 9.2/Baan Wanglang/ibis Riverside/Aurum Wat-Arun-view/ibis Sathorn)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-riverside — The Deck (Wat Arun view), Supanniga, Yok Yor dinner cruise, Khinlomchomsaphan, NAAM 1608 Song Wat, Riva del Fiume (Four Seasons)...
- ☕ https://thailandaddict.com/top10-popular-cafes-riverside — Hong Sieng Kong (200yr mansion), Mother Roaster, The Jam Factory, Before Sunset (Wat Arun ice cream), Feng Huang matcha...
- 📸 https://thailandaddict.com/top10-attractions-riverside — ICONSIAM, Wat Arun, Asiatique, River City, Tha Maharaj, Talat Noi, Khlong Ong Ang, Rama VIII Bridge...
- Notes: 13-reviewer fanout (8×5★ + 5 value; Ramada Menam verified 5★ not 4★; Loften non-existent → reviewer fallback Hotel Once 3★). cafes+restaurants no hang this run. Wat Arun CC hero. Fixed cross-province stayCta bug (Nakhon Phanom/Chanthaburi "riverside" matched the substring). Build hit a concurrent mid-write JSON once → retry OK.

## ⏳ In progress (TWO loops · coordinate via ย่าน geography to avoid hotel collisions)
### 15. On Nut–Phra Khanong (อ่อนนุช-พระโขนง) — ⚙ THIS loop (Imac) · started 2026-06-27 · Sukhumvit far-east (On Nut BTS / W District / Habito / Phra Khanong, Soi 77–81) — distinct from phrom-phong (Soi 24–39) + far from loop A's central/north-central cluster. reuse hop-inn-onnut + somerset-sukhumvit-71.

## 📋 Queue (popular-first; #8 siam-pratunam done by concurrent loop, #11 phrom-phong done this loop)
ploenchit (FOLDED into chidlom — skip, ~100% overlap) · ratchathewi (⚙this loop NEXT · reuse top10-ratchathewi-bts) · rama9 · ratchada · on-nut · victory-monument · charoen-krung · saphan-taksin · mochit-chatuchak · ladprao · central-ladprao · ramkhamhaeng · bangkapi · bangna · srinakarin · pinklao · talat-phlu · bang-sue · bang-khen · kaset · chaeng-watthana · sai-tai

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

### 10. Ratchathewi–Phaya Thai (ราชเทวี-พญาไท) — 2026-06-27 (LIVE, TH+EN · ⚙ central-core loop)
- 🏨 https://thailandaddict.com/top10-ratchathewi-bts-hotels-bangkok — REUSED existing roundup (VIE MGallery/Eastin Grand Phayathai/Pullman King Power... — Ari-style, no new reviews)
- 💰 https://thailandaddict.com/top5-love-hotels-ratchathewi-bangkok — 5 value 2-3★ (Vic3/The Posh Phayathai/Bed Station 9.4/Been Hostel/Siam Swana — all reuse)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-ratchathewi — Chakki (Jak Gee) Michelin rad na, Muek Man Kai Singapore chicken rice, Tehoo roti cha chak halal, Baan Khun Ya 60yr...
- ☕ https://thailandaddict.com/top10-popular-cafes-ratchathewi — Factory Coffee (3× barista champ), Roots, Casa Lapin, Café Narasingh (Thailand's first coffee shop, Phaya Thai Palace), Piccolo Vicolo garden...
- 📸 https://thailandaddict.com/top10-attractions-ratchathewi — Victory Monument, Phaya Thai Palace (Roman dome), Platinum Fashion Mall, Suan Pakkad Palace Museum, Baiyoke Sky, Baan Krua silk community...
- Notes: ⚡FAST (Ari-style) — hotels+value 100% REUSE, zero new reviews; only value roundup + 3 articles new. Swapped CLOSED Talad Neon night market → Baiyoke Sky (rank 6). Scrubbed ban-words ระดับโลก/โดดเด่น in attractions. Baiyoke-skyline CC hero + Victory Monument + Baiyoke CC cards. **victory-monument #(future) FOLDS into ratchathewi — skip.** SELECTIVE git add (no new hotel imgs, only food/ratchathewi).

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

### 15. On Nut–Phra Khanong (อ่อนนุช-พระโขนง) — 2026-06-27 (LIVE, TH+EN · ⚙ this loop · Version ac8ad4d5)
- 🏨 https://thailandaddict.com/top10-hotels-on-nut-bangkok — 10 hotels (Avani+ 9.2/Cross Vibe/Hotel Amber 9.1/INNSiDE/Kokotel/Somerset 71/ibis Styles/Quarter Onnut/Ramada 48/Qiu)
- 💰 https://thailandaddict.com/top5-love-hotels-on-nut-bangkok — 5 value 2-3★ (Hop Inn/ibis Styles/The Bedrooms/Klassique/Aspira 71)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-on-nut — Nam Tian Cantonese (80yr), Nai Uan Yentafo (Michelin Guide), Ha Seng roast duck, Fu Chai pork-blood soup, Heng oyster omelette...
- ☕ https://thailandaddict.com/top10-popular-cafes-on-nut — Ministry of Roasters, The Wood Land garden cafe, Atlas (11 beans), vast.coffee, Bake Urban croissants, Ekkamai Macchiato...
- 📸 https://thailandaddict.com/top10-attractions-on-nut — Habito Mall T77, Sansiri Backyard sheep farm, W District art market, Wat Mae Nak Phra Khanong, People Park, Century Movie Plaza...
- Notes: 11-reviewer fanout w/ HEAVY substitution (Aspira Skye/Citadines/Blu Monkey/Hotel 92 don't exist → reviewers swapped to real ones). **Caught+removed a DUPLICATE** (2 reviewers both picked Quarter Onnut). Repointed 14 dead related-refs. **DATA-CORRECTNESS round (owner-requested):** cafes had a CLOSED cafe (Magpie→Coffee Effect) + a relocated cafe (INK&LION→Ministry of Roasters) → swapped + scrubbed all stale frame/faq refs; `tourlogy-quality-auditor` on hotels confirmed all 10 real+open+located, fixed 2 banned words, Kokotel Booking URL→search URL. New gate: `_internal/wf/audit-roundup.mjs`. Wat Mahabut CC hero.

### 11. Rama 9–Ratchada–Huai Khwang (พระราม 9-รัชดา) — 2026-06-27 (LIVE, TH+EN · ⚙ central-core loop)
- 🏨 https://thailandaddict.com/top10-hotels-rama9-bangkok — 10 (Jubilee Prestige[ex-Swissôtel]/Avani Ratchada/The Emerald/ZAZZ Urban/Somerset/Golden Tulip Sovereign/Maitria/Cassia/Grande Mercure Atrium/Lancaster — 2 new + 8 reuse)
- 💰 https://thailandaddict.com/top5-love-hotels-rama9-bangkok — 5 value 2-3★ (ibis Styles Ratchada/Calmly Stay/Best Western Ratchada/Chiva/Praso — 3 new + 2 reuse)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-rama9 — Somboon crab curry (1969), Agave Foomuikee Hainanese (Shell Chuan Chim), Holy Shrimp (Jodd Fairs), Lung Luean chicken noodles (1957)...
- ☕ https://thailandaddict.com/top10-popular-cafes-rama9 — Phil Coffee (70s house), Talaychan Patisserie (Le Cordon Bleu), Baker x Florist, OASIS 24hr, FlowEver Cafe & Wine...
- 📸 https://thailandaddict.com/top10-attractions-rama9 — JODD FAIRS, The One Ratchada colourful-umbrella market, Central Rama 9, RCA, Wat Phra Ram 9, Esplanade, INVESTORY...
- Notes: 6-reviewer fanout (3 popular 5★ + 3 value). **Caught DUPE: Grand Mercure Fortune = Avani Ratchada (rebranded 2024, same building) → DROPPED, replaced #4 w/ ZAZZ Urban (reuse).** cafes hung at Frame→Assemble (poller caught) → resume recovered + fixed a garbled string. Swapped CLOSED Pressed Cafe→FlowEver (rank 6). Train-Night-Market-umbrella CC hero + RCA Plaza + SET building CC. **ratchada/huai-khwang FOLD into rama9 — skip.** SELECTIVE commit (5 new hotels, NOT grand-mercure-fortune).

### 19. Mochit–Chatuchak (หมอชิต-จตุจักร) — 2026-06-27 (LIVE, TH+EN · ⚙ this loop · Version ace44034)
- 🏨 https://thailandaddict.com/top10-hotels-mochit-chatuchak-bangkok — 10 (Centara Grand Ladprao 5★/Best Western Chatuchak 4★/Josh 4★ NEW + 7 reuse จตุจักร: Boutique Poo-Yai Ma 9.1/Baan Nueng/Tobacco One/Jatujak Studio/CU Inn/Bed To Bangkok/G9)
- 💰 https://thailandaddict.com/top5-love-hotels-mochit-chatuchak-bangkok — 5 value 2-3★ (Boutique Poo-Yai Ma 9.1/Baan Nueng/Jatujak Studio/Bed To Bangkok/CU Inn)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-mochit-chatuchak — Coco JJ coconut ice cream, Viva 8 paella, Sanan/Sudjai Or-Tor-Kor seafood, boat noodles, Larb Nua Udon...
- ☕ https://thailandaddict.com/top10-popular-cafes-mochit-chatuchak — Kaarom specialty 4.7, HEY! Beanstro, Peaktellers Or-Tor-Kor bakery (30yr), Daisy flower cafe, Brewery Brasserie, Compress Coffee...
- 📸 https://thailandaddict.com/top10-attractions-mochit-chatuchak — JJ Weekend Market (world's biggest), Or Tor Kor, Rot Fai/Railway Park, Chatuchak Park, Mixt Chatuchak, Queen Sirikit Park, Children's Museum...
- Notes: existing top9 was budget-only/sub-standard → **upgraded to proper top-10** (3 NEW premium reviewers + 7 reuse) + **retired old top9** (repointed whole-BKK restaurants link → top10, deleted dup). DATA-CORRECTNESS: restaurants hung at Frame→Assemble → resume recovered; cafes had **2 CLOSED cafes** (Standalone Vibhavadi/Pompano @ The Camp) → swapped → Brewery Brasserie + Compress Coffee + frame scrubbed; fixed Tobacco One (FB-as-Booking) + Centara/Josh former-name Booking slugs → search URLs. Chatuchak-market CC hero. Used `git -c rebase.autostash=true` for the churn-race push.

### 12. Sai Tai – Taling Chan (สายใต้ใหม่-ตลิ่งชัน) — 2026-06-27 (LIVE, TH+EN · ⚙ central-core loop · Thonburi)
- 🏨 https://thailandaddict.com/top7-sai-tai-bus-terminal-hotels-bangkok — REUSED existing roundup (Visa/Cana/S.D. Avenue/NORN Canalside/Charlie House Pinklao/Royal City/Yaks — Ari-style, no new reviews)
- 💰 https://thailandaddict.com/top5-love-hotels-sai-tai-bangkok — 5 value 3★ (NORN Canalside/Cana/Charlie House Pinklao/S.D. Avenue/Visa — all reuse)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-sai-tai — Taling Chan Floating Market grilled fish, Huen Lampoon (Michelin Guide N.Thai), Phed Phed Bistro (Bib Gourmand Isan), COAL Bistro charcoal steak...
- ☕ https://thailandaddict.com/top10-popular-cafes-sai-tai — James Boulangerie (Chef James croissants), Rolling Roasters, Eight de Klong (canalside wood house), RAWVAELA (Khlong Lat Mayom)...
- 📸 https://thailandaddict.com/top10-attractions-sai-tai — Taling Chan + Khlong Lat Mayom + Wat Saphan + Song Khlong floating markets, Baan Silapin Artist's House, Wat Champa (Ayutthaya-era), The Circle Ratchaphruek...
- Notes: ⚡FAST (Ari-style) — hotels+value 100% REUSE, only value roundup + 3 articles new. Swapped CLOSED Suan Ahan Talingchan→PLA-YOOYEN (restaurants r6). cafes EN agent died mid-response (API)→re-ran OK. Taling-Chan-market CC hero. SELECTIVE git add (no new hotel imgs). ratchada→rama9, victory-monument→ratchathewi, ploenchit→chidlom (folded).

### 25. Bang Na (บางนา) — 2026-06-27 (LIVE, TH+EN · ⚙ this loop · Version fbbc91ff)
- 🏨 https://thailandaddict.com/top10-hotels-bangna-bangkok — 10 (Lasalle Suites 4★/56 Hotel/Brighton/Avana 4★/Shade House BITEC NEW + 5 reuse: Thomson 9.0/Cubic 9.2/Takka/Romance 97/Hop Inn 9.2)
- 💰 https://thailandaddict.com/top5-love-hotels-bangna-bangkok — 5 value 2-3★ (Cubic 9.2/Hop Inn 9.2/Takka/56 Hotel/Romance Sukhumvit 97)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-bangna — Silawat Seafood (40yr), Maguro 4.7, Ohkajhu rooftop Lasalle, Khelang northern, NANA Coffee, Saen Aroi Pochana, duck+tomyum noodles...
- ☕ https://thailandaddict.com/top10-popular-cafes-bangna — NANA Coffee Roasters garden roastery 4.6, Roots @ BITEC, Coffee Station Tokyo-subway theme, La Mesa Mayan Mocha, Shelterhood 4.9, Bougain garden cafe...
- 📸 https://thailandaddict.com/top10-attractions-bangna — Mega Bangna+IKEA, Pororo rooftop AquaPark, Suan Luang Rama 9, Train Night Market, Seacon Square, Bueng Nong Bon sailing, BITEC, TopGolf 4.9, BEAT Active...
- Notes: 5-reviewer fanout (Lasalle/56/Brighton/Avana/Shade House) + 5 reuse → proper top-10. DATA-CORRECTNESS: spawned cafe closure-verify agent → **all 10 cafes confirmed OPEN** (no swap needed); value h1 clean (ม่านรูด hidden in TH metaDesc only); 24 new hotel imgs → R2. Bhumibol-Bridge-sunset CC hero (CC BY 2.0). Build 12,308 pages. NOTE for srinakarin (next): Train Night Market + Seacon + Suan Luang Rama 9 already used here — differentiate srinakarin attractions.

### 13. Talat Phlu – Wongwian Yai – Krung Thonburi (ตลาดพลู-วงเวียนใหญ่) — 2026-06-27 (LIVE, TH+EN · ⚙ central-core loop · Thonburi)
- 🏨 https://thailandaddict.com/top10-hotels-talat-phlu-bangkok — 10 NEW (Hop Inn Krung Thonburi 9.1/Bangkok Loft Inn/W Station/White Ivory/Klean Residence/Aim House/Aiyapura/Sarasinee/King Royal II/Jolly Suites — all-new, no reuse existed)
- 💰 https://thailandaddict.com/top5-love-hotels-talat-phlu-bangkok — 5 value 2-3★ (Hop Inn/Klean Residence/Aim House/Aiyapura/King Royal II)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-talat-phlu — Somsak Pu Ob (Michelin crab glass noodles), Kuychai Lee Po Ngek (100yr), Suriya Coffee (100yr kopi), Ni-Ang egg ice cream, Sunee khao moo daeng...
- ☕ https://thailandaddict.com/top10-popular-cafes-talat-phlu — LYNX Coffee (young-coconut pie), Pracha Cafe (70yr printing house), Siamratana Bakehouse (1964 sangkaya), Trok Talatphlu rooftop (Wat Paknam view), Cafe Marquina...
- 📸 https://thailandaddict.com/top10-attractions-talat-phlu — Wat Paknam Big Buddha 69m + Glass Pagoda, Talat Phlu market (Lahn Mah film loc), Baan Silapin canal puppets, Wongwian Yai King Taksin Monument, Wat Khun Chan Rahu shrine...
- Notes: 10-reviewer Workflow-fanout (ALL-NEW — no reuse hotels existed in this Thonburi-west cluster; scoped honest top10 around BTS Wongwian Yai/Krung Thonburi). restaurants hung at Frame→Assemble (poller caught) → resume recovered. Swapped CLOSED Kups Cafe→Cafe Marquina (cafes r9, agent flagged BLOCKER). Wat-Paknam-Big-Buddha CC hero + Wat Intharam CC. SELECTIVE git add. ratchada→rama9, victory-monument→ratchathewi, ploenchit→chidlom (folded).

### 14. Pinklao – Wang Lang – Bangkok Noi (ปิ่นเกล้า-วังหลัง) — 2026-06-27 (LIVE, TH+EN · ⚙ central-core loop · Thonburi · ⚡FAST/REUSE · **LAST ย่าน → loop A COMPLETE**)
- 🏨 https://thailandaddict.com/top7-siriraj-hospital-hotels-bangkok — REUSED existing roundup (= Wang Lang/Pinklao/Bangkok Noi zone: Uncle Loy's/Baan Wanglang Riverside/Wang Lang Hostel/Kaya Heritage/Theatre Residence/Icon/Ekanake — no new reviews)
- 💰 https://thailandaddict.com/top5-love-hotels-pinklao-bangkok — 5 value 2-3★ (Uncle Loy's 9.5/Wang Lang Hostel 9.2/Baan Wanglang Riverside 9.0/Kaya Heritage/Charlie House Pinklao — all reuse)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-pinklao — Khao Dong Moo Daeng charcoal-grill, Earw Thai Suki Boran, Jade Garden Peking duck, Khua Cham Ple (Shell Chuan Chim chicken noodles), Orathai Sushi ฿5/piece, Khun Or Vietnamese kuay jab...
- ☕ https://thailandaddict.com/top10-popular-cafes-pinklao — N10 Café riverside Wat-Arun view, Japang (first butter-grilled ice cream in TH), Lazy Café La-Z-Boy gallery, Second Cafe riverside, Double Slash specialty, Coffee No.9...
- 📸 https://thailandaddict.com/top10-attractions-pinklao — Wang Lang Market, Royal Barges National Museum (Suphannahong), Wat Rakhang (ring-the-bell), Central Pinklao IMAX, Siriraj Bimuksthan Museum, Rama VIII Park & cable-stayed bridge, Siriraj Medical Museum...
- Notes: ⚡FAST (Ari-style) — hotels 100% REUSE top7-siriraj (Wang Lang = Pinklao zone), only value roundup + 3 articles new. All 3 eat-rankings ran clean (no hangs). Suphannahong-Royal-Barge CC hero (CC BY-SA 4.0) + Wat Amarintharam CC. SELECTIVE git add (no new hotel imgs). ratchada→rama9, victory-monument→ratchathewi, ploenchit→chidlom (folded).

---
## 🏁 LOOP A (central-core · Thonburi) COMPLETE = 14 ย่าน LIVE (2026-06-27)
**sukhumvit · silom-sathorn · thong-lo · ari · khao-san · chinatown · samyan · siam-pratunam · chidlom · ratchathewi · rama9 · sai-tai · talat-phlu · pinklao** — all 5 dimensions × TH+EN. No clean ย่าน left for loop A (remaining = loop-B's east/north/SE or charoen-krung/saphan-taksin riverside/silom-overlaps). STOP unless owner assigns more.

### 26. Srinakarin (ศรีนครินทร์) — 2026-06-28 (LIVE, TH+EN · ⚙ this loop · Version 5f237b4b)
- 🏨 https://thailandaddict.com/top10-hotels-srinakarin-bangkok — 10 (The Park Nine 9.3/Dusit Princess 4★/Lumen/De Botan/B2 NEW + 5 reuse: Onix 4★/The 9 Residence/Bay Hotel/Livotel Hua Mak 4★/Xtreme Suites)
- 💰 https://thailandaddict.com/top5-love-hotels-srinakarin-bangkok — 5 value 3★ (The 9 Residence 8.4/B2 8.2/De Botan 8.1/Bay Hotel 8.0/Xtreme Suites)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-srinakarin — Guay Jub Ek Pailin (Wongnai Users' Choice), Halee Teochew Peking duck, Pathe 90s legend, Ruepoh Seafood, Baan Khamin Southern, Baan Nok boat noodles...
- ☕ https://thailandaddict.com/top10-popular-cafes-srinakarin — MiVana forest-coffee glasshouse 4.4, Santarosa Korean Dutch Coffee, NANA @ Seacon, Part of Moon B&W 4.5, Marble Cafe, After You, Lan Cake Nom Sod...
- 📸 https://thailandaddict.com/top10-attractions-srinakarin — Seacon Square, Train Night Market, Suan Luang Rama 9, Paradise Park, Bueng Nong Bon + 4 differentiated: Wat Thammamongkhon, Rajamangala National Stadium, Thanya Park, Ramkhamhaeng University
- Notes: 5-reviewer fanout (Dusit Princess/Park Nine 9.3/Lumen/De Botan/B2) + 7 reuse from Samitivej-hospital cluster. **DATA-CORRECTNESS (3 fixes):** (1) restaurants r6 Moo Thewada was a cross-ย่าน DUP w/ bangna (Lasalle border) → swapped Baan Nok Boat Noodles (Suan Luang core) + FAQ scrub; (2) attractions had **3 cafe cross-DIMENSION dups** (Marble/MiVana/Santarosa already in srinakarin cafes) + Yoyoland redundant-in-Seacon → swapped Wat Thammamongkhon/Rajamangala/Thanya Park + frame scrub; (3) attractions r10 Wat Mahabut/Mae Nak was a DUP w/ on-nut + wrong zone (On Nut) → swapped Ramkhamhaeng University (Hua Mak). Kept 4 genuine srinakarin icons that bangna borrowed (Seacon/Train Market/Suan Luang Rama 9/Bueng Nong Bon). Suan Luang Rama IX CC hero. cafes all 10 verified OPEN.

### 27. Lat Phrao (ลาดพร้าว) — 2026-07-01 (LIVE, TH+EN · ⚙ this session · Version a573ca1e)
- 🏨 https://thailandaddict.com/top10-hotels-ladprao-bangkok — 10 (The Quarter Ladprao 4★9.1/President Chokchai 4 4★/Livotel 4★ reuse/48 Metro 3★8.4/Cha Cha Suite 3★/Synsiri 130 3★ reuse/Kiatthada/T3/Fullrich/Grandview)
- 💰 https://thailandaddict.com/top5-love-hotels-ladprao-bangkok — 5 value 3★ (48 Metro/Cha Cha Suite/Synsiri 130/Kiatthada/Fullrich)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-ladprao — Tong Peng duck, Auan Yentafo, Somyot late-night rice soup (Michelin Bib), Zong braised duck, Union Mall food court...
- ☕ https://thailandaddict.com/top10-popular-cafes-ladprao — UNFINISHED, Wood, Hacking Coffee, LIEBE, Blackhills, HARIO 24h, Santipanich, Maysa, Hong Di, Bluetamp
- 📸 https://thailandaddict.com/top10-attractions-ladprao — Central Ladprao, Union Mall, Chok Chai 4 night market, Ha Yaek skywalk, Imperial World, Indy Market, Bueng Lat Phrao 71 park, Wang Hin cafe-bar zone, Wat Sakhonsun, Ram Inthra Sports Park
- Notes: **🔀 central-ladprao FOLDED IN (skipped)** — Ha Yaek/Central Plaza node ≈100% overlap w/ built mochit-chatuchak. 8 new hotel reviews + 2 reuse (livotel/synsiri). **Cross-dim dedup:** Slōlē cafe was in BOTH restaurants r10 + cafes r4 → swapped cafes r4 → LIEBE Coffee & Roastery (new reviewer). Restaurants engine 529'd at Plan once → relaunch OK; cafes hung Frame→Assemble once → TaskStop+resume OK. Ha Yaek Lat Phrao CC0 cityscape hero + real CC attraction photos (r3 exact Chok Chai 4 market; r7/r9/r10 honestly-credited "ภาพประกอบ" representative). Scrubbed a leaked prov instruction from foodexp/localtips labels. All 5 dims verify errors=0, EN validate PASS. Also shipped in this deploy: **23 top10-attractions-<province> EN twins** (Isan/deep-south — closed that gap to 0/96).

### 28. Bang Sue (บางซื่อ) — 2026-07-01 (LIVE, TH+EN · ⚙ this session · Version 2b0b39b8 · **honest top-6 hotels**)
- 🏨 https://thailandaddict.com/top6-hotels-bang-sue-bangkok — **top-6** honest (thin transit district; not padded): State Apartment 3★/WE Hotel Riverfront 4★/Matini Hostel Grandstation 2★9.1/Ziniza 3★/Yeehaa 3★/Cattreya 3★. (Dropped from research: Dusita [wrong placeholder img] + Orange Lodge [out-of-area Phaya Thai] — files removed pre-build.)
- 💰 https://thailandaddict.com/top5-love-hotels-bang-sue-bangkok — 5 value 2-3★ (Matini/State/Ziniza/Yeehaa/Cattreya)
- 🍜 https://thailandaddict.com/top10-popular-restaurants-bang-sue — Ngua smoked beef noodle, Guay Jub Sam Thum, Je Khai Seafood, Pae Joke Michelin-Bib congee, Thipparot 50yr ice cream... (dedup: Sanan Seafood = mochit r5/Or Tor Kor → Pae Joke)
- ☕ https://thailandaddict.com/top10-popular-cafes-bang-sue — Ripple Coffee Roasters, Lab Coffee x Pudding Lab, TRYST, Hoffmann, Sao Cafe dim sum, Sevendays...
- 📸 https://thailandaddict.com/top10-attractions-bang-sue — Bang Sue Grand Station, Bang Pho Wood Street, Gateway mall, Tao Poon Market, Wat Bang Pho, Chao Mae Thapthim Shrine, Code Craft Beer Bar... (dedup: Wachirabenchathat Railway Park = mochit r3 → Wat Matchantikaram + full frame scrub)
- Notes: honest thin transit district → top-6 not padded (owner-approved "honest smaller builds"). All-new hotels (no reuse). 3 cross-ย่าน dedups vs mochit (Sanan/Wachirabenchathat) + reused WE Hotel (re-homed from yanhee). restaurants+cafes+attractions each hung Frame→Assemble once → TaskStop+resume recovered. Bang Sue Grand Station CC hero. All 5 dims verify errors=0, EN validate PASS.

## ⏳ In progress (2026-07-01 · Imac · THIS session)
### (loop B next) Bang Khen (บางเขน) — NEXT · North BKK (Kaset intersection/ม.เกษตร · Ram Inthra · MRT/SRT Bang Khen). ⚠️ differentiate from kaset (adjacent — decide fold or split). Then: kaset · chaeng-watthana · ramkhamhaeng · bangkapi · charoen-krung (⚠️vs riverside/silom) · saphan-taksin (⚠️vs riverside/silom).

## 📋 Queue after ladprao (loop B north/east/SE; loop A COMPLETE)
bang-sue · bang-khen · kaset · chaeng-watthana · ramkhamhaeng · bangkapi · charoen-krung (⚠️differentiate vs riverside/silom) · saphan-taksin (⚠️differentiate vs riverside/silom) — 8 remaining after ladprao. FOLDED/skip: ploenchit→chidlom · ratchada→rama9 · victory-monument→ratchathewi · central-ladprao→ladprao.

# Bangkok ย่าน — Full Correctness Audit

**Audit date:** 2026-07-03 · **Auditor:** Claude Opus 4.8 (automated audit-bangkok.mjs) · **Scope:** all 33 Bangkok ย่าน

**Structural result:** ✅ PASS — 0 errors · 0 warnings · eat-rankings 99 · hotel roundups 60

Per eat-ranking: JSON valid · type/cluster · 10 cards · descHtml ≥700 Thai chars · crumbCityHref=area-bangkok-<hood> · 0 ban-words · EN twin exists + zero-raw-Thai + block parity.
Per roundup: JSON valid (TH+EN) · EN zero-raw-Thai.

## Cross-ย่าน venue collisions: 26 (SAME-VENUE dups: 5)
> LANDMARK = a park/market/temple/mall genuinely between two ย่าน (acceptable). BRANCH = same brand, different outlet/สาขา (acceptable but noted). SAME-VENUE = the same single place on two pages (should swap one). "🟡mine" = involves a ย่าน built 2026-07-03.

| venue | ย่าน | category | this-session? |
|---|---|---|---|
| Holey Artisan Bakery (สาขาร่วมฤดี) | ploenchit, silom-sathorn | BRANCH(diff location) | 🟡 yes |
| Coffee Beans by Dao (สาขาร่วมฤดี) | ploenchit, srinakarin | BRANCH(diff location) | 🟡 yes |
| โกอ่างข้าวมันไก่ประตูน้ำ (สาขาเอสพลานาด รัชดา) | ratchada, siam-pratunam | BRANCH(diff location) | 🟡 yes |
| Thongyoy Cafe (ทองย้อย คาเฟ่) | ari, siam-pratunam | BRANCH(diff location) | — |
| Roots Coffee (Mega Bangna) | bangna, silom-sathorn, thong-lo | BRANCH(diff location) | — |
| Erawan Tea Room | chidlom, siam-pratunam | BRANCH(diff location) | — |
| Ha Tien Cafe | khao-san, riverside | BRANCH(diff location) | — |
| Roast | phrom-phong, sukhumvit, thong-lo | BRANCH(diff location) | — |
| D'ARK EmQuartier | phrom-phong, sukhumvit | BRANCH(diff location) | — |
| Sarnies カフェ Sukhumvit | phrom-phong, sukhumvit | BRANCH(diff location) | — |
| Kaizen Coffee Co. (ไคเซ็น คอฟฟี่) | sukhumvit, thong-lo | BRANCH(diff location) | — |
| One Ounce for Onion (วันออนซ์ ฟอร์ ออเนียน) | sukhumvit, thong-lo | BRANCH(diff location) | — |
| ข้าวมันไก่เจ๊อ้วน | bang-khen, mochit-chatuchak | BRANCH(diff location) | — |
| Roast Coffee & Eatery | sukhumvit, thong-lo | BRANCH(diff location) | — |
| สวนกีฬารามอินทรา (สวนใต้ทางด่วนรามอินทรา) | bang-khen, ladprao | LANDMARK(shared) | — |
| สวนหลวง ร.9 (Suan Luang Rama IX Park) | bangna, srinakarin | LANDMARK(shared) | — |
| ตลาดนัดรถไฟ ศรีนครินทร์ (Train Night Market Srinakarin) | bangna, srinakarin | LANDMARK(shared) | — |
| ศูนย์กีฬาทางน้ำบึงหนองบอน (Bueng Nong Bon Water Sports Center) | bangna, srinakarin | LANDMARK(shared) | — |
| สวนลุมพินี (Lumpini Park) | chidlom, silom-sathorn | LANDMARK(shared) | — |
| ตลาดน้อย (Talat Noi) | chinatown, riverside | LANDMARK(shared) | — |
| สวนเบญจสิริ (Benjasiri Park) | phrom-phong, sukhumvit | LANDMARK(shared) | — |
| Luka | chidlom, silom-sathorn | SAME-VENUE | — |
| Hong Sieng Kong (ฮงเซียงกง) | chinatown, riverside | SAME-VENUE | — |
| Tiengna Viennoiserie | phrom-phong, silom-sathorn | SAME-VENUE | — |
| รุ่งเรือง (ตั๋ง) ก๋วยเตี๋ยวหมู สุขุมวิท 26 | phrom-phong, sukhumvit | SAME-VENUE | — |
| Sri Trat Restaurant & Bar (ศรีตราด) | phrom-phong, sukhumvit | SAME-VENUE | — |

## Eat-rankings — written · audited · result

| ย่าน | dim | written | audited | result |
|---|---|---|---|---|
| ari | attr | 2026-06-25 | 2026-07-03 | ✅ pass |
| ari | cafes | 2026-06-25 | 2026-07-03 | ✅ pass |
| ari | rest | 2026-06-25 | 2026-07-03 | ✅ pass |
| bangkapi | attr | 2026-07-02 | 2026-07-03 | ✅ pass |
| bangkapi | cafes | 2026-07-02 | 2026-07-03 | ✅ pass |
| bangkapi | rest | 2026-07-02 | 2026-07-03 | ✅ pass |
| bang-khen | attr | 2026-06-20 | 2026-07-03 | ✅ pass |
| bang-khen | cafes | 2026-06-20 | 2026-07-03 | ✅ pass |
| bang-khen | rest | 2026-06-20 | 2026-07-03 | ✅ pass |
| bangna | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| bangna | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| bangna | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| bang-sue | attr | 2026-06-20 | 2026-07-03 | ✅ pass |
| bang-sue | cafes | 2026-06-20 | 2026-07-03 | ✅ pass |
| bang-sue | rest | 2026-06-20 | 2026-07-03 | ✅ pass |
| central-ladprao | attr | 2026-07-03 | 2026-07-03 | ✅ pass |
| central-ladprao | cafes | 2026-07-03 | 2026-07-03 | ✅ pass |
| central-ladprao | rest | 2026-07-03 | 2026-07-03 | ✅ pass |
| chaeng-watthana | attr | 2026-07-02 | 2026-07-03 | ✅ pass |
| chaeng-watthana | cafes | 2026-07-02 | 2026-07-03 | ✅ pass |
| chaeng-watthana | rest | 2026-07-02 | 2026-07-03 | ✅ pass |
| charoen-krung | attr | 2026-07-02 | 2026-07-03 | ✅ pass |
| charoen-krung | cafes | 2026-07-02 | 2026-07-03 | ✅ pass |
| charoen-krung | rest | 2026-07-02 | 2026-07-03 | ✅ pass |
| chidlom | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| chidlom | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| chidlom | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| chinatown | attr | 2026-06-25 | 2026-07-03 | ✅ pass |
| chinatown | cafes | 2026-06-25 | 2026-07-03 | ✅ pass |
| chinatown | rest | 2026-06-25 | 2026-07-03 | ✅ pass |
| kaset | attr | 2026-07-02 | 2026-07-03 | ✅ pass |
| kaset | cafes | 2026-07-02 | 2026-07-03 | ✅ pass |
| kaset | rest | 2026-06-20 | 2026-07-03 | ✅ pass |
| khao-san | attr | 2026-06-25 | 2026-07-03 | ✅ pass |
| khao-san | cafes | 2026-06-25 | 2026-07-03 | ✅ pass |
| khao-san | rest | 2026-06-25 | 2026-07-03 | ✅ pass |
| ladprao | attr | 2026-06-20 | 2026-07-03 | ✅ pass |
| ladprao | cafes | 2026-06-20 | 2026-07-03 | ✅ pass |
| ladprao | rest | 2026-06-20 | 2026-07-03 | ✅ pass |
| mochit-chatuchak | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| mochit-chatuchak | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| mochit-chatuchak | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| on-nut | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| on-nut | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| on-nut | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| phrom-phong | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| phrom-phong | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| phrom-phong | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| pinklao | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| pinklao | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| pinklao | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| ploenchit | attr | 2026-07-03 | 2026-07-03 | ✅ pass |
| ploenchit | cafes | 2026-07-03 | 2026-07-03 | ✅ pass |
| ploenchit | rest | 2026-07-03 | 2026-07-03 | ✅ pass |
| rama9 | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| rama9 | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| rama9 | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| ramkhamhaeng | attr | 2026-07-02 | 2026-07-03 | ✅ pass |
| ramkhamhaeng | cafes | 2026-07-02 | 2026-07-03 | ✅ pass |
| ramkhamhaeng | rest | 2026-07-02 | 2026-07-03 | ✅ pass |
| ratchada | attr | 2026-07-03 | 2026-07-03 | ✅ pass |
| ratchada | cafes | 2026-07-03 | 2026-07-03 | ✅ pass |
| ratchada | rest | 2026-07-03 | 2026-07-03 | ✅ pass |
| ratchathewi | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| ratchathewi | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| ratchathewi | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| riverside | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| riverside | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| riverside | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| sai-tai | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| sai-tai | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| sai-tai | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| samyan | attr | 2026-06-26 | 2026-07-03 | ✅ pass |
| samyan | cafes | 2026-06-26 | 2026-07-03 | ✅ pass |
| samyan | rest | 2026-06-25 | 2026-07-03 | ✅ pass |
| saphan-taksin | attr | 2026-07-02 | 2026-07-03 | ✅ pass |
| saphan-taksin | cafes | 2026-07-02 | 2026-07-03 | ✅ pass |
| saphan-taksin | rest | 2026-07-02 | 2026-07-03 | ✅ pass |
| siam-pratunam | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| siam-pratunam | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| siam-pratunam | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| silom-sathorn | attr | 2026-06-25 | 2026-07-03 | ✅ pass |
| silom-sathorn | cafes | 2026-06-25 | 2026-07-03 | ✅ pass |
| silom-sathorn | rest | 2026-06-25 | 2026-07-03 | ✅ pass |
| srinakarin | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| srinakarin | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| srinakarin | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| sukhumvit | attr | 2026-06-24 | 2026-07-03 | ✅ pass |
| sukhumvit | cafes | 2026-06-24 | 2026-07-03 | ✅ pass |
| sukhumvit | rest | 2026-06-24 | 2026-07-03 | ✅ pass |
| talat-phlu | attr | 2026-06-27 | 2026-07-03 | ✅ pass |
| talat-phlu | cafes | 2026-06-27 | 2026-07-03 | ✅ pass |
| talat-phlu | rest | 2026-06-27 | 2026-07-03 | ✅ pass |
| thong-lo | attr | 2026-06-25 | 2026-07-03 | ✅ pass |
| thong-lo | cafes | 2026-06-25 | 2026-07-03 | ✅ pass |
| thong-lo | rest | 2026-06-25 | 2026-07-03 | ✅ pass |
| victory-monument | attr | 2026-07-03 | 2026-07-03 | ✅ pass |
| victory-monument | cafes | 2026-07-03 | 2026-07-03 | ✅ pass |
| victory-monument | rest | 2026-07-03 | 2026-07-03 | ✅ pass |

## Hotel roundups — written · audited · result

| roundup | ย่าน | written | audited | result |
|---|---|---|---|---|
| top5-love-hotels-ari-bangkok | ari | 2026-06-26 | 2026-07-03 | ✅ pass |
| top5-love-hotels-bangkapi-bangkok | bangkapi | 2026-07-02 | 2026-07-03 | ✅ pass |
| top8-hotels-bangkapi-bangkok | bangkapi | 2026-07-02 | 2026-07-03 | ✅ pass |
| top5-hotels-bang-khen-bangkok | bang-khen | 2026-07-02 | 2026-07-03 | ✅ pass |
| top5-love-hotels-bang-khen-bangkok | bang-khen | 2026-07-02 | 2026-07-03 | ✅ pass |
| top10-hotels-bangna-bangkok | bangna | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-bangna-bangkok | bangna | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-bang-sue-bangkok | bang-sue | 2026-07-01 | 2026-07-03 | ✅ pass |
| top6-hotels-bang-sue-bangkok | bang-sue | 2026-07-01 | 2026-07-03 | ✅ pass |
| top5-hotels-central-ladprao-bangkok | central-ladprao | 2026-07-03 | 2026-07-03 | ✅ pass |
| top5-love-hotels-chaeng-watthana-bangkok | chaeng-watthana | 2026-07-02 | 2026-07-03 | ✅ pass |
| top9-hotels-chaeng-watthana-bangkok | chaeng-watthana | 2026-07-02 | 2026-07-03 | ✅ pass |
| top5-love-hotels-charoen-krung-bangkok | charoen-krung | 2026-07-02 | 2026-07-03 | ✅ pass |
| top7-hotels-charoen-krung-bangkok | charoen-krung | 2026-07-02 | 2026-07-03 | ✅ pass |
| top10-hotels-chidlom-bangkok | chidlom | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-chidlom-bangkok | chidlom | 2026-06-27 | 2026-07-03 | ✅ pass |
| top10-hotels-chinatown-bangkok | chinatown | 2026-06-26 | 2026-07-03 | ✅ pass |
| top5-love-hotels-chinatown-bangkok | chinatown | 2026-06-26 | 2026-07-03 | ✅ pass |
| top5-love-hotels-kaset-bangkok | kaset | 2026-07-02 | 2026-07-03 | ✅ pass |
| top7-hotels-kaset-bangkok | kaset | 2026-07-02 | 2026-07-03 | ✅ pass |
| top10-hotels-khao-san-bangkok | khao-san | 2026-06-26 | 2026-07-03 | ✅ pass |
| top5-love-hotels-khao-san-bangkok | khao-san | 2026-06-26 | 2026-07-03 | ✅ pass |
| top10-hotels-ladprao-bangkok | ladprao | 2026-07-01 | 2026-07-03 | ✅ pass |
| top5-love-hotels-ladprao-bangkok | ladprao | 2026-07-01 | 2026-07-03 | ✅ pass |
| top10-hotels-mochit-chatuchak-bangkok | mochit-chatuchak | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-mochit-chatuchak-bangkok | mochit-chatuchak | 2026-06-27 | 2026-07-03 | ✅ pass |
| top10-hotels-on-nut-bangkok | on-nut | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-on-nut-bangkok | on-nut | 2026-06-27 | 2026-07-03 | ✅ pass |
| top10-hotels-phrom-phong-bangkok | phrom-phong | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-phrom-phong-bangkok | phrom-phong | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-pinklao-bangkok | pinklao | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-hotels-ploenchit-bangkok | ploenchit | 2026-07-03 | 2026-07-03 | ✅ pass |
| top10-hotels-rama9-bangkok | rama9 | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-rama9-bangkok | rama9 | 2026-06-27 | 2026-07-03 | ✅ pass |
| top10-hotels-ramkhamhaeng-bangkok | ramkhamhaeng | 2026-07-02 | 2026-07-03 | ✅ pass |
| top5-love-hotels-ramkhamhaeng-bangkok | ramkhamhaeng | 2026-07-02 | 2026-07-03 | ✅ pass |
| top5-love-hotels-ratchada-bangkok | ratchada | 2026-07-03 | 2026-07-03 | ✅ pass |
| top7-hotels-ratchada-bangkok | ratchada | 2026-07-03 | 2026-07-03 | ✅ pass |
| top5-love-hotels-ratchathewi-bangkok | ratchathewi | 2026-06-27 | 2026-07-03 | ✅ pass |
| top10-hotels-riverside-bangkok | riverside | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-riverside-bangkok | riverside | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-sai-tai-bangkok | sai-tai | 2026-06-27 | 2026-07-03 | ✅ pass |
| top10-hotels-samyan-bangkok | samyan | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-samyan-bangkok | samyan | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-saphan-taksin-bangkok | saphan-taksin | 2026-07-02 | 2026-07-03 | ✅ pass |
| top8-hotels-saphan-taksin-bangkok | saphan-taksin | 2026-07-02 | 2026-07-03 | ✅ pass |
| top10-hotels-siam-pratunam-bangkok | siam-pratunam | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-siam-pratunam-bangkok | siam-pratunam | 2026-06-27 | 2026-07-03 | ✅ pass |
| top10-hotels-silom-sathorn-bangkok | silom-sathorn | 2026-06-25 | 2026-07-03 | ✅ pass |
| top5-love-hotels-silom-sathorn-bangkok | silom-sathorn | 2026-06-25 | 2026-07-03 | ✅ pass |
| top10-hotels-srinakarin-bangkok | srinakarin | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-srinakarin-bangkok | srinakarin | 2026-06-27 | 2026-07-03 | ✅ pass |
| top10-hotels-sukhumvit-bangkok | sukhumvit | 2026-06-24 | 2026-07-03 | ✅ pass |
| top5-love-hotels-sukhumvit-bangkok | sukhumvit | 2026-06-24 | 2026-07-03 | ✅ pass |
| top10-hotels-talat-phlu-bangkok | talat-phlu | 2026-06-27 | 2026-07-03 | ✅ pass |
| top5-love-hotels-talat-phlu-bangkok | talat-phlu | 2026-06-27 | 2026-07-03 | ✅ pass |
| top10-hotels-thong-lo-bangkok | thong-lo | 2026-06-25 | 2026-07-03 | ✅ pass |
| top5-love-hotels-thong-lo-bangkok | thong-lo | 2026-06-25 | 2026-07-03 | ✅ pass |
| top10-hotels-victory-monument-bangkok | victory-monument | 2026-07-03 | 2026-07-03 | ✅ pass |
| top5-love-hotels-victory-monument-bangkok | victory-monument | 2026-07-03 | 2026-07-03 | ✅ pass |

# 🏙️ BANGKOK DEEP-DIVE PLAN — ย่าน + overlay "hotels near ___" (blueprint)

> สร้าง 2026-06-22 · เป้า: เจาะลึกกรุงเทพระดับ "ย่าน/แลนด์มาร์ก" ที่คนค้นจริง — สำหรับนักท่องเที่ยวทั่วโลก + คนไทย
> ต่อยอดจาก Item 1 (`gen-neighborhood-hotels.mjs`) ที่ทำ 10 ย่านกรุงเทพแล้ว · ใช้ engine + research-agent เดิม

---

## ✅ สรุปเข้าใจง่าย (TL;DR)
- **หน่วยของหน้า = "anchor" (ห้าง/สถานี BTS-MRT/โรงพยาบาล/ศูนย์ประชุม/มหา'ลัย) ไม่ใช่ "เขตปกครอง"** — เพราะคนค้น "โรงแรมย่านเกษตร / ใกล้บำรุงราษฎร์ / ใกล้เซ็นทรัลลาดพร้าว" ไม่มีใครค้น "โรงแรมเขตจตุจักร"
- **โครงสร้าง 2 ชั้น:**
  - **ชั้น A — ย่าน (~45 หน้า):** `where-to-stay-bangkok-<area>` → "พักย่าน X มีโรงแรมอะไรบ้าง"
  - **ชั้น B — Overlay "hotels near ___" (~40 หน้า):** `hotels-near-<anchor>` → "พักใกล้ [รพ./ศูนย์ประชุม/สนามบิน]" (proximity intent, ROI สูงสุดคือ medical tourism)
- **ทุกหน้า research โรงแรมจริง (ไม่แต่ง) · EN+TH · quick-answer+FAQ+schema (AEO) · ลิงก์ Agoda/Klook (monetize)** — ชนะคู่แข่ง (bkkstay/thaiontours ทำแค่ไทย/บทความเดี่ยว)
- **ทำแล้ว 10 · ศักยภาพรวม ~85 หน้า · ทำเป็น 3 เฟสตาม ROI** (เฟส 1 = medical+MICE+airport)
- **กลไกพร้อม:** engine `gen-neighborhood-hotels.mjs` + research agent (1 agent/หน้า เขียน JSON → generate → build → push)

**งานที่ต้องทำเรียงตามลำดับ:**
1. (ค้าง) push Item 2 + แก้รูปหน้า city-bangkok — รอ classifier แพลตฟอร์มกลับมา
2. เฟส 1: ~14 overlay (medical/MICE/airport) — เงินสูงสุด
3. เฟส 2: ~18 ย่าน 🔥
4. เฟส 3: รพ./ย่านที่เหลือ ตาม demand

---

## ✅ STATUS UPDATE (2026-06-22) — ชั้น A ย่าน + การรวมหน้าเมือง: เสร็จ
- **ชั้น A ย่านกรุงเทพ = 31 หน้า** (จาก 10 → +14 🔥 → +7 ●) ครบทุกโซนหลัก รวม 3 ย่านที่ owner ระบุ (เกษตร·เซ็นทรัลลาดพร้าว·วัดพระศรีฯ):
  - **เดิม 10:** sukhumvit·thong-lo·silom-sathorn·khao-san·riverside·chinatown·siam-pratunam·ari·ratchada·on-nut
  - **🔥 +14:** phrom-phong·chidlom·samyan·victory-monument·rama9·ladprao·mochit-chatuchak·central-ladprao·kaset·ramkhamhaeng·bangna·pinklao·chaeng-watthana·bang-khen
  - **● +7:** charoen-krung·ratchathewi·ploenchit·bang-sue·srinakarin·bangkapi·talat-phlu
- **การรวม (owner เน้น "ย่านทั้งหมดไปรวม+เข้าได้จากหน้าเมือง"):** `gen-hubs.mjs` `hoodGuides()` → กริด **"พักย่านไหน / By neighborhood"** ในแท็บ Stay ของทุกหน้าเมือง (auto-list `where-to-stay-<city>-<area>` ทั้งหมด) · ดึงออกจาก Prep tab (de-dup) · กรุงเทพโชว์ครบ 31 ใบ
- **รูป:** `HERO` map ใน `gen-neighborhood-hotels.mjs` (+ `gen-activities.mjs`) → 31 การ์ด / 29 รูปต่างกัน / 0 fallback skyline (เลิกปัญหา 14× รูปเดิม) · เหลือ family-plan & khao-gaeng ซ้ำอย่างละ 2×
- commits: image-fix → aggregation grid → +14 🔥 → +7 ● (ทั้งหมด build OK · audit-jsonld 0 · freshness 0 · EN zero-Thai)
- **ค้างเฟส 1:** overlay "hotels-near-___" (medical/MICE/airport) — ยังไม่เริ่ม · ย่าน ○ ที่เหลือ (udom-suk·min-buri·sutthisan·national-stadium·phra-athit ฯลฯ) ส่วนใหญ่ทับซ้อน/inventory บาง = ทำเฉพาะที่ demand จริง
- **NOTE รูปเมืองอื่น:** กริด By-neighborhood ใช้ได้ทุกเมืองแล้ว แต่ HERO map mapping รูปเฉพาะตอนนี้มีแค่กรุงเทพ — CM/Phuket/Krabi/Pattaya/Samui/HuaHin ยังใช้ city-hero (fallback) ในการ์ดย่าน · ขยาย HERO map ได้แบบเดียวกัน

## ✅ STATUS UPDATE (2026-06-23) — การ์ดเหมือนต้นแบบ + หน้าย่าน standalone (เสร็จ)
- **การ์ด By-neighborhood ทำใหม่ให้เหมือน wherebest:** รูปเต็มใบ + อิโมจิ+ชื่อ+คำโปรยทับบนรูป · 4 ใบ/แถว · โชว์ 12 + ปุ่ม `<details>` "ดูย่านทั้งหมด (31)" · `HOOD_CARDS` map (order/emoji/ชื่อ/คำโปรย TH+EN) ใน gen-hubs · รูป re-curate ไม่ซ้ำ/สื่อสถานที่ (เอายีราฟ+อยุธยาออก) 30/31 ต่างกัน
- **หน้าย่าน standalone ครบ 31 ย่าน:** `area-bangkok-<slug>.html` (TH+EN = 62 หน้า) — `hoodHub()` ใน gen-hubs reuse chrome หน้าเมือง · hero+breadcrumb+quick-answer+แท็บ **ที่พัก/ที่กิน/ที่เที่ยว** · ที่พัก = โรงแรม research (`.hl-row` + Agoda search) + ลิงก์คู่มือเต็ม · **ที่กิน/ที่เที่ยว = placeholder รอ owner เติมเนื้อหาประจำย่านทีหลัง** · การ์ด By-neighborhood ลิงก์ไป area hub · search-index + sitemap รวมครบ 31
- **Deploy เป็น auto แล้ว** (`.github/workflows/deploy.yml` + secret `CLOUDFLARE_API_TOKEN`) — push = ขึ้นเว็บเองใน ~3 นาที (เลิก deploy มือ)
- ~~งานต่อ: เติม ที่กิน/ที่เที่ยว~~ → **เสร็จแล้ว (ดู STATUS #2 ด้านล่าง)** · (อนาคต) ภาพถ่ายเฉพาะย่าน upload R2 · ขยาย area hub ไปเมืองอื่น

## ✅ STATUS (2026-06-23 #2) — ที่กิน/ที่เที่ยว เติมครบ + นับงานที่เหลือชัด ๆ
- **ที่กิน/ที่เที่ยว ทุกย่าน = เสร็จ** (เลิก placeholder): research จริง → `_internal/hood-extra/bangkok__<hood>.json` `{highlights[],food[]}` · `hoodHub()` ทำใหม่เป็น SECTIONS (cstats · ⭐ไฮไลท์ห้ามพลาด `.hoodgrid` · 🍜ของกินเด่น `.foodgrid` · 🏨ที่พัก · 🔎เทียบ3เว็บ) · ขยายครบ POI = **348 ไฮไลท์ (~11/ย่าน) + 251 ของกิน (~8)** · verify+ตัดที่ปิด · EN zero-Thai 31/31 (commits bbe93277, 416c5896)

### 📊 นับชัด — ทำแล้ว vs เหลือ
- **Layer A ย่าน = ทำแล้ว 31** (live, เนื้อหาเต็ม). สเปครอบใหม่ส่วนใหญ่ทำแล้ว: บางซื่อ-สถานีกลาง=`bang-sue`✅ · EmDistrict=`phrom-phong`✅ · เอกมัย=`thong-lo`✅ · หมอชิต=`mochit-chatuchak`✅
  - ❌ ขาดจริง **~1-2 ย่าน:** สายใต้ใหม่-ตลิ่งชัน (`sai-tai-taling-chan`) · สะพานตากสิน-สาทรพีร์ (ตอนนี้รวมใน riverside/silom)
  - แผนเต็ม ~45 = ที่เหลือเป็นย่าน ○ บาง/ทับซ้อน (udom-suk·min-buri·sutthisan·national-stadium·phra-athit·saphan-khwai·wongwian-yai≈talat-phlu·punnawithi≈on-nut) → ทำตาม demand
- **Layer B overlay `hotels-near-<anchor>` = ยังไม่ทำเลย 0 / ~40 หน้า** (งานก้อนใหญ่ที่เหลือ):
  - 🏥 รพ.เอกชน **~19** (🌍 medical tourism ROI สูงสุด): bumrungrad·bangkok-hospital(BDMS)·medpark·samitivej-sukhumvit·bnh·vejthani·praram9·phyathai2·samitivej-srinakarin·yanhee + เฟส3(ปิยะเวท·วิภาวดี·เปาโล·พญาไท1·ศิครินทร์·กล้วยน้ำไท·เซนต์หลุยส์·กรุงเทพคริสเตียน·บางปะกอก9)
  - 🏥 รพ.รัฐ **~8**: siriraj·chulalongkorn-hospital·ramathibodi·rajavithi·phramongkutklao·vajira·police-hospital (เลิดสิน=รวมสีลม·ตากสิน=รวมฝั่งธน)
  - 🎵 MICE/สนามกีฬา **~4**: qsncc·impact·bitec·rajamangala
  - ✈️🚉 สนามบิน/สถานี **~4**: suvarnabhumi·don-muang·bang-sue·sai-tai
  - 🎓 มหา'ลัยที่ไม่ทับย่าน **~3** (ส่วนใหญ่ทับย่านแล้ว)
- engine = `gen-neighborhood-hotels.mjs` เดิม + field `anchor` + กรอบ "ใกล้ ___ กี่นาที/เดิน-รถ" · overlay อยู่คู่ย่านได้ (search ต่าง ไม่ cannibalize)

### เฟสตาม ROI
- **เฟส 1 = 14 overlay (เงินสูงสุด):** bumrungrad·bangkok-hospital·medpark·samitivej-sukhumvit·siriraj·bnh·vejthani·chulalongkorn-hospital·ramathibodi·qsncc·impact·bitec·suvarnabhumi·don-muang
- **เฟส 2:** ย่านใหม่ (`sai-tai-taling-chan`) + ย่าน ● ที่เหลือ
- **เฟส 3:** รพ.เอกชน/รัฐ ที่เหลือ + ย่าน ○ ตาม demand
- **รวม: ทำแล้ว 31 ย่าน · เหลือ ~2 ย่าน + ~40 overlay · ศักยภาพเต็ม ~80-90 หน้า**

## ✅ STATUS (2026-06-23 #3) — Layer A ครบ 33 + หน้าย่านเป็น "หน้าเมืองย่อย" เต็มรูป
- **Layer A = 33 ย่าน (ครบ)** — +2 ใหม่: `sai-tai` (สายใต้ใหม่-ตลิ่งชัน) · `saphan-taksin` (สะพานตากสิน-สาทร). commit 5989ba1b
- **`hoodHub()` ทำใหม่ให้ mirror หน้าเมือง (provinceHub) เต็ม:** hero+chips · cstats · updatepill · intro + **4 icards** · **⭐ Editor's Picks (การ์ดเรียงเลข top-6, ช่องรูปพร้อม-รูปตามมา)** · **5 แท็บ** ที่พัก/ที่เที่ยว/ที่กิน/แผนเที่ยว/เดินทาง (เติมตามข้อมูล · ที่ยังไม่มีขึ้น "เร็ว ๆ นี้") · 🔎 เทียบ 3 เว็บ · ย่านอื่น · CTA. ข้อมูลย่าน = `neighborhood-data` (hotels) + `hood-extra` (highlights/food). EN zero-Thai 33/33.
- บทเรียน: โรงแรมชื่อไทย → ต้อง romanize ใน field `name` (มันใช้ทั้ง TH+EN) ไม่งั้น gen บล็อก EN-leak. · **deploy: push auto-deploy ปิดแล้ว** (CI build ออกไม่ครบหน้า) → live ด้วย `npx wrangler deploy` จาก dist เต็มในเครื่องเท่านั้น (ดู memory deploy-pipeline)

---

## 🏥 เฟส 1 — BUILD SPEC (พร้อมสั่งงานเซสชั่นใหม่) — 14 overlay "hotels-near-___"
**เป้า:** 14 หน้า `hotels-near-<anchor>` (TH+EN) — โรงแรมจริงใกล้ "จุดหมาย" ที่ search intent = proximity (≠ ย่าน) · ROI สูงสุด medical tourism + MICE + airport

**14 anchor (slug · ชื่อ · โซน · กลุ่ม):**
| # | slug | จุดหมาย | โซน | กลุ่ม |
|---|---|---|---|---|
| 1 | `hotels-near-bumrungrad` | รพ.บำรุงราษฎร์ / Bumrungrad International | นานา-อโศก | 🌍🔥 |
| 2 | `hotels-near-bangkok-hospital` | รพ.กรุงเทพ (BDMS) / Bangkok Hospital | เพชรบุรีตัดใหม่-อโศก | 🌍🔥 |
| 3 | `hotels-near-medpark` | รพ.เมดพาร์ค / MedPark Hospital | พระราม4-คลองเตย | 🌍🔥 |
| 4 | `hotels-near-samitivej-sukhumvit` | รพ.สมิติเวช สุขุมวิท / Samitivej Sukhumvit | สุขุมวิท 49 (พร้อมพงษ์) | 🌍 |
| 5 | `hotels-near-bnh` | รพ. BNH / BNH Hospital | สีลม-สาทร | 🌍 |
| 6 | `hotels-near-vejthani` | รพ.เวชธานี / Vejthani Hospital | บางกะปิ-ลาดพร้าว | 🌍 |
| 7 | `hotels-near-siriraj` | รพ.ศิริราช / Siriraj Hospital | วังหลัง ฝั่งธน | 🇹🇭🌍🔥 |
| 8 | `hotels-near-chulalongkorn-hospital` | รพ.จุฬาฯ / King Chulalongkorn Memorial | ปทุมวัน-สามย่าน | 🇹🇭🔥 |
| 9 | `hotels-near-ramathibodi` | รพ.รามาธิบดี / Ramathibodi Hospital | พญาไท-พระราม6 | 🇹🇭🔥 |
| 10 | `hotels-near-qsncc` | ศูนย์ฯ สิริกิติ์ / Queen Sirikit NCC | คลองเตย (MRT) | 💼🎵🔥 |
| 11 | `hotels-near-impact` | อิมแพ็ค เมืองทอง / IMPACT Muang Thong | ปากเกร็ด | 💼🎵🔥 |
| 12 | `hotels-near-bitec` | ไบเทค บางนา / BITEC Bang Na | บางนา (BTS) | 💼🎵🔥 |
| 13 | `hotels-near-suvarnabhumi` | สนามบินสุวรรณภูมิ / Suvarnabhumi (BKK) | ลาดกระบัง | ✈️🔥 |
| 14 | `hotels-near-don-muang` | สนามบินดอนเมือง / Don Mueang (DMK) | ดอนเมือง | ✈️🔥 |

**Data model** → `_internal/overlay-data/<slug>.json`:
```
{"slug":"hotels-near-bumrungrad","city":"bangkok","cityTh":"กรุงเทพ","cityEn":"Bangkok",
 "anchorTh":"โรงพยาบาลบำรุงราษฎร์","anchorEn":"Bumrungrad International Hospital",
 "zoneTh":"นานา-อโศก","zoneEn":"Nana–Asok","zoneSlug":"sukhumvit",   // ลิงก์ไป area-bangkok-<zoneSlug>
 "quickTh":"<strong>คำตอบสั้น ๆ:</strong> …","quickEn":"<strong>Short answer:</strong> …",
 "introTh":"…","introEn":"…",
 "hotels":[{"name":"Real Hotel","star":4,"priceFromTHB":"2,500",
   "distTh":"เดิน 5 นาที (400 ม.)","distEn":"5-min walk (400 m)",   // ระยะถึง anchor จริง
   "bestForTh":"…","bestForEn":"…","whyTh":"…","whyEn":"…"}],   // 6-8 โรงแรมจริง ใกล้ anchor จริง
 "faq":[{"qTh","aTh","qEn","aEn"}×3]}
```

**Engine:** ทำ `_internal/gen-overlay.mjs` (ก๊อป `gen-neighborhood-hotels.mjs` มาปรับ) → อ่าน `overlay-data/*.json` → เขียนบทความ slug `hotels-near-<anchor>` (`type:'prep'`, `cluster:'bangkok'`) ด้วย `ranked` block + per-hotel Agoda search (cid=1965862, sponsored nofollow) + **โชว์ระยะถึง anchor (distTh/En) ในแต่ละการ์ด** + staycta → area-bangkok-<zoneSlug> + where-to-stay-bangkok-<zoneSlug>. เก็บ guard EN-zero-Thai + TH/EN alignment เหมือนเดิม.

**Research recipe:** 1 general-purpose Agent ต่อ 1 anchor → WebSearch หาโรงแรมจริง 6-8 แห่งที่อยู่ใกล้ anchor จริง (ระบุระยะ/เวลาเดิน-รถจริง) + quick/intro/faq → เขียน strict JSON ลง `overlay-data/<slug>.json` · **ห้ามแต่งโรงแรม/ระยะทาง** (verify Agoda/Booking + Google Maps proximity) · EN ห้ามมีไทย (฿ ได้) · ห้ามคำ AI.

**Surfacing:** cluster=bangkok → ขึ้น Prep tab city-bangkok อัตโนมัติ (artCards) · เพิ่ม section "🏥 โรงแรมใกล้โรงพยาบาล/แลนด์มาร์ก" ใน gen-hubs (คล้าย hoodGuides — auto-list `hotels-near-*`) · cross-link จาก area hub โซนนั้น.

**Gate ต่อ batch:** `bash _internal/build-test.sh` (BUILD OK) → `node _internal/audit-jsonld.mjs` 0 → `node _internal/audit-freshness.mjs --links` 0 → สแกน EN zero-Thai = 0 → `git fetch && git rebase origin/main` → push. **อย่าแตะไฟล์ parallel eat-ranking** (`top10-popular-restaurants-*`, `_internal/cc-food-*`).

**⚠️ Deploy:** push **ไม่** auto-deploy แล้ว → หลัง push ให้เจ้าของรัน `cd astro && npm run build && cd .. && npx wrangler deploy` จากเครื่อง (dist เต็ม) ถึงจะขึ้นเว็บจริง.

**อ่านก่อนเริ่ม:** ไฟล์นี้ + memory `deploy-pipeline` · `image-serving-r2-architecture` · `quality-phase-done` · ดู `gen-neighborhood-hotels.mjs` (engine ต้นแบบ) + `_internal/neighborhood-data/bangkok__sukhumvit.json` (รูปแบบ data).

---

## หลักการ (LOCKED)
- โรงแรมจริงทุกแห่ง WebSearch-verified · ราคา ~฿ ระบุ "โดยประมาณ" · ไม่แต่งย่าน/โรงแรม/ราคา (anchor ไหนโรงแรมไม่พอ = ข้าม)
- EN mirror TH เป๊ะ · ZERO Thai ใน EN (`/[ก-฾เ-๛]/`, ฿ ได้)
- โทน v2-clean เพื่อนเล่าให้เพื่อน · ห้ามคำ AI
- overlay อยู่คู่ย่านได้ (search ต่างกัน ไม่ cannibalize) · cluster=bangkok → ขึ้น Prep tab ฮับกรุงเทพ
- gate ทุก batch: build-test OK → audit-jsonld 0 → audit-freshness 0 → rebase origin/main → push (อย่าแตะไฟล์ parallel eat-ranking)

---

## ชั้น A — ย่านกรุงเทพทั้งหมด (13 โซน)
สถานะ: ✅ ทำแล้ว · 🔥 gap สำคัญ · ● กลาง · ○ บาง/ออปชัน

### โซน 1 · สุขุมวิทต้น-กลาง (BTS สุขุมวิท)
| ย่าน | anchor | กลุ่ม | สถานะ | slug |
|---|---|---|---|---|
| สุขุมวิท (อโศก-นานา) | Asok/Nana | 🌍🏥 | ✅ | where-to-stay-bangkok-sukhumvit |
| ทองหล่อ-เอกมัย | Thong Lo/Ekkamai | 🌍💼 | ✅ | where-to-stay-bangkok-thong-lo |
| พร้อมพงษ์ (EmDistrict) | Phrom Phong | 🌍🛍️ | 🔥 | where-to-stay-bangkok-phrom-phong |
| พระโขนง-อ่อนนุช | Phra Khanong/On Nut | 🇹🇭 | ✅ | where-to-stay-bangkok-on-nut |
| ปุณณวิถี-บางจาก | Punnawithi | 💼🇹🇭 | ● | where-to-stay-bangkok-punnawithi |
| อุดมสุข-แบริ่ง | Udom Suk/Bearing | 🇹🇭 | ○ | where-to-stay-bangkok-udom-suk |

### โซน 2 · สีลม-สาทร-ริมน้ำใต้ (BTS สีลม/MRT)
| สีลม-สาทร | Sala Daeng/Sathorn | 🌍💼 | ✅ | where-to-stay-bangkok-silom-sathorn |
| ริมเจ้าพระยา-คลองสาน (ICONSIAM) | Saphan Taksin/Krung Thonburi | 🌍🛍️ | ✅ | where-to-stay-bangkok-riverside |
| บางรัก-เจริญกรุง | Charoen Krung | 🌍 | ● | where-to-stay-bangkok-charoen-krung |

### โซน 3 · สยาม-ราชประสงค์-ปทุมวัน (BTS)
| สยาม-ประตูน้ำ | Siam/Pratunam | 🌍🛍️📦 | ✅ | where-to-stay-bangkok-siam-pratunam |
| ชิดลม-ราชประสงค์ (เซ็นทรัลเวิลด์) | Chidlom | 🛍️🌍 | 🔥 | where-to-stay-bangkok-chidlom |
| สามย่าน-จุฬาฯ | Sam Yan | 🎓🇹🇭 | 🔥 | where-to-stay-bangkok-samyan |
| เพลินจิต | Phloen Chit | 💼🌍 | ● | where-to-stay-bangkok-ploenchit |
| สนามกีฬา-MBK | National Stadium | 🌍🎓 | ● | where-to-stay-bangkok-national-stadium |

### โซน 4 · เมืองเก่า-พระนคร (ไม่มี BTS)
| ข้าวสาร-เมืองเก่า | Khao San/Rattanakosin | 🌍 | ✅ | where-to-stay-bangkok-khao-san |
| พระอาทิตย์-บางลำพู | Phra Athit | 🌍 | ● | where-to-stay-bangkok-phra-athit |

### โซน 5 · เยาวราช-ฝั่งเก่า (MRT)
| เยาวราช (ไชน่าทาวน์) | Wat Mangkon | 🌍🇹🇭📦 | ✅ | where-to-stay-bangkok-chinatown |
| ตลาดน้อย | Talat Noi | 🌍 | ● | where-to-stay-bangkok-talat-noi |

### โซน 6 · พญาไท-ราชเทวี-อนุสาวรีย์ (BTS/ARL)
| อารีย์-พญาไท | Ari/Phaya Thai | 🇹🇭🌍✈️ | ✅ | where-to-stay-bangkok-ari |
| อนุสาวรีย์ชัย-ดินแดง | Victory Monument | 🇹🇭💼🏥 | 🔥 | where-to-stay-bangkok-victory-monument |
| ราชเทวี | Ratchathewi | 🇹🇭🌍 | ● | where-to-stay-bangkok-ratchathewi |
| สะพานควาย | Saphan Khwai | 🇹🇭 | ● | where-to-stay-bangkok-saphan-khwai |

### โซน 7 · รัชดา-พระราม9-ห้วยขวาง (MRT — CBD ใหม่)
| พระราม9 (เซ็นทรัลพระราม9) | Rama 9 | 💼🛍️🏥 | 🔥 | where-to-stay-bangkok-rama9 |
| รัชดา-ห้วยขวาง | Huai Khwang | 🇹🇭 | ✅ | where-to-stay-bangkok-ratchada |
| ลาดพร้าว (โชคชัย4) | Lat Phrao | 🇹🇭 | 🔥 | where-to-stay-bangkok-ladprao |

### โซน 8 · จตุจักร-พหลโยธินเหนือ (BTS/MRT)
| หมอชิต-จตุจักร (ตลาดนัด JJ + บขส.) | Mo Chit/Chatuchak | 🌍🇹🇭🛍️🚌 | 🔥 | where-to-stay-bangkok-mochit-chatuchak |
| ห้าแยกลาดพร้าว (เซ็นทรัลลาดพร้าว) | Ha Yaek Lat Phrao | 🛍️🇹🇭 | 🔥 | where-to-stay-bangkok-central-ladprao |
| ม.เกษตรศาสตร์-เกษตรนวมินทร์ | Kasetsart U | 🎓🇹🇭 | 🔥 | where-to-stay-bangkok-kaset |
| รัชโยธิน | Ratchayothin | 🇹🇭 | ● | where-to-stay-bangkok-ratchayothin |
| วัดพระศรีฯ-บางเขน | Wat Phra Si Mahathat | 🇹🇭🎓 | ● | where-to-stay-bangkok-bang-khen |
| บางซื่อ-สถานีกลางอภิวัฒน์ | Bang Sue Grand | 🚉🇹🇭 | ● | where-to-stay-bangkok-bang-sue |

### โซน 9 · รามคำแหง-บางกะปิ-หัวหมาก (MRT เหลือง/ARL)
| รามคำแหง-หัวหมาก (ABAC, ราชมังคลา) | Ramkhamhaeng | 🎓🎵🇹🇭 | 🔥 | where-to-stay-bangkok-ramkhamhaeng |
| บางกะปิ (เดอะมอลล์) | The Mall Bangkapi | 🛍️🇹🇭 | ● | where-to-stay-bangkok-bangkapi |

### โซน 10 · บางนา-ตะวันออก (BTS/BITEC)
| บางนา (เซ็นทรัลบางนา) | Bang Na | 💼🇹🇭 | 🔥 | where-to-stay-bangkok-bangna |
| ศรีนครินทร์-เมกาบางนา | Srinakarin/Mega | 🛍️🇹🇭 | ● | where-to-stay-bangkok-srinakarin |

### โซน 11 · ธนบุรี-ฝั่งตะวันตก (BTS/MRT)
| ปิ่นเกล้า (เซ็นทรัลปิ่นเกล้า + สายใต้ใหม่) | Pinklao | 🇹🇭🛍️🚌 | 🔥 | where-to-stay-bangkok-pinklao |
| วงเวียนใหญ่ | Wongwian Yai | 🇹🇭 | ● | where-to-stay-bangkok-wongwian-yai |
| ตลาดพลู | Talat Phlu | 🇹🇭 | ● | where-to-stay-bangkok-talat-phlu |
| จรัญฯ-บางขุนนนท์ | Charan/Bang Khun Non | 🏥🇹🇭 | ● | where-to-stay-bangkok-charan |

### โซน 12 · ชานเมืองเหนือ-นนทบุรี
| แจ้งวัฒนะ-หลักสี่ (ศูนย์ราชการ) | Chaeng Watthana | 💼🇹🇭 | 🔥 | where-to-stay-bangkok-chaeng-watthana |
| รังสิต-ฟิวเจอร์พาร์ค (ธรรมศาสตร์/BU) | Rangsit | 🛍️🎓🇹🇭 | ● | where-to-stay-bangkok-rangsit |
| นนทบุรี-เซ็นทรัลเวสต์เกต (MRT ม่วง) | Bang Yai | 🛍️🇹🇭 | ● | where-to-stay-bangkok-nonthaburi |

### โซน 13 · ตะวันออก-ลาดกระบัง
| มีนบุรี (MRT ชมพู) | Min Buri | 🇹🇭 | ○ | where-to-stay-bangkok-min-buri |
| (ลาดกระบัง-สุวรรณภูมิ → overlay สนามบิน) |

---

## ชั้น B — Overlay "hotels near ___" (proximity intent)
slug = `hotels-near-<anchor>` · ใช้ engine เดิม + field `anchor` (เพิ่มกรอบ "ใกล้ ___ กี่นาที เดิน/รถ")

### 🏥 โรงพยาบาลรัฐ (medical + ญาติผู้ป่วย)
| รพ. | ทำเล | Pri | slug |
|---|---|---|---|
| ศิริราช + ปิยมหาราชการุณย์ (int'l) | วังหลัง ฝั่งธน | 🔥 | hotels-near-siriraj |
| จุฬาฯ (สภากาชาด) | ปทุมวัน-สามย่าน | 🔥 | hotels-near-chulalongkorn-hospital |
| รามาธิบดี | พญาไท-พระราม6 | 🔥 | hotels-near-ramathibodi |
| ราชวิถี + สถาบันเด็กฯ | ราชเทวี | ● | hotels-near-rajavithi |
| พระมงกุฎเกล้า (ทหาร) | ราชวิถี | ● | hotels-near-phramongkutklao |
| วชิรพยาบาล | ดุสิต | ● | hotels-near-vajira |
| ตำรวจ | ราชประสงค์ | ● | hotels-near-police-hospital |
| เลิดสิน · ตากสิน · สงฆ์ · กลาง | สีลม/ฝั่งธน/ราชเทวี/ป้อมปราบ | ○ | (เฟส 3) |

### 🏥 โรงพยาบาลเอกชนชื่อดัง (medical tourism — ROI สูงสุด)
| รพ. | ทำเล | Pri | slug |
|---|---|---|---|
| บำรุงราษฎร์ (ใหญ่สุด SEA) | นานา-อโศก | 🔥 | hotels-near-bumrungrad |
| กรุงเทพ (BDMS) | เพชรบุรี-อโศก | 🔥 | hotels-near-bangkok-hospital |
| เมดพาร์ค (MedPark) | พระราม4-คลองเตย | 🔥 | hotels-near-medpark |
| สมิติเวช สุขุมวิท | สุขุมวิท49 | 🔥 | hotels-near-samitivej-sukhumvit |
| BNH | สีลม-สาทร | ● | hotels-near-bnh |
| เวชธานี (มี 111 Residence) | บางกะปิ-ลาดพร้าว | ● | hotels-near-vejthani |
| พระรามเก้า · พญาไท2 · สมิติเวชศรีนครินทร์ · ยันฮี(ศัลยกรรม) | พระราม9/พญาไท/ศรีนครินทร์/จรัญฯ | ● | hotels-near-praram9 / -phyathai2 / -samitivej-srinakarin / -yanhee |
| ปิยะเวท · วิภาวดี · เปาโล · พญาไท1 · ศิครินทร์ · กล้วยน้ำไท · เซนต์หลุยส์ · กรุงเทพคริสเตียน · บางปะกอก9 | — | ○ | (เฟส 3) |

### 🎵 MICE / คอนเสิร์ต / สนามกีฬา
| ศูนย์สิริกิติ์ (QSNCC) | คลองเตย MRT | 🔥 | hotels-near-qsncc |
| IMPACT เมืองทอง | ปากเกร็ด | 🔥 | hotels-near-impact |
| BITEC บางนา | บางนา | 🔥 | hotels-near-bitec |
| ราชมังคลากีฬาสถาน | หัวหมาก | 🔥 | hotels-near-rajamangala |

### 🎓 มหาวิทยาลัย (เฉพาะที่ไม่ทับย่าน)
| ธรรมศาสตร์ รังสิต | รังสิต | ● | hotels-near-thammasat-rangsit |
| (จุฬา=สามย่าน · เกษตร=ย่านเกษตร · ABAC/รามคำแหง=หัวหมาก → ใช้หน้าย่าน) |

### ✈️🚉 สนามบิน / สถานีขนส่ง
| สุวรรณภูมิ (BKK) | ลาดกระบัง | 🔥 | hotels-near-suvarnabhumi |
| ดอนเมือง (DMK) | ดอนเมือง | 🔥 | hotels-near-don-muang |
| สายใต้ใหม่ (Sai Tai) | ตลิ่งชัน | ● | hotels-near-sai-tai |

---

## กลไกการสร้าง (reuse — ไม่ต้องสร้าง infra ใหม่)
1. **Research:** 1 `Agent` (general-purpose) ต่อ 1 หน้า → WebSearch โรงแรมจริง 6–8 แห่งรอบ anchor → เขียน JSON ไป `_internal/neighborhood-data/bangkok__<area>.json` (ย่าน) หรือ `_internal/activity-data`-style สำหรับ overlay
   - schema เดียวกับ Item 1 (`hood/hoodTh/hoodEn/quick/intro/hotels[name,star,priceFromTHB,bestFor,why]/faq`) · overlay เพิ่ม `anchor` + กรอบระยะ "ใกล้ ___"
2. **Generate:** `node _internal/gen-neighborhood-hotels.mjs` (รองรับทั้ง 2 อยู่แล้ว; overlay = เพิ่ม template "hotels near" เล็กน้อย) → `where-to-stay-bangkok-<area>` / `hotels-near-<anchor>` (type=prep, cluster=bangkok)
3. **Surface:** `gen-hubs.mjs` + `gen-search-index.mjs` → ขึ้น Prep tab ฮับกรุงเทพ + search
4. **Gate+push:** build-test OK → audit 0/0 → EN zero-Thai → rebase → push (ทีละ ~10 หน้า/batch)
5. **Validate ก่อน generate เสมอ:** parse JSON + EN-zero-Thai + ครบ field (กัน related/EN leak แบบที่เจอใน Item 2)

---

## เฟสงาน (เรียงตาม ROI)
**🔧 เฟส 0 (ค้าง — รอ classifier):** push Item 2 (13 activity guides ที่ build+audit ผ่านแล้ว) + แก้รูปหน้า city-bangkok (cross-check refs↔ไฟล์ → remap/source)

**🔥 เฟส 1 — Overlay เงินสูงสุด (~14 หน้า):** bumrungrad · bangkok-hospital · medpark · samitivej-sukhumvit · siriraj · bnh · vejthani · chulalongkorn-hospital · ramathibodi · qsncc · impact · bitec · suvarnabhumi · don-muang

**🔥 เฟส 2 — ย่าน gap สำคัญ (~18 หน้า):** phrom-phong · chidlom · samyan · victory-monument · rama9 · ladprao · mochit-chatuchak · central-ladprao · kaset · ramkhamhaeng · bangna · pinklao · chaeng-watthana · rajamangala · phyathai2 · praram9 · bang-khen · charoen-krung

**● เฟส 3 — ตาม demand จริง:** ย่าน ● + รพ.รัฐ/เอกชนที่เหลือ + มหา'ลัย/transport รอง (~40 หน้า)

**🌏 ขยายโมเดลเดียวกันไปเมืองใหญ่อื่น:** เชียงใหม่ (เมืองเก่า/นิมมาน/ริมปิง + ใกล้ รพ.) · ภูเก็ต (รายหาด + ใกล้สนามบิน/รพ.กรุงเทพภูเก็ต) · พัทยา · หาดใหญ่ (medical hub ใต้)

---

## สถานะปัจจุบัน (2026-06-22)
- ✅ ทำแล้ว 10 ย่านกรุงเทพ: sukhumvit · thong-lo · silom-sathorn · khao-san · riverside · chinatown · siam-pratunam · ari · ratchada · on-nut (push แล้ว commit 086cca8a)
- 🔧 Item 2 (13 activity guides) build+audit ผ่าน รอ push (classifier บล็อก)
- 🔧 รูป city-bangkok บางการ์ดอาจอ้าง ref ที่ไม่มีไฟล์ (ดิร R2-exempt → audit ไม่จับ) — ต้อง cross-check + remap
- ศักยภาพรวมกรุงเทพ: ~45 ย่าน + ~40 overlay ≈ **85 หน้า** (data-driven ทั้งหมด)

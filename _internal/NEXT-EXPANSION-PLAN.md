# 🎯 NEXT-EXPANSION PLAN — handoff (fresh session, ทำ งาน 1→2→3 ตามลำดับจนเสร็จ)

> เฟสก่อน (QUALITY-PHASE งาน 1–4 + 3 chip) เสร็จแล้ว: where-to-stay 57 เขียนมือ + 40 data-driven · audit-jsonld 0 err/warn · audit-freshness 0 broken · EN ทุกไฟล์ zero-Thai
> เฟสนี้ = **ขยายเชิงลึก** (sub-area + best-of) และ **รีวิว 8 จังหวัด data-driven**
> ทำ **งาน 1 → 2 → 3 ตามลำดับ จนเสร็จแต่ละงาน** · ใช้ Opus · ห้ามถาม · หลังจบแต่ละ batch: `bash _internal/build-test.sh` ต้อง **BUILD OK** → `git fetch && git rebase origin/main` → push
> อ่านก่อนเริ่ม: ไฟล์นี้ทั้งไฟล์ · memory `quality-phase-done.md` · `_internal/gen-stay-compare.mjs` (HOODS) · `_internal/gen-best-of.mjs` (LISTS)

---

## 🔧 Environment + protocol (LOCKED — ห้ามพลาด)
- เครื่อง `C:\Users\Imac\Thailandaddict` · **Node v24 ที่ `~/nodejs`** → bash ต้อง `export PATH="$HOME/nodejs:$PATH"` ก่อนรัน node ทุกครั้ง · **Python ใช้ไม่ได้** (Node/PowerShell แทน)
- git: branch `main` · **มี parallel session (งานร้านอาหาร v3 / food-image lib) ทำในรีโปเดียวกัน** → `git fetch && git rebase origin/main` ก่อน push เสมอ · **ห้ามแก้/revert ไฟล์ของคนอื่น** (เช่น `top10-popular-restaurants-*`, `_internal/cc-food-*`, engine ร้านอาหาร) · ถ้า rebase ชน `search-index.json` (generated) ให้ `node _internal/gen-search-index.mjs` แล้ว `git add` + `git rebase --continue`
- pre-push: `bash _internal/build-test.sh` → ต้องเห็น `BUILD OK` (build ใน `~/ta-build-temp`, heap 8GB, ข้าม public/ images)
- **กฎเนื้อหา (LOCKED):** โทน v2-clean เพื่อนเล่าให้เพื่อน · honest/EEAT ห้ามอวย · ห้ามคำ AI (TH: ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก · EN: nestled/boasts/hidden gem/breathtaking)
- **EN ต้อง mirror TH เป๊ะ:** โครงสร้าง/คีย์/ลำดับ block เหมือนกัน · **ZERO Thai ใน EN** (ตรวจ `/[ก-฾เ-๛]/` · ยกเว้น `฿`) — ก่อน push สแกนเสมอ
- **⛔ ห้ามแต่งข้อมูล/ราคา/ย่าน/URL** · ย่าน/ที่เที่ยวต้อง **WebSearch ยืนยันก่อนเขียนทุกครั้ง** · ราคาดึงจาก roundup จริงในรีโป · affiliate ที่ยังไม่มี = placeholder เดิม (`__GYG_PARTNER_ID__`) ห้าม hardcode ปลอม
- design Direction-C เดิม · 1 h1/หน้า · วันที่ปัจจุบัน = ใช้ `2026-06-21` (publishedDate/modifiedDate)

## 🏗️ Architecture quick-ref + กลไก
- **HOODS** (`_internal/gen-stay-compare.mjs`, array ~บรรทัด 18) = where-to-stay เขียนมือ · entry แต่ละตัว: `{ city, th, en, hero, [sub-area overrides], quick:{th,en}, areas:[3-5×{a,v,n × th,en}], styles:{th[],en[]}, faq:[3×{q,a × th,en}] }`
  - **sub-area pattern** (ดูตัวอย่าง `ao-nang`/`khao-lak`/`patong` ใน HOODS): เพิ่ม override `cluster`(=parent slug) · `hub`(=`city-<parent>.html`) · `roundup`(=area-roundup ถ้ามี ไม่งั้น `top10-hotels-<parent>.html`) · `hubTh`/`hubEn`(=ชื่อ parent) · `extraRel:{th[],en[]}`(ลิงก์ไป where-to-stay-<parent> ภาพรวม) · sub-area surface บน parent city hub อัตโนมัติผ่าน `cluster`
- **gen-best-of** (`_internal/gen-best-of.mjs`, array `LISTS`) = "best X for Y" listicle · entry: `{ slug, hero, emoji, th:{eyebrow,h1,title,metaDesc,intro,quick}, en:{...}, items:[{name:{th,en}, href, blurb:{th,en}, tags:{th[],en[]}, stayHref}], faq:[{q,a×th,en}] }` · **มี link-target validation ก่อนเขียน** (href/stayHref ต้องเป็น city-hub หรือ where-to-stay จริง ไม่งั้น ABORT)
- **surface บน hub:** sub-area = อัตโนมัติ (cluster) · best-of = เพิ่ม slug ใน `BESTOF` array ของ `gen-hubs.mjs` (ใน `destinationsHub()` section "Pick by travel style")
- **audit scripts (ใช้ตรวจ):** `node _internal/audit-jsonld.mjs` (อ่าน `~/ta-build-temp/dist` + `astro/public` · ต้อง 0 error) · `node _internal/audit-freshness.mjs --links` (ต้อง 0 broken)
- **re-run order (bash, export PATH ก่อน):** `gen-stay-compare.mjs` → `gen-where-to-stay-auto.mjs` → `gen-best-of.mjs` → `gen-hubs.mjs` → `gen-search-index.mjs`
- **EN-leak scan เร็ว:** `node -e "const fs=require('fs');let n=0;for(const dir of ['articles-en','reviews-en','roundups-en'])for(const f of fs.readdirSync('astro/src/content/'+dir)){if(!f.endsWith('.json'))continue;if(/[ก-฾เ-๛]/.test(fs.readFileSync('astro/src/content/'+dir+'/'+f,'utf8')))n++}console.log('EN thai leaks:',n)"`

---

## ✅ งาน 1 — Sub-area where-to-stay (ย่าน/หาดดังใต้จังหวัดแม่)
**เป้า:** เพิ่มหน้า "พักย่านไหนใน <หาด/ย่านดัง>" สำหรับหาด/ย่านที่คนค้นหาเยอะ ใต้ parent ที่มี hub+roundup จริง (เหมือน `ao-nang` ใต้ krabi)
**กลไก 1 sub-area:** (1) **WebSearch micro-zone จริง** ของหาด/ย่านนั้น (เช่น kata vs karon, เฉวง north/central/south) — ห้ามเดา · (2) เพิ่ม HOODS entry แบบ sub-area (override cluster/hub/roundup/hubTh/hubEn/extraRel) · (3) เช็ก area-roundup จริง: ถ้ามี `top*-<area>-*.json` ลิงก์อันนั้น ไม่มีใช้ `top10-hotels-<parent>.html` · (4) **ไม่ต้องเพิ่มใน HANDWRITTEN** (sub-area ไม่มี `top10-hotels-<slug>` + ไม่มี `city-<slug>` hub → auto ข้ามเอง) · (5) รัน gen-stay-compare → gen-hubs

**Candidate (parent hub+roundup ครบทุกตัว · ทำตามลำดับนี้):**
| sub-area | parent | area-roundup ที่มี (ลิงก์อันนี้) | หมายเหตุ micro-zone (ต้อง WebSearch ยืนยัน) |
|---|---|---|---|
| `kata-karon` | phuket | (ใช้ parent `top10-hotels-phuket`) | Kata Yai / Kata Noi / Karon — หาดครอบครัว |
| `jomtien` | pattaya | `top10-jomtien-beach-hotels-pattaya` | Jomtien beach / Dongtan / Na Jomtien |
| `lamai` | samui | (parent `top10-hotels-samui`) | Lamai center / north / south |
| `bophut` | samui | (parent `top10-hotels-samui`) | Fisherman's Village / Big Buddha / Plai Laem |
| `naklua` | pattaya | (parent `top10-hotels-pattaya`) | Naklua / Wong Amat beach |
| `khao-takiab` | huahin | `top10-khao-takiab-beach-hotels-huahin` | Khao Takiab / Khao Tao / south Hua Hin |
| `bang-saen` | chonburi | `top9-bangsaen-hotels-chonburi` | Bang Saen beach / Laem Tan / university side |
| `si-racha` | chonburi | `top15-hotels-sriracha-chonburi` | town / Ko Loi / seafront |
| `ko-sichang` | chonburi | `top9-koh-sichang-hotels-chonburi` | Tha Wang / Tham Phang beach / town |
| `koh-samet` | rayong | `top10-beach-hotels-koh-samet` | Sai Kaew / Ao Phai / Ao Wong Deuan / Ao Prao |
| `khanom` | nakhon-si-thammarat | (parent `top10-hotels-nakhon-si-thammarat`) | Nadan / Nai Phlao / Khanom town |
| `sichon` | nakhon-si-thammarat | (parent) | Hin Ngam / Sichon town / Piti beach |
**ลำดับ:** ทำหาดดัง-search สูงก่อน (kata-karon · jomtien · lamai · bophut · koh-samet) → batch ~6 → build-test → push → ที่เหลือ batch สอง
**เกณฑ์ผ่าน:** ทุก sub-area มี HOODS entry · micro-zone WebSearch-verified · roundup/hub ลิงก์จริง · surface บน parent city hub · `gen-stay-compare` รายงาน `enThaiLeaks:[] misaligned:[]` · audit-freshness --links 0 broken · build OK

## ✅ งาน 2 — Best-of listicle ใหม่ (AEO)
**เป้า:** เพิ่ม "best X for Y" listicle ใหม่ (มีแล้ว 6: snorkeling/family-beach/cool-mountain/honeymoon/nightlife/rainy) · ทุก item ลิงก์ city-hub + where-to-stay จริง · ข้อมูลจาก content ที่มี ห้ามแต่ง
**กลไก:** เพิ่ม entry ใน `LISTS` (`gen-best-of.mjs`) + เพิ่ม slug ใน `BESTOF` (`gen-hubs.mjs` `destinationsHub`) → รัน gen-best-of → gen-hubs · (link-target validation จะ ABORT ถ้า href ผิด)

**ไอเดีย listicle ใหม่ (เลือก ~6-8 · ทุก item ต้องเป็นเมือง/หาดที่มี hub จริง):**
- `best-day-trips-from-bangkok` — เที่ยวใกล้กรุงเทพไปเช้า-เย็นกลับ (ayutthaya·kanchanaburi·samut-songkhram·bang-saen/chonburi·khao-yai·ratchaburi)
- `best-temple-destinations-thailand` — สายวัด-มูเตลู (ayutthaya·sukhothai·nan·chiang-mai·nakhon-phanom(พระธาตุพนม)·nakhon-si-thammarat)
- `best-cafe-hopping-thailand` — สายคาเฟ่ (chiang-mai(นิมมาน)·nan·khao-kho/phetchabun·chiang-rai·hua-hin)
- `best-waterfalls-nature-thailand` — น้ำตก-ธรรมชาติ (kanchanaburi(เอราวัณ)·khao-yai·tak(ทีลอซู/อุ้มผาง)·loei·phetchabun)
- `best-budget-backpacker-thailand` — แบ็คแพ็คงบน้อย (pai·chiang-rai·koh-phangan·koh-lipe·kanchanaburi)
- `best-solo-travel-thailand` — เที่ยวคนเดียวปลอดภัย-เพื่อนเยอะ (chiang-mai·pai·bangkok·koh-phangan·koh-tao/chumphon)
- `best-river-mekong-thailand` — สายริมโขง (nong-khai·nakhon-phanom·mukdahan·loei(เชียงคาน)·ubon-ratchathani)
- `best-quiet-islands-thailand` — เกาะเงียบหนีคน (koh-kood·koh-mak·koh-phayam/ranong·koh-lipe·trang islands)
- `best-historic-old-towns-thailand` — เมืองเก่า (ayutthaya·sukhothai·lampang·phuket old town·songkhla/hat-yai·chanthaburi)
**เกณฑ์ผ่าน:** listicle ใหม่ TH↔EN aligned · EN zero-Thai · ทุก href ผ่าน validation (ไม่ ABORT) · surface ใน destinations hub (BESTOF) + search · build OK

## ✅ งาน 3 — รีวิว 8 จังหวัด data-driven (อัปเกรดเฉพาะที่มีย่านจริง ≥3)
**เป้า:** WebSearch ลึกอีกครั้งกับ 8 จังหวัดที่คงไว้ data-driven · **อัปเกรดเป็น HOODS เขียนมือเฉพาะที่เจอย่าน/อำเภอท่องเที่ยวจริง ≥3 โซนชัด** · ไม่เจอ → คงไว้ data-driven (ห้ามแต่งย่าน)
**8 จังหวัด:** `phrae` `phayao` `sakon-nakhon` `mukdahan` `surin` `sisaket` `nakhon-pathom` `phitsanulok`
- เซสชั่นก่อนประเมินว่าเป็น "เมืองในตัว" โซนเดียว (เหตุผลใน comment ของ `gen-where-to-stay-auto.mjs`) — เฟสนี้ลอง **WebSearch แบบเจาะอำเภอ/แหล่งเที่ยวรอบเมือง** (เช่น phrae: เมืองเก่า/วัดพระธาตุช่อแฮ/แพะเมืองผี · phayao: กว๊าน/บ้านบัว/เชียงคำ · surin: เมือง/บ้านตากลาง(ช้าง)/ปราสาทขแมร์ · sisaket: เมือง/เขาพระวิหาร-ผามออีแดง/วัดล้านขวด · phitsanulok: ริมน่าน/ภูหินร่องกล้า/ทุ่งแสลงหลวง)
- **กลไกอัปเกรด:** ถ้าเจอ ≥3 โซนจริง → เพิ่ม HOODS entry (city-level ปกติ ไม่ใช่ sub-area) + เพิ่ม slug ใน `HANDWRITTEN` set (`gen-where-to-stay-auto.mjs`) → auto จะข้าม · ถ้าไม่เจอ → ปล่อย data-driven + อัปเดต comment เหตุผล
**เกณฑ์ผ่าน:** แต่ละจังหวัด = อัปเกรด (มี HOODS) หรือ บันทึกเหตุผลคงไว้ data-driven · ไม่มีย่านที่แต่งขึ้น · build OK

---

## ✅ Done criteria (ทั้งเฟส)
ทุกงาน: `bash _internal/build-test.sh` = **BUILD OK** · `node _internal/audit-jsonld.mjs` = 0 error · `node _internal/audit-freshness.mjs --links` = 0 broken · EN zero-Thai (สแกน `/[ก-฾เ-๛]/`) · ไม่แต่งข้อมูล/ย่าน/ราคา · rebase origin/main ก่อน push เสมอ · อัปเดต memory `quality-phase-done.md` (หรือสร้างใหม่) สรุปสิ่งที่ทำ
**TH↔EN parity ก่อนปิดเฟส:** `node -e "const fs=require('fs');const ls=d=>new Set(fs.readdirSync('astro/src/content/'+d).filter(f=>f.endsWith('.json')));for(const[a,b]of[['articles','articles-en'],['reviews','reviews-en'],['roundups','roundups-en']]){const x=ls(a),y=ls(b);console.log(a,[...x].filter(s=>!y.has(s)).length,'TH-only ·',[...y].filter(s=>!x.has(s)).length,'EN-only')}"` (TH-only ที่เหลือควรเป็นแค่ eat-ranking ของ parallel session)

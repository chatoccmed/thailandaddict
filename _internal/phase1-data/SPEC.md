# Phase 1 — Phuket/Samui/Krabi segmented hotel roundups (SPEC)

> From `_internal/ROUNDUP-REVENUE-AUDIT-2026-07-10.md` — owner GO 2026-07-10.
> Model: every roundup entry REQUIRES a real on-site review (`reviewUrl`) + real image (`img`) — schema-enforced.
> Engine: adapted from `_internal/wf/province-hotels.template.js` (Plan → Review → Roundup), standards from
> `.claude/agents/tourlogy-hotel-reviewer.md` / `tourlogy-roundup-builder.md` + thailandaddict OVERRIDES.

## The 16 roundups (slugs LOCKED — chosen to match ย่าน hood slugs for the district-coverage audit)

**Phuket (8):**
| slug | set size | reuse (existing reviews) |
|---|---|---|
| top10-patong-beach-hotels-phuket | 10 | amari-phuket · hotel-indigo-phuket-patong · lub-d-phuket-patong |
| top10-kata-karon-hotels-phuket | 10 | kk-karon-kata-boutique · the-old-phuket-karon-beach-resort |
| top8-bang-tao-laguna-hotels-phuket | 8 | banyan-tree-phuket · the-surin-phuket (Surin/Pansea beach — label location honestly) |
| top7-kamala-beach-hotels-phuket | 7 | glam-habitat-phuket |
| top8-rawai-nai-harn-hotels-phuket | 8 | the-happy-eight-resort-phuket |
| top8-phuket-old-town-hotels | 8 | the-memory-at-on-on-hotel · aekkeko-hostel-phuket |
| top10-budget-hotels-phuket | 10 | cross-cut: assembled from the pool AFTER beach sets (no new reviews unless pool <10) |
| top10-luxury-hotels-phuket | 10 | cross-cut: banyan-tree, surin, sri-panwa + beach sets' luxury picks (planners MUST include each beach's iconic luxury: Keemala→kamala, Trisara→bang-tao, Amanpuri→bang-tao/surin ฯลฯ) |

**Samui (6):** (⚠️ duplicate wart: banyan-tree-samui & sala-samui exist in BOTH `samui` and `surat-thani` clusters — ALWAYS reuse the `-samui` cluster version; where only `-surat-thani` exists (anantara-bophut, anantara-lawana, samui-resotel), reuse those slugs as-is)
| slug | size | reuse |
|---|---|---|
| top10-chaweng-beach-hotels-samui | 10 | sala-samui-chaweng-beach-resort-samui · lub-d-koh-samui-chaweng-samui · la-vida-samui · ozo-chaweng-samui · chaweng-regent-beach-resort-samui · anantara-lawana-koh-samui-surat-thani · samui-resotel-beach-resort-surat-thani |
| top8-lamai-beach-hotels-samui | 8 | banyan-tree-samui · lamai-wanta-beach-resort-samui |
| top8-bophut-fishermans-village-hotels-samui | 8 | greenlight-fishermans-village-resort-samui · the-waterfront-boutique-hotel-samui · anantara-bophut-koh-samui-surat-thani |
| top7-maenam-choeng-mon-hotels-samui | 7 | garrya-tongsai-bay-samui (เชิงมน) · lipa-bay-resort-samui (ลิปะน้อย — west, label honestly) |
| top10-budget-hotels-samui | 10 | cross-cut from pool |
| top10-luxury-hotels-samui | 10 | cross-cut: banyan-tree, garrya-tongsai, anantara×2, sala + planners include Four Seasons/W/Ritz-tier in beach sets |

**Krabi (2):**
| slug | size | reuse |
|---|---|---|
| top10-ao-nang-beach-hotels-krabi | 10 | ASSEMBLE-ONLY from ~18 existing ao-nang reviews (ananta-burin, aonang-hill, panan, whalecome, aonang-cliff, peace-laguna, phu-pha, vipa, glow, bluesotel, krabi-resort, wake-up, the-ri, nomads, pop-in, sleeper, the-moment, andaman-pearl) — NO new reviews |
| top8-luxury-hotels-krabi | 8 | rayavadee · tubkaak · nakamanda · avani-plus-koh-lanta (+ 3-4 NEW: Phulay Bay Ritz-Carlton Reserve, Banyan Tree Krabi, Dusit Thani Krabi, Anana Ecological — verify operating) |

## Hard rules (every agent)
1. **NEVER overwrite an existing review** — reuse slugs are read-only references. Only create files for slugs marked NEW.
2. New review slugs: `review-<hotel-kebab>-phuket|samui|krabi` (match cluster). TH → `reviews/`, EN twin → `reviews-en/`. Schema: `content.config.ts` reviewSchema; sample: `_internal/templates/review.sample.json`. parent* fields REQUIRED (schema-gotchas): `parentHref` = the district roundup html of its set (e.g. `top10-patong-beach-hotels-phuket.html`), crumbCityHref = `city-phuket.html` etc.
3. Reused reviews KEEP their original parentHref (a hotel may appear in several roundups; parent stays first-home).
4. Brand/tone: ThailandAddict v2-clean — ห้าม slang (อ่ะ/ปะ/แหละ/ล่ะ) · ห้ามคำ AI (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · no dark patterns (lint enforced in build-test).
5. Affiliate: Agoda `?cid=1965862` · Trip `?Allianceid=6861268&SID=312919111` · Booking = plain canonical URL (CJ wrap happens at build; check-booking-cj enforces).
6. Images: hero per review self-hosted → `astro/public/images/hotels/<city>-<short>-N.jpg`; curl direct to final filename ONLY; **ห้าม rm/ลบไฟล์ใด ๆ ใน images/** (มีรูปจังหวัดอื่นปน); โหลดไม่ได้ → ปล่อยว่าง (layout onerror). Track new files for R2 upload (`_internal/upload-r2-api.mjs`) before deploy.
7. Prices = "เริ่มประมาณ" from real standard-room ranges, not peak single points.
8. Roundup schema: match `_internal/templates/roundup.sample.json` + gold `top10-jomtien-beach-hotels-pattaya.json`. Entries pull score/price/links from the actual review JSONs. breadcrumb → city-phuket ฯลฯ.
9. Honest top-N: if a category can't fill N with ≥8.0 real candidates, shrink N (rename slug NO — keep slug, fill honestly; slugs sized conservatively above).
10. Sequencing: beach sets FIRST (reviews+roundup per set), THEN city cross-cuts (budget/luxury) assembled from the pool.

## Pipeline stages
A. **Kamala vertical slice** (smallest set, 6 new reviews + 1 roundup) → quality gate (manual + auditor) before fan-out.
B. Phuket remaining 5 beach sets → phuket budget+luxury cross-cuts.
C. Samui 4 beach sets → samui cross-cuts.
D. Krabi: ao-nang assemble-only + luxury (3-4 new).
E. QA: build-test (schema/banned-words/dark-patterns/CJ) + quality-auditor sample + `audit-roundup-coverage.mjs` re-run (phuket/samui/krabi rows must clear their tier gaps) + gen-hubs regen (rankGuides auto-surfaces) + R2 image upload + commit/push. Deploy bundled with Wave-2 QA ship.

## Post-phase notes
- New reviews are TH+EN only (hi/he/ar/ru/ko/ja twins = separate decision; the 342-file i18n set is a fixed list).
- Samui/surat-thani duplicate reviews flagged for future dedup (do NOT delete anything this phase).

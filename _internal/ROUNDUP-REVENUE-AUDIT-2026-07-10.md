# 🏨 Nationwide Hotel-Roundup Revenue Audit — 2026-07-10

> Owner asked: "ตรวจสอบเรื่องนี้อย่างละเอียดทั้งประเทศ ทั้งระบบ เพราะเป็นแหล่งรายได้หลักของเว็บ"
> (triggered by finding Phuket — an S-tier destination — with only 1 hotel roundup).
> **Re-run anytime:** `node _internal/audit-roundup-coverage.mjs` (stateless, counts from disk).
> Baseline at audit time: 296 roundups · 2,296 reviews · 89 cities (77 จังหวัด + 12 destinations) · 65 ย่าน.

---

## ✅ FIXED THIS SESSION (commit 86e4397b8 — pushed, NOT yet deployed)

### 1. Orphan roundups: 73/296 revenue pages had ZERO internal links → now 0
The single biggest measured revenue leak. 73 roundup pages (~25% of all roundups) were live in
production, in the sitemap, fully monetized (every entry has booking URLs, CJ guard passes) — but
**no hub, article, review, or other roundup linked to them**. Verified example:
`top10-luxury-hotels-pattaya` → 200 in prod, 8 sitemap entries, 0 inbound links.
Google treats unlinked pages as low-value; users could never discover them.

**Root cause:** city hubs only ever linked the anchor (`top10-hotels-<city>`), and area-bangkok
pages never linked their own district roundups. Segmented roundups (budget/luxury/beach/hospital)
were built across many sessions but no surface ever listed them.

**Fix (gen-hubs.mjs):** new roundup→city index + "จัดอันดับที่พักตามสไตล์และทำเล" pill section on
every city hub (all locales, twin-aware) + district-roundup links on area-bangkok pages.
**Re-verified: orphan count now 0.**

### 2. Hospital/landmark duplication risk (flagged, partially mitigated)
18 hospital/MICE/airport roundups (`top8-bumrungrad-hospital-hotels-bangkok` etc.) duplicate the
surfaced `hotels-near-*` articles — same 7/8 hotels, zero cross-links, competing for the same query
(skill anti-pattern B2 cannibalization). Now both are at least surfaced (hub pills). **Follow-up
choice needed:** cross-link the pairs, or consolidate one format.

### 3. "ดูอันดับที่พัก →" callout now shows the real count ("(12 โรงแรม)") — owner request.

---

## 📊 COVERAGE MATRIX (the content gap — NOT yet built)

Tiers: S = top revenue destinations · A = rest of the curated 30 tourism cities · B = ≥12 reviews · C = rest.
Build targets (adapted from `.claude/skills/tourlogy-city-roundup-checklist` build matrix):
S ≥ anchor+budget+luxury+2 beach/area+1 audience · A ≥ anchor+budget+1 more · B ≥ anchor+budget · C ≥ anchor.

### Tier S — the revenue core (7 cities)
| city | reviews | roundups | gap |
|---|---|---|---|
| bangkok | 418 | 88 | **budget, luxury** (province-level; 87 are district/landmark-scoped) |
| chiang-mai | 95 | 10 | audience (couples/family) |
| pattaya | 79 | 10 | audience |
| huahin | 47 | 7 | audience |
| krabi | 39 | 4 | **luxury, +1 beach/area (railay/ao-nang/klong-muang), audience** |
| **phuket** | 12 | **1** | **budget, luxury, beach/area×2+, audience — worst S-tier gap** |
| **samui** | 12 | **1** | **budget, luxury, beach/area×2+, audience — same** |

### Tier A (23 cities) — 17 missing budget; 12 also need +1 segment
Missing budget: prachuap-khiri-khan, nakhon-ratchasima(fixed by alias — has budget), nan, khao-yai,
chiang-rai, koh-larn, mae-hong-son, phang-nga, pai, trat, koh-mak, surat-thani, ayutthaya, sukhothai,
koh-phangan, hat-yai, koh-lipe. (chonburi/rayong/kanchanaburi/phetchabun/koh-chang/koh-kood already ≥target.)

### Tier B (54 provinces) — 48 missing budget roundup (all have anchors)
### Tier C — all 5 have anchors. No gap at C-tier target.

### ย่าน (district) hotel-roundup coverage
| city | districts | with own roundup | missing |
|---|---|---|---|
| bangkok | 33 | 33 ✅ | — |
| chiang-mai | 6 | 1 | hang-dong, night-bazaar, old-city, ping-riverside, santitham |
| pattaya | 5 | 2 | central, naklua, pratumnak |
| huahin | 3 | 1 | khao-tao, town |
| krabi | 4 | 1 | klong-muang, railay, town |
| **phuket** | 6 | **0** | **bang-tao, kamala, kata-karon, old-town, patong, rawai-nai-harn** |
| **samui** | 5 | **0** | **bophut, chaweng, choeng-mon, lamai, maenam** |
| phang-nga | 3 | 0 | khuk-khak, nang-thong, natai |

### Untapped review inventory (already-written reviews in no roundup)
chiang-mai 18 · nakhon-ratchasima 17 · rayong 16 · prachuap 9 · bangkok 4 · (rest ≤2).

### Integrity (all healthy)
- Every roundup entry links a real review page where claimed (0 files below 50%).
- Every entry has booking URLs (0 missing). CJ guard covers dist at deploy.

---

## 📋 PROPOSED BUILD PLAN (phased by revenue impact — needs owner GO per phase)

Per the skill: hotel selection is researched FRESH from OTAs (review inventory does NOT cap roundups);
≥5 hotels @8.0+ per category or make it an honest Top-N; verification non-negotiable;
image policy Trip.com→official; EN twin for every TH page. District roundups double as the
foundation for the ย่าน-page upgrade plan (แผนหน้าย่านแบบจัดเต็ม — same work, two payoffs).

**Phase 1 — Phuket + Samui rescue (~17 roundups)** ← highest revenue/urgency
- phuket: budget, luxury, patong, kata-karon, bang-tao-laguna, kamala, rawai-nai-harn, old-town (8)
- samui: budget, luxury, chaweng, lamai, bophut, maenam+choeng-mon (6–7)
- krabi quick-win: luxury, ao-nang or railay (2)

**Phase 2 — S-tier audience + bangkok province-level (~7)**
- bangkok: budget, luxury (2) · chiang-mai/pattaya/huahin: couples or family each (3) · krabi audience (1)

**Phase 3 — A-tier budget sweep (~17 + 12 "+1 segment")**
**Phase 4 — B-tier budget sweep (48)** — lowest priority; validate search volume per skill B1 first.
**Phase 5 — remaining district roundups** (chiang-mai 5, pattaya 3, huahin 2, krabi 3, phang-nga 3)
— feeds directly into the ย่าน full-treatment plan.

**Refresh debt (skill B4):** anchors are "อัปเดต 2026"-stamped; set a 6-month re-rank cadence for
S-tier anchors (bangkok/phuket/chiang-mai/pattaya) — currently no cadence exists.

---

## ⚠️ Deploy note
The surfacing fix is committed+pushed but **NOT deployed** — the working tree holds ~2,100
untracked hi/he/ar translations (Wave 2) still in QA; deploying now would ship them raw.
Deploy AFTER Wave-2 QA lands (one deploy ships both).

---
## ⚠️ Phase-1 follow-up flag (2026-07-11): ao-nang cannibalization
Phase-1 built `top10-ao-nang-beach-hotels-krabi` (assemble-only) — but a pre-existing committed roundup
`top15-ao-nang-hotels-krabi` already covers ao-nang (8/10 hotel overlap). The audit missed this because
top15-ao-nang was classified as generic "area" segment, so krabi's "beach/area" gap looked open.
**Decision needed (owner):** (a) keep top15 only + discard the new top10-ao-nang-beach (redundant), or
(b) consolidate to the new one + redirect the old, or (c) keep both. Pending decision, the new
top10-ao-nang-beach-hotels-krabi TH+EN is left UNCOMMITTED (on disk, not shipped). Krabi's real remaining
beach/area gaps are railay + klong-muang (would need ~top5 each — thin existing inventory: rayavadee/sand-sea
= railay; tubkaak/nakamanda = klong-muang). The new `top8-luxury-hotels-krabi` is a genuine non-duplicate addition.

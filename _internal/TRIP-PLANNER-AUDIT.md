# 🔍 AI Trip Planner — Expert Audit & Roadmap (2026-06-22)

Multi-lens audit (UX/UI · itinerary design · monetization · shareability · trust/data · actionability) + synthesis + adversarial review. Frame = owner's 5 goals: (1) max user value (2) comprehensive trip (3) actionable on the trip (4) shareable (5) revenue.

## Verdict
A genuinely polished v1 **shell** — coherent design, real thumbnails, real timeline, branded infographic, sound anti-hallucination gate — on an engine that **arranges items but doesn't yet compose a trip**. The output is also **ephemeral (window._trip only) + read-only**, capping all 5 goals at once.

## 🔴 P0 — must fix (correctness / revenue / honesty)
1. **Guarantee a bookable hotel every NIGHT** (biggest revenue lever). `resolve()` only honors AI's optional `hotelId`; `ensureSavedIncluded()` backfills SAVED stays only → a user who saved 0 hotels gets a bed-less, **zero-Agoda** plan. FIX: `ensureHotelPerNight(days,pool,prefs)` — for each night < `prefs.nights` with no hotel, attach top-`styleScore` unused stay **for that night's own province** (saved→candidate→honest empty slot, NEVER a wrong-province carry-forward). Reconcile hotel count to `nights` (last day = checkout, no hotel). Effort M.
2. **Checklist hotel button → Agoda deep-link** not review page. `renderChecklist` emits `h.url`; object already carries `h.agoda` (cid=1965862). Day card already prefers agoda → checklist is inconsistent, loses the highest-intent click. One line. Effort S.
   - +critic: `pickHotels` EXCLUDES saved hotels (`!savedNames`) → a saved hotel never appears in the revenue "ที่พักแนะนำ" grid. Stop excluding saved.
3. **Persist the trip + mint a shareable URL.** Plan lives only in `window._trip` → refresh/tab-kill = gone; reopening /trip = blank form + forced re-roll. FIX (a) cheap now: write `ta_trip` to localStorage + rehydrate with a "latest plan" bar. (b) real: POST writes **Workers KV** (unused, available) → `tripId` + `shareUrl` (30-day TTL) + `GET /api/trips/:id`. Prereq for og:image / native share / email. Effort M.
4. **Interest matching — do it, or stop claiming it.** Header echoes the interest while `see` candidates are sliced in raw feed order with no interest filter; `styleScore` weights hotels only → "ธรรมชาติ" returned markets/craft/food. FIX (honest now): only echo an interest in the header if a rendered item maps to it. FIX (partial match): keyword-bucket attraction **names** (น้ำตก/ดอย/อุทยาน/ทะเล…) → sort. Ship honest-header as primary (keyword match is partial — many TH names are proper nouns). Effort M.
5. **Loading copy lies — honesty violation.** Both the static subline AND the rotating array promise "คำนวณเส้นทางและเวลา" (no coords → never computed) and "เลือกที่พักให้แต่ละคืน" (an outright lie on a 0-hotel run). Reword to what actually happens. Effort S.

## 🟡 P1 — high-value next
- **Inter-province transfer band** (owner's explicit Goal-2 complaint). When day N province ≠ day N-1, inject a transfer row (province→province Maps link + transport-aware note from `prefs.transport`, no fabricated minutes). Zero backend. *(critic: technically P1 by frequency — most trips single-province — but cheap + owner-requested → do early.)*
- **Editable itinerary** (remove / swap / add-a-hotel-tonight from `hotelPicks` / add-my-own / tick done). Today 100% read-only; only lever is full regenerate (which may drop what the user liked). Pure local-state once persisted. Effort L.
- **High-margin travel stack + checklist ordering.** Add "เตรียมก่อนไป" group: SafetyWing (insurance, nights≥2) + Airalo (eSIM) behind per-provider LIVE flags. Reorder checklist by commission: hotels → insurance/eSIM → Klook → transport → eat/see. Effort S.
  - +critic: **eat-side revenue is missing** — restaurant rows link to our review page only; add Klook "food tours / things to do" per restaurant-area (deepest-data vertical, no affiliate today).
- **UTM on every affiliate link** (`utm_source=trip-planner&utm_medium=<provider>&utm_campaign=plan`, preserve cid/aid). Without it: no attribution, no commission-ordering, no share-loop measurement. *(Note: inert until GA4 installed — owner task #12.)* Effort S.
- **Honest partial/failure states.** `fallback()` renders identical chrome to a rich AI plan; `usedAI` never surfaced; food-less province is silent. Show a "basic ordering" banner + per-province "ยังไม่มีรีวิวร้าน → หาบน Maps/Klook" recovery. Return `coverage{eat,see,stay}` from worker. Effort M.
- **Infographic + native share + email.** Draw each day's hero photo + a QR to the UTM'd shareUrl (today text-only, footer points to the **empty form** not the trip); add `navigator.share`; optional email-the-plan (store with KV tripId, never gate). Depends on share URL. Effort M.
- **Per-day time budget + meal cadence.** pace/kids/elderly collected but never bound activity count; CAP.eat=5 total < 2 meals/day. Slots-per-day by pace, ensure a meal each day. Effort M.
- **Export: Maps day-route + .ics + offline (PWA).** Whole-day Maps route (waypoints by name+province + travelmode), add-to-calendar, manifest + service worker so the persisted trip works with no signal. Effort M.

## ⚪ P2 — polish
- og:image + drop `noindex` on shared-trip pages (today shares unfurl blank → 3-5× fewer clicks, no backlink/AEO). +critic: planner page itself has no SEO landing for "AI trip planner Thailand".
- Per-item confidence cue replacing the wall of identical "เช็กเวลา/ค่าเข้าก่อนไป" chips (dominates nature trips); show "ข้อมูลจำกัด" or a one-tap Google-hours search + a "N คุณเลือก / M แนะนำ" summary.
- 3-step progressive form (10 fields at once on a 380px phone = drop-off).
- Constrain AI `note` to plan-reasons only — forbid asserting place qualities (taste/view) → soft fabrication that spreads in the shared infographic.
- Arrival/departure placement from `startFrom` + reconcile days vs nights (steppers independent today).
- Fix the **"จัดใหม่" button** (only hides output, doesn't regenerate) + add no-AI per-day reshuffle.
- Visual hierarchy + tap targets ≥40px + aria labels/roles + focus-to-H2 after render.
- Group-trip: "บันทึกของในทริปนี้เข้า my-list ของฉัน" on a shared trip → 1 planner becomes N (viral).

## 💰 Single highest-leverage move
**Guarantee a province-correct, Agoda-deep-linked hotel every night** (P0 #1 + #2 fused). Hotels are the only vertical with real Agoda deep-links + ~1939 style-ranked stays already in the pool → on the owner's real run the #1 revenue path went to **literally zero**. Pure wiring, no new data/AI/backend; lifts revenue on trips already being generated today.

## ⚡ Quick wins (this week, value÷effort)
1. checklist hotel href → `h.agoda || h.url` (1 line)
2. `ensureHotelPerNight()` backfill (province-scoped, pool already ranked)
3. persist `ta_trip` to localStorage + rehydrate
4. UTM helper on all affiliate hrefs
5. transfer band on adjacent-day province change
6. reword the false loading copy (BOTH static subline + rotating array)

## Sequencing note
Revenue-measurement recs (UTM ordering, share-loop) are **inert until GA4 is installed** (owner task #12). KV share-URL is the keystone that unlocks share/og/email/PWA — do the localStorage half now, KV when ready.

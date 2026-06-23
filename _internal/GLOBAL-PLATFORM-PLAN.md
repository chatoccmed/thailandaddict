# 🌏 Global Platform Plan — mapping the 4-lens advice onto our build (2026-06-22)

Owner shared a 4-lens "build for global scale from Day 1" critique (Developer / UX-UI / Business / Tourist). This maps each recommendation to our REAL code + constraints, dedupes against the shipped P0/quick-wins and the [TRIP-PLANNER-AUDIT](TRIP-PLANNER-AUDIT.md), and sequences it into phases. Legend: ✅ shipped · 🔜 feasible now (no new infra) · 🏗️ needs a foundation (KV backend or data layer).

## The one insight that frames everything
The global vision is gated by **two foundations**, and the advice is right that both must start now before "debt" compounds:
1. **The data layer ("Data as Lego").** Today: hotels = rich (type/price/Agoda), restaurants = rich (hours/price/coords), but **attractions (1,051) are name-only — no tags, no hours, no coords.** Every "smart global" feature (logistics routing, swap-by-proximity, #FamilyFriendly / #EVparking filtering, rest-stops, family pacing that knows a place's duration) needs structured+tagged+geo place data. This is **"tag debt"** — cheap to start, expensive to retrofit on 11k pages later.
2. **The server backend (Workers KV).** Today trips are ephemeral (localStorage only). Shareable links, collaborative voting, PDF-by-email lead-gen, og:image, retargeting lists — **all hinge on a server-saved trip object.** The audit already flagged KV as the keystone.

Everything else is sequencing around these two.

## Lens 1 — Developer / Architecture
- **1.1 Data as Lego (modular tagged places)** → 🏗️ FOUNDATION. Plan: add `tags[]` + `lat/lng` + structured `hours`/`fee` to the content schema; **auto-derive tags now** from data we already have (restaurant `foodType`, hotel `qiType`, attraction name keywords via the existing `INTEREST_KW` buckets, `kids`/`pool`/`ev` from review text); backfill top-traffic places first. Emit tags into `/feeds/*.json`. This is incremental — start the schema + auto-derivation in Phase 1, backfill ongoing.
- **1.2 Prompt Engineering Architecture (send tags/hours/coords for logistics)** → ✅ PARTLY. The worker already builds a *typed pool* (stay/eat/see + province + price/hours/type/agoda) and a structured prompt; the AI arranges by id (anti-hallucination). The missing inputs are exactly the data-layer gaps (tags/coords). So 1.2 is "already architected, unlocks as 1.1 data lands." Next: pass `tags` + (where present) `lat/lng` into the pool lines so the model reasons on logistics; add real haversine ordering once attractions have coords.

## Lens 2 — UX/UI / Frictionless
- **2.1 Smart Swap (auto time-shift)** → 🔜 PHASE 1. We already return a swap pool (`hotelPicks` + `t.unused` + per-province candidates). Build: per-item "🔄 หาที่ใกล้เคียง/สลับ" → pick from same-type, same-province unused candidates → replace in place; recompute the day. Auto-retime uses the `dur` estimates we already generate. No AI call, no backend.
- **2.2 Collaborative + PDF-to-LINE + vote** → ✅/🏗️. Infographic + copy-summary shipped. Real link-share + "vote/add together" needs KV (Phase 2 = async: share link → others open, suggest, ✓/✗ stored in KV). True real-time sync = Cloudflare **Durable Objects** (Phase 4, bigger). Start async-collab on KV; don't over-build real-time first.

## Lens 3 — Business / Monetization
- **3.1 Beyond hotels — car rental (high-ticket)** → 🔜 PHASE 3 (needs affiliate signup, task #13). Add a **vehicle step** in the form (รถเก๋ง / ครอบครัว-Alphard / EV-XPENG / รถตู้+คนขับ) → inject a car-rental affiliate row in the booking checklist (Local TH rental / Toyota Rent a Car) behind a per-provider LIVE flag. EV choice can later filter hotels for `#EVparking` (ties back to 1.1 tags). Also add insurance(SafetyWing)+eSIM(Airalo)+Klook-food-tours (audit P1).
- **3.2 Lead-gen PDF gated by email** → 🔜 PHASE 2 (task #14 + KV). The trip artifact = the magnet. Build: "📄 ดาวน์โหลด PDF ทริป" → ask email (optional, never gate the on-screen plan) → store email+tripId in KV → email the PDF link + an Agoda nudge → retargeting/newsletter base. PDF from the same data (jsPDF or print stylesheet).

## Lens 4 — Tourist / Reality Check
- **4.1 Pacing & Rhythm (family mode + over-packed warning)** → 🔜 PHASE 1 (overlaps audit "per-day time budget"). Add a **"ครอบครัว"** pace preset (fewer stops, longer meals, more buffer); enforce slots-per-day by pace − 1 if kids/elderly; **warn when a day is over-packed** (sum of `dur` + transfers > a daylight budget) and trim overflow to `unused`.
- **4.2 Contextual Necessity (rest-stops between cities → Wow)** → 🔜 best-effort now / 🏗️ full later. On the transfer band, suggest a café/rest-stop. Honest v1 (no route data): surface a highly-reviewed café in the destination province as "แวะพักก่อนเข้าเมือง". Full version (a stop at the right *midpoint* of the drive) needs coords + a route — depends on the data layer (1.1).

## Phased roadmap
- **Phase 0 — DONE:** v1 planner + audit P0/quick-wins (hotel-per-night province-correct + Agoda deep-links, interest match, persist, UTM, transfer band, honest copy).
- **Phase 1 — "A tool you control" (frontend, no infra):** Smart Swap + editable itinerary (remove/swap/add-own, auto-retime) · family pace + time-budget + over-packed warning · rest-stop suggestion on transfers · **start the tag/geo schema + auto-derive tags** (foundation, cheap).
- **Phase 2 — "Shareable & lead-gen" (Workers KV = keystone):** server-saved trip → shareable URL + `GET /api/trips/:id` · og:image + native share · PDF export gated by email → KV email store (lead-gen).
- **Phase 3 — "High-ticket revenue":** vehicle step + car-rental affiliate (EV/Alphard) · insurance/eSIM stack · Klook food-tours · checklist ordered by commission.
- **Phase 4 — "Collaborative + Global":** async collab (suggest/vote on shared KV trip) → real-time via Durable Objects · full data layer backfill (tags+coords) → proximity swap, real logistics, EV-parking filter, true rest-stops · pluggable content provider (Booking/Google Places) + directions API for non-Thai scale.

## Sequencing notes / honesty
- GA4 (task #12) must be live for the UTM/commission-ordering work to be measurable.
- Affiliate signups (task #13: car rental, 12Go, Airalo, SafetyWing, GYG) gate Phase 3 revenue rows — build behind LIVE flags so nothing ships broken/untracked.
- Don't build real-time collab before async collab; don't build full geo before auto-derived tags. Foundations first, incremental backfill.
- "Global" = foreign tourists IN Thailand first (per owner), not multi-country yet — keep the Thai data moat; make the content-provider pluggable so multi-country is a later swap, not a rewrite.

# Monetization analysis + booking-revenue levers (2026-07-05)

## Baseline (already strong)
- Reviews: 99% carry all-3 hotel links (Agoda cid ✓, Booking ✓, Trip Allianceid ✓). Roundups: 100% of 2666 entries. Eat-rankings 97% Klook, attractions 100% Klook.
- ReviewLayout already has: 3-button price widget (Agoda/Booking/Trip) + "⚖️ เทียบราคา 3 เว็บ" compare framing + sticky mobile "จองผ่าน Agoda" bar + in-image "ดูห้องว่าง" CTAs + EEAT byline + affiliate disclosure. Trip links are deep hotel-detail pages. Conversion scaffolding is mature.

## 🔴 #1 REVENUE LEAK — Booking.com earned ฿0 (FIXED-PREP this session)
Every review + roundup shows a prominent **Booking.com** button, but 0/2277 review + 0/296 roundup booking.com URLs carried an affiliate ID → **100% of Booking clicks were untracked = ฿0**. Booking.com is typically the highest-converting hotel affiliate.
**Done:** wired `aid=__BOOKING_AID__&label=thailandaddict` placeholder onto **10,003 booking.com URLs across 5,146 files** (safe: invalid aid is ignored, link still works).
**TO ACTIVATE (owner):** sign up Booking.com Affiliate Partner Program (or via Travelpayouts) → get the numeric **aid** → repo-wide find-replace `__BOOKING_AID__` → real aid → rebuild + deploy → assert `grep -rl __BOOKING_AID__ astro/dist | wc -l` == 0. (Optionally switch `label=thailandaddict` to a per-page label for sub-tracking.)

## 🟡 #2 Klook: search links → deep activity links
1058 attractions + 776 eat-rankings link to `klook.com/search/?query=…` (generic search); only ~17 curated guides use deep `klook.com/activity/<id>` links. Deep product links convert 3–5×. LEVER: upgrade top-destination attractions (Bangkok/Phuket/Chiang Mai/Krabi/Samui/Pattaya) to deep Klook activity links where a matching product exists (agent-sourced, like the activity guides). NOT yet done.

## 🟡 #3 GetYourGuide dormant — owner-gated
6510 `__GYG_PARTNER_ID__` placeholders ready; needs the GYG partner ID → find-replace to activate.

## 🟢 #4/#5 smaller: cross-sell (itinerary/attraction → hotel roundups + Klook more aggressively), conversion micro-polish.

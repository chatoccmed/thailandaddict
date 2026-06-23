# 🏷️ Place Tags & Geo — content spec (the Data Layer)

For everyone writing **reviews / attraction articles / restaurant blocks**. Adding tags + coordinates is how a place becomes usable by the **AI Trip Planner** (match by interest/audience/practical) and, later, real logistics. Start now so new content is tagged from Day 1 — we don't retrofit 11k pages later.

## TL;DR — what to add
In any review JSON or article JSON, optionally add:
```jsonc
{
  "tags": ["temple", "culture", "family", "free-entry"],   // pick from the vocabulary below
  "lat": 18.8045,                                            // decimal degrees (Google Maps: right-click → copy)
  "lng": 98.9213
}
```
- **All three are optional + additive** — existing content keeps working with none. Add what you *know*; don't guess.
- **`tags` must come from the controlled vocabulary** (below). Invalid tags are silently dropped by the feed builder. Don't invent ad-hoc tags.
- **Manual tags merge with auto-derived ones** (the builder already guesses some from the name/type) — your manual tags are the high-quality signal, so add the ones a keyword can't infer (e.g. `family`, `ev-charging`, `free-entry`, `rest-stop`).
- For **restaurant blocks** you mostly don't need to add tags — they're derived from `foodType` / `halal` / `veg` / `englishMenu` / `priceRange`. Just keep those structured fields filled (and `lat`/`lng` if you have them).

## Controlled vocabulary (v1) — source of truth: `_internal/lib/place-tags.mjs`
**Theme (what kind of place):** nature · waterfall · mountain · viewpoint · cave · park · lake · hotspring · beach · island · temple · museum · history · culture · palace · shrine · art · oldtown · market · walkingstreet · citywalk · cafe · restaurant · streetfood · localfood · michelin · shopping · mall · nightlife · bar · rooftop · adventure · trekking · water-activity · cycling · wellness · spa · animal · elephant · zoo · aquarium · farm · landmark · iconic · instagram · bridge · skywalk · (hotels:) resort · villa · pool · boutique · hostel · beachfront · city · apartment · luxury · budget · garden

**Audience:** family · kids · elderly-friendly · romantic · solo · group · pet-friendly

**Practical:** free-entry · paid-entry · indoor · outdoor · ev-charging · parking · wheelchair · halal · vegetarian · english-ok · reservation · cash-only

**Trip-fit:** rest-stop · quick-visit · half-day · full-day

**Time/vibe:** sunrise · sunset · night · hidden-gem · seasonal

> Need a tag that doesn't exist? Add it to `TAG_VOCAB` in `_internal/lib/place-tags.mjs` (and here) — never use an unlisted tag in content; the builder drops unknown tags.

## Which tags matter most to add by hand (highest planner value)
The builder auto-guesses theme tags from the name fairly well. The ones it **can't** infer — please add when you know them:
- **Audience:** `family` / `kids` / `elderly-friendly` / `romantic` (drives the family/couple pacing + recommendations)
- **Practical:** `free-entry` / `paid-entry`, `indoor` (rainy-day backup), `ev-charging`, `parking`, `halal`, `vegetarian`, `wheelchair`
- **Trip-fit:** `rest-stop` (a good driving break with restroom + food/drink — powers the "Wow" mid-route stop), `quick-visit` vs `full-day`
- **lat/lng** for attractions & hotels — unlocks real distance/route ordering later (restaurants already carry coords).

## How it flows (for devs)
content JSON `tags`/`lat`/`lng` → validated by `astro/src/content.config.ts` (optional fields) → `_internal/gen-feeds.mjs` emits `tags` (manual ⋃ auto-derived via `lib/place-tags.mjs`) + `lat`/`lng` into `/feeds/*.json` → the Trip Planner worker (`worker.js`) matches interests via `INTEREST_TAGS` (tag hit > name guess) and will use coords for logistics. Tags appear only in the machine feeds, not on the rendered page.

---
name: thailandaddict-klook-province
description: Build the COMPLETE per-province Klook cluster for Thailandaddict — the full content + monetization system, not just one article. Proven end-to-end on Chiang Mai (gold) and Phuket. Orchestrates all 4 deliverables A1 roundup ("10 กิจกรรมน่าทำใน<จังหวัด>") + A2 comparison/decision articles (island tours / elephant sanctuaries / cooking classes / getting-around / worth-it) + B auto-generated activity hub (activities-<city>) + C selective hero per-product pages — plus the integration & UI patterns (city-page activity-cards section, full-width Klook book button, brand-accurate Agoda/Booking/Trip buttons, highlight-card readability), the per-province checklist, build/verify/deploy, and rollout order. Each card reviews a BOOKABLE PRODUCT (tour/ticket/class) with a real rating+source, evidence-based pros/cons, credited Wikimedia CC photos, Klook deep link (aid=121442), and hotel cross-sell. Delegates the A1 roundup build to the `thailandaddict-activity-ranking` skill. Master template: `references/province-klook-blueprint.md`. TRIGGER on: "ทำ Klook [จังหวัด]", "ทำกิจกรรม Klook ครบ [จังหวัด]", "ทำคลัสเตอร์กิจกรรม [จังหวัด]", "ทำ Klook ทั้งจังหวัด [X]", "สเกล Klook จังหวัด [X]", "ทำจังหวัดถัดไป (Klook)", "build klook cluster [province]", "full activity cluster [province]".
---

# Thailandaddict — Klook จังหวัด (per-province Klook cluster) orchestrator

Owner's recipe for the **complete per-province Klook system** — every province gets a content **cluster** (not a SKU dump) that earns **Klook activity/ticket** revenue (`aid=121442`) + **hotel cross-sell** (Agoda/Booking/Trip) off "กิจกรรม/ที่เที่ยว <จังหวัด>" search traffic.

This SKILL.md is the **orchestrator**: it sequences the whole cluster. The authoritative spec for *what every province must have* (deliverables, UI patterns, checklist, statuses, anti-patterns) is the master template → [`references/province-klook-blueprint.md`](../thailandaddict-activity-ranking/references/province-klook-blueprint.md). **Read it first.** The A1 roundup build pipeline lives in the `thailandaddict-activity-ranking` skill (`references/format-spec.md` for exact fields).

## 🥇 Gold references (match, never overwrite)
- **Chiang Mai** + **Phuket** — full clusters live. Mirror their shape exactly.
- Roundup: `astro/src/content/articles/top10-activities-{chiang-mai,phuket}.json`
- Compare: `astro/src/content/articles/{phuket-island-tours-compared,phuket-elephant-sanctuaries,...}.json`
- Hero: `elephant-nature-park-chiang-mai.json`, `phi-phi-island-tour-phuket.json`
- Render: `astro/src/layouts/ArticleLayout.astro` (`isActivity` on for `type` starting "activity"). Hub + city-page + brand buttons: `_internal/gen-hubs.mjs` (`activityHub`, `actSection`, `aff`, `.klook`, `.hlc`).

## 🔑 LOCKED principles (owner)
- **Every card reviews a BOOKABLE PRODUCT, not a place** ("ทัวร์วัดพระธาตุดอยสุเทพ" ✅ not "ไหว้พระ…" ❌). Rating/price/pros/cons describe the tour/ticket/class.
- **Evidence-based only — ห้ามคิดเอง.** Real rating + cited source (omit if none; never invent). Real pros/cons incl. the genuine downsides. No first-person ("ไปมาเอง").
- **Klook photos off-limits** (403 + copyright) → Wikimedia CC only, credited.
- Tone v2-clean. Ban slang `อ่ะ/ปะ/แหละ/ล่ะ` + AI words `ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`.

## วิธีเรียกใช้ (Invocation)
`ทำ Klook [จังหวัด]` · `ทำคลัสเตอร์กิจกรรม [จังหวัด] ครบ` · `ทำจังหวัดถัดไป` (→ next in rollout: Krabi). If only one article is wanted, use `thailandaddict-activity-ranking` (A1) directly.

---

## ▶️ Cluster build sequence (per province)

**0. Plan** — read the blueprint. Survey the province on Klook → decide the A2 compare set (4-6 that fit its real offering) + which 1-2 C heroes. Confirm a real hotel roundup exists for the `rail`/`stayHref` (else the cross-sell 404s).

**1. A1 roundup** — run the `thailandaddict-activity-ranking` pipeline → `top10-activities-<city>.json` (10 bookable products, parallel-agent research, CC images, selling blocks). This is the anchor + the source of the `staycta`/`experiences` blocks the compares reuse.

**2. A2 compares (4-6)** — spawn ONE `general-purpose` agent per compare, in parallel. Each agent: READs a gold compare (e.g. `phuket-island-tours-compared.json`) + the new A1 for tone/region/rail, web-researches real ratings+reviews, fetches credited Wikimedia CC images, writes a valid `type:"activity-compare"` JSON directly to disk (literal HTML, not entity-escaped). Blocks: `p` → `table` → `restaurant` cards (pros/cons + bookHref each) → `experiences` → `staycta` → `tip` → `cta` + faq + related + rail. Transport/worth-it compares included; transport cards carry NO rating.

**3. C hero (1-2)** — one agent per famous product → `type:"activity"` deep page (gallery + quick-facts + ≥3-para review summary + bookHref + localtips + experiences + cta). Mirror `phi-phi-island-tour-phuket.json`.

**4. Post-process** — recursively un-escape subagent JSON (`&lt;`→`<` … `&amp;`→`&`, in order) if any returned entities; strip `rating`/`ratingSrc` not in (0,5]; JSON.parse every file; scan for banned words; **verify every image URL returns 200** (throttle + backoff — Wikimedia 429s on parallel checks).

**5. Regen + build** — `node _internal/gen-hubs.mjs` (auto-builds **B hub** `activities-<city>.html` + the **city-page section** + brand buttons) → `rm -rf astro/node_modules/.astro && cd astro && npm run build` (clean — stale cache silently skips new articles).

**6. Verify** — activity hub lists all cluster articles; city page "ทำอะไรดีใน…" shows the cards + Klook banner; each article: big Klook button (`bk-klook`) + selling blocks present; ratings cite real sources; `aid=121442` on every `bookHref`; no `&lt;`/`&amp;` left.

**7. Deploy** (owner says deploy) — `npx wrangler whoami` MUST be `chatmaliwan@gmail.com` / `46cdce4b` (not chatoccmed → `npx wrangler logout`). `cd astro && npx wrangler deploy` (reads `astro/dist`; KV `TRIPS` must attach — no "KV not found"). Confirm live with `curl`.

---

## 🧩 Cluster deliverables (summary — full detail in the blueprint)
- **A1** `top10-activities-<city>` (`activity-ranking`) — 10 bookable products.
- **A2** 4-6 `activity-compare` — island-tours / elephant-sanctuaries / cooking-classes / diving / getting-around / <attraction>-worth-it. **Each must include `experiences`+`staycta` selling blocks.**
- **B** `activities-<city>.html` — auto-generated hub (hero image + filter + cards + Klook & hotel selling bands).
- **C** 1-2 `activity` hero pages — famous products only (never auto-catalogue).
- **Integration**: city-page activity-cards section + Klook banner; full-width Klook book button per card; brand-accurate Agoda `#FF2938` / Booking `#003580` / Trip `#287DFA` buttons; `.hlc` highlight cards = white bg + dark text + brand accent bar (readability LOCKED).

## 💰 Monetization (per page)
Klook deep link `klook.com/th/search/?query=<encoded>&aid=121442` per card (upgrade to product URL + aid from dashboard); per-card `stayHref` → real hotel roundup; `staycta` (Agoda `cid=1965862`); `experiences` Klook module; sticky `rail` of real hotel roundups. Hotel cookie on Klook is short → cross-sell hotels via Agoda/Booking/Trip.

## ✅ Quality gates
10 bookable products (A1) + 4-6 compares + 1-2 heroes, all evidence-based; each `descHtml` ≥200 Thai words real & review-backed; ratings from real platforms (or omitted); pros/cons incl. real downsides; all images CC + credited + 200; closed internal-linking loop; clean build; deploy from chatmaliwan only.

## 📈 Rollout order (tourist-first)
Chiang Mai ✅ → Phuket ✅ → **Krabi** → Bangkok → Pattaya/Chonburi → Koh Samui → Chiang Rai → Kanchanaburi → Ayutthaya → Pai → Hua Hin → Koh Lipe/Phi Phi … Run one province at a time; report per province; never silently cap. See [[quality-over-speed-rollout]].

## Anti-patterns
❌ Place instead of bookable product · ❌ inventing ratings/counts · ❌ lifting Klook photos · ❌ compare without `experiences`+`staycta` · ❌ white text on light gradient · ❌ skipping clean build (→404) · ❌ deploying from chatoccmed · ❌ overwriting Chiang Mai/Phuket gold refs.

## Related
- Master template: [`references/province-klook-blueprint.md`](../thailandaddict-activity-ranking/references/province-klook-blueprint.md)
- A1 builder: `thailandaddict-activity-ranking` skill (+ its `references/format-spec.md`)
- Render `astro/src/layouts/ArticleLayout.astro` · Hub/city/buttons `_internal/gen-hubs.mjs` · Schema `astro/src/content.config.ts`
- Memory: [[activity-engine]], [[cloudflare-deploy-account]], [[attraction-rollout-pipeline]], [[quality-over-speed-rollout]]. Affiliate IDs: Klook `aid=121442` · Agoda `cid=1965862` · Trip `Allianceid=6861268&SID=312919111`.

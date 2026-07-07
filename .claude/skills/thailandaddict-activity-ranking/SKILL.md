---
name: thailandaddict-activity-ranking
description: Build a "10 กิจกรรมน่าทำในจังหวัด<X>" (Top-10 bookable activities/tours per province) activity-ranking article for Thailandaddict — proven on Chiang Mai (gold reference). Each card reviews a BOOKABLE PRODUCT (tour / ticket / class), not a place — with a real rating from a real platform, pros/cons summarised from real reviews, 3-4 credited Creative-Commons photos, ≥200 Thai words, a Klook booking deep link (aid=121442), and a hotel cross-sell. Reuses the eat-ranking render engine (ArticleLayout `restaurant` block, extended with activity fields) via `type:"activity-ranking"`. Covers the parallel-agent research pipeline, the Klook-blocked image policy (use Wikimedia CC, never Klook photos), the entity-unescape merge gotcha, build + verify + deploy, and city-page auto-linking. Detailed field spec in `references/format-spec.md`. TRIGGER on: "ทำ 10 กิจกรรม [จังหวัด]", "จัดอันดับกิจกรรม [จังหวัด]", "ทำหน้ากิจกรรม [จังหวัด]", "ทัวร์/ตั๋ว [จังหวัด] ตาม skill", "สเกลกิจกรรม [จังหวัด]", "ทำตาม skill กิจกรรม", "build activity ranking [province]", "top 10 activities [province]".
---

# Thailandaddict — Activity Ranking (activity-ranking) Builder

Owner's recipe for the **"10 กิจกรรมน่าทำในจังหวัด<X>"** article type — a per-province Top-10 of **bookable activities** (tours, tickets, classes) whose job is to earn **Klook activity/ticket affiliate** revenue plus **hotel cross-sell** (Agoda/Booking/Trip) off "ที่เที่ยว/กิจกรรม <จังหวัด>" search traffic.

This SKILL.md + pipeline below builds **A1, the roundup** (the anchor). To build the **whole per-province cluster** (A1 + A2 compares + B hub + C heroes + integration), use the orchestrator skill **`thailandaddict-klook-province`** — it sequences everything and delegates A1 here. The **full per-province system spec** (deliverables + UI patterns + per-province Klook checklist + statuses + rollout order) is the master template [`references/province-klook-blueprint.md`](./references/province-klook-blueprint.md). Read it to know the complete deliverable set; this file covers building the roundup. Exact block/field spec: [`references/format-spec.md`](./references/format-spec.md).

## 🥇 Gold reference (match it — never overwrite)
- **Chiang Mai** — `astro/src/content/articles/top10-activities-chiang-mai.json` (10 cards, the standard).
- Render: `astro/src/layouts/ArticleLayout.astro` — the rich "resto" engine auto-activates when `restaurant` blocks are present; `type:"activity-ranking"` flips on `isActivity` (swaps food labels → "กิจกรรม", schema → `TouristAttraction`, save `data-type="activity"`).
- Schema: `astro/src/content.config.ts` — the `restaurant` block was extended (additive) with activity fields: `pros[]`, `cons[]`, `tipHtml`, `bookHref`, `bookLabel`, `bookProvider`, `duration`.

## 🔑 The core principle (owner LOCKED)
**Every card reviews a BOOKABLE PRODUCT, not a place.** "ทัวร์วัดพระธาตุดอยสุเทพ" ✅ — not "ไหว้พระวัดพระธาตุดอยสุเทพ" ❌. Rating/price/pros/cons describe the *tour/ticket/class* (pickup, guide, what's included, value), sourced from that product's real reviews.

## วิธีเรียกใช้ (Invocation)
Auto-trigger (skill asks "จังหวัดไหน" if not given): `ทำ 10 กิจกรรม [จังหวัด]` · `จัดอันดับกิจกรรม [จังหวัด] ตาม skill` · `สเกลกิจกรรมต่อ [จังหวัด]`. Explicit: `/skill thailandaddict-activity-ranking [จังหวัด]`.

---

## ▶️ Build pipeline (per province)

**1. Pick 10 bookable activities** — the most-reviewed/famous tours·tickets·classes in the province, spanning categories (ปางช้าง/ทัวร์ธรรมชาติ/คุกกิ้งคลาส/วัฒนธรรม-ทัวร์วัด/ผจญภัย ซิปไลน์-ล่องแก่ง/ตั๋วเข้าชม/เวิร์กช็อป-มวยไทย/วิวดอย). Each must be bookable (ideally on Klook).

**2. Research — one parallel agent per activity** (proven method). Spawn N `general-purpose` agents in ONE message (parallel). Each agent does:
   - Web-search real reviews (TripAdvisor / Klook / GetYourGuide) → real **rating + platform** (`ratingSrc`); extract genuine **pros & cons** reviewers mention (include the real downsides).
   - Get 2-3 **Creative-Commons images from Wikimedia Commons** (API below) — relevant to the product; record thumburl + artist + license + Commons file-page URL.
   - Return ONE JSON card object (the `restaurant` block) per `references/format-spec.md`.
   - Honesty rules in the prompt: real data only; no first-person ("ไปมาเอง"); banned AI words `ตอบโจทย์ โดดเด่น ครบครัน ระดับโลก สุดยอด อันซีน`; banned slang `อ่ะ ปะ แหละ ล่ะ`; `descHtml` ≥200 Thai words (≥700 chars) in 3 `<p>`.

   Wikimedia Commons image API (replace TERM):
   `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=TERM&gsrlimit=6&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&format=json`

**3. Assemble** — write the 10 cards + article-level fields + supporting blocks (`p` intro → 10 `restaurant` → `staycta` (hotel) → `experiences` (Klook) → `localtips` → `tip` → `cta`) + `faq` (≥5) + `related` + `rail` (3-4 REAL hotel roundups with R2 imgs). slug = `top10-activities-<city>`, `type:"activity-ranking"`, `cluster:"<city>"`, `heroEmoji:"🎟️"`, hero = card-1's img.

**4. ⚠️ Un-escape gotcha** — subagent JSON usually returns HTML entities in `descHtml`/`tipHtml`/`mapHref`/`bookHref` (`&lt; &gt; &amp;`). Before writing to disk, recursively un-escape every string value (`&lt;`→`<`, `&gt;`→`>`, `&quot;`→`"`, `&#39;`→`'`, `&amp;`→`&`, in that order). Otherwise `set:html` prints literal `<p>` text and `&aid=` breaks the affiliate link.

**5. Build (clean) + verify**
   `rm -rf astro/node_modules/.astro && cd astro && npm run build` (stale cache silently skips the new article).
   Confirm: `ls dist/top10-activities-<city>.html`; 10 `resto-rank`; each `resto-desc` ≥700 Thai chars; `TouristAttraction` schema (not Restaurant); 10 `rbtn book`; 10 `resto-pc`; no `&lt;`/`&amp;` left in descs.

**6. Deploy** — `cd astro && npx wrangler deploy` (account **chatmaliwan**, see memory `cloudflare-deploy-account`; `npx wrangler logout` if whoami shows chatoccmed). Confirm live: `curl https://thailandaddict.com/top10-activities-<city>`.

**7. City link is automatic** — `gen-hubs.mjs` adds a "คู่มือกิจกรรมน่าทำใน<จังหวัด>" callout in the city page's activities section whenever an `activity-ranking` article exists for that cluster. (Re-run `node _internal/gen-hubs.mjs` + rebuild so the city page picks it up.)

---

## 🖼️ Image policy (LOCKED — Klook blocks scraping)
- **Klook blocks automated fetch (HTTP 403)** and Klook photos are copyrighted (affiliate self-produced content needs Klook approval; site must not resemble Klook). **Never lift Klook images.**
- Use **Wikimedia Commons CC images**, 3-4 per card, each with `credit` ("ภาพ: <artist> · <license>") + `creditHref` (Commons file page). Prefer **location-specific** photos (real place); for activity types with no location-specific CC photo (zipline, rafting, muay thai) use **generic-but-relevant** CC images, credited, with a generic alt that does not falsely claim the exact venue.
- The takedown/copyright box is rendered by ArticleLayout automatically.
- Upgrade path: if the owner pulls licensed shots from the Klook affiliate **media kit**, swap them in per card.

## 💰 Monetization
- Per card: **Klook deep link** `https://www.klook.com/th/search/?query=<encoded>&aid=121442` (`bookHref`). Upgrade to a specific **product URL** + aid via the affiliate dashboard for better conversion/attribution when available.
- Per card `stayHref` → a real hotel roundup; mid-article `staycta` (Agoda city link cid=1965862); sticky `rail` of hotel roundups; `experiences` Klook module. Hotel cookie on Klook is short (7d) → cross-sell hotels via Agoda/Booking/Trip, not Klook.

## ✅ Quality gates (honesty-first — brand LOCKED)
- 10 bookable products, each `descHtml` ≥200 Thai words (≥700 chars), real & review-backed.
- Each card is a PRODUCT (tour/ticket/class), not a place. Rating from a real platform (set `ratingSrc`); omit `rating`/`ratingSrc` if none found (never invent).
- pros/cons from real reviews, including the genuine downsides.
- Friend-tone (v2-clean). Ban slang `อ่ะ/ปะ/แหละ/ล่ะ` + AI words `ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`. No first-person ("ไปมาเอง"). See [[quality-over-speed-rollout]].

## 📈 Scaling (when owner says go)
- Do the ~15-20 tourist provinces first (high search + sellable activities + hotel roundups exist for the rail): Chiang Mai ✓ → Phuket, Krabi, Chiang Rai, Kanchanaburi, Ayutthaya, Pai, Hua Hin, Chonburi/Pattaya, Koh Samui…
- Run provinces one at a time; report per province; never silently cap.
- Background: `[[activity-engine]]` memory (architecture + Klook constraints).

## Anti-patterns
- ❌ Reviewing a PLACE instead of a bookable product · ❌ lifting Klook photos · ❌ inventing ratings/counts.
- ❌ Forgetting the entity un-escape (renders literal `<p>` / breaks `&aid`).
- ❌ Skipping the clean build (stale cache → 404) · ❌ deploying from the chatoccmed account.
- ❌ Overwriting the Chiang Mai gold reference.

## Related
- Render: `astro/src/layouts/ArticleLayout.astro` (`isActivity`) · Schema: `astro/src/content.config.ts` (`restaurant` block activity fields) · City link: `_internal/gen-hubs.mjs` (`actCallout`).
- Memory: `[[activity-engine]]`, `[[cloudflare-deploy-account]]`. Affiliate IDs (CLAUDE.md): Klook aid=121442 · Agoda cid=1965862 · Trip Allianceid=6861268&SID=312919111.
- Field spec: [`references/format-spec.md`](./references/format-spec.md).

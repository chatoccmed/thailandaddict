# Bangkok half-day-plan cluster — session note (2026-08-24)

## What shipped (TH + EN, 20 ย่าน)
20 `<hood>-half-day-plan.json` itinerary articles (type:"itinerary", cluster:<hood>) — Ari, Bang Sue,
Bangkapi, Bangna, Chidlom, Ladprao, Mochit-Chatuchak, On Nut, Phrom Phong, Ploenchit, Rama9,
Ramkhamhaeng, Ratchathewi, Samyan, Saphan Taksin, Silom-Sathorn, Sukhumvit, Talat Phlu, Thong Lo,
Victory Monument. Each finished to the site's itinerary standard:
- `quickAnswerHtml` (AEO direct-answer, TH+EN) — was missing on all 20, now present
- expanded body: added an "adjust the plan" h2+intro+list + a "know before you go" `localtips`
  grid (transit / budget / timing / rain fallback) + 2 extra FAQ pairs → median body 2.7k→4.0k chars
- `staycta` block per plan (hotel monetization): links to the ย่าน hotel guide + area hub, Agoda area
  search as the CTA. Agoda URL is BARE — `stampAffiliate()` adds cid=1965862 at render (CLAUDE.md rule).
  0 raw booking.com added; CJ wrapping untouched.
- gen-hubs.mjs `hoodHub()`: surfaces real clustered articles in the see/eat/plan tabs via `artCards()`
  (previously the plan tab was a static "coming soon"). Regenerated th + en area-bangkok-*.html (33 each),
  sitemap.xml, search-index.json (both langs).

Validation: astro sync (schema) OK · dark-pattern lint clean · JSON 40/40 · TH↔EN key/blocks/faq parity
clean · 0 dead internal links · no banned AI words / no fake dates / no first-person visit claims.
Full 17k-page local build OOMs on THIS machine (disk ~4GB → pagefile can't grow → 9GB commit fails —
the documented build-oom-disk-trap); Cloudflare builds fresh on deploy.

## DEFERRED (owner decision 2026-08-24): 7-language hub refresh
Owner chose "ship TH/EN now, do the 7-lang hubs as a separate pass."
- The gen-hubs change surfaces ~123 new EN card-title strings across all 33 area hubs (attraction/cafe/
  restaurant/itinerary titles now shown in see/eat/plan tabs). These are MISSING from every tm.<loc>.json
  (zh/ru/ko/ja/hi/he/ar — 123 each). Regenerating the 7-lang hubs WITHOUT translating them first would
  leak English into those pages.
- The 7-lang area hubs currently live (public/<loc>/area-bangkok-*.html) are the OLD version (static
  "coming soon" plan tab) and are internally consistent + not broken — they just don't show the new links.
- To do the pass properly: `node _internal/i18n/localize.mjs --collect $(ls astro/public/en/area-bangkok-*.html)`,
  translate the 123 strings into each of the 7 TMs (note existing hood-name conventions in TM are
  themselves inconsistent — some romanized, some translated), then run localize.mjs for all 7 locales on
  the 33 area hubs. Underlying content articles are TH+EN only, so cards link to /en/ regardless — the
  translations are card-title-only. Do 1 language at a time (rate limits) and --collect fresh first.

## UPDATE 2026-08-24 (same session): 7-language hub refresh — DONE
Owner said continue ("ทำต่อ", ultracode on). Completed the deferred pass:
- Translated the 123 newly-surfaced strings into zh/ru/ko/ja/hi/he/ar via a 14-agent workflow
  (7 translate → 7 verify, pipelined). Each translator got that locale's existing hood-name
  conventions + template examples from its TM, so titles stay house-consistent.
- Merged into each tm.<loc>.json (+123 keys each: 121 translated + ไทย/English passthrough).
- Cross-script contamination scan caught 5 subtle stray-Thai-char bugs the verify agents missed
  (hi "Chidlom" had Thai ด mixed into Devanagari; he "Kaset-Nawamin" had Thai า/ม in Hebrew) —
  fixed deterministically (Thai→target-script char map). Final scan: 0 stray-script chars across
  all 121×7 entries.
- Ran localize.mjs for all 7 locales on the 33 area-bangkok hubs → misses(→en): 0 for every
  locale (zero English leakage). Verified: 0 real Thai letters in 231 files (only ฿ currency),
  plan/see/eat cards translated, plan cards fall back to /en/<slug> (no localized content twin),
  he/ar dir=rtl intact.
This item is now CLOSED. Content-layer articles for these 7 languages remain TH+EN-only by design.

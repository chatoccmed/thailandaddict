# 🇹🇭 THAILANDADDICT — ROADMAP V2 (post-launch, Thailand-specific)

> 2026-06-21 · expert gap-audit 7 มุม · เว็บ live แล้ว · 61 ช่องว่าง (กรอง done ออก) · ต่อจาก DEVELOPMENT-PLAN.md

## North-star
Thailandaddict should be the most trusted, most-useful, best-monetized English+Thai resource for global tourists planning any Thailand trip — the place that answers every Thailand decision (where to stay down to the soi, what to eat down to the dish, which island fits you, how to get from A to B, when to go by region) with honest, EEAT-locked, AI-citable content, and then converts that intent into a booking via the right partner (Agoda/Trip for stays, Klook/GetYourGuide for experiences, 12Go for transport, Airalo/SafetyWing for prep). It wins not by out-publishing Travelfish on prose but by out-structuring everyone: a Thailand-complete content graph (1,939 reviews + 215 roundups + 3,347 articles already) wrapped in 4-5 client-side decision tools (island finder, budget calculator, route finder, visa lookup) that no static competitor offers, all measured by analytics and compounded by an email list.

## Biggest unlocks
The single highest-leverage move is instrumentation + affiliate activation: install GA4/Search Console and UTM-tag links (zero analytics today — flying blind), then activate the GetYourGuide placeholder live in 6,290 files and 12Go in transport articles via find-replace once the owner signs up. This converts thousands of dead links to revenue in one commit each and finally lets you measure what works. Second: launch the experience-content engine (cooking classes, food tours, Muay Thai, wellness/yoga, island-hopping comparison) — these are the highest-commission, globally-bookable verticals where the site has near-zero dedicated pages but already has the writing pipeline and a live Klook integration to monetize them immediately.

## 🟢 NOW (วัดผล + เปิดเงินที่ wire ไว้)
- Install GA4 + Search Console + UTM-tag all affiliate hrefs (G-XXXX from owner, gtag.js in the 3 shared layouts, utm_source=slug&utm_medium=agoda|trip|klook). Verified: zero gtag/GA4 in src today. Effort 1, this is the prerequisite for every other monetization decision.
- Owner signs up GetYourGuide + 12Go this week; on ID arrival run one find-replace per partner. Verified: __GYG_PARTNER_ID__ live in 6,290 content files, __12GO_AID__ in 24 transport files — all currently dead links. Single commit per partner converts them; spot-check 5 pages.
- Activate Airalo (eSIM guide) + SafetyWing (insurance guide) affiliate links + add a 'Buy Now' CTA. Content already references them in prep articles; just needs IDs and a button.
- Add visible 'Updated [date] · Verified' stamp under the h1 in ReviewLayout/RoundupLayout/ArticleLayout and a trust micro-badge on the sticky booking bar. JSON-LD already emits dateModified; surface it. Pure template/CSS, EEAT + conversion lift.
- Add Mailchimp/MailerLite footer form (free tier) across the 3 layouts + a printable lead magnet (Thailand packing list / Bangkok 3-day itinerary PDF). Verified: zero email capture today. Builds the only owned audience asset.
- Ship the Thailand cannabis legality guide (post-2022 reality) — 800-word listicle, no affiliate (liability), pure GSC/AEO play for a trending high-confusion query with zero good English guide.
- Emit HowTo + richer TouristAttraction schema in ArticleLayout (attraction/prep types) and Place schema on the 77 city hubs. ArticleLayout already conditionally emits Article/Restaurant/TouristTrip; extend it. Drives AI citations + rich results.

## 🔵 STRATEGIC (เติม experience content + tools + accommodation depth)
- Build the Cooking Class + Food Tour content cluster (8-12 city guides each for Bangkok/CM/Phuket/Krabi/Ayutthaya etc.). Verified: zero dedicated cooking/food-tour pages despite 929 passing mentions. Highest-commission food vertical (Klook/GYG 10-15%); reuse the existing eat-ranking engine and writer agent.
- Launch Muay Thai + Adventure (zipline/canopy) + Island-Hopping comparison cluster. Verified: zero dedicated muay-thai/boxing pages despite 29 mentions; only 1-2 island-hopping comparisons. These are globally-searched, high-ticket Klook/GYG bookings the site currently sends nowhere.
- Build the Wellness/Spa/Yoga-retreat + Pool-Villa accommodation roundups (Thailand-signature inventory). Verified: 0 pool-villa roundups despite 63 files mentioning pool villas; 0 yoga/wellness roundups. High-spend segments; reuse the roundup engine as hotel feeds; pair with Klook spa/yoga experiences.
- Decompose 'where to stay' city guides into neighborhood roundups, Bangkok first (Silom, Thonglor, Khao San, Sukhumvit, Riverside, Old City). Verified: only 1 sub-neighborhood roundup exists. Captures hundreds of high-intent hotel keywords; Bangkok alone ~1-2k affiliate clicks/mo.
- Persona content clusters — Solo-Female, LGBTQ+, Digital-Nomad/DTV — each as a small flagship hub (4-6 guides) reusing ArticleLayout + AEO boxes. Verified: 0 LGBTQ+ and 0 DTV pages, ~8 thin solo-female mentions. High-income, high-conversion, structurally under-indexed; gate behind GA4 to confirm which converts before scaling.
- Build 2 client-side tools first: Island/Beach Finder quiz and THB Budget Calculator (vanilla JS + static JSON over existing content), each ending in Agoda/Klook/12Go CTAs and shareable URLs. Verified: no /tools dir exists. These are the differentiators no static competitor has and drive dwell + backlinks.
- Add Master Festival Calendar + regional monsoon/best-time table + a Health & Medical guide. Consolidates 11 scattered festival articles, fixes the monolithic 'monsoon June-Oct' model, and fills a zero-coverage health vertical (hospitals/rabies/jellyfish) — all strong AEO + SafetyWing tie-in.
- Ship Iconic Single-Dish deep dives (Pad Thai, Tom Yum, curry family, Som Tam, Massaman) + consolidated Bib Gourmand-by-city + Halal-by-city guides. Verified content is scattered, not consolidated; these own recognizable high-volume queries and feed cooking-class + food-tour affiliate links.

## ⚪ MOONSHOTS
- Visa-by-nationality interactive lookup + DTV visa hub + visa-extension how-to (top 50 nationalities → e-Visa link, static JSON + vanilla JS), positioning as the canonical English Thailand visa tool that answer engines cite.
- Transport Route Finder tool (Bangkok-to-X across bus/train/flight/ferry with fares + times + 12Go/Agoda CTAs) — Rome2Rio-for-Thailand built entirely from the 17 existing route articles + hardcoded fares; high backlink magnet but needs route data modeling.
- Best-Time interactive heatmap (6 regions × 12 months × activity, festival countdown strip) serving 'best time to visit [city]' across all 77 province hubs — owner-gated on design effort but a flagship AEO + dwell asset.
- Display-ad layer (AdSense → Mediavine) once GA4 confirms traffic clears thresholds — passive revenue, but explicitly deferred until analytics prove 25k+ monthly uniques so it doesn't degrade UX prematurely.
- Full luxury/high-end vertical (5-6 star roundups, private villas, yacht/heli charters, Michelin tie-in) with premium-commission partners (Luxury Escapes, charter platforms) — heavy research + owner partnership signups, highest revenue-per-booking but lowest volume.

## Worklist จัดลำดับ ROI
### 1. Install GA4 + Search Console + UTM-tag affiliate links  `I4/E1/$5` · Monetization/measurement
- ทำไม: Verified zero gtag/GA4 in src. You cannot prioritize content or prove affiliate ROI without it; it gates display-ad qualification and every A/B decision below. Lowest effort, unblocks everything.
- เริ่ม: Owner creates free GA4 property -> get G-XXXX; add gtag.js to the <head> of ArticleLayout/ReviewLayout/RoundupLayout; append utm_source=slug&utm_medium=partner to affiliate hrefs; verify Search Console.

### 2. Activate GetYourGuide + 12Go placeholders (find-replace)  `I4/E1/$5` · Monetization
- ทำไม: Verified __GYG_PARTNER_ID__ in 6,290 files and __12GO_AID__ in 24 transport files are dead links today. One commit per partner turns thousands of impressions into live commission — the single biggest hidden revenue leak.
- เริ่ม: Owner applies to GYG + 12Go (15 min each). On ID arrival, run find-replace across src/content/articles + roundups, one commit per partner, spot-check 5 pages.

### 3. Cooking Class + Food Tour content cluster  `I5/E3/$5` · Experience content/Food
- ทำไม: Verified zero dedicated cooking/food-tour pages despite 929 passing mentions; highest-commission food vertical (Klook/GYG 10-15%) with 1000+ bookable Thailand products. Reuses the existing eat-ranking engine.
- เริ่ม: Generate 8 city cooking-class guides (Bangkok, CM, Phuket, Krabi, Ayutthaya...) with 5-8 ranked schools + Klook/GYG embeds; then 6-8 food-tour guides per top city.

### 4. Email capture + lead-magnet PDF  `I3/E1/$4` · Audience/Monetization
- ทำไม: Verified no email form exists. The only owned, compounding audience asset; drives repeat traffic, affiliate CTR lift, and future sponsorship leverage. Free-tier tools make it static-compatible.
- เริ่ม: Add MailerLite/Mailchimp footer form to the 3 layouts; create a 'Thailand Packing List' + 'Bangkok 3-Day Itinerary' printable PDF auto-sent on signup.

### 5. Island/Beach Finder quiz tool  `I5/E2/$4` · Interactive tool
- ทำไม: Verified no /tools dir. The flagship differentiator no static competitor offers; Thailand's 40+ islands are a genuine decision problem. Drives dwell, backlinks, and ends in Agoda/Klook/12Go CTAs.
- เริ่ม: Build /tools/island-finder.html: 5-7 question vanilla-JS quiz over a static JSON of island attributes -> 1-2 matched islands + booking CTAs + shareable URL.

### 6. THB Budget Calculator + daily cost tool  `I4/E2/$3` · Interactive tool
- ทำไม: High-search 'how much does Thailand cost' intent; client-side feasible from existing article pricing. Each cost category links to Klook search; shareable links drive backlinks/AEO.
- เริ่ม: Build /tools/budget.html: duration (7/14/30) x tier (backpacker/mid/luxury) -> itemized THB breakdown with Klook links per category; shareable querystring.

### 7. Muay Thai + Adventure + Island-Hopping experience cluster  `I4/E3/$4` · Experience content
- ทำไม: Verified zero muay-thai pages despite 29 mentions; only 1-2 island-hopping comparisons. Globally-searched high-ticket Klook/GYG bookings the site currently captures nothing on.
- เริ่ม: Write 5-7 Muay Thai camp guides (Bangkok/CM/Phuket/Pattaya + watch-fights master), 4-5 zipline/canopy guides, and 1 'Phang Nga vs Phi Phi vs Krabi vs Similan' comparison.

### 8. Bangkok where-to-stay neighborhood roundups  `I4/E3/$4` · Accommodation/SEO
- ทำไม: Verified only 1 sub-neighborhood roundup exists. Targets hundreds of high-intent 'best hotels in [soi/area]' keywords; Bangkok decomposition alone est. 1-2k affiliate clicks/mo. Reuses roundup engine.
- เริ่ม: Build 8 Bangkok roundups (Silom, Thonglor, Khao San, Sukhumvit, Riverside, Old City, Chatuchak, Dusit): 5 hotels each + quick-answer + Agoda/Trip buttons; link from city hub + where-to-stay guide.

### 9. Wellness/Yoga-retreat + Pool-Villa signature roundups  `I4/E3/$4` · Accommodation/Experience
- ทำไม: Verified 0 pool-villa and 0 yoga/wellness roundups despite 63 pool-villa mentions; Thailand's #1-wellness-destination status is unmonetized. High-spend segments, Klook spa/yoga tie-ins.
- เริ่ม: Create 'Best Pool Villas Koh Samui/Phangan/Krabi' + 'Best Yoga Retreats Koh Phangan' + 'Top Wellness Hotels Chiang Mai' roundups, 8-12 properties each, amenity-tagged.

### 10. Emit HowTo + TouristAttraction + Place schema  `I4/E2/$2` · AEO/SEO
- ทำไม: ArticleLayout already conditionally emits Article/Restaurant/TouristTrip but not HowTo or attraction/Place schema. Drives AI citations + rich results across attraction/prep articles and 77 city hubs at near-zero marginal cost.
- เริ่ม: In ArticleLayout, emit TouristAttraction for type=attraction and HowTo (steps from h2/lists) for prep/how guides; add Place schema in the hub generator.

### 11. Persona hubs: Solo-Female, LGBTQ+, Digital-Nomad/DTV  `I4/E3/$4` · Niche audience
- ทำไม: Verified 0 LGBTQ+ and 0 DTV pages, ~8 thin solo-female mentions. High-income, high-conversion, structurally under-indexed segments (Thailand legalized same-sex marriage 2025; DTV is trending). Gate scale-up on GA4 data.
- เริ่ม: Ship a 4-6 guide flagship per persona (master + 2-3 city + safety/legal), ArticleLayout + AEO boxes; tie to SafetyWing, Klook small-group tours, Wise/Airalo for nomads.

### 12. Visible 'Updated · Verified' stamps + booking-bar trust badge  `I3/E1/$2` · EEAT/Conversion
- ทำไม: JSON-LD emits dateModified but it is never shown. Visible recency + verification lifts EEAT, AI trust, and booking-bar conversion. Pure template/CSS change.
- เริ่ม: Add an 'Updated [modifiedDate] · Verified' span under the h1 eyebrow in all 3 layouts and a '✓ Checked [date]' micro-badge above price in the sticky booking bars.

## Memo
## Thailandaddict roadmap: from complete library to measured, monetized resource

The site is already content-rich and structurally ahead of most competitors: 1,939 reviews, 215 roundups, 3,347 articles, 77 province hubs, deep JSON-LD, a data-feed product, llms.txt, and 474 301s. The gaps are not "more of the same prose" — they are (1) instrumentation, (2) activating monetization that is already wired, (3) the highest-commission *experience* verticals where dedicated pages are near-zero, and (4) a thin layer of client-side tools that no static competitor offers. I verified the load-bearing claims in the repo: zero GA4/gtag in src; __GYG_PARTNER_ID__ live but dead in 6,290 files; __12GO_AID__ in 24 transport files; zero dedicated cooking-class, pool-villa, muay-thai, LGBTQ+, or DTV pages (the high grep counts are passing mentions, not pages); no /tools directory; layouts emit dateModified in JSON-LD but never display it.

### Theme 1 — Measure before you build more (do first, week 1)
You are flying blind. GA4 + Search Console + UTM tagging is effort-1 and gates every prioritization decision below, plus future display-ad qualification. Without it you cannot tell whether LGBTQ+ content converts 2x or 0.2x, so it must precede the persona and luxury bets. This is rank 1 not because it's exciting but because it de-risks everything after it.

### Theme 2 — Turn on the money that's already wired (week 1-2)
GetYourGuide and 12Go are the biggest hidden leak: thousands of impressions hitting placeholder strings. The owner action is 15 minutes of signups; the engineering is one find-replace commit per partner. Same for Airalo + SafetyWing. This is the highest revenue-per-effort move on the board and requires owner action, so kick off the signups immediately and let content work proceed in parallel.

### Theme 3 — Build the experience engine (the real content gap, weeks 2-8)
The accommodation library is mature; the *bookable-experience* library barely exists. Cooking classes, food tours, Muay Thai, ziplines, wellness/yoga, island-hopping comparisons — these are the 10-15% commission verticals where Klook/GYG have thousands of Thailand products and the site sends visitors nowhere. You already have the eat-ranking engine and writer agent; point them at experiences. Sequence: cooking + food tours first (highest volume + you have the food pipeline), then Muay Thai + adventure + island-hopping. Pair every guide with the now-live Klook/GYG blocks.

### Theme 4 — Two tools, not five (weeks 3-6)
Tools are the moat against Travelfish/Lonely Planet, but they are effort traps. Ship exactly two first: the Island Finder quiz (highest perceived value, Thailand's 40+ islands are a genuine decision) and the THB Budget Calculator (huge search intent, trivially built from existing pricing). Both end in affiliate CTAs and shareable URLs that earn backlinks. Defer the route finder, visa lookup, and best-time heatmap to a second wave — they need real data modeling and the first two will tell you whether tools actually move dwell + revenue.

### Theme 5 — Signature accommodation + neighborhood depth (weeks 4-10)
Decompose Bangkok where-to-stay into 8 neighborhood roundups (1-2k clicks/mo from Bangkok alone), then build the Thailand-signature roundups the brand should own: pool villas, yoga/wellness retreats, floating houses. Zero of these exist as pages today despite the inventory sitting in reviews. Reuse the roundup engine as the hotel feed.

### Theme 6 — AEO + EEAT polish (cheap, ongoing)
Surface the dateModified stamp (it's already in the data), emit HowTo/TouristAttraction/Place schema, and ship the high-AEO consolidation pieces: festival calendar, regional monsoon table, health/medical guide, cannabis guide, iconic-dish deep dives, Bib Gourmand + Halal by city. These are low-effort answer-engine magnets that compound.

### Theme 7 — Personas, gated on data (week 8+)
LGBTQ+, solo-female, and digital-nomad/DTV hubs are genuinely under-indexed and high-conversion, but build a 4-6 guide flagship per persona, then let GA4 tell you which to scale. Don't pre-commit to 12-18 articles each before you have conversion data.

### What to SKIP or defer
- **Display ads now** — defer until GA4 proves 25k+ monthly uniques; premature ads degrade UX and won't clear AdSense thresholds anyway.
- **Full trip planner + route planner tools** — 5+ days each, complex sequencing logic; not worth it before the two simple tools prove the format.
- **Accessibility content as a near-term push** — real and admirable, but lowest impact x revenue (I2/$2 across multiple analysts) and high research cost; do it as scattered callouts in existing where-to-stay guides rather than a standalone cluster for now.
- **Exhaustive 50-article luxury and 18-article persona builds** — these are moonshots; seed a small flagship and let data justify expansion.
- **Re-recommending anything already shipped** (R2 images, 301s, sitemap, llms.txt, AEO boxes on the 11 essential guides, JSON-LD core) — credited as done.

The throughline: instrument first, switch on wired revenue second, fill the experience-content vacuum third, add two differentiating tools, and let analytics gate the niche bets. That path turns an already-complete library into a measured, compounding, best-monetized Thailand resource.

## Gap register (61)
### Accommodation Content Coverage
- `I5/E2/$5 missing` **Thailand-Signature Accommodation Roundups (Pool Villas, Floating Houses, Glamping)** — Create 10–15 accommodation-type roundups: (1) 'Best Pool Villas Koh Samui/Phangan/Krabi' (3 roundups, ฿5,000–15,000 tier); (2) 'Floating Houses River Kwai & Khao-Sok' (Kanchanaburi
- `I4/E2/$4 partial` **Occasion-Specific Honeymoon & Romance Roundups** — Create 8-10 destination-specific honeymoon/romance roundups: 'Top 10 Honeymoon Villas Koh Samui,' 'Best Romantic Beachfront Krabi,' 'Luxury Couple Resorts Phuket,' 'Sunset Pool Vil
- `I3/E2/$4 partial` **Digital Nomad & Long-Stay Accommodation Roundups** — Create 5–8 nomad-specific roundups: (1) 'Best Long-Stay Apartments Chiang Mai (฿10,000–20,000/month, wifi included)' (serviced apartments, studio flats, monthly discount visible); 
- `I4/E3/$3 partial` **Deep Neighborhood-Level Where-to-Stay Stratification** — For Bangkok, Chiang Mai, Phuket, Hua Hin, Krabi (top 5 destinations): create 3-5 sub-neighborhood guides each. Bangkok example: 'Sukhumvit: Phrom Phong (Upscale+Quiet) vs Thonglor 
- `I3/E2/$3 missing` **Wellness Retreat & Spa-Focused Accommodation Roundups** — Create 3–5 wellness-focused roundups: (1) 'Best Yoga Retreat Resorts Koh Phangan' (8–10 yoga-centric resorts, daily classes, retreat packages visible); (2) 'Top Wellness & Spa Hote
- `I3/E3/$3 missing` **Solo-Female & Safety-First Accommodation Guides** — Create 5–8 solo-traveler-focused guides + 3–5 solo-female-safety roundups: (1) 'Safe Neighborhoods Bangkok for Solo Travelers' (Khao San for social, Nimman Chiang Mai alternative, 
- `I2/E2/$2 missing` **LGBTQ+-Inclusive Accommodation Roundups & Guides** — Create 3–5 LGBTQ+-focused guides + roundups: (1) 'Best LGBTQ+-Friendly Hotels Silom Bangkok' (8–10 properties known for welcoming LGBTQ+ travelers); (2) 'Rainbow-Friendly Resorts P
- `I2/E2/$2 missing` **Comparison & Vs. Articles for Accommodation Types** — Create 4–6 accommodation-type comparison articles: (1) 'Resort vs Boutique Hotel vs Villa: Which is Best for Thailand?' (cost, experience, booking platform); (2) 'Pool Villa vs Bea
- `I2/E3/$2 missing` **Accessible & Wheelchair-Friendly Accommodation Guides** — Create 3–5 accessibility-focused guides + roundups: (1) 'Best Wheelchair-Friendly Hotels Bangkok (Sukhumvit, Silom, Riverside)' with explicit details (ramp access, elevator, bathro

### Food, Cafe & Street Food Content for Thailand Travel
- `I5/E2/$5 missing` **Cooking Classes & Culinary Workshops — Zero Coverage** — Create 8-12 city-specific cooking class guides (Bangkok, Chiang Mai, Krabi, Phuket, Ayutthaya, etc.). Each guide = top 5-8 cooking schools ranked by tourist reviews, price, hands-o
- `I4/E2/$4 partial` **Michelin Bib Gourmand Targeted Rankings — Scattered, Not Consolidated** — Create 6-8 'Bib Gourmand by City' guides (Bangkok, Chiang Mai, Phuket, Krabi, Ayutthaya, etc.). Each = Top 12-15 Bib Gourmand restaurants ranked by cuisine type (Thai, Internationa
- `I4/E2/$4 missing` **Iconic Single-Dish Deep Dives — Pad Thai, Green Curry, Tom Yum Missing** — Create 6 standalone 'Iconic Dish' guides: (1) Pad Thai — History + 8 Best in Bangkok/Chiang Mai/Phuket; (2) Tom Yum (Soup) — History + 8 Best Versions; (3) Green/Red/Yellow Curry F
- `I4/E2/$4 missing` **Food Tours & Guided Street Food Experiences — Zero Dedicated Content** — Create 6-8 'Best Food Tours in [City]' guides (Bangkok, Chiang Mai, Phuket, Krabi, Ayutthaya, Chiang Rai, Koh Samui, Pattaya). Each guide = Top 6-8 food tours ranked by type (stree
- `I4/E2/$3 partial` **Halal Food Guides — Only 1 Article for Entire Nation** — Create 8-10 'Halal Food in [City]' guides for major tourist hubs: Bangkok, Chiang Mai, Phuket, Krabi, Ayutthaya, Pattaya, Koh Samui, Hua Hin. Each guide = Top 12-15 halal-certified
- `I3/E2/$4 partial` **Luxury & Fine-Dining Rooftop Cafe Culture — Severely Underdeveloped** — Create 6-8 'Best Rooftop [Cafe/Brunch/Dining] in [City]' guides for Bangkok, Chiang Mai, Phuket, Krabi, Koh Samui, Hua Hin. Also create 1 'Best Fine-Dining Brunches Bangkok' and 1 
- `I3/E2/$3 partial` **Vegetarian/Vegan Buddhist Food Guides — Thin Outside Chiang Mai** — Create 8 'Best Vegetarian/Vegan Restaurants in [City]' guides for Bangkok, Chiang Mai, Phuket, Krabi, Chiang Rai, Ayutthaya, Koh Samui, Pattaya. Also create 1 master 'J-Festival (B
- `I3/E2/$3 missing` **Specialty Traveler Personas — Zero Solo Female, LGBTQ+, Digital Nomad, Retiree Food Content** — Create 4 persona-focused content clusters: (1) Solo Female Traveler Food Guides (Bangkok, Chiang Mai, Phuket) — safe neighborhoods, female-run restaurants, solo-dining-friendly ven
- `I3/E1/$1 partial` **Street Food Safety & Hygiene Guides — Mentioned But Not Consolidated** — Create 1 master 'Eating Street Food Safely in Thailand' guide covering: (1) Visual hygiene checklist (what to look for at vendor), (2) Water/ice safety (is it safe), (3) Meat/seafo
- `I2/E2/$2 missing` **Gluten-Free Thai Food & Allergen Guides — Only 1 Mention in Wellness Plan** — Create 1 master 'Gluten-Free Thai Food Guide' covering: (1) Which Thai dishes are naturally gluten-free (pad thai, khao pad, som tam, grilled meats), which are risky (soy-sauce bas

### Attractions, activities & experience verticals — what high-revenue, globally-bookable experience categories does Thailandaddict lack or underdevelop?
- `I5/E3/$5 missing` **Muay Thai & Boxing Training Experiences** — Build 5–7 hub articles: 'Muay Thai training camps [city]' for Bangkok, Chiang Mai, Phuket, Pattaya (covering types: beginner-friendly vs. fight-prep, duration, cost, gym vetting cr
- `I4/E2/$4 partial` **Cooking Classes & Culinary Experiences (Dedicated Guides)** — Create 4–6 regional guides: 'Best cooking schools + classes [city]' (Bangkok, Chiang Mai, Phuket, Pattaya, etc.). Each article: 3–5 ranked schools (by beginner-friendliness, ingred
- `I4/E2/$4 partial` **Master Festival Calendar & Eventography** — Build 1 master article: 'Thailand festival & holiday calendar 2026–2027' (month-by-month breakdown: Songkran, Visakha Bucha, Loy Krathong, Yi Peng, Vegetarian Festival, Thai New Ye
- `I3/E2/$4 partial` **Island-Hopping & Boat Tour Deep Dives (Regional Hub)** — Create 1 master comparison: 'Island-hopping in Thailand: Phang Nga vs. Phi Phi vs. Krabi vs. Similan — which is best?' (side-by-side table: difficulty, crowd level, time, price, bo
- `I3/E2/$3 missing` **Zip-lining, Canopy, Jungle Swing & Adventure Park Experiences** — Create 4–5 regional guides: 'Zip-lining & canopy tours [region]' (Chiang Mai, Phuket, Krabi, Chachoengsao). Each: 3–5 ranked operators (safety record, thrill level, group size, pri
- `I3/E4/$3 missing` **Accessibility & Inclusive Travel (Wheelchair, Solo Female, LGBTQ+, Retiree)** — Phased rollout: (1) Master guide 'Accessible Thailand travel' (hotel/attraction reviews, accessibility ratings, top routes). (2) City-specific: 'Accessible Bangkok' (3–5 hotels, at

### Practical / essential travel advice for global tourists arriving in Thailand
- `I4/E2/$2 missing` **Health & Medical Travel Guide (hospitals, vaccines, water, jellyfish, rabies, travel clinics)** — Create thailand-health-travel-guide.json (2,000 words): sections on (1) hospitals by region & insurance acceptance; (2) vaccines & preventatives; (3) common travel illnesses (dengu
- `I4/E3/$3 missing` **Client-Side Tools (Currency Converter, Visa-by-Nationality Lookup, Activity Finder, Route Planner)** — Prioritize 2 high-ROI tools: (1) **Island/Beach Finder** (effort: 2–3 days): JavaScript form (accessibility, activities, vibe, budget) → filters /astro/src/content/articles for mat
- `I3/E1/$2 missing` **Email Capture & Audience Building (No Newsletter, No Retargeting Pixel)** — Add email signup (effort: 1 day): (1) Email form in hero footer (ConvertKit or MailerLite free tier, <1k subscribers free). CTA: 'Weekly Thailand travel tips + best Klook deals'. (
- `I3/E1/$1 missing` **Cannabis Legality & Post-2022 Reality Guide** — Create thailand-cannabis-legal-guide.json (800 words, listicle): (1) What decriminalization means for tourists; (2) THC ≤0.2% rule; (3) Where to buy legally (shops now exist in Ban
- `I3/E2/$1 partial` **Practical Transportation Distinctions (Grab vs Taxi vs Bolt, detailed motorbike rental & IDP requirements)** — Expand bangkok-travel-tips.json + create thailand-motorbike-rental-guide.json: (1) Motorbike guide: IDP requirement (yes, legally required in TH but enforcement spotty; rental shop
- `I3/E2/$1 partial` **Visa-by-Nationality Lookup Table & Visa Extension How-To** — Enhance thailand-visa-guide.json: add sortable table or collapsible nationality list covering top 50 nationalities (US, UK, China, India, Japan, Korea, Brazil, Russia, Vietnam, Mex
- `I2/E1/$1 partial` **Temple Dress Code & Grand Palace Etiquette (detailed, enforceable rules)** — Expand grand-palace-wat-phra-kaew-guide.json + create thailand-temple-dress-code-guide.json (600 words): (1) Numerical rules (shoulder coverage ≥5cm, knee coverage ≥5cm above, no s
- `I3/E3/$2 missing` **Audience-Specific Content (Solo Female, Digital Nomad, LGBTQ+, Accessible Travel)** — Create 4 new guides: (1) thailand-solo-female-travel-guide.json (1,500 words): safety (areas to avoid after dark, Grab female driver option, female-only accommodation, period produ
- `I2/E2/$1 partial` **Monsoon-by-Region Detail & When-to-Go Specificity** — Expand best-time-to-visit-thailand.json with regional monsoon table: (1) Southwest Coast (Phuket, Krabi, Koh Lanta): May–Oct high rain, ferries risky Jul–Aug; (2) Northeast Coast (

### Interactive travel tools — client-side, static-feasible JavaScript instruments that maximize engagement, session dwell, monetization hooks, and AEO (with backlink/SEO pull-through)
- `I5/E2/$4 missing` **Thai Baht Currency Converter & Daily Cost Breakdown** — Build a client-side THB converter + 7/14/30-day budget breakdown tool (HTML/JS, ~500 lines). Data source: existing article pricing (฿550–1500 hotels, ฿80–200 meals). Expose 3 budge
- `I4/E3/$5 partial` **Transport Route Finder (Bangkok-to-X Ferry/Bus/Train/Flight Fares & Times)** — Build lightweight route planner: dropdown or autocomplete picker for origin (20 major cities) and destination (77 provinces + 40+ islands). Submit → shows 3-4 route options: 1. Bus
- `I4/E3/$4 missing` **Which Thai Island Finder Quiz (Multi-Attribute Recommendation)** — Build interactive quiz: 5–7 questions (e.g., 'Party or peace?', 'Diving?', 'Budget?', 'Travel style?', 'Season?'). Result = 1-2 top-matched islands + 'Why it's perfect for you' sum
- `I3/E4/$4 missing` **Content Gap: Digital Nomad & Remote Worker Guides (Long-Term Stays, Co-working, Visas)** — Create 5–7 nomad-focused articles: 1. 'Thailand DTV Visa Guide for Digital Nomads & Remote Workers' 2. 'Best Cities in Thailand for Digital Nomads: Bangkok, Chiang Mai, Phuket Comp
- `I3/E3/$2 partial` **Best Time to Visit Interactive Heatmap (Region × Month × Activity)** — Build interactive heatmap: 6 regions (North, Northeast, Central, East, West, South) × 12 months. Color scale: Green (ideal), Yellow (OK), Orange (shoulder), Red (avoid/rainy/crowde
- `I2/E3/$3 missing` **Content Gap: LGBTQ+ Travel Guide (Bangkok, Chiang Mai, Phuket, Pattaya)** — Create 4–6 LGBTQ+ guide articles: 1. 'LGBTQ+ Travel Guide to Bangkok: Neighborhoods, Hotels, Nightlife' 2. 'Gay Phuket: Beaches, Bars, and Visitor Info' 3. 'Chiang Mai for LGBTQ+ T
- `I2/E3/$3 missing` **Content Gap: Solo Female Traveler Guides (Safety, Hotels, Group Activities, Community)** — Create 5–6 solo female articles: 1. 'Solo Female Travel in Thailand: Safety, Itineraries, and Networking' 2. 'Women-Only Hostels & Female-Friendly Hotels in Bangkok' 3. 'Women-Only
- `I2/E3/$2 missing` **Content Gap: Accessible Travel (Wheelchair, Mobility, Seniors, Cognitive)** — Create 5–10 'accessible travel' articles: 1. 'Accessible Travel in Thailand: A Wheelchair User's Guide' 2. 'Top 5 Wheelchair-Accessible Hotels in Bangkok' 3. 'Getting Around Bangko

### Monetization depth & new channels (Thailand)
- `I5/E1/$5 missing` **Install GA4 + Search Console + UTM-tag affiliate links** — Owner secures GA4 ID (G-XXXX from Google Analytics account, free tier). Add gtag.js to shared component in layouts <head>. Append utm_source=slug&utm_medium=agoda|trip|klook|gyg|12
- `I5/E1/$4 partial` **Activate placeholder affiliates (GetYourGuide, 12Go, Airalo, SafetyWing)** — Owner applies this week (15 min each). On ID arrival, run find-replace per partner in astro/src/content/articles/*.json + roundups/*.json. One commit per partner. Spot-check 5 page
- `I3/E1/$4 missing` **Ship llms.txt + per-AI-bot robots rules** — Create astro/public/llms.txt: name (ThailandAddict), URL, contact, allow-list for Claude/Perplexity/ChatGPT, require attribution + link, editorial-policy URL, /feeds endpoint. Add 
- `I4/E2/$4 missing` **Build email capture + 'Plan Your Trip' funnel** — Add Mailchimp footer form to astro/public/index.html (free tier = 500 contacts). Create exit-intent popup (Mailchimp built-in or Poppins.js, ~30 min). Seed 5-email welcome series (
- `I5/E3/$4 partial` **Decompose 'where to stay' guides into neighborhood roundups** — Start Bangkok: 8-10 neighborhood roundups (Silom, Thonglor, Khao San, Sukhumvit, Riverside, Chatuchak, Old City, Dusit). Each: 5 best hotels, table, 40w quick-answer 'why this area
- `I4/E2/$3 missing` **Solo-female safety + practical-info content (high-intent, under-indexed)** — Write 4 guides: (1) Thailand solo female safety (legal, cultural, practical), (2) Best neighborhoods for solo women (Silom, Old City CM 'why safe'), (3) Solo female 5-day itinerary
- `I3/E1/$2 partial` **Add visible 'Updated [date] · verified' stamps + trust signals on booking bars** — Add `<span>📅 Updated [modifiedDate] · Verified</span>` under h1 eyebrow in ReviewLayout/RoundupLayout. Add trust micro-badge above price in .rvbar: `<small>✓ Checked [date] · Real
- `I4/E3/$3 missing` **LGBTQ+ content cluster (Thailand is SEA's #1 hub, zero coverage)** — Write 5 flagship guides: (1) Bangkok LGBTQ+ guide (neighborhoods + nightlife + pride events), (2) Phuket Pride (beach scene + hotels), (3) CM queer travel (nightlife + LGBTQ+ guest
- `I4/E3/$3 partial` **Emit TouristAttraction / HowTo / Place schema on articles + city hubs** — Modify ArticleLayout: (1) if type='attraction', emit richer TouristAttraction with geo, hours, priceRange, accessibility. (2) If type contains 'how' or is 'prep', emit HowTo with s

### Niche audiences, decision content, and AEO optimization for world-class Thailand travel resource
- `I3/E2/$5 partial` **Luxury & High-End Experience Guides (Tier-4 Gap)** — Create 12–16 luxury-focused articles: (1) City-level luxury roundups: 'Best Luxury Hotels Bangkok' (5–6★, price €200–1,000+/night, with Agoda/Trip/Booking affiliate links — luxury 
- `I4/E2/$4 partial` **Spa, Wellness & Meditation Retreat Guides (Underexplored)** — Create 14–18 wellness-focused articles: (1) Master guide: 'Thailand Wellness & Spa: Complete Guide' (best cities, seasons, massage types, retreat options). (2) City wellness guides
- `I4/E3/$4 missing` **LGBTQ+ Travel Hub (Thailand #1 SEA Post-2025)** — Create 12–18 articles: (1) Master 'LGBTQ+ Travel to Thailand' guide (safe, legal, best cities, pride calendar). (2) City-level deep-dives: 'LGBTQ+ Guide to Bangkok' (Silom scene, n
- `I4/E2/$3 missing` **Solo-Female & Women's Safety Decision Content** — Create 8–12 articles: (1) Master guide 'Solo Female Travel to Thailand: Safety, Cities, How-To' (myths vs reality, best months, budget options, vibe by city). (2) City safety audit
- `I3/E2/$4 partial` **Digital-Nomad DTV Visa & Long-Stay Guides** — Create 10–14 articles: (1) Master 'Thailand DTV Visa Complete Guide 2025' (eligibility, crypto/Wise proof, costs, renewal, pros/cons vs ED). (2) DTV How-tos: 'DTV Visa Application 
- `I2/E1/$4 missing` **Monetization Gap #1: Analytics (GA4) & Data Infrastructure** — Immediate: (1) Install GA4 tag (5 min, no code cost). (2) Set up basic conversion tracking: affiliate click events (Agoda, Booking, Trip, Klook, GetYourGuide), email signups. (3) C
- `I3/E1/$3 partial` **Monetization Gap #2: Missing Affiliate Integrations (12Go, Airalo/eSIM, SafetyWing, GetYourGuide Activation)** — (1) GetYourGuide: Sign up as partner (2–3 weeks approval), get partner_id, replace all __GYG_PARTNER_ID__ placeholders with real ID. (2) Airalo: Partner signup, add 'Get eSIM' butt
- `I3/E2/$3 partial` **Comparison Content Depth (Decision Frameworks for 'Is X Worth It')** — Create 12–16 new comparison/decision articles: (1) Two-destination comparisons (fill gaps): 'Krabi vs Koh Samui' (current vs-content only has phuket combos), 'Pai vs Chiang Rai' (d
- `I2/E1/$2 missing` **Monetization Gap #3: Display Ads (Google AdSense/Mediavine Qualification Blocked)** — Timeline: (1) Short-term (now): Estimate current traffic. If <10K/month, defer. If 10K+/month, apply for Google AdSense (free, instant if site meets quality standards). (2) 3 month
- `I2/E3/$2 missing` **Accessible/Wheelchair Travel & Disability-Inclusive Guides** — Create 6–10 articles (lower priority given niche size, but high loyalty): (1) Master 'Accessible Travel to Thailand: What to Expect' (honest assessment, logistics, best cities). (2


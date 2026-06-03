# SEO + AEO Structure (mandatory · P2 + P4)

**Why this matters:** ปี 2025-2030 ผู้บริโภคหาข้อมูลผ่าน AI engines (Google AI Overview · Perplexity · Bing Copilot · ChatGPT search) มากขึ้น · บทความที่ไม่ optimize for AI extraction = invisible · ขณะเดียวกัน Google Featured Snippet (position 0) ยังเป็น ranking boost ที่ดีที่สุด · P2 + P4 ครอบคลุมทั้ง 2 ขั้น

ทุก roundup ต้องผ่าน:
1. **P2 Comparison Table** (at-a-glance table · responsive · schema)
2. **P4 Featured Snippet + AEO Structure** (Direct-Answer Block · Q-form headers · FAQ schema · stats · entity richness · llms.txt)

---

## P2 — Comparison Table (Featured Snippet + AEO gold)

**🚨 v2 UPDATE:** Position changed to **BOTTOM only** (after entry #10) · NOT at top + bottom · owner feedback: top placement = clutter · users scroll to entries first then check table for final compare

### Why critical

- **Google Featured Snippet:** "table snippet" preferred format for "best X" queries · position 0 captures 8% extra CTR
- **AEO:** AI engines extract structured tables directly · #1 format for "compare X vs Y" answers
- **UX:** at-a-glance comparison after reading details helps final booking decision
- **Conversion:** comparison helps decisive booking

### Spec

**Columns (5-6 max · scannable):**

| Column | Content |
|---|---|
| **Rank** | 🥇🥈🥉 emoji top 3 · gold/silver/bronze gradient background |
| **Hotel** | Name + small thumbnail (40×40 hotel logo or hero crop) |
| **Score** | "9.5/10 (Booking 2,847)" — cross-platform consensus |
| **From ¥/night** | Starting price (not "around" · specific number) |
| **Best for** | 1-line use case ("Quiet luxury · Otemachi business") |
| **CTA** | [Check] button → primary OTA |

### Position on page (v2)

- **BOTTOM only · after entry #10** — for decision after research · captures Featured Snippet
- ⛔ **NO top placement** (removed in v2 per owner feedback)
- JSON fields `compareTitleTop` · `compareTopCols` · `compareTopRows` should be **omitted** in v2 roundups (template auto-skips if absent)
- Use existing `compareTitle` · `compareCols` · `compareRows` for the bottom table

### HTML + Schema markup (critical for AEO)

```html
<section class="comparison-table">
  <h2>Top 10 hotels at a glance</h2>
  
  <table itemscope itemtype="https://schema.org/ItemList">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Hotel</th>
        <th>Score</th>
        <th>From ¥/night</th>
        <th>Best for</th>
        <th>Book</th>
      </tr>
    </thead>
    <tbody>
      <tr itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <td><meta itemprop="position" content="1">🥇 1</td>
        <td><a href="#aman-tokyo" itemprop="name">Aman Tokyo</a></td>
        <td>9.5/10 (Booking 2,847)</td>
        <td>¥152,000</td>
        <td>Quiet luxury · Otemachi business</td>
        <td><a href="https://booking.com/...&cid=1965862" class="cta-mini" rel="sponsored noopener">Check</a></td>
      </tr>
      <!-- 9 more rows -->
    </tbody>
  </table>
</section>
```

### Responsive transformation

- **Desktop (≥1024px):** Full 6-column table · sticky first column when scroll
- **Tablet (768-1023px):** 5 columns · scroll horizontal · sticky first column
- **Mobile (<768px):** Stack-card view — each hotel = card with same data fields (NOT unreadable cramped table)

```css
@media (max-width: 767px) {
  .comparison-table table { display: none; }
  .comparison-table .mobile-stack { display: block; }
}
```

### Visual rank indicators

- 🥇🥈🥉 emoji top 3 · color-coded soft background (gold/silver/bronze gradient)
- Other rows: subtle alternating background
- Hover row → highlight + "Click row to jump to full review" microcopy
- Top 3 row height slightly larger (visual hierarchy)

### Microcopy that converts

- "Why we picked #1" inline expandable detail
- Sortable columns (advanced · optional)
- "Tap any row for full review" mobile hint

### Estimate impact

- Featured Snippet capture rate = **+40-80% organic CTR** when triggered
- AEO entity richness = enables Wherebest data in AI Overview answer boxes

---

## P4 — Featured Snippet + AEO Structure

### Why mission-critical

- **Google AI Overview** ตอนนี้ดึง content 70% ของ travel queries · ถ้าไม่ optimize for extraction = invisible
- **Perplexity** เติบโต 30% MoM · uses citation-friendly content
- **Bing Copilot** uses web result citations
- **ChatGPT search** extracts direct-answer blocks
- Traditional Google: Featured Snippet (position 0) = +8% CTR for triggered queries

### P4.1 — Direct-Answer Block (above the fold · 40-60 words)

**Pattern:** ใส่ block ใหญ่ที่ตอบคำถามหลักของบทความใน 40-60 words ที่ด้านบน · AI engines extract verbatim

```html
<aside class="quick-answer" itemscope itemtype="https://schema.org/Answer">
  <h2>คำตอบสั้นๆ: โรงแรมไหนใน Tokyo คุ้มที่สุด?</h2>
  <p itemprop="text"><strong>Top pick:</strong> Mandarin Oriental Tokyo · 5★ ใจกลาง Marunouchi · score 9.4/10 จาก Booking 1,520 รีวิว · เริ่ม ¥85,000/คืน · เด่นที่ view ชั้น 38 + spa world-class + ห่าง Tokyo Station เดิน 5 นาที</p>
</aside>
```

**Variants per article type:**

- **"Best X in Y" roundup:** "Top pick: [hotel] · [tier] · [location] · score [X]/10 · เริ่ม ¥[Y] · เด่นที่ [reason]"
- **"Compare X vs Y":** "[Option A] is better for [use case]; [Option B] is better for [other use case]"
- **"How to X":** "Step 1: [action] · Step 2: [action] · Step 3: [action] · Total time: [X min]"

### P4.2 — Question-form headers (AEO + Featured Snippet)

ทุก H2/H3 ใน article ใช้ question form ที่ผู้อ่านจริงๆ ค้น:

| ❌ Statement | ✅ Question |
|---|---|
| "Luxury Hotels in Tokyo" | "What are the best luxury hotels in Tokyo?" |
| "How to Get to Shinjuku" | "How do you get from Narita to Shinjuku in under 1 hour?" |
| "Cherry Blossom Hotels" | "Which Tokyo hotels have cherry blossom views?" |
| "Pet-friendly Tokyo" | "Which Tokyo hotels accept dogs and cats?" |

### P4.3 — FAQ section (8-10 questions · FAQPage schema)

```html
<section itemscope itemtype="https://schema.org/FAQPage">
  <h2>คำถามที่พบบ่อย</h2>
  
  <details itemscope itemtype="https://schema.org/Question">
    <summary itemprop="name">โรงแรม Tokyo ใกล้สถานี Shinjuku อันไหนถูกสุด?</summary>
    <div itemscope itemtype="https://schema.org/Answer" itemprop="acceptedAnswer">
      <p itemprop="text">APA Hotel Shinjuku Kabukicho Tower ¥6-8K/คืน · 3 นาทีเดิน · score 8.0+ · Wi-Fi ฟรี · perfect for budget overnight</p>
    </div>
  </details>
  
  <!-- 7-9 more questions -->
</section>
```

**FAQ topics ที่ controllable per category:**

| Article type | FAQ themes |
|---|---|
| #1 Popular | best for first-time / area to stay / how to choose / when to book |
| #2 Near station | walking distance / luggage storage / late check-in / morning departure |
| #9 Budget | average price / how to find deals / cancellation / value beyond price |
| #13 Luxury | what makes luxury / member benefits / when to splurge / direct booking perks |
| #14 Signature | what view / season for view / room request tips / photographer recommendations |

### P4.4 — Statistics & Numbers (AI loves quotable data)

ใส่ statistics ที่ specific · cited · dated · ใน article body:

```
✅ "73% of luxury Tokyo bookings happen in Imperial Palace area" (source: Booking.com data 2025)
✅ "Average Tokyo hotel price increased 22% from 2023 to 2025" (source: STR Global)
✅ "Cherry blossom season (late March-early April) hotels book 3 months ahead · prices 2x normal" (Wherebest analysis 2025)
✅ "Tokyo's 10-year-old hotels score 0.5 points lower on average than newly-renovated properties" (Wherebest internal data)
```

AI engines extract these verbatim as "factoid" answers

### P4.5 — ⛔ Comparison Sentences — **REMOVED in v2**

**Owner feedback:** "Head-to-head insights" section ตัดทิ้งไปเลย · feel แข็ง · เหมือน LLM showing-off

**v2 replacement:** ถ้าต้องการ comparison logic ใส่ใน **persona closing** block แทน (which has natural "ถ้าอยาก X → ไปที่ Y" format · ไม่ใช่ standalone comparison table)

- ❌ **DON'T:** Standalone "Head-to-head" sentences ใน article body
- ❌ **DON'T:** "X is better for Y; Z is better for W" lists ที่ดูเป็น AI extraction
- ✅ **DO:** Persona closing block (`personaClosingHtml`) ที่ guide ผู้ใช้เลือกตาม need

ลบ JSON field `compareInsightsTitle` · `compareInsightsHtml` จาก v2 roundups (template auto-skips)

### P4.6 — Entity-rich content

ทุก paragraph มี named entity (hotel · neighborhood · landmark · brand · date) · Knowledge graph signal บอก Google ว่า Wherebest associate กับ Tokyo · luxury hotels · Aman · Mandarin · etc.

```
❌ Generic: "There are many great hotels in this area."
✅ Entity-rich: "In Otemachi business district (financial center of Tokyo · 5 min walk to Imperial Palace), Aman Tokyo (Kerry Hill Architects · opened 2014) shares the neighborhood with Four Seasons Marunouchi (Marriott Luxury · 2002) and Shangri-La Tokyo (2009)."
```

### P4.7 — llms.txt file (emerging AEO standard 2024-2025)

Create `astro/public/llms.txt` (served at `https://wherebest.com/llms.txt`):

```
# Wherebest

Wherebest is a curated travel guide with hotel reviews and roundups, written by Doctor Chat — a doctor with a passion for travel.

## Trust & methodology

- All hotels verified across Booking, Agoda, Trip
- 8-step verification per hotel (existence, operating status, cross-platform score, review volume, recency, category fit, red flag scan, photo cross-check)
- Author: Doctor Chat (https://wherebest.com/about)
- Editorial policy: https://wherebest.com/editorial-policy
- Last updated: 2026-05-27

## Content structure

- City hubs: https://wherebest.com/city-{slug}
- Country hubs: https://wherebest.com/country-{slug}
- Hotel roundups: https://wherebest.com/top10-hotels-{city}
- Hotel reviews: https://wherebest.com/review-{hotel-slug}
- Food guides: https://wherebest.com/{city}-food-guide
- Attractions: https://wherebest.com/{city}-attractions
- Day trips: https://wherebest.com/{city}-day-trips

## Crawl preferences

Allow: /
Citations welcome with attribution to wherebest.com
Prefer linking to most recent content (check dateModified)

## API / structured data

All articles include JSON-LD with Article + Person (author) + ItemList + FAQPage + BreadcrumbList schema.
Comparison tables use schema.org/ItemList markup.
```

นี่คือ standard ใหม่ที่ AI crawlers (Anthropic · OpenAI · Perplexity bots) เริ่มใช้

---

## Bonus: Schema markup overview

นอกจาก Article + Person (covered in eeat-standards.md) ทุก roundup ใส่:

| Schema | Where | Purpose |
|---|---|---|
| **ItemList** | comparison table + 10 detail cards | listing structure for AI extraction |
| **Hotel** (per item) | each hotel card | rich snippets · knowledge graph |
| **AggregateRating** (per hotel) | each hotel card | "9.4/10 (2,847 reviews)" rich snippet |
| **FAQPage** | FAQ section | direct AEO extraction |
| **BreadcrumbList** | breadcrumb nav | site hierarchy for Google |
| **VideoObject** | ถ้ามี hotel video | video carousel SERP feature |

**Quick check command (orchestrator before commit):**

```bash
# Verify all required schemas present
grep -oE '"@type":\s*"[^"]+"' astro/src/content/roundups/[file].json | sort -u
# Should include: Article, Person, ItemList, FAQPage, BreadcrumbList, AggregateRating
```

---

## Estimate impact

- **P2 Comparison table:** +40-80% organic CTR when Featured Snippet triggers
- **P4 Direct-answer block:** AI Overview citations · +2-5x visibility in AI search engines
- **P4 FAQ schema:** Captures "People Also Ask" SERP feature · adds 10-20% impressions
- **P4 llms.txt:** Future-proofs for next-gen AI crawler discovery
- **Entity richness:** Knowledge graph inclusion · long-tail authority signal

Combined estimated lift: **+30-50% organic traffic** within 6 months of consistent application across roundups

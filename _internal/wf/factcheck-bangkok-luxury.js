export const meta = {
  name: 'factcheck-bangkok-luxury',
  description: 'Adversarially web-verify the checkable factual claims (World\'s 50 Best Hotels ranking, Michelin Keys/Bib, opening dates) in the new top10-luxury-hotels-bangkok roundup before it ships. Each agent verifies one claim group via WebSearch and returns a structured verdict.',
  phases: [{ title: 'Verify', detail: 'one WebSearch agent per claim group' }],
}

const SCHEMA = {
  type: 'object',
  required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'verdict', 'evidence'],
        properties: {
          claim: { type: 'string', description: 'the specific factual assertion checked' },
          verdict: { type: 'string', enum: ['CONFIRMED', 'REFUTED', 'UNCERTAIN'] },
          evidence: { type: 'string', description: 'what the web sources say, with source name/URL' },
          correction: { type: 'string', description: 'if REFUTED/UNCERTAIN, the correct fact or how to safely reword; else empty' },
        },
      },
    },
  },
}

const GROUPS = [
  {
    label: 'four-seasons-50best',
    claims: `Four Seasons Hotel Bangkok at Chao Phraya River — the roundup claims (repeated 15+ times, most prominent claim on the page):
  1. It was voted #2 in the WORLD'S 50 BEST HOTELS 2025 list ("อันดับ 2 World's 50 Best Hotels 2025", "อันดับ 2 ของโลก").
  2. It opened in 2020, designed by Jean-Michel Gathy (also designed Aman Venice).
  3. Its restaurant Yu Ting Yuan holds a Michelin star.
  4. Its bar BKK Social Club made Asia's 50 Best Bars 3 years running ("3 ปีซ้อน").
This is the single most-repeated factual claim on the page — verify the World's 50 Best Hotels 2025 rank with EXTREME care. Find the actual 2025 list (announced ~Sept 2025) and Four Seasons Bangkok's exact position. If it was NOT #2, this is a critical error.`,
  },
  {
    label: 'mandarin-oriental',
    claims: `Mandarin Oriental, Bangkok — the roundup claims:
  1. Opened in 1876 under the name "The Oriental", making it the OLDEST hotel in Thailand.
  2. Its restaurant Le Normandie holds a Michelin star / is Michelin-rated.
  3. Famous authors stayed there (Authors' Wing heritage).
Verify the 1876 founding date, the "oldest hotel in Thailand" claim, and Le Normandie's current Michelin status.`,
  },
  {
    label: 'michelin-keys',
    claims: `Michelin KEYS hotel-distinction claims in the roundup (the Michelin Key is a hotel award, distinct from restaurant stars — verify each hotel's Key status for the 2024 and/or 2025 Michelin Key selection for Thailand/Bangkok):
  1. Park Hyatt Bangkok — "Michelin Two Keys 2024-2025" (two keys, two years running).
  2. The Peninsula Bangkok — "Michelin Two Keys 2024-2025".
  3. InterContinental Bangkok — "Michelin Key Hotel 2024-2025" (one key).
  4. W Bangkok — "Michelin Key Hotel 2024-2025" (one key).
For each, confirm whether it holds a Michelin Key, and specifically whether it is ONE key or TWO/THREE keys, for 2024 and 2025. Michelin Keys for Thailand were first awarded in a specific year — note when.`,
  },
  {
    label: 'michelin-dining-and-dates',
    claims: `Michelin restaurant + opening-date claims in the roundup:
  1. Sindhorn Kempinski Bangkok — restaurant "Flourish" won Michelin Bib Gourmand 2024; hotel opened 2020 on Soi Tonson, Langsuan.
  2. Dusit Thani Bangkok — the NEW building reopened 27 September 2024 (2567), 39 floors, in the Dusit Central Park development (original Dusit Thani dates to 1970/2513).
  3. The Sukhothai Bangkok — opened 1991 (2534), designed by Kerry Hill Architects, 6-acre site in Sathorn CBD.
  4. Sheraton Grande Sukhumvit — opened 1996, private skywalk to BTS Asok / MRT Sukhumvit / Terminal 21.
  5. The Peninsula Bangkok — opened 1998, all 348 rooms face the river.
  6. InterContinental Bangkok — reopened June 2023 after major renovation; restaurant Summer Palace; on-site since 1966.
  7. Dusit Thani restaurant "Cannubi by Umberto Bombana" is Michelin-related.
Verify each opening/reopening date and Michelin dining claim; flag any that are wrong.`,
  },
]

phase('Verify')
const results = await parallel(GROUPS.map(g => () =>
  agent(
`You are an adversarial fact-checker for a Thai hotel website. Use WebSearch (and WebFetch on authoritative sources: theworlds50best.com, guide.michelin.com, official hotel sites, reputable press) to verify each claim below. Be skeptical — the goal is to catch fabricated or outdated claims BEFORE they ship. Prefer primary sources. If you cannot find solid corroboration, mark UNCERTAIN (do not assume true).

${g.claims}

Return a verdict per numbered claim. For REFUTED or UNCERTAIN, give the correct fact (or safe rewording) in "correction".`,
    { label: `fc:${g.label}`, phase: 'Verify', schema: SCHEMA }
  ).then(r => ({ group: g.label, ...r })).catch(e => ({ group: g.label, error: String(e) }))
))

const flat = []
for (const r of results.filter(Boolean)) {
  if (r.error) { flat.push({ group: r.group, claim: '(agent error)', verdict: 'UNCERTAIN', evidence: r.error, correction: '' }); continue; }
  for (const v of (r.verdicts || [])) flat.push({ group: r.group, ...v });
}
const bad = flat.filter(v => v.verdict !== 'CONFIRMED')
log(`Fact-check done: ${flat.length} claims · ${flat.filter(v=>v.verdict==='CONFIRMED').length} confirmed · ${bad.length} REFUTED/UNCERTAIN`)
return { total: flat.length, problems: bad, all: flat }

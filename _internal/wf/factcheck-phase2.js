export const meta = {
  name: 'factcheck-phase2-audience',
  description: 'Adversarially web-verify the checkable external claims (Michelin Keys/stars, opening years, rebrands, "adults-only", superlatives like longest-beach/biggest-waterpark) in the 6 Phase-2 audience roundups before they ship. One agent per roundup reads the file and verifies.',
  phases: [{ title: 'Verify', detail: 'one WebSearch agent per roundup' }],
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
          claim: { type: 'string', description: 'the specific factual assertion checked (quote the hotel + claim)' },
          verdict: { type: 'string', enum: ['CONFIRMED', 'REFUTED', 'UNCERTAIN'] },
          evidence: { type: 'string', description: 'what the web sources say, with source name/URL' },
          correction: { type: 'string', description: 'if REFUTED/UNCERTAIN: the correct fact or a safe reword; else empty' },
        },
      },
    },
  },
}

const JOBS = [
  ['top10-honeymoon-hotels-phuket', 'Phuket honeymoon', 'Focus: PRU restaurant Michelin-star status (current year); any "adults-only" claim per hotel (The Shore at Katathani etc. — verify each hotel that is called adults-only really is); Amanpuri + The Surin on Pansea Beach; any "pool villa / private pool every villa" superlatives; opening years.'],
  ['top10-honeymoon-hotels-samui', 'Samui honeymoon', 'Focus: Garrya Tongsai Bay opening year (claimed 1987) + "28-acre private bay"; Banyan Tree Samui; Renaissance Koh Samui; any adults-only / private-beach superlatives; opening years.'],
  ['top10-honeymoon-hotels-krabi', 'Krabi honeymoon', 'Focus: Dusit Thani Krabi Beach Resort was formerly "Sheraton Krabi" (verify rebrand) + 240 rooms + Klong Muang beach; Phulay Bay a Ritz-Carlton Reserve; Rayavadee on Railay; any superlatives; opening years.'],
  ['top10-couples-hotels-chiang-mai', 'Chiang Mai couples', 'HIGH RISK. Focus: Four Seasons Resort Chiang Mai "3 MICHELIN Keys" (only a handful of hotels worldwide hold 3 keys — verify the exact key count for 2024 AND 2025); "MICHELIN Guide" claims for Anantara Chiang Mai and Raya Heritage (Key? Guide-listed? how many keys?); Akyra Manor rebranded to "AMANOR Hotel" (verify); Cross Chiang Mai Riverside formerly "X2 Chiang Mai Riverside" (verify) + opening 2017; 137 Pillars House; Kerry Hill Architects for Anantara; any rice-terrace acreage.'],
  ['top10-family-hotels-huahin', 'Hua Hin family', 'Focus superlatives: Hyatt Regency Hua Hin "longest private beach in Hua Hin ~315m" (verify or soften); Vana Nava Water Jungle "biggest waterpark in the area" (verify); Centara Grand = the historic "Railway Hotel" opened 1923 (verify year); THE BARAI spa awards; opening years.'],
  ['top10-family-hotels-pattaya', 'Pattaya family', 'Focus: Renaissance Pattaya opening 2017; any waterpark/kids-club specific claims; The Grass Serviced Suites; any superlatives; opening years.'],
]

phase('Verify')
const results = await parallel(JOBS.map(([slug, label, focus]) => () =>
  agent(
`You are an adversarial fact-checker for a Thai hotel website (honesty/EEAT is LOCKED — no overstated awards).
Read the roundup file: astro/src/content/roundups/${slug}.json (Thai). Extract every CHECKABLE external factual claim — Michelin stars/Keys/Guide, opening/founding years, hotel rebrands/former-names, "adults-only", and superlatives ("longest/biggest/first/only ... in <place>"). Ignore review SCORES and prices (those are internal, already verified).
${focus}
Use WebSearch + WebFetch on authoritative sources (guide.michelin.com, official hotel sites, reputable press). Be skeptical — catch fabricated or outdated claims. If you cannot corroborate, mark UNCERTAIN (do not assume true). For REFUTED/UNCERTAIN give the correct fact or a safe reword in "correction". Return one verdict per checkable claim you found.`,
    { label: `fc:${label.replace(/\s+/g, '-')}`, phase: 'Verify', schema: SCHEMA }
  ).then(r => ({ slug, label, ...r })).catch(e => ({ slug, label, error: String(e) }))
))

const flat = []
for (const r of results.filter(Boolean)) {
  if (r.error) { flat.push({ slug: r.slug, claim: '(agent error)', verdict: 'UNCERTAIN', evidence: r.error, correction: '' }); continue; }
  for (const v of (r.verdicts || [])) flat.push({ slug: r.slug, ...v });
}
const bad = flat.filter(v => v.verdict !== 'CONFIRMED')
log(`Phase-2 fact-check: ${flat.length} claims · ${flat.filter(v=>v.verdict==='CONFIRMED').length} confirmed · ${bad.length} REFUTED/UNCERTAIN`)
return { total: flat.length, problems: bad, all: flat }

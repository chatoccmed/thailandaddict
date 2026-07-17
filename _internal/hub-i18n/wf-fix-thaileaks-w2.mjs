export const meta = {
  name: 'fix-thaileaks-w2',
  description: 'Remove residual Thai-script leaks from hi/he/ar Wave-2 twins (place-name transliterations + stray baht words) so validate-hub-twin passes 0-fail; one owning agent per language for consistency, then an independent full-gate verify',
  phases: [
    { title: 'Fix', detail: 'one agent per language: consistent replacement map, applied, looped until its gate is clean' },
    { title: 'Verify', detail: 'independent agent re-runs all 6 validations, reports residuals' },
  ],
};

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';
const SCRATCH = 'C:/Users/Imac/AppData/Local/Temp/claude/C--Users-Imac-Thailandaddict/e8dcc82e-09a6-4a91-9319-26e13332d452/scratchpad/w2brief';

const CONVENTION = {
  hi: `Hindi convention on this site renders Thai/foreign PLACE NAMES in LATIN (English spelling), NOT Devanagari — e.g. clean files already write "Koh Larn", "Chonburi", "Samae Beach", "Pattaya" in Latin inside Hindi prose. So every leaked place fragment must become its ENGLISH/Latin name. Examples: पัटยा/ปัฏ→Pattaya, ปाय/पाय→Pai, โคราช→Korat, बางแสน/บางแสน→Bang Saen, พิมाई→Phimai, चोนบुรी→Chonburi, ลำตะคอง→Lam Takhong, จอมเทียน→Jomtien, สोงแทว→songthaew, ฮ่อง/ซอน (as in "Mae Hong Son")→Hong/Son. VERIFY each by grepping how that same name already appears elsewhere in the hi files (it is almost always Latin) and match it exactly.`,
  he: `Hebrew convention TRANSLITERATES place/district names to HEBREW script (clean files already write סוקומוית=Sukhumvit, סילום=Silom, קוה לארן=Koh Larn). So leaked names become Hebrew transliteration: ทองล่อ→תונג לו (Thong Lo), ท่าประดู่→טה פרדู (Tha Pradu), etc. Match how the same name already appears elsewhere in the he files. Also fix any stray Thai "baht" word (บาท/บาต/บาח and similar half-converted forms) → the Hebrew word באט. Hotel proper-names and Latin brand names stay Latin.`,
  ar: `Arabic convention TRANSLITERATES place names to ARABIC script. Leaked names: إيราวัน/إราวัน (half-converted "Erawan")→إيراوان, برانบุรี→برانبوري (Pranburi), خีรี/خัน→ (Prachuap) Khiri Khan parts, كاثู→كاتو (Kathu), أوتيยาน→ (Uthayan). Also fix stray Thai "baht" word (บาท/الบาท)→ Arabic بات. Match how the same name already appears elsewhere in the ar files. Hotel proper-names and Latin brand names stay Latin.`,
};

const LANGNAME = { hi: 'Hindi', he: 'Hebrew', ar: 'Arabic' };

const FIX_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['lang', 'reviewsPass', 'reviewsFail', 'roundupsPass', 'roundupsFail', 'map', 'notes'],
  properties: {
    lang: { type: 'string' },
    reviewsPass: { type: 'number' }, reviewsFail: { type: 'number' },
    roundupsPass: { type: 'number' }, roundupsFail: { type: 'number' },
    map: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['from', 'to'],
      properties: { from: { type: 'string' }, to: { type: 'string' } } } },
    notes: { type: 'string' },
  },
};

const VERIFY_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['allClean', 'perColl', 'residualFiles'],
  properties: {
    allClean: { type: 'boolean' },
    perColl: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['coll', 'pass', 'fail'],
      properties: { coll: { type: 'string' }, pass: { type: 'number' }, fail: { type: 'number' } } } },
    residualFiles: { type: 'array', items: { type: 'string' } },
  },
};

function fixPrompt(lang) {
  return `You are a native ${LANGNAME[lang]} editor fixing residual Thai-script LEAKS in thailandaddict.com Wave-2 translation twins so they pass the structural validator. This is a mechanical cleanup: the prose is already in ${LANGNAME[lang]}; a few PROPER-NOUN / currency tokens were left half-converted with Thai characters.

REPO ROOT: ${ROOT}  (use bash: export PATH="$HOME/nodejs:$PATH" first)
Your brief (failing files + the exact distinct contaminated tokens with counts):
  ${SCRATCH}/${lang}.txt   — Read it first.

CONVENTION (authoritative):
${CONVENTION[lang]}

GROUND-TRUTH GATE (this defines "done"):
  node _internal/validate-hub-twin.mjs reviews ${lang} --all
  node _internal/validate-hub-twin.mjs roundups ${lang} --all
Each prints "<pass> pass · <fail> fail". You are DONE only when BOTH report 0 fail. The gate flags every "RAW THAI" leak with its exact field path — use it to find leaks and to confirm fixes.

HOW TO APPLY (do NOT hand-edit 20 files):
1. Read the brief; decide ONE consistent replacement for each distinct contaminated token per the convention. For ambiguous names, grep the ${lang} files to see how that name already appears and match it.
2. Write a small node script under _internal/hub-i18n/ that, for EACH failing file, reads the raw JSON text, does LONGEST-KEY-FIRST plain substring replacement of your {from→to} map, and writes it back with fs.writeFileSync (raw string replace preserves the 2-space formatting exactly — do NOT JSON.parse/stringify, to avoid reformatting).
   - Only touch dirs astro/src/content/reviews-${lang} and roundups-${lang}. NEVER touch -en/-th/-ru/-ko/-ja/other langs.
   - Replacement 'to' values must be JSON-safe (plain letters/spaces — no unescaped " or \\).
   - Sanity-guard: your 'from' keys must each contain at least one Thai character (range ฀-๿), so you never rewrite already-correct text.
3. Run the two gate commands. If any RAW THAI remains, inspect the flagged field, extend your map (some leaks are glued to markup or are additional names), re-run until 0 fail.
4. Do a final check that you did not introduce English proper-noun leaks where the convention wanted target-script, and vice-versa.

CRITICAL: never delete files; never modify the -en source; keep numbers/prices/links untouched.

Return the structured report: your final pass/fail counts for reviews and roundups, the full {from,to} map you applied, and notes on anything unusual.`;
}

phase('Fix');
const langs = ['hi', 'he', 'ar'];
const fixes = await parallel(langs.map(lang => () =>
  agent(fixPrompt(lang), { label: `fix:${lang}`, phase: 'Fix', schema: FIX_SCHEMA, effort: 'high' })
));

log('Fix phase done: ' + fixes.filter(Boolean).map(f => `${f.lang} r${f.reviewsFail}/rd${f.roundupsFail}`).join(' · '));

phase('Verify');
const verify = await agent(
  `Independently verify the Wave-2 Thai-leak cleanup for hi/he/ar. In ${ROOT} run (bash, export PATH="$HOME/nodejs:$PATH" first), for lang in hi he ar and coll in reviews roundups:
  node _internal/validate-hub-twin.mjs <coll> <lang> --all
Collect the final "<pass> pass · <fail> fail" for all 6. allClean = every one reports 0 fail. List every file the gate still marks FAIL (with its coll-lang prefix) in residualFiles. Do not edit anything — verification only.`,
  { label: 'verify:gate', phase: 'Verify', schema: VERIFY_SCHEMA, effort: 'low' }
);

return { fixes, verify };

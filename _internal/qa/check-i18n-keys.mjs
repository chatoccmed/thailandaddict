#!/usr/bin/env node
/* =============================================================================
   check-i18n-keys.mjs — the guard for "no tx() argument may ever change"
   Blueprint §2.6 · Phase 2 build gates · EXIT CODE 6

   WHY THIS EXISTS
   ---------------
   gen-hubs.mjs keys its 9-language chrome dictionary on the LITERAL ENGLISH
   STRING (`_internal/gen-hubs.mjs::tx`):

       const tx = (th, en) => { ...; if (en in dict) return dict[en]; return en; }

   A miss returns English. Not an error, not a warning, not a build failure —
   English, forever, on every one of the ~476 hub snapshots in that locale.
   So a one-character edit to an English literal ("Where to stay" →
   "Where to Stay") silently un-translates a string in zh, ru, ko, ja, hi, he
   and ar simultaneously, and nothing anywhere says so. During a presentation-
   layer migration, where the temptation to "tidy up" copy while moving markup
   is constant, that is the single easiest way to quietly break 7 locales.

   The three Astro layouts have the same hazard in a milder form: their UI
   strings live in a `S = { th:{...}, en:{...}, zh:{...} ... }[lang]` object
   keyed by SYMBOLIC names. A missing key there renders the literal text
   "undefined" rather than English — louder, but still not a build failure.

   WHAT IT CHECKS
   --------------
   LAYER 1 · hub chrome (literal-English keys)
     Re-extracts every tx('th','en') pair from gen-hubs.mjs (same parser as
     _internal/hub-i18n/extract-chrome.mjs) and asserts every extracted English
     key is present in ALL 7 dictionaries. Also diffs against the committed
     baseline _internal/hub-i18n/_strings.json and names added/removed keys,
     because "added" during Phase 2 almost always means "someone edited a
     literal", not "someone wrote a new string".

   LAYER 2 · layout UI strings (symbolic keys)
     Parses the S/STRINGS object literal out of each of the three layouts and
     asserts every key in the `en` block exists in all 9 locale blocks.

   LAYER 3 · unparseable tx() calls
     A tx() whose first argument is not a plain string literal is invisible to
     the extractor, so its English text can never be translated. The count is
     pinned to a baseline; growing it fails.

   This gate is READ-ONLY. It never rewrites _strings.json — regenerating the
   baseline is a deliberate act (`node _internal/hub-i18n/extract-chrome.mjs`)
   that must be accompanied by translating the new keys into all 7 dicts.

   Usage:  node _internal/qa/check-i18n-keys.mjs
           exit 0 = OK · exit 6 = a key would silently fall back
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const EXIT = 6;

/* The 7 translated locales. th is the source, en is the dictionary key — neither
   has a dict file, by construction. Mirrors gen-hubs.mjs::NEW_LOCS. */
const DICT_LOCALES = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
/* Every locale the layouts render. Mirrors the S = {...}[lang] blocks. */
const LAYOUT_LOCALES = ['th', 'en', ...DICT_LOCALES];

/* Non-literal tx() calls that the extractor cannot see, as of the Phase 2
   baseline. Raise this ONLY together with a note saying why the new call
   cannot use a plain string literal — every increment is a string that no
   locale will ever translate. */
const ALLOWED_UNPARSEABLE_TX = 24;

/* ACCEPTED DEBT (a ratchet, not an amnesty).
   gen-hubs.mjs drifted away from the dictionaries between 2026-07-08 (when the
   7 dicts were translated from _strings.json) and 2026-09-08: 96 English
   strings gained since then have no entry in any dict and already render as
   English in zh/ru/ko/ja/hi/he/ar on the live hubs. Verified against
   git (fe97335c9^, fe97335c9, HEAD — identical 96), so it predates the
   redesign and is not something this rollout introduced.

   Failing on it would make the gate permanently red and therefore useless, so
   the known set is pinned here and only GROWTH fails. The correct end state is
   an empty file. Shrink it with --update-baseline after translating; growing it
   additionally requires --allow-growth, so "just regenerate the baseline" can
   never be the accidental fix for a broken key. */
const DEBT_FILE = path.join(HERE, 'i18n-untranslated-baseline.json');

const problems = [];
const notes = [];
const fail = (headline, detail) => problems.push({ headline, detail });

/* ===========================================================================
   Shared: parse a JS string literal at src[i] (the opening quote).
   Byte-for-byte the parser in _internal/hub-i18n/extract-chrome.mjs, so this
   gate and the tool that WRITES the dictionaries can never disagree about what
   counts as a key. Do not "improve" it independently of that file.
   ======================================================================== */
function parseStr(s, i) {
  const q = s[i];
  if (q !== "'" && q !== '"' && q !== '`') return null;
  let out = '', j = i + 1;
  while (j < s.length) {
    const c = s[j];
    if (c === '\\') { out += c + s[j + 1]; j += 2; continue; }
    if (c === q) return { value: out, end: j };
    out += c; j++;
  }
  return null;
}
function unescapeLit(lit) {
  return lit.replace(/\\(['"`\\])/g, '$1').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
}

/* ===========================================================================
   LAYER 1 — hub chrome dictionary
   ======================================================================== */
function extractHubStrings() {
  const file = path.join(ROOT, '_internal', 'gen-hubs.mjs');
  const src = fs.readFileSync(file, 'utf8');
  const pairs = new Map();          // en -> th
  const lineOf = new Map();         // en -> 1-based line of first occurrence
  let parsed = 0, unparseable = 0;
  const re = /tx\(/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + 3;
    while (' \n\t'.includes(src[i])) i++;
    const a = parseStr(src, i);
    if (!a) { unparseable++; continue; }
    let k = a.end + 1;
    while (' \n\t'.includes(src[k])) k++;
    if (src[k] !== ',') { unparseable++; continue; }
    k++;
    while (' \n\t'.includes(src[k])) k++;
    const b = parseStr(src, k);
    if (!b) { unparseable++; continue; }
    parsed++;
    const en = unescapeLit(b.value);
    if (!pairs.has(en)) {
      pairs.set(en, unescapeLit(a.value));
      lineOf.set(en, src.slice(0, m.index).split('\n').length);
    }
  }
  return { pairs, lineOf, parsed, unparseable };
}

function checkHubDicts() {
  const { pairs, lineOf, parsed, unparseable } = extractHubStrings();
  const live = [...pairs.keys()];
  console.log(`  · gen-hubs.mjs: ${parsed} tx() calls → ${live.length} unique English keys`);

  /* 1a. every live key must exist in every dictionary */
  const missingBy = new Map();      // key -> [locales]
  for (const loc of DICT_LOCALES) {
    const f = path.join(ROOT, '_internal', 'hub-i18n', `${loc}.json`);
    if (!fs.existsSync(f)) { fail(`dictionary missing: _internal/hub-i18n/${loc}.json`,
      [`  gen-hubs falls back to English for the whole ${loc} locale when this file is absent`,
       `  (tx(): "const dict = CHROME[LOC]; if (!dict) return en").`,
       `  Restore the file from git, or remove ${loc} from NEW_LOCS deliberately.`]); continue; }
    let dict;
    try { dict = JSON.parse(fs.readFileSync(f, 'utf8')); }
    catch (e) { fail(`dictionary is not valid JSON: _internal/hub-i18n/${loc}.json`, [`  ${e.message}`]); continue; }
    for (const k of live) if (!(k in dict)) {
      if (!missingBy.has(k)) missingBy.set(k, []);
      missingBy.get(k).push(loc);
    }
  }

  /* 1a-ratchet: split the misses into accepted pre-existing debt and NEW breakage */
  const debt = readDebt();
  const fresh = [...missingBy.keys()].filter(k => !debt.has(k));
  const paidOff = [...debt].filter(k => !missingBy.has(k));

  if (fresh.length) {
    const detail = [];
    detail.push(`  ${fresh.length} English string(s) in gen-hubs.mjs have no dictionary entry`);
    detail.push(`  and are NOT in the accepted-debt baseline — i.e. they are new since`);
    detail.push(`  the last green run. Each renders as ENGLISH on every hub page in the`);
    detail.push(`  listed locales, silently and permanently.`);
    detail.push('');
    let n = 0;
    for (const k of fresh) {
      if (n++ >= 12) { detail.push(`  … and ${fresh.length - 12} more`); break; }
      detail.push(`  gen-hubs.mjs:${lineOf.get(k)}  missing in ${missingBy.get(k).join(',')}`);
      detail.push(`      ${JSON.stringify(k)}`);
    }
    /* Pair each new key with a key the baseline knew but gen-hubs no longer
       emits: that pairing is what identifies an EDITED literal, as opposed to
       a genuinely new string. */
    const strFile = path.join(ROOT, '_internal', 'hub-i18n', '_strings.json');
    if (fs.existsSync(strFile)) {
      const known = new Set(Object.keys(JSON.parse(fs.readFileSync(strFile, 'utf8'))));
      const orphaned = [...known].filter(k => !pairs.has(k) && !isKnownDeadKey(k, debt));
      /* Pair each NEW key with the closest key the dictionaries already hold.
         An edited literal keeps most of its text, so the nearest known key is
         the one the 2,716 translations are filed under — naming it turns a
         91-line haystack into a one-line "revert this". Candidates include
         keys that are still emitted elsewhere, because editing one of several
         occurrences of the same literal is the commonest form of this bug and
         leaves no orphan behind at all. */
      const pairsFound = [];
      for (const f of fresh) {
        let best = null, bestScore = 0;
        for (const o of known) {
          if (o === f) continue;
          const s = similarity(f, o);
          if (s > bestScore) { bestScore = s; best = o; }
        }
        if (best && bestScore >= 0.5) pairsFound.push([best, f, bestScore, pairs.has(best)]);
      }
      if (pairsFound.length) {
        detail.push('');
        detail.push('  LIKELY THE EDIT — old key (translated) → new key (not translated):');
        for (const [o, f, s, stillLive] of pairsFound.slice(0, 8)) {
          detail.push(`    - ${JSON.stringify(o)}`);
          detail.push(`    + ${JSON.stringify(f)}      (${Math.round(s * 100)}% of the old text kept)`);
          if (stillLive) detail.push(`      NOTE: the old literal is STILL emitted elsewhere in gen-hubs.mjs —`);
          if (stillLive) detail.push(`      you edited one of several occurrences, so no key went missing.`);
        }
        if (pairsFound.length > 8) detail.push(`    … and ${pairsFound.length - 8} more pairs`);
      }
      if (orphaned.length) {
        detail.push('');
        detail.push(`  All keys the dictionaries hold but gen-hubs.mjs no longer emits: ${orphaned.length}`);
        detail.push('  A new key appearing while an old one disappears is the signature');
        detail.push('  of an EDITED literal, not a new string.');
      }
    }
    detail.push('');
    detail.push('  WHAT TO DO — in this order of preference:');
    detail.push('   1. You edited an English literal while moving markup. REVERT IT,');
    detail.push('      character for character, punctuation, emoji and the arrow "→"');
    detail.push('      included. Phase 2 is structure and CSS only (blueprint §2.6):');
    detail.push('        git diff -- _internal/gen-hubs.mjs | grep -n "tx("');
    detail.push('   2. The string really is new. Translate it before it ships:');
    detail.push('        node _internal/hub-i18n/extract-chrome.mjs      # refresh _strings.json');
    detail.push('        …add the new keys to all 7 of zh,ru,ko,ja,hi,he,ar.json…');
    detail.push('        node _internal/qa/check-i18n-keys.mjs           # re-run this gate');
    detail.push('   3. Only if the owner has decided to ship it untranslated:');
    detail.push('        node _internal/qa/check-i18n-keys.mjs --update-baseline --allow-growth');
    detail.push('      That records the string as accepted debt. It does not fix it.');
    fail(`hub chrome: ${fresh.length} NEW key(s) absent from at least one of the 7 dictionaries`, detail);
  } else if (missingBy.size) {
    console.log(`  ✓ hub chrome: no new untranslated keys (${missingBy.size} pre-existing, see baseline)`);
  } else {
    console.log(`  ✓ hub chrome: all ${live.length} keys present in all ${DICT_LOCALES.length} dictionaries`);
  }

  /* 1b. the standing debt, printed every run so it cannot quietly become normal */
  if (debt.size) {
    notes.push({
      headline: `${debt.size} hub string(s) are accepted untranslated debt — they render English in zh,ru,ko,ja,hi,he,ar`,
      detail: [
        `  Recorded in ${path.relative(ROOT, DEBT_FILE)}. This is drift that accumulated`,
        `  in gen-hubs.mjs between 2026-07-08 and 2026-09-08, before the redesign.`,
        `  Clear it by translating the keys into the 7 dicts and then running:`,
        `    node _internal/qa/check-i18n-keys.mjs --update-baseline`,
        `  The target is an empty baseline file.`,
      ],
    });
  }
  if (paidOff.length) {
    notes.push({
      headline: `${paidOff.length} baseline string(s) are now translated — shrink the baseline`,
      detail: [`  node _internal/qa/check-i18n-keys.mjs --update-baseline`],
    });
  }

  /* 1c. tx() calls the extractor cannot read at all */
  if (unparseable > ALLOWED_UNPARSEABLE_TX) {
    fail(`hub chrome: ${unparseable} tx() calls have a non-literal argument (baseline ${ALLOWED_UNPARSEABLE_TX})`, [
      '  The extractor only sees tx(\'…\', \'…\') with plain string literals. A call',
      '  built from a variable or a concatenation can never be translated: it is',
      '  English in all 7 locales for good.',
      '',
      '  WHAT TO DO: write the English argument as one literal (template literals',
      '  with ${…} are fine — tx() reconstructs them via DYN). If the call really',
      '  cannot be a literal, raise ALLOWED_UNPARSEABLE_TX in this file and say',
      '  in the commit message which string you are giving up on.',
    ]);
  } else {
    console.log(`  ✓ hub chrome: ${unparseable} non-literal tx() calls (≤ baseline ${ALLOWED_UNPARSEABLE_TX})`);
  }

  if (UPDATE_BASELINE) writeDebt([...missingBy.keys()], debt);
}

/* --------------------------------------------------------------------------
   accepted-debt baseline I/O
   ----------------------------------------------------------------------- */
const argv = new Set(process.argv.slice(2));
const UPDATE_BASELINE = argv.has('--update-baseline');
const ALLOW_GROWTH = argv.has('--allow-growth');

function readDebt() {
  if (!fs.existsSync(DEBT_FILE)) return new Set();
  try {
    const j = JSON.parse(fs.readFileSync(DEBT_FILE, 'utf8'));
    return new Set(Array.isArray(j) ? j : (j.keys || []));
  } catch (e) {
    fail(`accepted-debt baseline is not valid JSON: ${path.relative(ROOT, DEBT_FILE)}`, [
      `  ${e.message}`,
      '  Without it this gate cannot tell new breakage from known debt, so it',
      '  refuses to guess. Restore the file from git.',
    ]);
    return new Set();
  }
}

/* A key that the dicts hold but gen-hubs no longer emits is only interesting
   when it is NOT part of the same debt population we already accepted. */
function isKnownDeadKey(k, debt) { return debt.has(k); }

/** How much of two strings is shared, as common-prefix + common-suffix over the
 *  longer length. Deliberately not an edit distance: an edited UI literal keeps
 *  its head or its tail ("Destinations" → "Destinations & guides" scores .57),
 *  while two unrelated strings score near 0, and this is O(n) on 400 keys. */
function similarity(a, b) {
  const n = Math.min(a.length, b.length);
  let p = 0; while (p < n && a[p] === b[p]) p++;
  let s = 0; while (s < n - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  return (p + s) / Math.max(a.length, b.length, 1);
}

function writeDebt(current, previous) {
  const grew = current.filter(k => !previous.has(k));
  if (grew.length && !ALLOW_GROWTH) {
    console.error('');
    console.error(`REFUSING to write the baseline: it would GROW by ${grew.length} key(s).`);
    console.error('Growing the baseline means shipping more untranslated English, which is');
    console.error('the thing this gate exists to prevent. If that is genuinely the decision,');
    console.error('re-run with --allow-growth and say so in the commit message.');
    process.exit(EXIT);
  }
  const body = {
    _comment: [
      'Accepted-debt baseline for check-i18n-keys.mjs (blueprint §2.6).',
      'Every string here is an English literal in _internal/gen-hubs.mjs that has NO',
      'entry in any of _internal/hub-i18n/{zh,ru,ko,ja,hi,he,ar}.json, and therefore',
      'renders as English on the hub pages in those 7 locales. tx() returns English on',
      'a miss with no error and no log line, which is why the list has to be explicit.',
      'The correct value of this file is [] — shrink it by translating, never grow it',
      'to make a red build green.',
    ],
    generated: new Date().toISOString().slice(0, 10),
    count: current.length,
    keys: current.slice().sort(),
  };
  fs.writeFileSync(DEBT_FILE, JSON.stringify(body, null, 2) + '\n');
  console.log(`  → wrote ${path.relative(ROOT, DEBT_FILE)} (${current.length} keys, was ${previous.size})`);
}

/* ===========================================================================
   LAYER 2 — layout UI-string objects

   The layouts are .astro, not JS we can import: the frontmatter is TypeScript
   and the rest is template. So we slice the object literal out by matching
   braces (string- and comment-aware) and evaluate just that slice in a vm with
   an empty context. The slice is pure data — if it ever stops being pure data
   the evaluation throws, and that is reported rather than swallowed.
   ======================================================================== */
const LAYOUT_DICTS = [
  { file: 'ReviewLayout.astro', start: /\nconst S(?:\s*:[^=\n]*)?\s*=\s*\{/, name: 'S' },
  { file: 'RoundupLayout.astro', start: /\nconst S(?:\s*:[^=\n]*)?\s*=\s*\{/, name: 'S' },
  { file: 'ArticleLayout.astro', start: /\nconst STRINGS(?:\s*:[^=\n]*)?\s*=\s*\{/, name: 'STRINGS' },
];

/** Slice the balanced { … } literal that begins at/after `start`.
 *  Skips over string literals (all three quote styles, with escapes) and both
 *  comment forms, so an apostrophe in a `// don't` comment cannot desync it. */
function sliceObjectLiteral(src, start) {
  const m = start.exec(src);
  if (!m) return null;
  const open = src.indexOf('{', m.index);
  if (open < 0) return null;
  let depth = 0, quote = null, esc = false;
  for (let j = open; j < src.length; j++) {
    const c = src[j];
    if (quote) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '/' && src[j + 1] === '/') { j = src.indexOf('\n', j); if (j < 0) return null; continue; }
    if (c === '/' && src[j + 1] === '*') { j = src.indexOf('*/', j + 2); if (j < 0) return null; j++; continue; }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return { text: src.slice(open, j + 1), line: src.slice(0, open).split('\n').length }; }
  }
  return null;
}

function checkLayoutDicts() {
  for (const { file, start, name } of LAYOUT_DICTS) {
    const p = path.join(ROOT, 'astro', 'src', 'layouts', file);
    if (!fs.existsSync(p)) { fail(`layout not found: astro/src/layouts/${file}`, ['  A layout was renamed or deleted — update LAYOUT_DICTS in this file.']); continue; }
    const src = fs.readFileSync(p, 'utf8');
    const sliced = sliceObjectLiteral(src, start);
    if (!sliced) {
      fail(`could not locate \`const ${name} = { … }\` in ${file}`, [
        `  The gate reads the UI-string object out of the layout by matching`,
        `  ${start} and then balancing braces. It found no match, so IT IS NOT`,
        `  CHECKING THIS LAYOUT AT ALL — a silent hole, hence a failure.`,
        '',
        `  WHAT TO DO: if you renamed or moved the object, update LAYOUT_DICTS`,
        `  in _internal/qa/check-i18n-keys.mjs to match.`,
      ]);
      continue;
    }
    let obj;
    try { obj = vm.runInNewContext('(' + sliced.text + ')', Object.create(null), { timeout: 5000 }); }
    catch (e) {
      fail(`could not evaluate \`${name}\` in ${file} (line ${sliced.line})`, [
        `  ${e.message}`,
        '  The UI-string object must stay a plain data literal so it can be',
        '  checked without building the site. Move any computed value out of it.',
      ]);
      continue;
    }
    const ref = Object.keys(obj.en || {});
    if (!ref.length) { fail(`${file}: \`${name}.en\` is empty or absent`, ['  The English block is the reference key set for every other locale.']); continue; }

    const missingBy = new Map();    // locale -> [keys]
    for (const loc of LAYOUT_LOCALES) {
      if (!obj[loc]) { missingBy.set(loc, ['<entire locale block absent>']); continue; }
      const miss = ref.filter(k => !(k in obj[loc]));
      if (miss.length) missingBy.set(loc, miss);
    }
    if (missingBy.size) {
      const detail = [`  astro/src/layouts/${file} · \`${name}\` at line ${sliced.line} · ${ref.length} keys in \`en\``, ''];
      for (const [loc, miss] of missingBy) {
        detail.push(`  ${loc}: ${miss.length} missing → ${miss.slice(0, 10).map(k => JSON.stringify(k)).join(', ')}${miss.length > 10 ? ' …' : ''}`);
      }
      detail.push('');
      detail.push('  Each missing key renders the literal text "undefined" in that');
      detail.push('  locale — it is not an English fallback, it is visible breakage.');
      detail.push('');
      detail.push('  WHAT TO DO: add the key to every locale block. The translated');
      detail.push('  source files are _internal/hub-i18n/{review,roundup}-<lang>.json;');
      detail.push('  _internal/hub-i18n/merge-layout-strings.mjs merges them back in.');
      detail.push('  Do NOT ship the key in en only "for now" — nothing will catch it later.');
      fail(`${file}: ${[...missingBy.values()].reduce((a, b) => a + b.length, 0)} UI string(s) missing from ${missingBy.size} locale(s)`, detail);
    } else {
      console.log(`  ✓ ${file}: ${ref.length} UI strings present in all ${LAYOUT_LOCALES.length} locales`);
    }
  }
}

/* ===========================================================================
   run
   ======================================================================== */
console.log('check-i18n-keys — no tx() key may change, no locale may fall back silently');
checkHubDicts();
checkLayoutDicts();

for (const { headline, detail } of notes) {
  console.log('');
  console.log('  NOTE: ' + headline);
  for (const l of detail) console.log('  ' + l);
}

if (problems.length) {
  console.error('');
  console.error('─'.repeat(78));
  for (const { headline, detail } of problems) {
    console.error('FAIL: ' + headline);
    for (const l of detail) console.error(l);
    console.error('');
  }
  console.error('─'.repeat(78));
  console.error(`check-i18n-keys: ${problems.length} FAILURE(S) — do NOT push.`);
  console.error('A wrong key here does not throw at build time and does not show up in');
  console.error('any log. It just serves English to zh/ru/ko/ja/hi/he/ar readers until');
  console.error('someone notices by eye. That is why this is a hard gate.');
  process.exit(EXIT);
}
console.log('check-i18n-keys: ALL PASS');

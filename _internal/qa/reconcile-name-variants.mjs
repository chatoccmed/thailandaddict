/* The second half of "one name per province per language": the spellings that
   are already translated but disagree with each other.

   canonicalise-place-names.mjs fixed every Latin province name. It did not
   touch the transliterations, because the hub snapshots carry two or three of
   them for the same place — hi/city-kamphaeng-phet says कम्फेंग फेत in the body,
   कमफेंग फेत in the <h1>, कामफेंग फेत in the <title> — and the obvious way to
   reconcile them, snapping a near-duplicate to the canonical spelling, is
   lethal here: Thai provinces differ from each other by a letter or two, and a
   dry run of exactly that idea renamed Chiang Mai to Chiang Rai on 764 pages.

   So this never guesses which province a spelling belongs to. It derives each
   variant from EVIDENCE that pins it to one province:

     the translation memory holds   "Explore Kamphaeng Phet" → "घूमें कमफेंग फेत"
     the hub dictionary holds       "Explore ${nm}"          → "घूमें ${nm}"

   Align the two and the variant is whatever stands where ${nm} stands — and it
   belongs to Kamphaeng Phet, because that is the English name the memory key
   was built from. No edit distance anywhere.

   Guards, each of which a variant must pass:
     · it is not another province's canonical name   (the Chiang Rai trap)
     · it is not contained in another province's name, and does not contain one
     · it is in the same script as the canonical name, and at least 2 letters
     · it was seen for exactly one province

   Writes by default; --dry reports every substitution it would make. It fixes
   the variant in the translation memory too, so the next localize.mjs run
   produces the canonical name instead of reintroducing the variant. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const argAt = (f) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : null; };
const LANGS = (argAt('--langs') || 'zh,ru,ko,ja,hi,he,ar').split(',').filter(Boolean);
const APPLY = !process.argv.includes('--dry');

const titleCase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, (m) => '\\' + m);
const scriptOf = (s) => (/[一-鿿]/.test(s) ? 'han' : /[぀-ヿ]/.test(s) ? 'kana'
  : /[가-힯]/.test(s) ? 'hangul' : /[Ѐ-ӿ]/.test(s) ? 'cyrillic'
  : /[ऀ-ॿ]/.test(s) ? 'devanagari' : /[֐-׿]/.test(s) ? 'hebrew'
  : /[؀-ۿ]/.test(s) ? 'arabic' : 'other');
/* Japanese mixes kana and kanji, so treat those two as one script */
const sameScript = (a, b) => { const x = scriptOf(a), y = scriptOf(b); return x === y || (/han|kana/.test(x) && /han|kana/.test(y)); };

/* 🚨 A variant is not automatically a misspelling. The first dry run proposed
   "Аюттхаю → Аюттхая" — but Аюттхаю is the ACCUSATIVE ("посетить Аюттхаю"),
   correct Russian, and the template it was measured against ("Исследуй ${nm}")
   is the ungrammatical one. Applying it would have broken the grammar of 4,402
   occurrences on 307 Russian pages. Hebrew fuses prepositions onto names and
   Arabic carried a "(Korat)" alias that would have been deleted.

   So a variant must prove it is SPELLING, not grammar, by landing in a class:
     A  mixed script — native letters glued to Latin ones, e.g. "Phang Ngaा".
        That is corruption in any language.
     B  identical once spaces, hyphens, apostrophes and diacritics are set aside
        — "Сурат-Тхани" vs "Сураттхани". Formatting, in any language.
     C  any other difference, but ONLY in zh/ja/ko, which do not inflect names,
        and never when one spelling contains the other (清迈府 is "Chiang Mai
        Province", not a misspelling of 清迈) or carries a parenthesis.
   Anything else is left exactly as it is. */
const norm = (s) => String(s).normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[ً-ٰٟـ]/g, '')
  .replace(/[֑-ׇ]/g, '')
  .replace(/[\s\-‐-―'’׳״·・]/g, '')
  .toLowerCase();
const UNINFLECTED = new Set(['zh', 'ja', 'ko']);
/* Spacing, hyphens and apostrophes only — diacritics kept. */
const normFmt = (s) => String(s).replace(/[\s\-‐-―'’׳״·・]/g, '').toLowerCase();
const marks = (s) => (String(s).normalize('NFD').match(/[̀-ًͯ-ٰٟ֑-ׇ]/g) || []).length;
function classify(v, cn, lang) {
  if (/[A-Za-z]/.test(v) && /[^\x00-\x7F]/.test(v)) return 'A';
  if (normFmt(v) === normFmt(cn)) return 'B';
  /* Differs only by vowel marks. Arabic and Hebrew running text is normally
     unmarked, and some homepage names happen to carry a shadda or a niqqud —
     so snapping body text to them would ADD marks a reader does not expect
     ("أيوتايا" → "أيوتّايا"). Only ever remove marks, never add them. */
  if (norm(v) === norm(cn)) return marks(cn) <= marks(v) ? 'B' : null;
  if (UNINFLECTED.has(lang) && !v.includes(cn) && !cn.includes(v) && !/[()（）]/.test(v)) return 'C';
  return null;
}

const SKIP = /<(script|style)\b[\s\S]*?<\/\1>/gi;
const save = (p, text) => {
  fs.writeFileSync(p + '.tmp', text, 'utf8');
  if (fs.readFileSync(p + '.tmp', 'utf8') !== text) { console.error('readback mismatch: ' + p); process.exit(1); }
  fs.renameSync(p + '.tmp', p);
};

let grandNodes = 0, grandPages = 0, grandTm = 0;

for (const lang of LANGS) {
  const tmPath = path.join(ROOT, '_internal/i18n', 'tm.' + lang + '.json');
  const tm = JSON.parse(fs.readFileSync(tmPath, 'utf8'));
  const dict = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/hub-i18n', lang + '.json'), 'utf8'));
  const prov = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/homepage-i18n', lang + '.json'), 'utf8')).prov || {};
  const canon = Object.fromEntries(Object.entries(prov).filter(([, v]) => v && v.n).map(([s, v]) => [s, v.n]));
  const canonNames = Object.values(canon);

  /* templates with exactly one ${nm} and nothing else variable */
  const templates = Object.entries(dict)
    .filter(([k, v]) => (k.match(/\$\{[^}]+\}/g) || []).join() === '${nm}' && String(v).split('${nm}').length === 2);

  /* Evidence, kept as the exact SENTENCE it came from. A variant is only ever
     replaced inside that sentence: "班武里" is wrong where the memory used it to
     mean Prachuap Khiri Khan, and right everywhere else on that same page,
     where it means Pranburi — a real district inside the province. Replacing
     a spelling page-wide would corrupt the second to fix the first. */
  const evidence = [];   /* { slug, v, cn, tmKey, val } */
  for (const [enT, trT] of templates) {
    const [pre, post] = String(trT).split('${nm}');
    const rx = new RegExp('^' + esc(pre) + '(.+?)' + esc(post) + '$');
    for (const [slug, cn] of Object.entries(canon)) {
      const tmKey = enT.split('${nm}').join(titleCase(slug));
      const val = tm[tmKey];
      if (typeof val !== 'string') continue;
      const m = val.match(rx);
      if (!m) continue;
      const v = m[1].trim();
      if (v !== cn) evidence.push({ slug, v, cn, tmKey, val });
    }
  }

  /* guards, then the spelling-not-grammar classes */
  const ownerCount = new Map();
  for (const e of evidence) ownerCount.set(e.v, new Set([...(ownerCount.get(e.v) || []), e.slug]));
  const accepted = [], rejected = [], skipped = [];
  for (const e of evidence) {
    const others = canonNames.filter((n) => n !== e.cn);
    let why = '';
    if (others.includes(e.v)) why = 'is another province\'s name';
    else if (others.some((n) => n.includes(e.v) || e.v.includes(n))) why = 'overlaps another province\'s name';
    else if (e.v.length < 2) why = 'too short';
    else if (ownerCount.get(e.v).size > 1) why = 'seen for more than one province';
    if (why) { rejected.push(`${e.slug}: ${e.v} — ${why}`); continue; }
    const cls = classify(e.v, e.cn, lang);
    if (!cls) { skipped.push(e); continue; }
    accepted.push({ ...e, cls, fixed: e.val.split(e.v).join(e.cn) });
  }

  /* apply: the exact sentence, wherever a reader sees it, and in the memory */
  const dir = path.join(ROOT, 'astro/public', lang);
  let nodes = 0, pages = 0;
  if (accepted.length) {
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
      const p = path.join(dir, f);
      const src = fs.readFileSync(p, 'utf8');
      if (!accepted.some((a) => src.includes(a.val))) continue;
      const holes = [];
      let masked = src.replace(SKIP, (x) => { holes.push(x); return '\u0000' + (holes.length - 1) + '\u0000'; });
      let hits = 0;
      const fix = (t) => { let s = t; for (const a of accepted) if (s.includes(a.val)) { s = s.split(a.val).join(a.fixed); hits++; } return s; };
      masked = masked.replace(/>([^<]+)</g, (_w, text) => '>' + fix(text) + '<');
      masked = masked.replace(/\b(alt|title|aria-label)="([^"]*)"/g, (_w, a, val) => a + '="' + fix(val) + '"');
      masked = masked.replace(/(<meta[^>]*\bcontent=")([^"]*)(")/gi, (_w, a, val, c) => a + fix(val) + c);
      if (!hits) continue;
      nodes += hits; pages++;
      if (APPLY) save(p, masked.replace(/\u0000(\d+)\u0000/g, (_x, i) => holes[+i]));
    }
  }
  let tmFixed = 0;
  for (const a of accepted) if (tm[a.tmKey] === a.val) { tm[a.tmKey] = a.fixed; tmFixed++; }
  if (APPLY && tmFixed) save(tmPath, JSON.stringify(tm, null, 2) + '\n');

  grandNodes += nodes; grandPages += pages; grandTm += tmFixed;
  const byCls = (c) => accepted.filter((a) => a.cls === c).length;
  console.log(`  ${lang}  ${accepted.length} sentence(s) fixed (A ${byCls('A')} · B ${byCls('B')} · C ${byCls('C')}) · ${skipped.length} left alone (could be grammar) · ${rejected.length} rejected · ${nodes} occurrence(s) on ${pages} page(s)`);
  const show = process.argv.includes('--verbose') ? accepted.length : 5;
  for (const a of accepted.slice(0, show)) console.log(`        ${a.cls} ${a.slug.padEnd(20)} ${a.v}  →  ${a.cn}`);
  if (accepted.length > show) console.log(`        … and ${accepted.length - show} more`);
  if (process.argv.includes('--verbose')) for (const s of skipped.slice(0, 8)) console.log(`        left alone ${s.slug.padEnd(16)} ${s.v} (vs ${s.cn})`);
}

console.log(`\n${grandNodes} occurrence(s) on ${grandPages} page(s), ${grandTm} memory entr(ies) ` + (APPLY ? 'rewritten' : 'would be rewritten (--dry)'));

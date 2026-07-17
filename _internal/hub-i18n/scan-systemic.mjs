// Measure the systemic translation defects sample-2 revealed, across ALL ru/ko/ja reviews+roundups.
// Read-only. Emits per-pattern file lists to /scratchpad and prints counts.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const OUT = process.argv[2] || '.';
const SCRIPT = { ru: /[Ѐ-ӿ]/, ko: /[가-힣]/, ja: /[぀-ヿ一-鿿]/, hi: /[ऀ-ॿ]/, he: /[֐-׿]/, ar: /[؀-ۿ]/ };
const _langArgs = process.argv.slice(3).filter(a => SCRIPT[a]);
const LANGS = _langArgs.length ? _langArgs : ['ru', 'ko', 'ja'];
const CJK = /[぀-ヿ一-鿿가-힣]/;
// mixed-script garble: a Latin run of >=2 letters glued directly to a CJK char (no space) — e.g. 涼season, seasonシ
const GLUED = /(?:[一-鿿぀-ヿ가-힣][A-Za-z]{2,})|(?:[A-Za-z]{2,}[一-鿿぀-ヿ가-힣])/;
const PARENT_FIELDS = ['parentName', 'parentShort', 'parentCrumbName'];

function walkStrings(o, cb, p = '$') {
  if (typeof o === 'string') cb(o, p);
  else if (Array.isArray(o)) o.forEach((v, i) => walkStrings(v, cb, `${p}[${i}]`));
  else if (o && typeof o === 'object') for (const k of Object.keys(o)) walkStrings(o[k], cb, `${p}.${k}`);
}

const report = { parentEnglish: {}, ltgtEntities: {}, gluedLatin: {}, taxExcluded: {} };
for (const coll of ['reviews', 'roundups']) {
  for (const lang of LANGS) {
    const enDir = path.join(ROOT, `astro/src/content/${coll}-en`);
    const twDir = path.join(ROOT, `astro/src/content/${coll}-${lang}`);
    if (!fs.existsSync(twDir)) continue;
    const files = fs.readdirSync(twDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const enp = path.join(enDir, f);
      if (!fs.existsSync(enp)) continue;
      const en = JSON.parse(fs.readFileSync(enp, 'utf8'));
      const tw = JSON.parse(fs.readFileSync(path.join(twDir, f), 'utf8'));
      const key = `${coll}-${lang}`;
      // (A) parent* left in English (reviews only have these fields)
      for (const pf of PARENT_FIELDS) {
        if (typeof tw[pf] === 'string' && tw[pf].trim() && !SCRIPT[lang].test(tw[pf]) && /[A-Za-z]/.test(tw[pf])) {
          (report.parentEnglish[key] ??= new Set()).add(f); break;
        }
      }
      // (D) &lt;/&gt; entities introduced in the twin but not in the EN source
      let enLt = 0, twLt = 0;
      walkStrings(en, s => { if (s.includes('&lt;') || s.includes('&gt;')) enLt++; });
      walkStrings(tw, s => { if (s.includes('&lt;') || s.includes('&gt;')) twLt++; });
      if (twLt > enLt) (report.ltgtEntities[key] ??= new Set()).add(f);
      // (E) glued Latin-in-CJK garble (ja/ko only) — skip ru
      if (lang !== 'ru') {
        let hit = null;
        walkStrings(tw, (s, p) => { if (!hit && CJK.test(s) && GLUED.test(s)) hit = p; });
        if (hit) (report.gluedLatin[key] ??= new Set()).add(f);
      }
      // (F) invented 税抜 (tax-excluded) in ja priceSub / prices where EN has no 'tax'
      if (lang === 'ja') {
        let bad = false;
        walkStrings(tw, (s, p) => { if (s.includes('税抜') || s.includes('税込')) bad = true; });
        const enHasTax = JSON.stringify(en).toLowerCase().includes('tax');
        if (bad && !enHasTax) (report.taxExcluded[key] ??= new Set()).add(f);
      }
    }
  }
}

function dump(name, obj) {
  console.log(`\n### ${name} ###`);
  let total = 0;
  for (const [key, set] of Object.entries(obj)) {
    console.log(`  ${key}: ${set.size}`);
    total += set.size;
    fs.writeFileSync(path.join(OUT, `sys-${name}-${key}.txt`), [...set].join('\n'));
  }
  console.log(`  TOTAL: ${total}`);
}
dump('parentEnglish', report.parentEnglish);
dump('ltgtEntities', report.ltgtEntities);
dump('gluedLatin', report.gluedLatin);
dump('taxExcluded', report.taxExcluded);

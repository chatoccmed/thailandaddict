// Gate: Thailand's entry rules must come from astro/src/data/entry-rules.json and be fresh.
// Fails (exit 13) when:
//   1. lastChecked is older than maxAgeDays — someone has to re-check the rules against the sources;
//   2. the file is malformed (a language missing a field, a {placeholder} with no fact);
//   3. any content JSON or prebuilt page states a visa-free stay that is not in allowedVisaFreeDays
//      (this is how the 60-day claims that outlived the 15 Sep 2026 change get caught).
// Run: node _internal/qa/check-entry-rules.mjs   (part of `npm run verify`)
import fs from 'node:fs';
import path from 'node:path';
import { staleClaims, flatten } from '../lib/entry-rules-scan.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const rules = JSON.parse(fs.readFileSync(path.join(ROOT, 'astro/src/data/entry-rules.json'), 'utf8'));
const LANGS = ['th', 'en', 'zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const problems = [];

// 1. freshness
// lastChecked is a Thai calendar date, so "today" is Asia/Bangkok's (UTC+7), not UTC's.
const today = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const ageDays = Math.round((Date.parse(today) - Date.parse(rules.lastChecked)) / 864e5);
if (!(ageDays >= 0 && ageDays <= rules.maxAgeDays))
  problems.push(`entry-rules.json lastChecked ${rules.lastChecked} is ${ageDays} days old (max ${rules.maxAgeDays}) — re-check the sources, update facts, set lastChecked`);

// 2. shape
const known = new Set([...Object.keys(rules.facts), 'checked']);
for (const l of LANGS) {
  const t = rules.text[l];
  if (!t || !t.title || !t.checked || !t.footer || !Array.isArray(t.items) || t.items.length !== rules.text.en.items.length) {
    problems.push(`entry-rules.json text.${l} is missing a field or has a different number of items than en`); continue;
  }
  for (const s of [t.title, t.checked, t.footer, ...t.items])
    for (const [, k] of s.matchAll(/\{(\w+)\}/g)) if (!known.has(k)) problems.push(`entry-rules.json text.${l}: unknown placeholder {${k}}`);
}

// 3. prose that contradicts the rules
const files = [];
const CONTENT = path.join(ROOT, 'astro/src/content');
for (const d of fs.readdirSync(CONTENT)) for (const f of fs.readdirSync(path.join(CONTENT, d))) if (f.endsWith('.json')) files.push(path.join(CONTENT, d, f));
const PUB = path.join(ROOT, 'astro/public');
for (const d of ['', ...LANGS.filter(l => l !== 'th')]) {
  const dir = path.join(PUB, d);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith('.html')) files.push(path.join(dir, f));
}
let hits = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  if (!/visa|วีซ่า|ตรวจลงตรา|签|виз|비자|ビザ|वीज़ा|वीजा|ויזה|تأشير/i.test(raw)) continue;
  const text = f.endsWith('.json') ? flatten(JSON.parse(raw)) : raw.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ');
  for (const c of staleClaims(text, rules.allowedVisaFreeDays)) {
    hits++;
    problems.push(`${path.relative(ROOT, f).replace(/\\/g, '/')}: says ${c.days} days visa-free — "${c.snippet}"`);
  }
}

if (problems.length) {
  console.error(`✗ check-entry-rules: ${problems.length} problem(s)` + (hits ? ` (${hits} stale visa claim(s) in ${files.length} files scanned)` : ''));
  for (const p of problems) console.error('  - ' + p);
  process.exit(13);
}
console.log(`✓ check-entry-rules: rules checked ${rules.lastChecked} (${ageDays} d ago), ${files.length} files scanned, 0 stale visa claims`);

#!/usr/bin/env node
// lint-dark-patterns — fail the build if any TRUE manipulative dark pattern appears in content or templates.
// This is the honesty guardrail behind our "trust > tricks" positioning (Booking was fined €413M for exactly
// these). It flags ONLY manufactured pressure — NOT honest travel advice like "ของหมดเร็ว ไปเช้า" (sells out,
// go early) or "book a villa if you're a group of 8", which are helpful and stay.
// Usage: node _internal/lint-dark-patterns.mjs   → exit 1 (+ report) if any hit, else exit 0.
import fs from 'node:fs';
import path from 'node:path';

const ASTRO = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', 'astro');
const TARGETS = [
  'src/content/articles', 'src/content/articles-en',
  'src/content/reviews', 'src/content/reviews-en',
  'src/content/roundups', 'src/content/roundups-en',
  'src/layouts', 'src/components', 'public',
];
const EXT = new Set(['.json', '.astro', '.html', '.js']);

// TRUE dark patterns — phrases that essentially never occur in honest content. Grouped by regulator category.
const RULES = [
  // 1. Fake live-viewer / booking social proof
  { id: 'live-viewers', re: /คน(กำลัง)?(ดู|เข้าชม)(ห้อง|ที่พัก|หน้า|รายการ)นี้(อยู่)?|อีก\s*\d+\s*คน(กำลัง)?ดูอยู่|มีคนดูอยู่\s*\d+\s*คน|\d+\s+(people|guests?)\s+(are\s+)?(viewing|looking at)\s+this|viewing this (hotel|property|room|page)\s+(right\s+)?now/i },
  { id: 'booked-count', re: /จองไปแล้ว\s*\d+\s*(ครั้ง|ห้อง|ที่)\s*(ในวันนี้|วันนี้|ในรอบ)|booked\s+\d+\s+times\s+(today|in the last|this week)/i },
  // 2. Manufactured scarcity on a bookable item
  { id: 'last-room', re: /เหลือ(ห้อง|ที่นั่ง)?\s*(เพียง|แค่)?\s*\d*\s*(ห้อง|ที่นั่ง)?\s*สุดท้าย(แล้ว)?|เหลือห้องเดียว(บนเว็บ)?|ห้องสุดท้ายแล้ว|only\s+\d+\s+(rooms?\s+)?left\b|\d+\s+rooms?\s+left\b|last\s+\d+\s+rooms?\b/i },
  // 3. Countdown / expiring-offer TIMER (not the "New Year countdown" festival — that's honest culture)
  { id: 'countdown', re: /เหลือเวลา(ซื้อ|จอง|โปร|ข้อเสนอ|สั่ง)|(โปร(โมชั่น)?|ราคานี้|ข้อเสนอ|ดีล)หมดใน\s*\d+\s*(นาที|ชั่วโมง|วินาที)|ends?\s+in\s+\d+:\d+|\d+:\d+:\d+\s*(left|remaining)|(offer|deal|sale|price)\s+expires?\s+in\s+\d/i },
  // 4. Price-hike pressure / fake discount urgency
  { id: 'price-pressure', re: /รีบจองก่อนราคาขึ้น|ราคาจะขึ้นใน\s*\d|ราคานี้เฉพาะวันนี้เท่านั้น(รีบ)|price\s+(goes|going)\s+up\s+(soon|in\s+\d)|book\s+now\s+before\s+the\s+price/i },
  // 5. Fake freshness / live-price theater
  { id: 'fake-freshness', re: /(เช็ก|ตรวจสอบ)(ราคา)?(ล่าสุด)?\s*(เมื่อครู่|เมื่อสักครู่|วินาทีนี้|เรียลไทม์)|ราคา(อัปเดต)?แบบเรียลไทม์|(checked|updated|prices?\s+updated)\s+(just\s+now|moments?\s+ago|seconds?\s+ago|live|in\s+real[\s-]?time)/i },
];

function walk(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (EXT.has(path.extname(e.name))) acc.push(p);
  }
  return acc;
}

const findings = [];
for (const rel of TARGETS) {
  for (const f of walk(path.join(ASTRO, rel), [])) {
    let txt; try { txt = fs.readFileSync(f, 'utf8'); } catch { continue; }
    for (const rule of RULES) {
      const m = txt.match(rule.re);
      if (m) {
        const idx = m.index || 0;
        findings.push({ id: rule.id, file: path.relative(ASTRO, f), sample: txt.slice(Math.max(0, idx - 30), idx + 50).replace(/\s+/g, ' ').trim() });
      }
    }
  }
}

if (findings.length) {
  console.error(`\n❌ DARK PATTERN LINT — ${findings.length} manipulative pattern(s) found:\n`);
  for (const h of findings) console.error(`  [${h.id}] ${h.file}\n      …${h.sample}…`);
  console.error('\nThese pressure/deceive users (the kind Booking.com was fined €413M for). Rewrite as honest info or remove.\n');
  process.exit(1);
}
console.log('✅ dark-pattern lint: clean — 0 manipulative patterns in content or templates.');

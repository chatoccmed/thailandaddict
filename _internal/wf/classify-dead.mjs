// Classify dead links: JS-template false positives vs real dead hrefs; group carriers.
import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync('_internal/wf/site-audit-report.json', 'utf8'));

const isTemplate = (l) => l.includes("'") || l.includes('+');

console.log('=== taipei/cingjing carriers ===');
const carriers = {};
const taipeiSamples = [];
for (const [page, links] of Object.entries(r.deadLinks.detail)) {
  if (links.some(l => /taipei|cingjing/.test(l))) {
    const grp = page.startsWith('en/') ? 'en/*' : page.startsWith('zh/') ? 'zh/*' : page.startsWith('ar/') ? 'ar/*' : 'th:' + (page.match(/^[a-z0-9]+/) || ['?'])[0];
    carriers[grp] = (carriers[grp] || 0) + 1;
    if (taipeiSamples.length < 6 && !page.startsWith('en/')) taipeiSamples.push(page);
  }
}
console.log(JSON.stringify(carriers));
console.log('samples:', taipeiSamples.join(', '));

console.log('\n=== real dead (non-template) ===');
const realDead = {};
for (const [page, links] of Object.entries(r.deadLinks.detail)) {
  const real = [...new Set(links.filter(l => !isTemplate(l)))];
  if (real.length) realDead[page] = real;
}
const byDir = { th: 0, en: 0, zh: 0, ar: 0 };
for (const p of Object.keys(realDead)) {
  const d = p.startsWith('en/') ? 'en' : p.startsWith('zh/') ? 'zh' : p.startsWith('ar/') ? 'ar' : 'th';
  byDir[d]++;
}
console.log('pages with real dead links:', Object.keys(realDead).length, '| by lang:', JSON.stringify(byDir));

const thPages = Object.entries(realDead).filter(([p]) => !p.includes('/'));
console.log('\nTH pages w/ real dead links:', thPages.length);
for (const [p, l] of thPages.slice(0, 15)) console.log('  ' + p + ' → ' + l.slice(0, 4).join(' | ').slice(0, 150));

// what dead hrefs remain after removing taipei set + templates?
const freq = {};
for (const links of Object.values(realDead)) for (const l of links) freq[l] = (freq[l] || 0) + 1;
console.log('\ntop real dead hrefs:');
Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([l, n]) => console.log('  ×' + n + '  ' + l.slice(0, 110)));

fs.writeFileSync('_internal/wf/real-dead.json', JSON.stringify(realDead, null, 1));

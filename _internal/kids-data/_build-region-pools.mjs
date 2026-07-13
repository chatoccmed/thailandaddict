import fs from 'node:fs';
import path from 'node:path';
import { provSlug } from '../../worker-provinces.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const arr = (() => { const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'astro/public/feeds/attractions.json'), 'utf8')); return Array.isArray(d) ? d : d.items; })();
const slugSet = new Set(fs.readdirSync(path.join(ROOT, 'astro/src/content/articles')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)));
const NEW = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/kids-data/_attractions.json'), 'utf8'));
const newSlugs = new Set(NEW.map(a => a.slug));

// STRONG kid signals (genuine kid attractions) — avoids false positives (เกาะช้าง/วัดช้าง/ดอย/หาด/temple-with-ช้าง)
const STRONG = /สวนน้ำ|สวนสัตว์|อควาเรียม|สถานแสดงพันธุ์สัตว์น้ำ|ไดโนเสาร์|สวนสนุก|สวนสัตว์เปิด|ฟาร์มโคนม|ฟาร์มแกะ|ฟาร์มโชคชัย|พิพิธภัณฑ์วิทยาศาสตร์|พิพิธภัณฑ์เด็ก|บึงฉวาก|ดรีมเวิลด์|วอเตอร์พาร์ค|ซาฟารี|planetarium|water ?park|aquarium|dinosaur|theme ?park|science ?(museum|park|centre|center)|zoo\b|safari|kidzania|sea ?life|sheep ?farm|dairy ?farm|butterfly ?(garden|farm)|jungle ?coaster/i;
// exclude obvious false positives even if a keyword hits
const EXCLUDE = /เกาะช้าง|วัดช้าง|ดอยช้าง|กู่ช้าง|หาด|เกาะ|วัด|ดอย|น้ำตก|ถ้ำ|ตลาด|ปาง.*อนุรักษ์.*ช้าง/;

const REG = {
  north: ['chiang-mai','chiang-rai','lampang','lamphun','mae-hong-son','nan','phayao','phrae','uttaradit','tak','sukhothai','phitsanulok','kamphaeng-phet','phichit','phetchabun','nakhon-sawan','uthai-thani'],
  northeast: ['nakhon-ratchasima','khon-kaen','udon-thani','ubon-ratchathani','buriram','surin','sisaket','yasothon','chaiyaphum','amnat-charoen','nong-khai','loei','sakon-nakhon','nakhon-phanom','mukdahan','kalasin','maha-sarakham','roi-et','nong-bua-lamphu','bueng-kan'],
  central: ['bangkok','nonthaburi','pathum-thani','samut-prakan','samut-sakhon','samut-songkhram','nakhon-pathom','ayutthaya','ang-thong','lopburi','sing-buri','chai-nat','saraburi','suphan-buri','nakhon-nayok'],
  east: ['chonburi','rayong','chanthaburi','trat','chachoengsao','prachinburi','sa-kaeo'],
  west: ['kanchanaburi','ratchaburi','phetchaburi','prachuap-khiri-khan'],
  south: ['phuket','krabi','surat-thani','phang-nga','nakhon-si-thammarat','songkhla','trang','satun','chumphon','ranong','phatthalung','pattani','yala','narathiwat'],
};
const p2r = {}; for (const [r, ps] of Object.entries(REG)) for (const p of ps) p2r[p] = r;

const item = (name, slug, cs, isNew) => ({ name, slug, clusterSlug: cs, isNew: !!isNew });
// existing genuine kid attractions
const existing = arr.map(a => ({ name: a.name, slug: String(a.url).replace(/^https?:\/\/[^/]+\//, '').replace(/\.html$/, ''), cs: provSlug(a.city) }))
  .filter(a => slugSet.has(a.slug) && !newSlugs.has(a.slug) && STRONG.test(a.name) && !EXCLUDE.test(a.name));

const OUT = {};
for (const r of Object.keys(REG)) OUT[r] = {};
for (const a of existing) { const r = p2r[a.cs]; if (!r) continue; (OUT[r][a.cs] ||= []).push(item(a.name, a.slug, a.cs, false)); }
for (const a of NEW) { const r = p2r[a.cluster]; if (!r) continue; (OUT[r][a.cluster] ||= []).push(item(a.th, a.slug, a.cluster, true)); }

for (const [r, provs] of Object.entries(OUT)) {
  fs.writeFileSync(path.join(ROOT, '_internal/kids-data', 'pool-' + r + '.json'), JSON.stringify(provs, null, 1));
  const total = Object.values(provs).reduce((s, x) => s + x.length, 0);
  const newN = Object.values(provs).flat().filter(x => x.isNew).length;
  console.log(`${r.padEnd(10)} ${Object.keys(provs).length} provinces · ${total} kid attractions (${newN} new famous + ${total - newN} existing)`);
}

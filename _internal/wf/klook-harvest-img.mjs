import https from 'node:https';
import fs from 'node:fs';

const UA = 'thailandaddict-imgharvest/1.0 (https://thailandaddict.com; contact@thailandaddict.com)';
const get = (url) => new Promise((res, rej) => {
  https.get(url, { headers: { 'User-Agent': UA } }, r => {
    if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) { r.resume(); return res(get(r.headers.location)); }
    let d = ''; r.on('data', c => d += c); r.on('end', () => res({ status: r.statusCode, body: d }));
  }).on('error', rej);
});
const head = (url) => new Promise((res) => {
  https.request(url, { method: 'HEAD', headers: { 'User-Agent': UA } }, r => { r.resume(); res(r.statusCode); })
    .on('error', () => res(0)).end();
});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clean = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

// products: slug + candidate queries (English titles hit Commons best) + a Thai alt label for the credit line
const PRODUCTS = [
  { slug: 'khao-kheow-open-zoo',   q: ['Khao Kheow Open Zoo', 'Khao Khiao Open Zoo'] },
  { slug: 'bangsaen-aquarium',     q: ['Institute of Marine Science Bangsaen', 'Bangsaen Aquarium', 'Bang Saen Beach'] },
  { slug: 'koh-sichang-day-trip',  q: ['Ko Sichang', 'Koh Sichang', 'Ko Si Chang'] },
  { slug: 'silverlake-vineyard',   q: ['Silverlake Vineyard', 'Silverlake Vineyard Pattaya', 'Khao Chi Chan'] },
  { slug: 'bang-phra-reservoir',   q: ['Bang Phra Reservoir', 'Ang Kep Nam Bang Phra', 'Si Racha District'] },
  { slug: 'bangsaen-beach',        q: ['Bangsaen Beach', 'Bang Saen', 'Wonnapha Beach'] },
  { slug: 'sriracha-sichang-ferry',q: ['Ko Loi Si Racha', 'Si Racha', 'Ko Sichang pier'] },
  { slug: 'viharn-sien',           q: ['Viharn Sien', 'Wat Yannasangwararam', 'Anek Kusala Sala'] },
];

async function searchImages(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=1280&format=json`;
  const r = await get(url);
  if (r.status !== 200) return [];
  let j; try { j = JSON.parse(r.body); } catch { return []; }
  const pages = j.query && j.query.pages ? Object.values(j.query.pages) : [];
  const out = [];
  for (const p of pages) {
    const ii = p.imageinfo && p.imageinfo[0]; if (!ii) continue;
    if (ii.mime && !/^image\/(jpeg|png)$/.test(ii.mime)) continue;   // skip svg/gif/tif
    const m = ii.extmetadata || {};
    const lic = clean((m.LicenseShortName && m.LicenseShortName.value));
    if (!/^(CC|Public domain)/i.test(lic)) continue;                  // CC / PD only
    const artist = clean(m.Artist && m.Artist.value).slice(0, 60) || 'Wikimedia Commons';
    out.push({
      title: p.title.replace('File:', ''),
      src: ii.thumburl || ii.url,
      credit: `ภาพ: ${artist} · ${lic}`,
      creditHref: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
      idx: p.index ?? 99,
    });
  }
  return out.sort((a, b) => a.idx - b.idx);
}

const result = {};
for (const prod of PRODUCTS) {
  const seen = new Set(); const pics = [];
  for (const query of prod.q) {
    if (pics.length >= 4) break;
    const found = await searchImages(query);
    await sleep(400);
    for (const f of found) {
      if (pics.length >= 4) break;
      const key = f.src.split('/thumb/')[1]?.split('/').slice(0, 2).join('/') || f.src;
      if (seen.has(key)) continue; seen.add(key);
      const code = await head(f.src); await sleep(250);
      if (code === 200) pics.push(f);
    }
  }
  result[prod.slug] = pics;
  console.log(`${prod.slug}: ${pics.length} รูป verified 200` + (pics.length < 2 ? '  ⚠️ น้อย' : ''));
}
fs.writeFileSync(process.argv[2], JSON.stringify(result, null, 1));
const total = Object.values(result).reduce((s, a) => s + a.length, 0);
const thin = Object.entries(result).filter(([, a]) => a.length < 2).map(([k]) => k);
console.log(`\nรวม ${total} รูป · สินค้าที่รูปน้อยกว่า 2: ${thin.join(', ') || 'ไม่มี'}`);

// Build a REUSABLE licensed Thai-food image library from Wikimedia Commons (CC-licensed).
// Output: astro/public/images/food/_lib/<key>.jpg  +  _internal/food-image-lib.json (manifest w/ credit + match keywords).
// Used by the eat-ranking engine as a representative-photo fallback when a restaurant has no real IG/FB embed.
// Run from the astro dir (so `sharp` resolves):  cd astro && node ../_internal/build-food-lib.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const sharp = createRequire('C:/Users/Imac/Thailandaddict/thailandaddict/astro/package.json')('sharp');

const UA = 'ThailandAddict-FoodLib/1.0 (https://thailandaddict.com; chatmaliwan@gmail.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUTDIR = 'public/images/food/_lib';                       // relative to astro/
const MANIFEST = '../_internal/food-image-lib.json';            // repo _internal/
fs.mkdirSync(OUTDIR, { recursive: true });

// key → { search term(s), Thai+EN match keywords }
const DISHES = [
  { key:'khao-soi',        search:'Khao soi',                 kw:['ข้าวซอย','khao soi'] },
  { key:'northern-thai',   search:'Sai ua',                   kw:['อาหารเหนือ','ไส้อั่ว','ลาบ','แกงฮังเล','northern thai','lanna','sai ua'] },
  { key:'dim-sum',         search:'Dim sum',                  kw:['ติ่มซำ','dim sum','ขนมจีบ','ฮะเก๋า'] },
  { key:'noodle',          search:'Kuaitiao noodle Thai',     kw:['ก๋วยเตี๋ยว','บะหมี่','เส้น','noodle','kuaitiao'] },
  { key:'boat-noodle',     search:'Boat noodle',              kw:['ก๋วยเตี๋ยวเรือ','boat noodle'] },
  { key:'som-tam',         search:'Som tam papaya salad',     kw:['ส้มตำ','ตำ','som tam','papaya salad'] },
  { key:'tom-yum',         search:'Tom yum goong',            kw:['ต้มยำ','tom yum'] },
  { key:'pad-thai',        search:'Pad thai',                 kw:['ผัดไทย','pad thai'] },
  { key:'chicken-rice',    search:'Hainanese chicken rice',   kw:['ข้าวมันไก่','chicken rice','khao man kai'] },
  { key:'khao-kha-moo',    search:'Khao kha mu pork leg rice',kw:['ข้าวขาหมู','ขาหมู','pork leg'] },
  { key:'grilled-chicken', search:'Kai yang grilled chicken', kw:['ไก่ย่าง','kai yang','grilled chicken'] },
  { key:'thai-curry',      search:'Thai green curry',         kw:['แกง','แกงเขียวหวาน','มัสมั่น','curry','massaman'] },
  { key:'mango-sticky',    search:'Mango sticky rice',        kw:['มะม่วงข้าวเหนียว','mango sticky'] },
  { key:'cafe-coffee',     search:'Latte coffee cafe',        kw:['คาเฟ่','กาแฟ','cafe','coffee','latte','เครื่องดื่ม'] },
  { key:'seafood',         search:'Thai seafood',             kw:['อาหารทะเล','seafood','กุ้ง','ปู'] },
  { key:'street-food',     search:'Thai street food',         kw:['สตรีทฟู้ด','street food','ตลาด','ของกิน'] },
  { key:'larb-isaan',      search:'Larb Isan food',           kw:['ลาบ','อีสาน','isan','isaan','น้ำตก'] },
  { key:'congee-jok',      search:'Congee jok rice porridge', kw:['โจ๊ก','ข้าวต้ม','congee','porridge'] },
  { key:'mookata',         search:'Mu kratha Thai bbq',       kw:['หมูกระทะ','mookata','bbq','ปิ้งย่าง','บุฟเฟ่ต์'] },
  { key:'thai-dessert',    search:'Thai dessert khanom',      kw:['ขนม','ของหวาน','dessert','ขนมไทย'] },
];

const okLicense = (code, name) => {
  const s = (code || name || '').toLowerCase();
  return /^(cc0|cc-by|cc-by-sa|pd|public)/.test(s) || /public domain|cc0|attribution/.test(s);
};
const txt = v => (v || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function api(params) {
  const u = 'https://commons.wikimedia.org/w/api.php?format=json&' + new URLSearchParams(params);
  for (let i = 0; i < 6; i++) {
    const r = await fetch(u, { headers: { 'User-Agent': UA } });
    const t = await r.text();
    try { return JSON.parse(t); } catch { await sleep(2500 * (i + 1)); }
  }
  throw new Error('api throttled');
}

async function pickFile(search) {
  const s = await api({ action:'query', list:'search', srsearch:search, srnamespace:'6', srlimit:'10' });
  const titles = (s.query?.search || []).map(x => x.title).slice(0, 8);
  for (const title of titles) {
    if (!/\.(jpe?g|png)$/i.test(title)) continue;
    await sleep(700);
    const info = await api({ action:'query', titles:title, prop:'imageinfo', iiprop:'url|size|extmetadata' });
    const p = Object.values(info.query?.pages || {})[0];
    const ii = p?.imageinfo?.[0]; if (!ii) continue;
    const m = ii.extmetadata || {};
    const licCode = m.License?.value, licName = m.LicenseShortName?.value;
    if (!okLicense(licCode, licName)) continue;
    if (ii.width < 800) continue;
    const author = txt(m.Artist?.value).slice(0, 50) || 'Wikimedia Commons';
    return { title, url: ii.url, w: ii.width, h: ii.height, license: licName || licCode, author,
      filePage: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')) };
  }
  return null;
}

const manifest = [];
let ok = 0, miss = 0;
for (const d of DISHES) {
  try {
    const f = await pickFile(d.search);
    if (!f) { console.log(`✗ ${d.key}: no CC file found`); miss++; continue; }
    const tmp = path.join(OUTDIR, `_tmp_${d.key}`);
    let buf = null;
    for (let i = 0; i < 4; i++) {
      buf = Buffer.from(await (await fetch(f.url, { headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' } })).arrayBuffer());
      const jpg = buf[0] === 0xFF && buf[1] === 0xD8, png = buf[0] === 0x89 && buf[1] === 0x50;
      if ((jpg || png) && buf.length > 15000) break;
      await sleep(2500 * (i + 1)); buf = null;
    }
    if (!buf) { console.log(`✗ ${d.key}: download blocked/throttled`); miss++; continue; }
    fs.writeFileSync(tmp, buf);
    const out = path.join(OUTDIR, `${d.key}.jpg`);
    const meta = await sharp(tmp).resize(1000, 600, { fit:'cover', position:'centre' }).jpeg({ quality:82, mozjpeg:true }).toFile(out);
    fs.unlinkSync(tmp);
    const credit = `ภาพประกอบ: ${d.kw[0]} · ${f.author} / Wikimedia (${f.license})`;
    manifest.push({ key:d.key, img:`/images/food/_lib/${d.key}.jpg`, credit, creditHref:f.filePage,
      license:f.license, author:f.author, keywords:d.kw });
    console.log(`✓ ${d.key}: ${f.license} · ${Math.round(meta.size/1024)}KB · ${f.author}`);
    ok++;
  } catch (e) { console.log(`✗ ${d.key}: ${e.message}`); miss++; }
  await sleep(1000);
}

fs.writeFileSync(MANIFEST, JSON.stringify({ note:'Reusable CC-licensed Thai-food image library. Match a restaurant foodType/cuisine against `keywords`; use `img`+`credit`+`creditHref` as a representative photo when no real IG/FB embed exists.', generated:'2026-06-21', count:manifest.length, images:manifest }, null, 2) + '\n');
console.log(`\n${miss ? '⚠️' : '✓'} built ${ok} library images, ${miss} missed → ${MANIFEST}`);

// Build/refresh migration manifest from WP raw post dumps. Status-preserving (re-runnable).
import fs from 'node:fs';
import path from 'node:path';
const dir = import.meta.dirname;
const strip = s => (s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#?\w+;/g, ' ').trim();

let raw = [];
for (const p of [1, 2, 3]) {
  const f = path.join(dir, `_raw${p}.json`);
  if (fs.existsSync(f)) raw.push(...JSON.parse(fs.readFileSync(f, 'utf8')));
}

// demo/junk posts (English WP theme placeholders) → skip
const DEMO = /love-advice|perfect-summer-body|fashion-outfit|worlds-hottest-destinations|best-hotel-wordpress-theme|7-things-you-tell|sun-is-underappreciated|an-overly-close|santa-barbara-wildfire|perfect-day-in-the-nature|smile-is-a-sign|happy-fammily|you-big-profit|foundry-coffee/i;

// city/cluster inference (keyword in slug/title → cluster slug)
const CITY = [
  [/khao-?yai|korat|nakhon-ratchasima|wang-nam-kheaw|pak-?chong|phimai/i, 'nakhon-ratchasima'],
  [/chiang-?mai|chiangmai|nimman|wualai/i, 'chiang-mai'],
  [/chiang-?rai|chang-?rai/i, 'chiang-rai'],
  [/pattaya|tattaya|jomtien|sattahip|sriracha|laemchabang|bang-?saen|bangsaen|ang-sila|koh-larn|koh-sichang|amata|burapha|bang-saray|chonburi|chonbulee/i, 'chonburi'],
  [/koh-chang|koh-kood|koh-kud|ko-mak|koh-mak|^.*trat|trad|tard/i, 'trat'],
  [/rayong|rayoung|samet|samed|mae-phim|mae-pim|ban-chang|wang-keaw/i, 'rayong'],
  [/hua-?hin|huahin|prachuap|sam-roi|bang-saphan|huay-yang|khlong-wan|pranburi|takiab|kui/i, 'prachuap-khiri-khan'],
  [/kanchanaburi|sangkhla|thongphaphum|srinakarin|sai-yok|kg-house/i, 'kanchanaburi'],
  [/phetchabun|khao-kho|khaokho/i, 'phetchabun'],
  [/phetchaburi|cha-?am|chaam/i, 'phetchaburi'],
  [/ratchaburi|suan-phung/i, 'ratchaburi'],
  [/chanthaburi|chantaburee|kung-wiman|chao-lao|khung|baan-rim-ao/i, 'chanthaburi'],
  [/krabi|ao-nang/i, 'krabi'],
  [/phang-?nga|khaolak|khao-lak/i, 'phang-nga'],
  [/nakhon-si-thammarat|nakhonsithammarat/i, 'nakhon-si-thammarat'],
  [/mae-hong-son|pai-/i, 'mae-hong-son'],
  [/\bnan\b|boklua|bo-?kluea|sapan/i, 'nan'],
  [/phayao/i, 'phayao'],
  [/lampang|ram-pang|lumpang/i, 'lampang'],
  [/lamphun|lamphan/i, 'lamphun'],
  [/phrae/i, 'phrae'],
  [/loei|chiangkhan|chiang-khan/i, 'loei'],
  [/nong-khai/i, 'nong-khai'],
  [/nakhon-phanom/i, 'nakhon-phanom'],
  [/sakon-?nakhon|sakolnakorn|sakon/i, 'sakon-nakhon'],
  [/udon/i, 'udon-thani'],
  [/ubon/i, 'ubon-ratchathani'],
  [/khon-kaen/i, 'khon-kaen'],
  [/buriram|burirum|burirum/i, 'buriram'],
  [/\btak\b|mae-sot/i, 'tak'],
  [/sakaeo|sa-kaeo|aranyaprathet|kason-buffalo/i, 'sa-kaeo'],
  [/prachin|kabin|304-industrial/i, 'prachinburi'],
  [/chachoengsao/i, 'chachoengsao'],
  [/bts|mrt|ari-|ratchathewi|phayathai|morchit|bangchak|sanampao/i, 'bangkok'],
];
const inferCity = (slug, title) => { const s = slug + ' ' + title; for (const [re, c] of CITY) if (re.test(s)) return c; return 'unknown'; };

const inferType = (slug, title) => {
  const s = (slug + ' ' + title).toLowerCase();
  if (/hotel|hostel|resort|ที่พัก|โรงแรม|apartment|พัก/i.test(s)) return 'hotel-roundup';
  if (/restaurant|cafe|food|ร้านอาหาร|คาเฟ่|ข้าวซอย|khao-soi|dinner|อาหาร|กิน|nighttime/i.test(s)) return 'food-guide';
  if (/travel|destination|temple|ที่เที่ยว|เที่ยว|road-?trip|check-in|walking-street|วัด|จุดเช็คอิน|green-trip/i.test(s)) return 'travel-guide';
  return 'other';
};

// preserve existing status if manifest exists
const outPath = path.join(dir, 'manifest.json');
const prev = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : { posts: [] };
const prevBy = Object.fromEntries((prev.posts || []).map(p => [p.id, p]));

const posts = raw.map(r => {
  const slug = r.slug, title = strip(r.title?.rendered || '');
  const demo = DEMO.test(slug);
  const type = demo ? 'demo' : inferType(slug, title);
  const city = demo ? '-' : inferCity(slug, title);
  const old = prevBy[r.id] || {};
  return {
    id: r.id,
    oldSlug: slug,
    oldUrl: r.link || `https://thailandaddict.com/${slug}/`,
    title, date: (r.date || '').slice(0, 10),
    type, city,
    status: old.status || (demo ? 'skip' : 'not-started'),
    newRoundupSlug: old.newRoundupSlug || '',
    reviewSlugs: old.reviewSlugs || [],
    newUrls: old.newUrls || [],
    redirectTo: old.redirectTo || '',
    notes: old.notes || '',
    doneDate: old.doneDate || '',
  };
});
posts.sort((a, b) => (a.city || '').localeCompare(b.city) || a.type.localeCompare(b.type));

fs.writeFileSync(outPath, JSON.stringify({ generated: new Date().toISOString?.() || '', total: posts.length, posts }, null, 2));
const byType = {}, byCity = {}, byStatus = {};
for (const p of posts) { byType[p.type] = (byType[p.type]||0)+1; byCity[p.city]=(byCity[p.city]||0)+1; byStatus[p.status]=(byStatus[p.status]||0)+1; }
console.log('total', posts.length);
console.log('byType', JSON.stringify(byType));
console.log('byStatus', JSON.stringify(byStatus));
console.log('unknown-city posts:', posts.filter(p=>p.city==='unknown'&&p.type!=='demo').map(p=>p.oldSlug).join(', ') || 'none');

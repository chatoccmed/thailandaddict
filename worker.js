// thailandaddict Worker — serves /api/* dynamically (Workers AI), passes everything else to static assets.
// Static .html/assets are served BEFORE this Worker runs (free); the Worker only fires for non-asset paths.
import { SLUG2TH, provSlug, locSlug } from './worker-provinces.js';

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const CAP = { see: 8, eat: 5, stay: 4 };           // candidate gap-fill caps per type
const AI_TIMEOUT_MS = 28000;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      // Abuse guard on the write/compute endpoints. /api/plan burns Workers-AI neurons per call and the
      // others write KV unauthenticated, so an unmetered loop is a denial-of-wallet vector. Backed by
      // Cloudflare's native Rate Limiting bindings (RL_PLAN / RL_WRITE — accurate, unlike a KV counter
      // whose edge read-caching lets bursts slip through). Limits live in wrangler.jsonc; fails OPEN so a
      // binding hiccup never blocks real visitors.
      if (url.pathname === '/api/plan' && request.method === 'POST') {
        if (!await allow(env.RL_PLAN, request, 'plan')) return tooMany();
        return await handlePlan(request, env);
      }
      if (url.pathname === '/api/plan') return json({ ok: false, error: 'POST only' }, 405);
      if (url.pathname === '/api/suggest') {
        if (!await allow(env.RL_WRITE, request, 'suggest')) return tooMany();
        return await handleSuggest(request, env);
      }
      if (url.pathname === '/api/trips' && request.method === 'POST') {
        if (!await allow(env.RL_WRITE, request, 'trips')) return tooMany();
        return await saveTrip(request, env);
      }
      const cm = url.pathname.match(/^\/api\/trips\/([a-z0-9]+)\/(vote|suggest)$/i);
      if (cm && request.method === 'POST') {
        if (!await allow(env.RL_WRITE, request, 'collab')) return tooMany();
        return await collabAction(request, env, cm[1], cm[2].toLowerCase());
      }
      const tm = url.pathname.match(/^\/api\/trips\/([a-z0-9]+)$/i);
      if (tm) return await getTrip(tm[1], env);
      if (url.pathname === '/api/email' && request.method === 'POST') {
        if (!await allow(env.RL_WRITE, request, 'email')) return tooMany();
        return await saveEmail(request, env);
      }
      if (url.pathname === '/api/contact' && request.method === 'POST') {
        if (!await allow(env.RL_WRITE, request, 'contact')) return tooMany();
        return await saveContact(request, env);
      }
      const sm = url.pathname.match(/^\/t\/([a-z0-9]+)$/i);
      if (sm) return await serveSharedTrip(request, env, sm[1]);
    } catch (e) {
      // don't leak internal error detail (stack/messages) to clients; expose it only under ?debug
      const dbg = url.searchParams.has('debug');
      return json({ ok: false, error: 'server_error', ...(dbg ? { detail: String(e && e.message || e) } : {}) }, 500);
    }
    // all other paths → static assets (also yields the 404 page for unknown routes)
    return env.ASSETS.fetch(request);
  }
};

async function handlePlan(request, env) {
  const body = await request.json().catch(() => ({}));
  const saved = Array.isArray(body.saved) ? body.saved : [];
  const prefs = normPrefs(body.prefs || {});

  // 1. target locations: from prefs + saved (province-level for broad pooling)
  const targets = new Set();
  for (const p of prefs.provinces) { const s = provSlug(p); if (s) targets.add(s); }
  for (const it of saved) { const s = provSlug(it.province || it.city); if (s) targets.add(s); }

  // 2. load feeds once → candidates (gap-fill) + an index to enrich SAVED items with real img/price/hours
  const feeds = targets.size ? await loadFeeds(request, env) : { hotels: [], attractions: [], restaurants: [] };
  const idx = getIndex(feeds);
  saved.forEach(s => { const e = idx[normName(s.name)]; if (e) { s.img = s.img || e.img; s.price = s.price || e.price; s.hours = s.hours || e.hours; s.htype = s.htype || e.htype; s.loc = s.loc || e.loc; s.agoda = s.agoda || e.agoda; if (s.lat == null) { s.lat = e.lat; s.lng = e.lng; } } });
  const candidates = buildCandidates(feeds, targets, saved, prefs);
  const hotelPicks = pickHotels(feeds, targets, saved, prefs);  // style-matched hotel options for the UI section

  // 3. build the allowed pool (saved + candidates), each with a short id (carries real img/price/hours)
  const pool = [];
  const push = (it, source) => {
    const type = it.type === 'stay' || it.type === 'eat' || it.type === 'see' ? it.type : 'see';
    pool.push({
      id: (source === 'saved' ? 's' : 'c') + pool.length,
      type, name: strip(it.name), url: clean(it.url),
      province: SLUG2TH[provSlug(it.province || it.city)] || it.province || it.city || '',
      meta: it.meta || '', img: it.img || '', price: it.price || '', hours: it.hours || '', htype: it.htype || '', loc: it.loc || '', agoda: it.agoda || '',
      lat: typeof it.lat === 'number' ? it.lat : null, lng: typeof it.lng === 'number' ? it.lng : null, source
    });
  };
  saved.forEach(s => push(s, 'saved'));
  candidates.stay.forEach(c => push({ ...c, type: 'stay' }, 'cand'));
  candidates.see.forEach(c => push({ ...c, type: 'see' }, 'cand'));
  candidates.eat.forEach(c => push({ ...c, type: 'eat' }, 'cand'));

  if (!pool.length) return json({ ok: false, error: 'empty', message: 'ยังไม่มีรายการให้จัดทริป — กดเพิ่มที่พัก/ร้าน/ที่เที่ยวก่อน หรือเลือกจังหวัด' }, 200);

  // 4. ask the AI to arrange (ids only); retry once, then fall back to a deterministic plan
  const debug = new URL(request.url).searchParams.has('debug');
  let itin = null, usedAI = false, dbg = [];
  for (let attempt = 0; attempt < 2 && !usedAI; attempt++) {
    try {
      const raw = await withTimeout(callAI(env, pool, prefs), AI_TIMEOUT_MS);
      const ai = unwrap(raw);
      const r = resolve(ai, pool, prefs);
      if (debug) dbg.push({ attempt, days: r && r.days ? r.days.length : 0, snip: typeof raw?.response === 'string' ? raw.response.slice(0, 200) : JSON.stringify(raw).slice(0, 200) });
      if (r && r.days && r.days.length) { itin = r; usedAI = true; }
    } catch (e) { if (debug) dbg.push({ attempt, err: String(e && e.message || e) }); }
  }
  if (!usedAI) itin = fallback(pool, prefs);

  // alternatives the client can swap in instantly (no AI call) — powers Smart Swap + rest-stop suggestion
  const provTH = c => SLUG2TH[provSlug(c.city)] || c.city || '';
  const swapPool = {
    stay: candidates.stay.map(c => ({ type: 'stay', name: strip(c.name), url: clean(c.url), img: c.img || '', price: c.price || '', htype: c.htype || '', loc: c.loc || '', agoda: c.agoda || '', lat: c.lat, lng: c.lng, province: provTH(c) })),
    see: candidates.see.map(c => ({ type: 'see', name: strip(c.name), url: clean(c.url), img: c.img || '', lat: c.lat, lng: c.lng, province: provTH(c), tag: c.meta || '' })),
    eat: candidates.eat.map(c => ({ type: 'eat', name: strip(c.name), url: clean(c.url), img: c.img || '', price: c.price || '', hours: c.hours || '', lat: c.lat, lng: c.lng, province: provTH(c), tag: c.meta || '' })),
  };

  return json({ ok: true, usedAI, ...(debug ? { dbg } : {}), prefs, poolSize: pool.length, itinerary: itin, hotelPicks, swapPool });
}

// live suggestions for the form (browse + add before generating) — reuses the candidate/style logic
async function handleSuggest(request, env) {
  const u = new URL(request.url);
  const provinces = (u.searchParams.get('provinces') || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 6);
  const interests = (u.searchParams.get('interests') || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 8);
  const prefs = { provinces, interests, kids: u.searchParams.get('kids') === '1', elderly: u.searchParams.get('elderly') === '1', pace: u.searchParams.get('pace') || 'สมดุล', budget: '' };
  const targets = new Set(); provinces.forEach(p => { const s = provSlug(p); if (s) targets.add(s); });
  if (!targets.size) return json({ ok: true, see: [], eat: [], stay: [] });
  const feeds = await loadFeeds(request, env);
  const cand = buildCandidates(feeds, targets, [], prefs);
  const picks = pickHotels(feeds, targets, [], prefs);
  const provTH = c => SLUG2TH[provSlug(c.city)] || c.city || '';
  return new Response(JSON.stringify({
    ok: true,
    stay: picks.slice(0, 6),
    eat: cand.eat.map(c => ({ name: strip(c.name), url: clean(c.url), img: c.img || '', price: c.price || '', province: provTH(c) })),
    see: cand.see.map(c => ({ name: strip(c.name), url: clean(c.url), img: c.img || '', province: provTH(c), tag: c.meta || '' })),
  }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=600' } });
}

// ---- feeds ----
// The three feeds total ~2.4 MB and were fetched + JSON.parsed on EVERY /api/plan and /api/suggest call.
// Cache them at module scope per warm isolate (10 min) — the feeds only change on deploy, so this cuts
// ~2.4 MB of fetch+parse off the hot path without risking staleness beyond a rebuild cycle.
let _feedsCache = null, _feedsAt = 0;
const FEEDS_TTL_MS = 10 * 60 * 1000;
// Cache the derived name→data index alongside the feeds so /api/plan doesn't rebuild it (~4.9k items)
// on every request. Identity-keyed: recomputes only when loadFeeds returns a different feeds object.
let _idxCache = null, _idxSrc = null;
function getIndex(feeds) { if (_idxCache && _idxSrc === feeds) return _idxCache; _idxCache = buildIndex(feeds); _idxSrc = feeds; return _idxCache; }
async function loadFeeds(request, env) {
  if (_feedsCache && (Date.now() - _feedsAt) < FEEDS_TTL_MS) return _feedsCache;
  const get = async (name) => {
    try {
      const r = await env.ASSETS.fetch(new Request(new URL('/feeds/' + name + '.json', request.url)));
      if (!r.ok) return [];
      const d = await r.json();
      return Array.isArray(d) ? d : (d.items || []);
    } catch { return []; }
  };
  const [hotels, attractions, restaurants] = await Promise.all([get('hotels'), get('attractions'), get('restaurants')]);
  const feeds = { hotels, attractions, restaurants };
  if (hotels.length || attractions.length || restaurants.length) { _feedsCache = feeds; _feedsAt = Date.now(); }  // don't cache an all-empty fetch failure
  return feeds;
}
// name -> real {img,price,hours} so SAVED items (which only carry name/url) get enriched too
function buildIndex(feeds) {
  const idx = {};
  const add = (name, o) => { const k = normName(name); if (k && !idx[k]) idx[k] = o; };
  feeds.hotels.forEach(h => add(h.name, { img: h.img, price: h.price, agoda: h.agoda, htype: h.type, loc: h.loc, lat: h.lat, lng: h.lng }));
  feeds.attractions.forEach(a => add(a.name, { img: a.img, lat: a.lat, lng: a.lng }));
  feeds.restaurants.forEach(r => add(r.name, { img: r.img, price: r.price, hours: r.hours, lat: r.lat, lng: r.lng }));
  return idx;
}
// rank hotels by fit to the user's chosen style (interests/pace/who/budget), honest heuristics on real type+price+score
function styleScore(h, prefs) {
  let s = (typeof h.score === 'number' ? h.score : 7);
  const t = (h.type || '').toLowerCase();
  const intr = (prefs.interests || []).join(' ');
  const nature = /ธรรมชาติ|ทะเล|เกาะ/.test(intr), city = /เมือง|ไลฟ์|ช้อป/.test(intr);
  if (nature && /resort|villa|beach|pool|รีสอร์ต|บังกะโล|วิลล่า|หาด|สวน|ติดหาด/.test(t)) s += 3;
  if (city && /city|เมือง|boutique|บูทีค|hotel|โรงแรม/.test(t)) s += 2;
  if (prefs.pace === 'ชิล' && /resort|villa|pool|รีสอร์ต|วิลล่า|สปา|บูทีค|สวน/.test(t)) s += 2;
  if ((prefs.kids || prefs.elderly) && /resort|รีสอร์ต|อพาร์ต|service|apartment|สวน/.test(t)) s += 1;
  const b = parseNum(prefs.budget), p = parseNum(h.price);
  if (b && p) { if (p <= b * 1.5) s += 2; else if (p > b * 3) s -= 4; }
  return s;
}
function parseNum(s) { const m = String(s || '').replace(/,/g, '').match(/\d{3,7}/); return m ? +m[0] : 0; }
// honest name-based interest matching for attractions (we only have names, no tags)
const INTEREST_KW = {
  'ธรรมชาติ': /น้ำตก|ดอย|อุทยาน|ภูเขา|เขา|ถ้ำ|ทะเลสาบ|สวน|ป่า|ไร่|นา|พุน้ำ|บ่อน้ำ|จุดชมวิว|วิว|ทุ่ง|เขื่อน|หนอง|บึง/,
  'ทะเล&เกาะ': /ทะเล|เกาะ|หาด|อ่าว|ดำน้ำ|แหลม|ปะการัง/,
  'วัฒนธรรม&วัด': /วัด|พระธาตุ|พิพิธภัณฑ์|โบราณ|วัง|ประวัติศาสตร์|เจดีย์|ศาล|อนุสรณ์|วิหาร/,
  'เที่ยวเมือง': /เมืองเก่า|ถนนคนเดิน|ตลาด|ย่าน|ชุมชน|กาด/,
  'แลนด์มาร์ค': /แลนด์มาร์ค|จุดชมวิว|สะพาน|หอ|อนุสาวรีย์|หอคอย|สกายวอล์ค|skywalk/i,
  'ช้อปปิ้ง': /ตลาด|ช้อป|เซ็นทรัล|มาร์เก็ต|ห้าง|outlet/i,
  'ไลฟ์กลางคืน': /บาร์|กลางคืน|ไนท์|ผับ|รูฟท็อป|night/i,
  'ร้านอาหาร&คาเฟ่': /คาเฟ่|กาแฟ|ร้านอาหาร|cafe|coffee/i,
};
// interest -> data-layer tags (preferred signal when a place is tagged; falls back to name keywords)
const INTEREST_TAGS = {
  'ธรรมชาติ': ['nature', 'waterfall', 'mountain', 'park', 'viewpoint', 'cave', 'lake', 'hotspring', 'outdoor'],
  'ทะเล&เกาะ': ['sea', 'beach', 'island'],
  'วัฒนธรรม&วัด': ['temple', 'museum', 'culture', 'palace', 'shrine', 'history'],
  'เที่ยวเมือง': ['oldtown', 'market', 'citywalk', 'walkingstreet'],
  'แลนด์มาร์ค': ['landmark', 'iconic', 'bridge', 'skywalk', 'viewpoint'],
  'ช้อปปิ้ง': ['shopping', 'mall', 'market'],
  'ไลฟ์กลางคืน': ['nightlife', 'bar', 'rooftop'],
  'ร้านอาหาร&คาเฟ่': ['cafe', 'restaurant', 'streetfood', 'localfood'],
};
function matchInterest(name, tags, interests) {
  let s = 0, tag = '';
  const ts = Array.isArray(tags) ? tags : [];
  for (const it of interests) {
    const tagHit = (INTEREST_TAGS[it] || []).some(x => ts.includes(x));
    const nameHit = INTEREST_KW[it] && INTEREST_KW[it].test(name);
    if (tagHit || nameHit) { s += tagHit ? 2 : 1; if (!tag) tag = it; }  // a tag match is a stronger signal than a name guess
  }
  return { s, tag };
}
// style-matched hotel options (full data) for the "ที่พักแนะนำ" section
function pickHotels(feeds, targets, saved, prefs) {
  const savedNames = new Set(saved.map(s => normName(s.name)));
  const byProv = {};
  feeds.hotels.filter(h => { const s = provSlug(h.city); return s && targets.has(s) && !savedNames.has(normName(h.name)); })
    .forEach(h => { const ps = provSlug(h.city); (byProv[ps] || (byProv[ps] = [])).push(h); });
  const out = [];
  Object.values(byProv).forEach(arr => arr.map(h => ({ h, sc: styleScore(h, prefs) })).sort((a, b) => b.sc - a.sc).slice(0, 3).forEach(({ h }) => out.push(h)));
  return out.slice(0, 8).map(h => ({ name: strip(h.name), url: h.url, img: h.img || '', price: h.price || '', score: typeof h.score === 'number' ? h.score : null, stars: typeof h.stars === 'number' ? h.stars : null, type: h.type || '', loc: h.loc || '', agoda: h.agoda || '', province: SLUG2TH[provSlug(h.city)] || h.city || '' }));
}
function buildCandidates(feeds, targets, saved, prefs) {
  const inTarget = (locField) => { const s = provSlug(locField); return s && targets.has(s); };
  const savedUrls = new Set(saved.map(s => clean(s.url)));
  const savedNames = new Set(saved.map(s => normName(s.name)));
  const fresh = (u, name) => !savedUrls.has(clean(u)) && !savedNames.has(normName(name));

  // per-province (top 3 each) so EVERY target province has bookable beds — a multi-province trip needs a hotel in each
  const stayByProv = {};
  feeds.hotels.filter(h => inTarget(h.city) && fresh(h.url, h.name)).forEach(h => { const ps = provSlug(h.city); (stayByProv[ps] || (stayByProv[ps] = [])).push(h); });
  const stay = [];
  Object.values(stayByProv).forEach(arr => arr.map(h => ({ h, sc: styleScore(h, prefs) })).sort((a, b) => b.sc - a.sc).slice(0, 3)
    .forEach(({ h }) => stay.push({ name: h.name, url: h.url, city: h.city, img: h.img, price: h.price, htype: h.type, loc: h.loc, agoda: h.agoda, lat: h.lat, lng: h.lng, meta: (h.type ? h.type : '') + (h.score ? ' · ★' + h.score : '') + (h.stars ? ' · ' + h.stars + '⭐' : '') })));

  // rank attractions by how well their NAME matches the chosen interests (honest, name-only data)
  const ints = prefs.interests || [];
  const see = feeds.attractions
    .filter(a => inTarget(a.city) && fresh(a.url, a.name))
    .map(a => { const m = matchInterest(a.name, a.tags, ints); return { a, sc: m.s, tag: m.tag }; })
    .sort((x, y) => y.sc - x.sc)
    .slice(0, CAP.see)
    .map(({ a, tag }) => ({ name: a.name, url: a.url, city: a.city, img: a.img, lat: a.lat, lng: a.lng, meta: tag || '' }));

  const eat = feeds.restaurants
    .filter(r => inTarget(r.province) && fresh(r.listUrl, r.name))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, CAP.eat)
    .map(r => ({ name: r.name, url: r.listUrl, city: r.province, img: r.img, price: r.price, hours: r.hours, lat: r.lat, lng: r.lng, meta: (r.foodType || '') + (r.rating ? ' · ★' + r.rating : '') }));

  return { stay, see, eat };
}

// ---- AI ----
function callAI(env, pool, prefs) {
  const lines = pool.map(p => `${p.id} [${TYPE_TH[p.type]}]${p.source === 'saved' ? '⭐' : ''} ${p.name}${p.province ? ' · ' + p.province : ''}${p.meta ? ' · ' + p.meta : ''}`).join('\n');
  const sys = [
    'คุณคือผู้วางแผนทริปเที่ยวไทยมืออาชีพ พูดจาเป็นกันเองเหมือนเพื่อนแนะนำเพื่อน',
    'กฎเหล็ก: ใช้ได้เฉพาะรายการใน "คลังตัวเลือก" ที่ให้มาเท่านั้น อ้างถึงด้วย id — ห้ามแต่งสถานที่/ชื่อใหม่เด็ดขาด ห้ามใส่ข้อมูลที่ไม่ได้ให้',
    'สำคัญที่สุด: รายการที่มีเครื่องหมาย ⭐ คือสิ่งที่ผู้ใช้เลือกบันทึกเอง — ต้องใส่ครบทุกอันในแผน ห้ามตัดทิ้ง · ถ้ามีที่พัก ⭐ ให้ใช้อันนั้นเป็นที่พักก่อนเสมอ · รายการที่ไม่มี ⭐ คือตัวเลือกเสริม ใช้เติมเฉพาะตอนที่แผนยังว่างหรือเพื่อให้ครบวัน',
    'จัดกลุ่มตามจังหวัด (อยู่จังหวัดเดียวกันให้อยู่วันเดียวกัน/ติดกัน) ลดการเดินทางย้อนไปมา',
    'แต่ละวันใส่ที่กิน+ที่เที่ยวสลับกันตามช่วงเวลา (เช้า/บ่าย/เย็น/ค่ำ) และเลือกที่พัก 1 แห่งต่อคืนจากในคลัง (type ที่พัก)',
    'จำนวนจุดต่อวันตามจังหวะ: ชิล/ครอบครัว 2-3 จุด · สมดุล 3-4 · อัดแน่น 4-5 (ไม่นับมื้ออาหาร) · ถ้ามีเด็กหรือผู้สูงอายุ ลดลง 1 จุดและเผื่อเวลาพัก/มื้ออาหารนานขึ้น · จังหวะครอบครัว = ชิลที่สุด ไม่อัดแน่น',
    'note: เขียนสั้นๆ 1 ประโยคว่าทำไม/ทำอะไร · travelNote: บอกแนวทางเดินทางจากจุดก่อนหน้าแบบกว้างๆ (เช่น "นั่งรถแดงต่อ ~15 นาที") ห้ามมั่วตัวเลขเป๊ะ',
    'dur: ประเมินเวลาที่ควรเผื่อสำหรับจุดนั้นแบบกว้างๆ เป็นช่วง เช่น "~1 ชม." หรือ "1-2 ชม." (เป็นการประมาณจากประเภทสถานที่ ไม่ใช่ข้อมูลตายตัว)',
    'เคารพสไตล์ความสนใจและรูปแบบการเดินทางของผู้ใช้ · ตอบเป็น JSON ตาม schema เท่านั้น ภาษาไทย'
  ].join('\n');
  const usr = [
    `แผน: ${prefs.days} วัน ${prefs.nights} คืน · ${prefs.pax} คน${prefs.kids ? ' (มีเด็ก)' : ''}${prefs.elderly ? ' (มีผู้สูงอายุ)' : ''}`,
    `จังหวะ: ${prefs.pace} · ความสนใจ: ${prefs.interests.join(', ') || 'ทั่วไป'} · การเดินทาง: ${prefs.transport}`,
    prefs.budget ? `งบ/วัน: ${prefs.budget}` : '',
    prefs.startFrom ? `เริ่มจาก: ${prefs.startFrom}` : '',
    '',
    'คลังตัวเลือก (ใช้เฉพาะ id เหล่านี้):',
    lines,
    '',
    'ตอบเป็น JSON object เดียวเท่านั้น ห้ามมีข้อความอื่นนอก JSON ตามรูปแบบนี้เป๊ะ:',
    '{"title":"ชื่อทริป","summary":"สรุปสั้นๆ","days":[{"day":1,"province":"จังหวัด","title":"หัวข้อวัน","items":[{"id":"s0","period":"เช้า","note":"ทำอะไร","travelNote":"เดินทางยังไง","dur":"~1 ชม."}],"hotelId":"sX"}],"tips":["ทิป"]}'
  ].filter(Boolean).join('\n');

  return env.AI.run(MODEL, {
    messages: [{ role: 'system', content: sys }, { role: 'user', content: usr }],
    max_tokens: 1600
  });
}

const ITIN_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    days: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'number' },
          province: { type: 'string' },
          title: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                period: { type: 'string' },
                note: { type: 'string' },
                travelNote: { type: 'string' }
              },
              required: ['id', 'period']
            }
          },
          hotelId: { type: 'string' }
        },
        required: ['day', 'items']
      }
    },
    tips: { type: 'array', items: { type: 'string' } }
  },
  required: ['title', 'days']
};

// Workers AI returns json_schema output under .response (object or string) — normalize to object
function unwrap(r) {
  let o = r && (r.response !== undefined ? r.response : r);
  if (typeof o === 'string') { try { o = JSON.parse(o); } catch { o = extractJson(o); } }
  return o;
}
function extractJson(s) { const a = s.indexOf('{'), b = s.lastIndexOf('}'); if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch {} } return null; }

// ---- resolve AI ids -> full items (drops invented ids; this is the anti-hallucination gate) ----
function resolve(ai, pool, prefs) {
  if (!ai || !Array.isArray(ai.days)) return null;
  const byId = Object.fromEntries(pool.map(p => [p.id, p]));
  const days = ai.days.map((d, i) => {
    const items = (d.items || []).map(it => {
      const p = byId[it.id];
      if (!p) return null;
      return { type: p.type, name: p.name, url: p.url, source: p.source, period: it.period || '', note: clip(it.note, 240), travelNote: clip(it.travelNote, 160), dur: clip(it.dur, 40), img: p.img || '', price: p.price || '', hours: p.hours || '', lat: p.lat, lng: p.lng };
    }).filter(Boolean);
    const hs = d.hotelId && byId[d.hotelId] && byId[d.hotelId].type === 'stay' ? byId[d.hotelId] : null;
    const hotel = hs ? { name: hs.name, url: hs.url, source: hs.source, img: hs.img || '', price: hs.price || '', htype: hs.htype || '', loc: hs.loc || '', agoda: hs.agoda || '', province: hs.province || '' } : null;
    return { day: d.day || (i + 1), province: clip(d.province, 60), title: clip(d.title, 120), items, hotel };
  }).filter(d => d.items.length || d.hotel);
  if (!days.length) return null;
  ensureSavedIncluded(days, pool);  // safety net: never drop a user-saved item
  ensureHotelPerNight(days, pool, prefs);  // guarantee a province-correct, bookable hotel every night (the revenue spine)
  return { title: clip(ai.title, 140) || 'แผนการเดินทางของคุณ', summary: clip(ai.summary, 600), days, tips: (ai.tips || []).slice(0, 6).map(t => clip(t, 200)), unused: unusedSaved(pool, days) };
}
// Every NIGHT (day.day <= nights) gets a hotel in ITS OWN province (one hotel reused per city = realistic);
// checkout day gets none; an AI-assigned hotel in the wrong province is replaced; prefer saved, else top style-ranked candidate.
function ensureHotelPerNight(days, pool, prefs) {
  const nights = (prefs && prefs.nights) || Math.max(0, days.length - 1);
  const stays = pool.filter(p => p.type === 'stay');  // pool order = saved first, then style-ranked candidates
  const chosen = {};  // province slug -> the one hotel for that city
  const toHotel = (p) => ({ name: p.name, url: p.url, source: p.source, img: p.img || '', price: p.price || '', htype: p.htype || '', loc: p.loc || '', agoda: p.agoda || '', province: p.province || '' });
  const pickFor = (ps) => {
    if (ps in chosen) return chosen[ps];
    const p = stays.find(s => s.source === 'saved' && provSlug(s.province) === ps) || stays.find(s => provSlug(s.province) === ps) || null;
    return (chosen[ps] = p ? toHotel(p) : null);
  };
  for (const d of days) {
    if (d.day > nights) { d.hotel = null; continue; }       // checkout day → no hotel
    const ps = provSlug(d.province);
    if (d.hotel && provSlug(d.hotel.province) === ps) { chosen[ps] = d.hotel; continue; }  // AI pick is province-correct → keep + reuse
    d.hotel = pickFor(ps);                                   // empty or wrong-province → the city's chosen hotel (null = honest empty slot)
  }
}
// guarantee every ⭐ saved item appears somewhere (AI sometimes omits them)
function ensureSavedIncluded(days, pool) {
  const used = new Set();
  days.forEach(d => { d.items.forEach(i => used.add(i.url)); if (d.hotel) used.add(d.hotel.url); });
  const missing = pool.filter(p => p.source === 'saved' && !used.has(p.url));
  for (const p of missing) {
    let day = days.find(d => p.province && d.province && (d.province.includes(p.province) || p.province.includes(d.province))) || days[0];
    if (p.type === 'stay' && day && !day.hotel) { day.hotel = { name: p.name, url: p.url, source: 'saved', img: p.img || '', price: p.price || '', htype: p.htype || '', loc: p.loc || '', agoda: p.agoda || '' }; }
    else if (day) { day.items.push({ type: p.type, name: p.name, url: p.url, source: 'saved', period: 'เพิ่มเติม', note: 'รายการที่คุณบันทึกไว้', travelNote: '', dur: '', img: p.img || '', price: p.price || '', hours: p.hours || '' }); }
  }
}
function unusedSaved(pool, days) {
  const used = new Set();
  days.forEach(d => { d.items.forEach(i => used.add(i.url)); if (d.hotel) used.add(d.hotel.url); });
  return pool.filter(p => p.source === 'saved' && !used.has(p.url)).map(p => ({ type: p.type, name: p.name, url: p.url }));
}

// ---- deterministic fallback (AI unavailable): group saved by province, spread across days ----
function fallback(pool, prefs) {
  const acts = pool.filter(p => p.type !== 'stay');
  const days = [];
  const perDay = Math.max(1, Math.ceil(acts.length / prefs.days));
  for (let d = 0; d < prefs.days; d++) {
    const slice = acts.slice(d * perDay, (d + 1) * perDay);
    if (!slice.length && d > 0) break;
    const periods = ['เช้า', 'บ่าย', 'เย็น', 'ค่ำ'];
    days.push({
      day: d + 1, province: slice[0] ? slice[0].province : '', title: `วันที่ ${d + 1}`,
      items: slice.map((p, i) => ({ type: p.type, name: p.name, url: p.url, source: p.source, period: periods[i] || 'ระหว่างวัน', note: '', travelNote: '', dur: '', img: p.img || '', price: p.price || '', hours: p.hours || '' })),
      hotel: null
    });
  }
  ensureHotelPerNight(days, pool, prefs);  // province-correct hotel per night (same logic as the AI path)
  return { title: 'แผนการเดินทางของคุณ', summary: 'จัดเรียงจากรายการที่คุณบันทึกไว้ (โหมดสำรอง — ปรับลำดับได้ตามสะดวก)', days, tips: [], unused: [] };
}

// ---- helpers ----
const TYPE_TH = { stay: 'ที่พัก', eat: 'ที่กิน', see: 'ที่เที่ยว' };
function normPrefs(p) {
  return {
    provinces: Array.isArray(p.provinces) ? p.provinces.filter(Boolean) : [],
    days: clampNum(p.days, 1, 10, 3), nights: clampNum(p.nights, 0, 10, Math.max(0, clampNum(p.days, 1, 10, 3) - 1)),
    pax: clampNum(p.pax, 1, 30, 2), kids: !!p.kids, elderly: !!p.elderly,
    pace: ['ชิล', 'สมดุล', 'อัดแน่น', 'ครอบครัว'].includes(p.pace) ? p.pace : 'สมดุล',
    interests: Array.isArray(p.interests) ? p.interests.slice(0, 8) : [],
    transport: ['รถสาธารณะ', 'รถเช่า', 'ขับรถเที่ยวเอง'].includes(p.transport) ? p.transport : 'รถสาธารณะ',
    budget: p.budget ? String(p.budget).slice(0, 40) : '', startFrom: p.startFrom ? String(p.startFrom).slice(0, 40) : '',
    lang: p.lang === 'en' ? 'en' : 'th'
  };
}
function clampNum(v, lo, hi, dft) { v = parseInt(v, 10); return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : dft; }
function clip(s, n) { s = (s == null ? '' : String(s)).trim(); return s.length > n ? s.slice(0, n) : s; }
function strip(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function normName(s) { return strip(s).replace(/\s+/g, '').toLowerCase(); }
function clean(u) { return String(u || '').trim(); }
function withTimeout(promise, ms) { return Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]); }
// Security headers for Worker-generated responses. The static _headers file (X-Frame-Options/nosniff/…)
// only applies to assets served directly — dynamic responses (json(), serveSharedTrip) bypass it entirely.
const SEC_HEADERS = { 'x-content-type-options': 'nosniff', 'x-frame-options': 'SAMEORIGIN', 'referrer-policy': 'strict-origin-when-cross-origin' };
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...SEC_HEADERS } });
}

// ---- abuse guard (Cloudflare native Rate Limiting binding, per-IP) ----
// `rl` is a Rate Limiting binding (env.RL_PLAN / env.RL_WRITE, configured in wrangler.jsonc). Its .limit()
// is an accurate distributed counter — unlike a KV counter, whose edge read-caching (~60s) lets bursts
// slip through. Keyed by bucket:IP so each endpoint-group throttles independently. Fails OPEN if the
// binding is missing or errors, so a platform hiccup never locks out real visitors.
async function allow(rl, request, bucket) {
  try {
    if (!rl || typeof rl.limit !== 'function') return true;
    const ip = request.headers.get('CF-Connecting-IP') || 'anon';
    const { success } = await rl.limit({ key: `${bucket}:${ip}` });
    return success !== false;
  } catch { return true; }
}
function tooMany() { return json({ ok: false, error: 'rate_limited', message: 'มีคำขอถี่เกินไป ลองใหม่อีกครั้งในอีกสักครู่' }, 429); }

// ---- shareable trips + lead-gen (Workers KV) ----
const TRIP_TTL = 60 * 60 * 24 * 365;   // 1 year
function genId() { return crypto.randomUUID().replace(/-/g, '').slice(0, 12); }
function escAttr(s) { return String(s || '').replace(/[<>"&]/g, c => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', '&': '&amp;' }[c])); }
// Strict email allowlist. The old /^[^@\s]+@[^@\s]+\.[^@\s]+$/ accepted shell/CSV-dangerous chars
// (" $ ; ` = …) in the local part, so a "malicious address" signed up via the public newsletter/contact
// form became a stored command-injection payload for the operator's export-emails.mjs (and a CSV formula).
// This charset covers all real-world addresses while rejecting every dangerous character at the boundary.
const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

// Sanitize a client-submitted trip before it is persisted and later re-served to OTHER users via /t/:id.
// The shared-trip renderer (trip.html) interpolates day.day / prefs counts / item.type RAW (no escaping),
// and drops item/hotel urls straight into href — so a malicious itin becomes stored XSS. We coerce the
// numeric/enum fields and strip non-http(s) url schemes here, at the trust boundary, for every field the
// page can render. (Text fields like name/title/note are escaped client-side, so they stay as-is.)
const SAFE_TYPES = ['stay', 'eat', 'see'];
function safeUrl(u) {
  const s = String(u || '').trim();
  if (!s) return '';
  // allow only absolute https(?) or a same-site root-relative path; reject //protocol-relative (off-site
  // redirect) and any script-ish scheme (javascript:/data:/vbscript: never match the allowlist anyway)
  if (!/^(https?:\/\/|\/(?!\/))/i.test(s)) return '';
  // Reject raw HTML-attribute-breakout / whitespace chars. The shared-trip renderer (trip.html) drops these
  // URLs straight into an href attribute; a real booking URL never contains an unencoded " ' < > ` \ or
  // whitespace, but a stored-XSS payload needs one to break out. Rejecting here kills the attack at the
  // trust boundary even if the client fails to escape. (See the stored-XSS fix — trip.html also esc()s these.)
  if (/["'<>`\s\\]/.test(s)) return '';
  return s.slice(0, 400);
}
function sanitizePick(h) { return h && typeof h === 'object' ? { ...h, url: safeUrl(h.url), agoda: safeUrl(h.agoda) } : h; }
function sanitizePicks(arr) { return (Array.isArray(arr) ? arr : []).slice(0, 60).map(sanitizePick); }
function sanitizeItin(itin) {
  const days = (Array.isArray(itin.days) ? itin.days : []).slice(0, 40).map((d, i) => {
    const day = { ...d, day: clampNum(d.day, 1, 999, i + 1) };
    day.items = (Array.isArray(d.items) ? d.items : []).slice(0, 40).map(it => ({ ...it, type: SAFE_TYPES.includes(it.type) ? it.type : 'see', url: safeUrl(it.url) }));
    if (d.hotel && typeof d.hotel === 'object') day.hotel = sanitizePick(d.hotel);
    return day;
  });
  return { ...itin, days };
}
function sanitizeStoredPrefs(p) {
  p = (p && typeof p === 'object') ? p : {};
  return { ...p, days: clampNum(p.days, 0, 999, 0), nights: clampNum(p.nights, 0, 999, 0), pax: clampNum(p.pax, 0, 999, 0) };
}

async function saveTrip(request, env) {
  const body = await request.json().catch(() => null);
  if (!body || !body.itin || !Array.isArray(body.itin.days) || !body.itin.days.length) return json({ ok: false, error: 'bad trip' }, 400);
  const rec = JSON.stringify({ v: 1, itin: sanitizeItin(body.itin), prefs: sanitizeStoredPrefs(body.prefs), hotelPicks: sanitizePicks(body.hotelPicks), swapPool: { stay: sanitizePicks(body.swapPool && body.swapPool.stay), see: sanitizePicks(body.swapPool && body.swapPool.see), eat: sanitizePicks(body.swapPool && body.swapPool.eat) }, ts: Date.now() });
  if (rec.length > 200000) return json({ ok: false, error: 'too large' }, 413);
  const id = genId();
  await env.TRIPS.put('trip:' + id, rec, { expirationTtl: TRIP_TTL });
  return json({ ok: true, tripId: id, shareUrl: new URL('/t/' + id, request.url).toString() });
}

async function getTrip(id, env) {
  const v = await env.TRIPS.get('trip:' + id);
  if (!v) return json({ ok: false, error: 'not found' }, 404);
  return new Response(v, { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}

// collaborative planning on a shared trip: append a vote or a suggestion to the KV record (last-write-wins; fine for small groups)
async function collabAction(request, env, id, action) {
  const key = 'trip:' + id;
  const raw = await env.TRIPS.get(key);
  if (!raw) return json({ ok: false, error: 'not found' }, 404);
  let rec; try { rec = JSON.parse(raw); } catch { return json({ ok: false, error: 'corrupt' }, 500); }
  rec.collab = rec.collab || { votes: {}, suggestions: [] };
  const body = await request.json().catch(() => ({}));
  if (action === 'vote') {
    const k = String(body.key || '').slice(0, 80);
    if (!k) return json({ ok: false, error: 'no key' }, 400);
    // cap distinct vote keys so an unauthenticated caller can't inflate the shared record unbounded
    if (!(k in rec.collab.votes) && Object.keys(rec.collab.votes).length >= 200) return json({ ok: false, error: 'too many' }, 429);
    rec.collab.votes[k] = (rec.collab.votes[k] || 0) + 1;
    await env.TRIPS.put(key, JSON.stringify(rec), { expirationTtl: TRIP_TTL });
    return json({ ok: true, count: rec.collab.votes[k] });
  }
  if (action === 'suggest') {
    const name = String(body.name || '').trim().slice(0, 120);
    if (!name) return json({ ok: false, error: 'no name' }, 400);
    rec.collab.suggestions = rec.collab.suggestions || [];
    if (rec.collab.suggestions.length < 40) rec.collab.suggestions.push({ name, by: String(body.by || '').slice(0, 30), ts: Date.now() });
    await env.TRIPS.put(key, JSON.stringify(rec), { expirationTtl: TRIP_TTL });
    return json({ ok: true, suggestions: rec.collab.suggestions });
  }
  return json({ ok: false, error: 'bad action' }, 400);
}

async function saveEmail(request, env) {
  const body = await request.json().catch(() => null);
  const email = body && String(body.email || '').trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email) || email.length > 120) return json({ ok: false, error: 'bad email' }, 400);
  await env.TRIPS.put('email:' + email, JSON.stringify({ email, tripId: String(body.tripId || '').slice(0, 20), province: String(body.province || '').slice(0, 60), ts: Date.now() }));
  return json({ ok: true });
}

// Contact-form submissions → KV (the form used to be a mailto: link, which silently lost messages on any
// device without a configured mail client). Keyed with a unique suffix so multiple messages never collide.
async function saveContact(request, env) {
  const body = await request.json().catch(() => null);
  const email = body && String(body.email || '').trim().toLowerCase();
  const message = body && String(body.message || '').trim();
  if (!email || !EMAIL_RE.test(email) || email.length > 120) return json({ ok: false, error: 'bad email' }, 400);
  if (!message || message.length < 2) return json({ ok: false, error: 'no message' }, 400);
  const rec = { name: String(body.name || '').slice(0, 80), email, subject: String(body.subject || '').slice(0, 160), message: message.slice(0, 4000), ts: Date.now() };
  await env.TRIPS.put('contact:' + email + ':' + genId(), JSON.stringify(rec));
  return json({ ok: true });
}

// serve the shared-trip page: inject per-trip og tags + the trip id so the static planner auto-loads it
let _tripTpl = null, _tripTplAt = 0;
async function serveSharedTrip(request, env, id) {
  // cache the /trip HTML template per warm isolate (it only changes on deploy) rather than re-fetching and
  // reading its ~85 KB on every /t/:id hit; per-request og injection still happens below on the cached copy
  if (!_tripTpl || (Date.now() - _tripTplAt) > FEEDS_TTL_MS) {
    _tripTpl = await (await env.ASSETS.fetch(new Request(new URL('/trip', request.url)))).text();
    _tripTplAt = Date.now();
  }
  let html = _tripTpl;
  let title = 'แผนการเดินทางของฉัน', desc = 'แผนเที่ยวไทยที่จัดโดย Thailandaddict';
  const rec = await env.TRIPS.get('trip:' + id);
  if (rec) { try { const t = JSON.parse(rec); if (t.itin && t.itin.title) title = t.itin.title; const p = t.prefs || {}; const provs = (p.provinces || []).join(' · '); desc = [provs, p.days ? p.days + ' วัน ' + (p.nights || '') + ' คืน' : '', 'จัดโดย Thailandaddict'].filter(Boolean).join(' · '); } catch (e) {} }
  const og = `<meta property="og:type" content="article"><meta property="og:title" content="${escAttr(title)}"><meta property="og:description" content="${escAttr(desc)}"><meta property="og:image" content="https://thailandaddict.com/images/heroes/chiang-mai.jpg"><meta name="twitter:card" content="summary_large_image"><script>window.__TRIP_ID__=${JSON.stringify(id)};</script>`;
  // function replacement so a `$` in the (escAttr'd) title/desc can't be read as a $-pattern (e.g. $&, $1)
  html = html.replace('</head>', () => og + '</head>');
  // frame-ancestors 'self' = clickjacking defense on this cross-user page; SEC_HEADERS adds nosniff/frame-options.
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'content-security-policy': "frame-ancestors 'self'", ...SEC_HEADERS } });
}

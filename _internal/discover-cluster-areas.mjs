#!/usr/bin/env node
/* =============================================================================
   discover-cluster-areas.mjs — the OSM boundary each cluster is geocoded inside

   WHY THIS EXISTS
   ---------------
   geocode-poi-overpass.mjs used to ask Overpass inside a ±0.45° box around a
   province's main town, and asked a sub-destination inside its PARENT
   province's box. Measured on 2026-09-15 against the 803 pins already
   verified, 89 lay outside their own cluster's box — every one for Koh
   Phangan, Samui, Pai, Khao Yai, Koh Lipe and Koh Kood, 30% for Kanchanaburi.
   Nothing outside the box was ever asked about, so famous, well-mapped places
   came back "no exact name match": ช่องเขาขาด (Hellfire Pass) is 0.58° west of
   Kanchanaburi town, น้ำตกธารเสด็จ about 100 km from Surat Thani city, where
   Koh Phangan was being looked for.

   WHAT IT WRITES
   --------------
   _internal/cluster-areas.json — for every cluster, the Overpass area id(s) to
   ask inside, the OSM elements they come from, and why. Edit SUB below and
   re-run; never edit the JSON by hand.
     · provinces (77): the admin_level=4 boundary carrying ISO3166-2 TH-xx,
       matched to our slug by English name AND by the capital in
       province-coords.json lying inside its bounding box. Both must agree.
     · sub-destinations: the district or island the cluster actually is, by OSM
       id, with the name each id must still carry — a renamed or re-used id
       fails the run instead of silently moving a cluster. Chosen from where
       that cluster's verified pins fall (Nominatim reverse, 2026-09-15), and
       narrowed where a district holds a second destination: Ko Kut district
       includes Koh Mak, Ko Pha-ngan district includes Koh Tao.
     · an island with no Overpass area (Koh Larn, Koh Mak) is asked inside its
       own bounding box plus a stated margin.
   A cluster not listed is asked inside its parent province (CLUSTER_PROVINCE
   in the geocoder): the 33 Bangkok districts, Railay, Koh Phi Phi, Khao Lak,
   Khao Sok — all on the mainland or with no boundary of their own in OSM.

   THE CHECK
   ---------
   Every cluster's verified pins (hotels and attractions at precision poi) are
   tested against its area's bounding box. A sub-destination with 3+ pins and
   under 90% inside fails the run (exit 3): the area is narrower than the
   cluster. A bounding box is coarse on purpose — it can only say "too
   narrow", which is the mistake this file exists to stop.

   Usage:  node _internal/discover-cluster-areas.mjs [--dry]
           exit 1 no answer · 2 a province did not match · 3 a check failed
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, '_internal/cluster-areas.json');
const DRY = process.argv.includes('--dry');

const UA = 'thailandaddict-geocoder/1.0 (+https://thailandaddict.com; cluster boundaries)';
/* Same mirrors, same order, same one-job-at-a-time rule as the geocoder. */
const ENDPOINTS = [
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };

/* Sub-destinations, by OSM id: [element, the name it must still carry]. */
const SUB = {
  pattaya: {
    from: [['relation/19051992', 'อำเภอบางละมุง'], ['relation/18996908', 'อำเภอสัตหีบ']],
    why: 'Bang Lamung (Pattaya City lies inside it) plus Sattahip, where the cluster\'s Nong Nooch and Khao Chi Chan are',
  },
  'koh-larn': {
    from: [['way/23484541', 'เกาะล้าน']], margin: 0.003,
    why: 'the island (no Overpass area for this way, so its bounding box); a second เกาะล้าน in Phang Nga is why this is by id',
  },
  samui: {
    from: [['relation/18990148', 'อำเภอเกาะสมุย']],
    why: 'Ko Samui district: the island plus Ang Thong, which the cluster writes about',
  },
  'koh-phangan': {
    from: [['relation/9443846', 'เกาะพะงัน']],
    why: 'the island, not the district — Ko Pha-ngan district also holds Koh Tao, which is its own cluster',
  },
  'koh-tao': {
    from: [['relation/20698577', 'ตำบลเกาะเต่า']],
    why: 'Ko Tao subdistrict',
  },
  'koh-chang': {
    from: [['relation/18936729', 'อำเภอเกาะช้าง']],
    why: 'Ko Chang district, Trat — OSM has another island called เกาะช้าง in Ranong',
  },
  'koh-kood': {
    from: [['relation/5734231', 'เกาะกูด']],
    why: 'the island, not the district — Ko Kut district also holds Koh Mak, which is its own cluster',
  },
  'koh-mak': {
    from: [['way/26690559', 'เกาะหมาก']], margin: 0.02,
    why: 'the island (no Overpass area, so its bounding box) plus 0.02° for Koh Kham, the islet the cluster writes about',
  },
  'koh-lipe': {
    from: [['relation/15406584', 'เกาะหลีเป๊ะ']],
    why: 'the island; Adang and Rawi are islands in their own right, refused as place=island in any case',
  },
  'koh-lanta': {
    from: [['relation/18935357', 'อำเภอเกาะลันตา']],
    why: 'Ko Lanta district',
  },
  'koh-yao': {
    from: [['relation/18976094', 'อำเภอเกาะยาว']],
    why: 'Ko Yao district',
  },
  'hat-yai': {
    province: 'songkhla',
    why: 'the whole province: Hat Yai articles include day trips to Samila Beach and Songkhla old town',
  },
  pai: {
    from: [['relation/18971456', 'อำเภอปาย']],
    why: 'Pai district',
  },
  'khao-yai': {
    from: [['relation/18976477', 'อำเภอปากช่อง'], ['relation/2971358', 'อุทยานแห่งชาติเขาใหญ่']],
    why: 'Pak Chong district (the farms, wineries and Palio) plus the national park, whose waterfalls reach into Prachin Buri and Nakhon Nayok',
  },
  huahin: {
    from: [['relation/18252311', 'อำเภอหัวหิน'], ['relation/18934935', 'อำเภอชะอำ']],
    why: 'Hua Hin plus Cha-am (Phetchaburi), where the cluster\'s Swiss Sheep Farm and Santorini Park are',
  },
};

async function overpass(ql) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    const ep = ENDPOINTS[(attempt - 1) % ENDPOINTS.length];
    try {
      const res = await fetch(ep, {
        method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'text/plain' },
        body: ql, signal: AbortSignal.timeout(180_000),
      });
      if (res.ok) {
        const j = await res.json();
        /* HTTP 200 with a runtime error in `remark` is a partial answer. */
        if (!(typeof j.remark === 'string' && /error|timed out|out of memory/i.test(j.remark))) return j;
        console.log(`   ${new URL(ep).host}: partial answer (${j.remark.slice(0, 60)})`);
      } else {
        console.log(`   ${new URL(ep).host}: HTTP ${res.status}`);
      }
    } catch (e) {
      console.log(`   ${new URL(ep).host}: ${e.message}`);
    }
    await sleep(8_000 * attempt);
  }
  return null;
}

const areaIdOf = (osm) => {
  const [t, n] = osm.split('/');
  return (t === 'relation' ? 3_600_000_000 : 2_400_000_000) + Number(n);
};
const boundsOf = (b) => [b.minlat, b.minlon, b.maxlat, b.maxlon].map((x) => Math.round(x * 1e5) / 1e5);

const clusters = {};
let bad = 0;

/* ── 1. provinces ───────────────────────────────────────────────────────── */
const PROV = readJson(path.join(ROOT, '_internal/province-coords.json'), {});
const provJ = await overpass('[out:json][timeout:120];rel["boundary"="administrative"]["admin_level"="4"]["ISO3166-2"~"^TH-"];out tags bb;map_to_area;out ids;');
if (!provJ) { console.error('provinces: no answer from any mirror'); process.exit(1); }
const provAreas = new Set(provJ.elements.filter((e) => e.type === 'area').map((e) => e.id));
const rels = provJ.elements.filter((e) => e.type === 'relation' && e.bounds);
const norm = (s) => String(s || '').toLowerCase().replace(/province/g, '').replace(/[^a-z]/g, '');
const holds = (c, b) => c.lat >= b.minlat && c.lat <= b.maxlat && c.lng >= b.minlon && c.lng <= b.maxlon;
for (const [slug, c] of Object.entries(PROV)) {
  const want = slug.replace(/-/g, '');
  const byName = rels.filter((r) => [r.tags['name:en'], r.tags.int_name,
    String(r.tags['name:en'] || '').replace(/^Phra Nakhon Si /, '')].some((n) => norm(n) === want));
  const r = byName.length === 1 && holds(c, byName[0].bounds) ? byName[0] : null;
  if (!r || !provAreas.has(areaIdOf(`relation/${r.id}`))) {
    console.log(`✗ ${slug}: ${byName.length} boundary relation(s) by English name`
      + `${byName.length === 1 && !r ? ', and the capital is outside its bounding box' : ''}${r ? ', and it has no Overpass area' : ''}`);
    bad++;
    continue;
  }
  clusters[slug] = {
    areas: [areaIdOf(`relation/${r.id}`)],
    from: [{ osm: `relation/${r.id}`, name: r.tags.name, nameEn: r.tags['name:en'] || null, iso: r.tags['ISO3166-2'], bounds: boundsOf(r.bounds) }],
    why: 'province boundary',
  };
}
console.log(`provinces: ${Object.keys(clusters).length} of ${Object.keys(PROV).length} matched by English name and capital`);
if (bad) { console.log(`${bad} province(s) did not match — nothing written`); process.exit(2); }

await sleep(6_000);

/* ── 2. sub-destinations ────────────────────────────────────────────────── */
const ids = [...new Set(Object.values(SUB).flatMap((s) => (s.from || []).map(([osm]) => osm)))];
const subJ = await overpass(`[out:json][timeout:120];(${ids.map((osm) => { const [t, n] = osm.split('/'); return `${t}(${n});`; }).join('')});out tags bb;map_to_area;out ids;`);
if (!subJ) { console.error('sub-destinations: no answer from any mirror'); process.exit(1); }
const subAreas = new Set(subJ.elements.filter((e) => e.type === 'area').map((e) => e.id));
/* `map_to_area` passes an element that has no area straight through, so a way
   like Koh Larn comes back twice — once with tags and bounds, then again as a
   bare id. Keep the first. */
const byId = new Map();
for (const e of subJ.elements) if (e.type !== 'area' && !byId.has(`${e.type}/${e.id}`)) byId.set(`${e.type}/${e.id}`, e);
for (const [slug, s] of Object.entries(SUB)) {
  if (s.province) {
    if (!clusters[s.province]) { console.log(`✗ ${slug}: parent province ${s.province} has no entry`); bad++; continue; }
    clusters[slug] = { ...clusters[s.province], why: s.why };
    continue;
  }
  const from = [], areas = [];
  let box = null;
  for (const [osm, expect] of s.from) {
    const e = byId.get(osm);
    const t = (e && e.tags) || {};
    if (!e || !e.bounds || t.name !== expect) {
      console.log(`✗ ${slug}: ${osm} ${e ? `is now called "${t.name}"` : 'was not returned'}, expected "${expect}"`);
      bad++;
      continue;
    }
    const b = boundsOf(e.bounds);
    from.push({ osm, name: t.name, nameEn: t['name:en'] || null, bounds: b });
    if (subAreas.has(areaIdOf(osm))) areas.push(areaIdOf(osm));
    else if (typeof s.margin === 'number') box = box ? [Math.min(box[0], b[0]), Math.min(box[1], b[1]), Math.max(box[2], b[2]), Math.max(box[3], b[3])] : b;
    else { console.log(`✗ ${slug}: ${osm} has no Overpass area, and no margin is set to ask inside its bounding box`); bad++; }
  }
  if (areas.length && box) { console.log(`✗ ${slug}: mixes areas with a bounding box — list one kind`); bad++; continue; }
  const entry = { areas, from, why: s.why };
  if (box) entry.bbox = [box[0] - s.margin, box[1] - s.margin, box[2] + s.margin, box[3] + s.margin].map((x) => Math.round(x * 1e4) / 1e4);
  else if (!areas.length) { console.log(`✗ ${slug}: nothing to ask inside`); bad++; continue; }
  clusters[slug] = entry;
}
console.log(`sub-destinations: ${Object.keys(SUB).filter((k) => clusters[k]).length} of ${Object.keys(SUB).length}`);

/* ── 3. check against the pins already verified ─────────────────────────── */
const clusterOf = new Map();
for (const dir of ['articles', 'reviews']) {
  const d = path.join(ROOT, 'astro/src/content', dir);
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    const doc = readJson(path.join(d, f), null);
    if (doc && doc.cluster) clusterOf.set(doc.slug || f.replace(/\.json$/, ''), doc.cluster);
  }
}
const pins = new Map();
const addPin = (slug, v) => {
  const cl = clusterOf.get(slug);
  if (!cl || !v || v.precision !== 'poi' || !Number.isFinite(v.lat)) return;
  if (!pins.has(cl)) pins.set(cl, []);
  pins.get(cl).push({ lat: v.lat, lng: v.lng, slug });
};
for (const [k, v] of Object.entries(readJson(path.join(ROOT, '_internal/place-coords.json'), {}))) addPin(k.split('/').pop(), v);
for (const [k, v] of Object.entries(readJson(path.join(ROOT, '_internal/hotel-coords.json'), {}))) addPin(k, v);
const inBox = (p, b) => p.lat >= b[0] && p.lat <= b[2] && p.lng >= b[1] && p.lng <= b[3];
console.log('\nverified pins inside each area\'s bounding box (sub-destinations, and any province under 100%):');
for (const [slug, e] of Object.entries(clusters)) {
  const ps = pins.get(slug) || [];
  if (!ps.length) continue;
  const boxes = e.bbox ? [e.bbox] : e.from.map((f) => f.bounds);
  const inside = ps.filter((p) => boxes.some((b) => inBox(p, b))).length;
  const share = inside / ps.length;
  const sub = !!SUB[slug];
  if (sub || share < 1) console.log(`   ${slug.padEnd(20)} ${String(inside).padStart(4)} / ${String(ps.length).padEnd(4)} ${String(Math.round(share * 100)).padStart(3)}%  ${sub ? (e.bbox ? 'island box' : e.from.map((f) => f.nameEn || f.name).join(' + ')) : 'province'}`);
  /* A province pin outside its own province's bounding box is outside the
     province: either cross-border content or a wrong pin. Named, not failed. */
  if (!sub) for (const p of ps.filter((q) => !boxes.some((b) => inBox(q, b)))) console.log(`        outside: ${p.slug} ${p.lat},${p.lng}`);
  if (sub && ps.length >= 3 && share < 0.9) {
    console.log(`✗ ${slug}: under 90% of its verified pins fall inside — the area is narrower than the cluster`);
    bad++;
  }
}
if (bad) { console.log(`\n${bad} problem(s) — ${path.relative(ROOT, OUT)} NOT written`); process.exit(3); }

const doc = {
  note: 'Where _internal/geocode-poi-overpass.mjs asks Overpass for each cluster. Built by _internal/discover-cluster-areas.mjs — edit its SUB table and re-run; do not edit this file. A cluster missing here is asked inside its parent province.',
  generated: new Date().toISOString().slice(0, 10),
  clusters: Object.fromEntries(Object.entries(clusters).sort(([a], [b]) => a.localeCompare(b))),
};
/* arrays of numbers stay on one line */
const text = JSON.stringify(doc, null, 2).replace(/\[\s+([-\d.,\s]+?)\s+\]/g, (m, inner) => `[${inner.split(/,\s*/).join(', ')}]`) + '\n';
if (DRY) console.log(`\n--dry: ${Object.keys(clusters).length} cluster scopes, not written`);
else { fs.writeFileSync(OUT, text); console.log(`\nwrote ${Object.keys(clusters).length} cluster scopes to ${path.relative(ROOT, OUT)}`); }

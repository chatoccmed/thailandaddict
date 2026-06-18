// One-shot: write city-cfg + markcfg for the 11 remaining hotel-roundup cities.
// Then run: for each, node gen-city-wf.mjs city-cfg/<c>.json
import fs from 'node:fs';
const DONE = '2026-06-18';
const CITIES = [
  { cluster:'buriram', prov:'บุรีรัมย์', posts:[
    { old:'top10-buriram-hotels', newSlug:'top10-buriram-popular-hotels', title:'10 ที่พักยอดนิยมในบุรีรัมย์ ใกล้สนามช้างอารีน่า', n:10 },
    { old:'top10-burirum-cheap-budget-hotels', newSlug:'top10-buriram-budget-hotels', title:'10 ที่พักหลักร้อยเมืองปราสาทหิน บุรีรัมย์', n:10 } ] },
  { cluster:'chachoengsao', prov:'ฉะเชิงเทรา', posts:[
    { old:'top10-chachoengsao-hotels', newSlug:'top10-chachoengsao-city-hotels', title:'10 ที่พักฉะเชิงเทราสไตล์โมเดิร์น บรรยากาศดี', n:10 } ] },
  { cluster:'khon-kaen', prov:'ขอนแก่น', posts:[
    { old:'top-ten-hotels-khon-kaen', newSlug:'top10-khon-kaen-popular-hotels', title:'10 โรงแรมยอดนิยมในเมืองขอนแก่น', n:10 },
    { old:'top10-khon-kaen-hotels-price-under-1000-bath', newSlug:'top10-khon-kaen-budget-hotels', title:'10 ที่พักหลักร้อยเดินทางสะดวกในขอนแก่น', n:10 } ] },
  { cluster:'loei', prov:'เลย', posts:[
    { old:'top10-chiangkhan-loei-hotels', newSlug:'top10-chiang-khan-hotels-loei', title:'10 ที่พักริมโขงบรรยากาศชิลที่เชียงคาน เลย', n:10 } ] },
  { cluster:'nakhon-phanom', prov:'นครพนม', posts:[
    { old:'top10-nakhon-phanom-hotels', newSlug:'top10-nakhon-phanom-riverside-hotels', title:'10 โรงแรมริมแม่น้ำโขงบรรยากาศดีในนครพนม', n:10 } ] },
  { cluster:'phang-nga', prov:'พังงา', posts:[
    { old:'top10-5stars-khaolak-phangnga-hotels', newSlug:'top10-khao-lak-5star-hotels-phang-nga', title:'10 ที่พักหรู 5 ดาวที่เขาหลัก พังงา', n:10 } ] },
  { cluster:'phetchaburi', prov:'เพชรบุรี', posts:[
    { old:'top10-hotels-phetchaburi', newSlug:'top10-cha-am-budget-hotels-phetchaburi', title:'10 ที่พักหลักร้อยในชะอำ เพชรบุรี', n:10 } ] },
  { cluster:'phrae', prov:'แพร่', posts:[
    { old:'top-ten-hotels-phrae', newSlug:'top10-phrae-popular-hotels', title:'10 โรงแรมยอดนิยมบรรยากาศดีในแพร่', n:10 } ] },
  { cluster:'sakon-nakhon', prov:'สกลนคร', posts:[
    { old:'top10-sakon-nakhon-hotels', newSlug:'top10-sakon-nakhon-popular-hotels', title:'10 โรงแรมห้ามพลาดในสกลนคร', n:10 } ] },
  { cluster:'ubon-ratchathani', prov:'อุบลราชธานี', posts:[
    { old:'top10-ubon-ratchathani-hotels-2', newSlug:'top10-ubon-ratchathani-city-hotels', title:'10 โรงแรมบรรยากาศดีในเมืองอุบลราชธานี', n:10 },
    { old:'top10-ubon-ratchathani-hotels', newSlug:'top10-ubon-ratchathani-budget-hotels', title:'10 ที่พักหลักร้อยในเมืองอุบลราชธานี', n:10 } ] },
  { cluster:'udon-thani', prov:'อุดรธานี', posts:[
    { old:'top10-udonthani-hotels', newSlug:'top10-udon-thani-popular-hotels', title:'10 โรงแรมน่าพักผ่อนวันหยุดในอุดรธานี', n:10 } ] },
];

let n = 0;
for (const c of CITIES) {
  const cfg = { cluster:c.cluster, prov:c.prov, crumb:c.prov, crumbHref:`city-${c.cluster}.html`, posts:c.posts };
  fs.writeFileSync(`_internal/wf/city-cfg/${c.cluster}.json`, JSON.stringify(cfg, null, 2) + '\n');
  const roundups = {}; for (const p of c.posts) roundups[p.old] = p.newSlug;
  fs.writeFileSync(`_internal/migration/markcfg/${c.cluster}.json`, JSON.stringify({ doneDate:DONE, prov:c.prov, roundups }, null, 2) + '\n');
  n++;
}
console.log(`wrote ${n} city-cfg + ${n} markcfg`);
console.log(CITIES.map(c => c.cluster).join(' '));

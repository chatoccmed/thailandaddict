// Generate a workflow that web-verifies each ranked restaurant/cafe in Bangkok yaan eat-rankings is still open.
import fs from 'node:fs';
const d = 'astro/src/content/articles/';
const hoods = new Set(fs.readdirSync('astro/public').filter(f => /^area-bangkok-.+\.html$/.test(f)).map(f => f.replace(/^area-bangkok-(.+)\.html$/, '$1')));
const arts = [];
for (const f of fs.readdirSync(d)) {
  if (!f.endsWith('.json')) continue;
  let a; try { a = JSON.parse(fs.readFileSync(d + f, 'utf8')); } catch { continue; }
  if (a.type === 'eat-ranking' && hoods.has(a.cluster) && /(restaurants|cafes)/.test(a.slug)) {
    const venues = (a.blocks || []).filter(b => b.kind === 'restaurant').map(b => ({ name: b.name, area: b.area, rank: b.rank }));
    arts.push({ slug: a.slug, cluster: a.cluster, venues });
  }
}
const B = 3, batches = [];
for (let i = 0; i < arts.length; i += B) batches.push(arts.slice(i, i + B));

const lines = [];
lines.push(`export const meta = {`);
lines.push(`  name: 'verify-eat-venues-bkk',`);
lines.push(`  description: 'Web-verify each ranked restaurant/cafe still open across ${arts.length} Bangkok yaan eat-rankings, ${batches.length} batches. No edits.',`);
lines.push(`  phases: [{ title: 'Verify', detail: '${batches.length} agents, ~3 articles each' }],`);
lines.push(`}`);
lines.push(`const BATCHES = ${JSON.stringify(batches)};`);
lines.push(`const SCH = { type:'object', additionalProperties:false, required:['articles'], properties:{`);
lines.push(`  articles:{ type:'array', items:{ type:'object', additionalProperties:false, required:['slug','venues'], properties:{`);
lines.push(`    slug:{type:'string'},`);
lines.push(`    venues:{ type:'array', items:{ type:'object', additionalProperties:false, required:['name','open'], properties:{`);
lines.push(`      name:{type:'string'}, open:{type:'boolean'}, issue:{type:'string'}, severity:{type:'string',enum:['none','minor','major']} } } } } } } } };`);
lines.push(`phase('Verify')`);
lines.push(`const mkList = (b) => b.map(a => a.slug + ':\\n' + a.venues.map(v => '  #' + v.rank + ' ' + v.name + ' - ' + (v.area || '')).join('\\n')).join('\\n\\n');`);
lines.push(`const res = await parallel(BATCHES.map((b, bi) => () =>`);
lines.push(`  agent('ตรวจสอบว่าร้านอาหาร/คาเฟ่ที่จัดอันดับไว้ยังเปิดอยู่จริงไหม (QA) - ตรวจอย่างเดียว ห้ามแก้ไฟล์. บทความ eat-ranking กรุงเทพ.\\n' +`);
lines.push(`    'แต่ละร้าน: web-search ชื่อ+ย่าน แล้วประเมิน open = ยังเปิดดำเนินการ (ปิดถาวร/ย้าย/เปลี่ยนชื่อถาวร = false). ปิด/ย้าย/เปลี่ยนชื่อ ให้ใส่ issue สั้นๆ + severity. เปิดปกติ open=true severity=none. อย่าเดา ถ้าไม่ชัวร์ให้ค้นจริง; ร้านเล็ก/สตรีทฟู้ดที่หาไม่เจอแต่ไม่มีสัญญาณปิด ให้ open=true severity=none.\\n\\n' +`);
lines.push(`    mkList(b) + '\\n\\nreturn: articles[] (1 ต่อ slug ครบทุก slug; venues[] 1 ต่อร้านครบทุกร้าน)',`);
lines.push(`    { label: 'venues:' + b[0].cluster + '#' + (bi + 1), phase: 'Verify', schema: SCH })`);
lines.push(`    .then(r => r?.articles || []).catch(e => [{ slug: '__err' + bi, venues: [{ name: 'batch', open: true, issue: String(e), severity: 'none' }] }])`);
lines.push(`))`);
lines.push(`return { articles: res.flat() }`);
fs.writeFileSync('_internal/wf/verify-eat-venues-bkk.js', lines.join('\n') + '\n');
console.log('wrote workflow: ' + arts.length + ' articles, ' + batches.length + ' batches');

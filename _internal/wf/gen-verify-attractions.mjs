// Generate a workflow that web-verifies each attraction article's subject still exists + is open (not permanently closed/demolished) + key facts plausible.
import fs from 'node:fs';
const d = 'astro/src/content/articles/';
const arts = [];
for (const f of fs.readdirSync(d)) {
  if (!f.endsWith('.json')) continue;
  let a; try { a = JSON.parse(fs.readFileSync(d + f, 'utf8')); } catch { continue; }
  if (a.type !== 'attraction') continue;
  const name = String(a.h1 || a.title || '').replace(/<br\s*\/?>/gi, ' — ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 90);
  arts.push({ slug: a.slug, cluster: a.cluster, name });
}
const B = 8, batches = [];
for (let i = 0; i < arts.length; i += B) batches.push(arts.slice(i, i + B));

const lines = [];
lines.push(`export const meta = {`);
lines.push(`  name: 'verify-attractions',`);
lines.push(`  description: 'Web-verify each attraction still exists + open across ${arts.length} attraction articles, ${batches.length} batches. No edits.',`);
lines.push(`  phases: [{ title: 'Verify', detail: '${batches.length} agents, ~8 attractions each' }],`);
lines.push(`}`);
lines.push(`const BATCHES = ${JSON.stringify(batches)};`);
lines.push(`const SCH = { type:'object', additionalProperties:false, required:['results'], properties:{`);
lines.push(`  results:{ type:'array', items:{ type:'object', additionalProperties:false, required:['slug','real','open'], properties:{`);
lines.push(`    slug:{type:'string'}, real:{type:'boolean'}, open:{type:'boolean'}, issue:{type:'string'}, severity:{type:'string',enum:['none','minor','major']} } } } } };`);
lines.push(`phase('Verify')`);
lines.push(`const mkList = (b) => b.map(a => '  - ' + a.slug + ' :: ' + a.name + ' (' + a.cluster + ')').join('\\n');`);
lines.push(`const res = await parallel(BATCHES.map((b, bi) => () =>`);
lines.push(`  agent('ตรวจสอบว่าสถานที่ท่องเที่ยว/แลนด์มาร์กที่เขียนถึงยัง**มีอยู่จริงและเปิดให้เข้าชม**ไหม (QA) - ตรวจอย่างเดียว ห้ามแก้ไฟล์.\\n' +`);
lines.push(`    'แต่ละแห่ง: web-search ชื่อ+จังหวัด แล้วประเมิน real=มีอยู่จริง, open=ยังเปิด/ยังดำเนินการ (ปิดถาวร/รื้อถอน/ยกเลิกถาวร = false). ปิด/รื้อ/ย้าย/เปลี่ยนสภาพ ให้ใส่ issue สั้นๆ + severity(major ถ้าปิด/รื้อถาวร). ปกติ real/open=true severity=none. อย่าเดา วัด/อุทยาน/ภูเขา/น้ำตก/ตลาด/พิพิธภัณฑ์ที่มีอยู่จริงและไม่มีสัญญาณปิด ให้ open=true. เฉพาะที่มีข่าว/หลักฐานปิดถาวรหรือรื้อถอนจริงเท่านั้นจึง open=false.\\n\\n' +`);
lines.push(`    mkList(b) + '\\n\\nreturn: results[] (1 ต่อ slug ครบทุก slug)',`);
lines.push(`    { label: 'attr:' + b[0].cluster + '#' + (bi + 1), phase: 'Verify', schema: SCH })`);
lines.push(`    .then(r => r?.results || []).catch(e => [{ slug: '__err' + bi, real: true, open: true, issue: String(e), severity: 'none' }])`);
lines.push(`))`);
lines.push(`return { results: res.flat() }`);
fs.writeFileSync('_internal/wf/verify-attractions.js', lines.join('\n') + '\n');
console.log('wrote workflow: ' + arts.length + ' attractions, ' + batches.length + ' batches');

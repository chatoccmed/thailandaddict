import fs from 'node:fs';
import path from 'node:path';
const dir = import.meta.dirname;
const m = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
const real = m.posts.filter(p => p.type !== 'demo');
const done = real.filter(p => p.status === 'done');
const inprog = real.filter(p => p.status === 'in-progress');
const pct = real.length ? Math.round(done.length / real.length * 100) : 0;
const esc = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cityStats = {};
for (const p of real) { const c = cityStats[p.city] ||= { total: 0, done: 0, reviews: 0 }; c.total++; if (p.status === 'done') c.done++; c.reviews += (p.reviewSlugs || []).length; }
const typeStats = {};
for (const p of real) { const t = typeStats[p.type] ||= { total: 0, done: 0 }; t.total++; if (p.status === 'done') t.done++; }
const totalReviews = real.reduce((s, p) => s + (p.reviewSlugs || []).length, 0);

const badge = s => ({ 'done': '#16a34a', 'in-progress': '#f59e0b', 'not-started': '#94a3b8', 'skip': '#cbd5e1' }[s] || '#94a3b8');
const rows = m.posts.map(p => `<tr data-status="${p.status}" data-type="${p.type}" data-city="${esc(p.city)}">
<td>${esc(p.city)}</td><td><span class="tp tp-${p.type}">${p.type}</span></td>
<td class="ti"><a href="${esc(p.oldUrl)}" target="_blank">${esc(p.title) || p.oldSlug}</a><div class="sl">${esc(p.oldSlug)}</div></td>
<td><span class="st" style="background:${badge(p.status)}">${p.status}</span></td>
<td>${p.newRoundupSlug ? `<a href="http://localhost:4400/${esc(p.newRoundupSlug)}.html" target="_blank">${esc(p.newRoundupSlug)}</a>` : '—'}</td>
<td style="text-align:center">${(p.reviewSlugs || []).length || '—'}</td>
<td>${p.redirectTo ? `<code>${esc(p.oldSlug)} → ${esc(p.redirectTo)}</code>` : '—'}</td>
<td class="nt">${esc(p.notes)}</td></tr>`).join('\n');

const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Migration Dashboard — thailandaddict.com</title>
<style>
:root{--teal:#06B6D4;--coral:#FB7185;--ink:#0F172A;--sub:#64748b;--bd:#e6eef2;--soft:#f1fbfd}
*{box-sizing:border-box}body{font-family:'Outfit','Sarabun',-apple-system,BlinkMacSystemFont,'Noto Sans Thai',sans-serif;margin:0;background:#f8fafc;color:var(--ink)}
.wrap{max-width:1500px;margin:0 auto;padding:24px}
h1{margin:0 0 4px;font-size:26px}.sub{color:var(--sub);margin-bottom:20px;font-size:14px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:22px}
.card{background:#fff;border:1px solid var(--bd);border-radius:16px;padding:16px}
.card .n{font-size:30px;font-weight:800}.card .l{color:var(--sub);font-size:13px}
.bar{height:14px;border-radius:999px;background:#e2e8f0;overflow:hidden;margin-top:8px}.bar>i{display:block;height:100%;background:linear-gradient(90deg,var(--teal),var(--coral))}
.sec{background:#fff;border:1px solid var(--bd);border-radius:16px;padding:18px;margin-bottom:18px}
.sec h2{margin:0 0 12px;font-size:17px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{border:1px solid var(--bd);border-radius:999px;padding:6px 12px;font-size:13px;background:var(--soft)}
.chip b{color:var(--teal)}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--bd);vertical-align:top}
th{position:sticky;top:0;background:#fff;cursor:pointer;font-size:12px;color:var(--sub);text-transform:uppercase;letter-spacing:.04em}
.ti a{color:var(--ink);font-weight:600;text-decoration:none}.ti a:hover{color:var(--teal)}
.sl{color:#94a3b8;font-size:11px;font-family:monospace;margin-top:2px}
.st{color:#fff;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap}
.tp{font-size:11px;padding:2px 7px;border-radius:6px;background:#eef2f7;color:var(--sub)}
.tp-hotel-roundup{background:#cffafe;color:#0e7490}.tp-food-guide{background:#ffe4e6;color:#be123c}.tp-travel-guide{background:#fef9c3;color:#a16207}.tp-demo{background:#f1f5f9;color:#cbd5e1}
.nt{color:var(--sub);font-size:12px;max-width:240px}code{font-size:11px;background:var(--soft);padding:1px 5px;border-radius:5px}
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
select,input{padding:7px 10px;border:1px solid var(--bd);border-radius:9px;font-size:13px}
.tablewrap{max-height:70vh;overflow:auto;border:1px solid var(--bd);border-radius:14px}
</style></head><body><div class="wrap">
<h1>🗺️ Migration Dashboard — thailandaddict.com</h1>
<div class="sub">ติดตามการย้าย/เขียนใหม่บทความเดิม ${real.length} โพสต์ (ไม่รวม demo ${m.posts.length - real.length}) · อัปเดต ${esc(m.generated || '')}</div>

<div class="cards">
<div class="card"><div class="n">${done.length}/${real.length}</div><div class="l">บทความเสร็จ (${pct}%)</div><div class="bar"><i style="width:${pct}%"></i></div></div>
<div class="card"><div class="n">${inprog.length}</div><div class="l">กำลังทำ</div></div>
<div class="card"><div class="n">${real.length - done.length - inprog.length}</div><div class="l">ยังไม่เริ่ม</div></div>
<div class="card"><div class="n">${totalReviews}</div><div class="l">รีวิวแยกโรงแรมที่สร้าง</div></div>
<div class="card"><div class="n">${Object.keys(cityStats).length}</div><div class="l">เมือง/จังหวัด</div></div>
</div>

<div class="sec"><h2>ตามประเภท</h2><div class="chips">${Object.entries(typeStats).map(([t, s]) => `<span class="chip">${t}: <b>${s.done}/${s.total}</b></span>`).join('')}</div></div>

<div class="sec"><h2>ตามเมือง (เรียงจำนวนโพสต์)</h2><div class="chips">${Object.entries(cityStats).sort((a, b) => b[1].total - a[1].total).map(([c, s]) => `<span class="chip">${esc(c)}: <b>${s.done}/${s.total}</b>${s.reviews ? ` · ${s.reviews}rev` : ''}</span>`).join('')}</div></div>

<div class="sec"><h2>รายบทความ (${m.posts.length})</h2>
<div class="filters">
<select id="fStatus" onchange="flt()"><option value="">สถานะ: ทั้งหมด</option><option>done</option><option>in-progress</option><option>not-started</option><option>skip</option></select>
<select id="fType" onchange="flt()"><option value="">ประเภท: ทั้งหมด</option><option>hotel-roundup</option><option>food-guide</option><option>travel-guide</option><option>other</option><option>demo</option></select>
<input id="fCity" placeholder="กรองเมือง…" oninput="flt()">
<input id="fText" placeholder="ค้นหาชื่อ/slug…" oninput="flt()">
</div>
<div class="tablewrap"><table id="tb"><thead><tr>
<th onclick="srt(0)">เมือง</th><th onclick="srt(1)">ประเภท</th><th onclick="srt(2)">บทความเดิม (คลิก=เปิดของเก่า)</th><th onclick="srt(3)">สถานะ</th><th>roundup ใหม่</th><th>#รีวิว</th><th>redirect (old→new)</th><th>หมายเหตุ</th>
</tr></thead><tbody>${rows}</tbody></table></div></div>
<div class="sub">💡 เมื่อทุกบทความ done → ใช้คอลัมน์ "redirect" สร้าง 301 (old URL → new URL) ตอนสลับ URL จริง · ลิงก์ roundup ใหม่เปิดผ่าน local preview :4400</div>
</div>
<script>
function flt(){const s=fStatus.value,t=fType.value,c=fCity.value.toLowerCase(),x=fText.value.toLowerCase();
for(const r of document.querySelectorAll('#tb tbody tr')){const ok=(!s||r.dataset.status===s)&&(!t||r.dataset.type===t)&&(!c||r.dataset.city.toLowerCase().includes(c))&&(!x||r.textContent.toLowerCase().includes(x));r.style.display=ok?'':'none';}}
let sd=1;function srt(i){const tb=document.querySelector('#tb tbody');[...tb.rows].sort((a,b)=>(a.cells[i].textContent.trim()>b.cells[i].textContent.trim()?1:-1)*sd).forEach(r=>tb.appendChild(r));sd*=-1;}
</script></body></html>`;

fs.writeFileSync(path.join(dir, 'dashboard.html'), html);
console.log('dashboard.html built ·', real.length, 'real posts ·', done.length, 'done ·', totalReviews, 'reviews');

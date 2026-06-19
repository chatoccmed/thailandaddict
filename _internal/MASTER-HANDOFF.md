# 🗺️ THAILANDADDICT MIGRATION — MASTER HANDOFF

> สรุปสถานะทั้งระบบ ณ **2026-06-19** เพื่อให้ session/คนอื่นทำต่อได้ทันที
> Source of truth = git + `_internal/migration/manifest.json` + `_internal/qa/qa-ledger.json` (อย่าเชื่อ doc นี้ถ้าขัดกับของจริง — เช็คสดเสมอ)

## ✅ สถานะรวม (3 สตรีมงาน)

| สตรีม | สถานะ | เหลือ |
|---|---|---|
| **1. Migration content (TH)** | ✅ **DONE 195/195** (manifest done=195, not-started=0) | — |
| **2. QA phase-a (deep audit)** | 🔶 23/38 migration-cluster ตรวจแล้ว | **15 cluster (~329 reviews)** |
| **3. EN translation** | articles ✅ DONE (3213/3213) · reviews/roundups 🔶 | **~868 reviews + ~125 roundups** |

**ความสะอาดเชิงโครงสร้าง (ทั้ง repo):** `node _internal/migration/audit-all.mjs` → **errors=0** (roundups 215 entries===toc===compareRows + reviewUrl resolve ครบ; reviews 1939 valid+keywords ครบ). เหลือ warns 2 รูป hero หาย (ดูสตรีม 3b). working tree สะอาด, sync origin/main.

---

## สตรีม 2 — QA phase-a (เหลือ 15 cluster)

**ตรวจแล้ว (23):** bangkok, buriram, chachoengsao, chanthaburi, chiang-mai, chiang-rai, chonburi, khon-kaen, krabi, loei, nakhon-phanom, pattaya, phang-nga, phetchaburi, phrae, prachinburi, prachuap-khiri-khan, ratchaburi, rayong, sakon-nakhon, tak, ubon-ratchathani, udon-thani

**ยังไม่ตรวจ (15):** `huahin kanchanaburi khao-yai koh-chang koh-kood koh-larn koh-mak mae-hong-son nakhon-ratchasima nan pai phayao phetchabun sa-kaeo trat`
(เช็คสด: `node -e "const fs=require('fs');const d='astro/src/content/reviews/';const byc={};for(const f of fs.readdirSync(d)){try{const o=JSON.parse(fs.readFileSync(d+f,'utf8'));const tc=((o.body||[]).map(b=>b.html||'').join('').replace(/<[^>]+>/g,'').match(/[฀-๿]+/g)||[]).join('').length;if(tc>=6500)byc[o.cluster]=(byc[o.cluster]||0)+1}catch{}}const fsx=require('fs');const qa=new Set(fsx.existsSync('_internal/migration/_qadone.txt')?fsx.readFileSync('_internal/migration/_qadone.txt','utf8').trim().split('\n'):[]);console.log(Object.keys(byc).filter(c=>!qa.has(c)).sort().join(' '))"`)

**Recipe ต่อ cluster (ดูตัวอย่าง `_internal/wf/deep-audit-chiang-mai.js`):**
1. gen สคริปต์: `node _internal/wf/gen-deep-audit.mjs <cluster>` (ถ้ามี) หรือ clone `deep-audit-<doneCity>.js` แก้ cluster
2. รัน Workflow `{scriptPath:"_internal/wf/deep-audit-<cluster>.js"}` → ตรวจ data/template/image แต่ละ review, fix ที่เจอ (รูปผิดโรงแรม/stock, ตัวเลข, claim เกินจริง, count, address), เขียน `_internal/qa/verdicts-<cluster>.json`
3. `node _internal/qa/apply-verdicts.mjs` (ถ้าใช้ ledger) + `node _internal/qa/build-ledger.mjs`
4. build-test BUILD OK → commit `qa(phase-a): deep audit <cluster> — N reviews; fixed ...`
- รูปหาย→ spawn image agent (Ostrovok/Tripadvisor/บล็อกทางการ · **ห้าม Trip.com** ส่งรูปผิดโรงแรม)

## สตรีม 3a — EN reviews + roundups (~868 + ~125)
- EN articles เสร็จแล้ว (handoff เก่า `_internal/EN-RESUME-HANDOFF.md` = ปิดงาน)
- เหลือ EN ของ migration reviews/roundups (TH-only ตามมติ owner "EN ทีหลัง")
- เช็คสด: `node -e "const fs=require('fs');const R=fs.readdirSync('astro/src/content/reviews').filter(f=>f.endsWith('.json'));const E=new Set(fs.readdirSync('astro/src/content/reviews-en'));console.log('reviews EN missing:',R.filter(f=>!E.has(f)).length)"` (เปลี่ยน reviews→roundups ได้)
- ใช้ pattern เดียวกับ `_internal/wf/translate-en.js` (RULES ฝังแล้ว) แต่ target = reviewSchema/roundupSchema (ปรับ collection path). โครง/รูป/ตัวเลขเหมือน TH เป๊ะ ห้ามแต่งเพิ่ม

## สตรีม 3b — 2 รูป hero หาย (trivial)
- `review-jatujak-studio-in-bangkok` → images/hotels/bangkok-jatujak-1.jpg (QA bangkok flag ไว้แล้ว)
- `review-udee-condo-chachoengsao` → images/hotels/chachoengsao-udee-1.jpg
- spawn image agent ดึง (Ostrovok) หรือยอมรับ onerror fallback. ไม่บล็อก build.

---

## ⛔ BLOCKER — weekly usage limit
- เคยชน **weekly limit** หลายรอบ (EN: reset 19 มิ.ย. 05:00 · chiang-rai workflow: reset 24 มิ.ย. 06:00 เวลาไทย — เป็น rolling window)
- เมื่อชน → **subagent/Workflow ทุกตัว fail** ("You've hit your weekly limit"). main-loop (git/verify/manifest/read) ยังทำได้
- พอ reset แล้ว resume ได้เลย — เนื้อหาที่ commit แล้วปลอดภัย, working tree สะอาด

## 🛠️ Infra / คำสั่งสำคัญ
- **build gate:** `export PATH="$HOME/nodejs:$PATH"; bash _internal/build-test.sh` → ต้อง `BUILD OK` (heap 8GB, temp ~/ta-build-temp)
- **objective audit:** `node _internal/migration/audit-all.mjs` → errors=0
- **dashboard:** `node _internal/preview-server.mjs _internal/migration 4500` (bg) → http://localhost:4500/dashboard.html · **ตายเมื่อเครื่อง sleep — เปิดใหม่ได้**
- **manifest+dashboard rebuild:** `node _internal/migration/build-dashboard.mjs`
- **engine family (migration roundup porter):** `_internal/wf/port-roundups-multi.js` (single-planner, clone แก้ PROV/CLUSTER/CRUMB/CRUMBHREF+POSTS) — content done แล้ว ไม่ต้องใช้ ยกเว้นแก้/เพิ่ม
- **กฎทอง:** เช็ค process จริง (find transcript -mmin) · ไม่เชื่อ workflow return เทียบดิสก์ · 1 workflow/ครั้ง (parallel→socket error) · review fail/short→cleanup workflow · ban `ตอบโจทย์`→`ลงตัว` · keywords field required (ไม่งั้น build error) · ห้ามแก้ gen-hubs.mjs/index.html/CLAUDE.md
- **commit identity:** `git -c user.name="chatoccmed" -c user.email="chatoccmed@users.noreply.github.com" commit`

## ▶️ เริ่มงานต่อยังไง (next session)
1. `git fetch origin && git rebase origin/main` (sync)
2. `node _internal/migration/audit-all.mjs` (ยืนยัน errors=0) + `bash _internal/build-test.sh` (BUILD OK)
3. เลือกสตรีม: QA 15 cluster ที่เหลือ / EN reviews+roundups / 2 รูป hero — ทำทีละ cluster, verify+build+commit ก่อนอันถัดไป
4. ถ้าชน weekly limit → หยุด, รอ reset, resume

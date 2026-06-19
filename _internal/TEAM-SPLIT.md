> 🚦 **ก่อนเริ่มงานใหญ่ เปิด `_internal/ACTIVE-WORK-CLAIMS.md` ก่อน** — กันงานซ้ำ (ตอนนี้มี session กำลังแปล reviews-en + roundups-en อยู่ · อย่าแตะ `reviews-en/`, `roundups-en/`)

# 👥 TEAM-SPLIT — แบ่งงานสร้าง 77 จังหวัด ระหว่าง 2 เครื่อง/คน

> เป้าหมาย: ทำให้ครบ 77 จังหวัดเร็วขึ้น 2 เท่า โดย **2 คนทำขนานกัน ไม่ทับงานกัน**
> งานเป็น "ต่อจังหวัด" และไฟล์เนื้อหาทุกอันตั้งชื่อด้วย slug จังหวัด → คนละจังหวัดไม่ชนไฟล์กัน
> Pipeline ต่อจังหวัด: ดู `_internal/PROVINCE-PLAYBOOK.md` · ดูความคืบหน้า: `node _internal/status.mjs`

## วิธีแบ่ง: ตาม "ภาค" (อัตโนมัติ ไม่ต้องคุยกันทุกจังหวัด)
- **A (เครื่องหลัก / owner):** ภาคเหนือ + กลาง + ตะวันออก + ตะวันตก
- **B (เครื่องช่วย):** ภาคอีสาน + ใต้

แต่ละคนรัน `/loop` ที่ "หยิบจังหวัดถัดไปของภาคตัวเองที่ยังไม่ติ๊กใน build-queue" → ไม่มีทางหยิบจังหวัดเดียวกัน

### คำสั่ง /loop ของแต่ละคน
**A (เครื่องนี้):**
```
/loop Build the next unchecked province in _internal/build-queue.md that is listed under the "🟦 A — เหนือ/กลาง/ตะวันออก/ตะวันตก" section of _internal/TEAM-SPLIT.md, to the Chiang Mai gold standard per _internal/PROVINCE-PLAYBOOK.md. Run hotels+articles+images workflows, optimize, lint, set-hero, gen-hubs, build-test, then `git pull --rebase` and push, mark done in build-queue.md. Keep going until every province in the A list is done. Do not ask.
```
**B (เครื่องช่วย):**
```
/loop Build the next unchecked province in _internal/build-queue.md that is listed under the "🟧 B — อีสาน/ใต้" section of _internal/TEAM-SPLIT.md, to the Chiang Mai gold standard per _internal/PROVINCE-PLAYBOOK.md. Run hotels+articles+images workflows, optimize, lint, set-hero, gen-hubs, build-test, then `git pull --rebase` and push, mark done in build-queue.md. Keep going until every province in the B list is done. Do NOT edit _internal/gen-hubs.mjs, astro/public/index.html, CLAUDE.md, or _internal/wf/*.template.js (A owns those). Do not ask.
```

## กฎกัน git ชนกัน (สำคัญสุด — push เข้า `main` เดียวกัน)
1. **`git pull --rebase origin main` ก่อนเริ่มจังหวัด และก่อน push เสมอ** · ถ้า push โดน reject → `git pull --rebase` แล้ว push ใหม่
2. ลำดับ finalize ปลอดภัย: `git pull --rebase` → `node _internal/gen-hubs.mjs` → `bash _internal/build-test.sh` → commit → push
   (pull ก่อน gen-hubs ทำให้ city-*.html ทั้ง 77 ถูกสร้างจากเนื้อหาล่าสุดของทุกคน → ไม่ทับงานกัน)
3. `build-queue.md` ติ๊ก `[x]` เฉพาะจังหวัดตัวเอง · ถ้าชน checkbox ตอน rebase → เก็บ `[x]` ทั้งสองฝั่ง (trivial)

## ไฟล์ส่วนกลาง — **A เป็นเจ้าของคนเดียว** (B ห้ามแก้)
`_internal/gen-hubs.mjs` · `astro/public/index.html` · `CLAUDE.md` · `_internal/wf/*.template.js` · `astro/public/font-compare.html` · design/chrome
(B รัน gen-hubs ได้ แต่ commit เฉพาะ city-<slug>.html ของจังหวัดตัวเอง + ไฟล์เนื้อหาตัวเอง)

## รายชื่อจังหวัด (เรียงตามความสำคัญท่องเที่ยว)

### 🟦 A — เหนือ/กลาง/ตะวันออก/ตะวันตก (35 จังหวัด, รวม rayong กำลังทำ)
เหนือ: rayong(*กำลังทำ-east), nan, mae-hong-son, sukhothai, phetchabun, lampang, lamphun, phitsanulok, phrae, phayao, uttaradit, tak, kamphaeng-phet, phichit, nakhon-sawan, uthai-thani
กลาง: nakhon-nayok, samut-songkhram, nonthaburi, pathum-thani, samut-prakan, samut-sakhon, nakhon-pathom, ang-thong, lopburi, sing-buri, chai-nat, saraburi, suphan-buri
ตะวันออก: chanthaburi, chachoengsao, prachinburi, sa-kaeo
ตะวันตก: phetchaburi, ratchaburi

### 🟧 B — อีสาน/ใต้ (30 จังหวัด)
อีสาน: nakhon-ratchasima, loei, buriram, surin, ubon-ratchathani, khon-kaen, udon-thani, nong-khai, bueng-kan, nakhon-phanom, mukdahan, sakon-nakhon, sisaket, chaiyaphum, kalasin, maha-sarakham, roi-et, yasothon, amnat-charoen, nong-bua-lamphu
ใต้: nakhon-si-thammarat, trang, satun, songkhla, chumphon, ranong, phatthalung, pattani, yala, narathiwat

## ส่งให้คน B
1. สิทธิ์ push เข้า repo `chatoccmed/thailandaddict` (PAT หรือ collaborator)
2. คู่มือเซ็ตเครื่อง: `ThailandAddict-Migration-Guide.pdf` (clone · Node v24 · push auth) — **ไม่ต้องแก้ ROOT แล้ว** scripts derive repo root อัตโนมัติจาก `import.meta.dirname` (clone ที่ไหนก็รันได้)
3. ไฟล์นี้ + `_internal/PROVINCE-PLAYBOOK.md` + `_internal/status.mjs` (อยู่ใน repo แล้ว — clone มาได้เลย)

# แผนคอนเทนต์ Michelin Guide Thailand 2026 — วิเคราะห์ 2026-07-02

> อิง 3 ชั้นข้อมูล: (1) dataset 485 ร้าน verified (`michelin-2026.json`) · (2) coverage เดิมในเว็บ (145 บทความพูดถึงมิชลิน · Bib 71/137 ถูก mention แล้ว · มี `bangkok-michelin-fine-dining` + `phuket-michelin-fine-dining` ฟอร์แมตเก่า) · (3) SERP gap scan 6 มุม TH+EN (`scratchpad/serp-gap.json` — ผลเต็ม)

## ทำไมเราชนะ (3 แต้มต่อที่คู่แข่งไม่มี)
1. **Dataset moat** — 485 ร้าน ครบทุก tier + ชื่อไทย 137/137 Bib + NEW flags + rerunnable script → คู่แข่งทุกเจ้าเป็น recap แช่แข็ง พ.ย. 2025
2. **เครื่องจักรพร้อม** — eat-ranking v3 (การ์ดร้าน + stayHref + sticky hotel rail + Klook) พิสูจน์แล้ว 77 จังหวัด · โครง 24 ย่าน กทม. · trip planner + 🔖 save-to-plan · EN-twin pipeline · bilingual search เพิ่งขึ้น
3. **SERP ว่าง** — ผล scan ชัด: หน้า 1 ไทยมีเว็บรถยนต์/บล็อกเล็กติดอยู่ · ไม่มีใครมี "ชั้นข้อมูลใช้จริง" (ราคา/วิธีจอง/BTS) · **ไม่มี affiliate สักเจ้า** · **ไม่มีใครจับคู่ "กิน↔นอน" เลย** (= จุด monetize หลักของเรา) · Wongnai/Ryoii ไม่แข่งที่ความสด 2026

## สถาปัตยกรรม Hub & Spoke (ลำดับความสำคัญ)

### WAVE 1 — Money pages (ทำก่อน)
| หน้า | เหตุผลชนะ |
|---|---|
| **Hub: ร้านมิชลินไทย 2026 ฉบับสมบูรณ์** (TH+EN, `michelin-guide-thailand-2026`) | ไม่มีใครมีลิสต์ครบทุก tier แยกจังหวัด + update stamp รายเดือน (Selected โตรายเดือน — เราคือเจ้าเดียวที่ track) |
| **Bangkok pillar** — อัปเกรด `bangkok-michelin-fine-dining` เป็นการ์ด v3 | ของเดิมเป็น `ranked` ไม่มี stayHref = เงินหาย; เพิ่มชั้นใช้จริง: ราคา/หัว · วิธีจอง+ลิงก์ (TableCheck/Chope, จองล่วงหน้ากี่วัน, มัดจำ, dress code) · BTS/MRT+นาทีเดิน |
| **Bib Gourmand กรุงเทพ 44 ร้าน** (TH+EN) | chillpainai 2019 ยังติดอันดับ = ฟอร์แมตพิสูจน์แล้วแต่เก่า 7 ปี; EN ยิ่งว่าง (เพจดีสุด cover 4/137!) |

### WAVE 2 — Province spokes (ใช้เครื่อง 77 จังหวัดเดิม)
`michelin-restaurants-<province>` TH+EN: เชียงใหม่(18 Bib) · ภูเก็ต(อัปเกรด+Bib 19) · **ขอนแก่น 11 (EN = ศูนย์คู่แข่ง)** · อยุธยา 8 (มุม day-trip จาก กทม.) · โคราช 8 · อุดร 6 · **สุราษฎร์+สมุย 9 (จังหวัดใหม่ในไกด์ = first-mover)** · พังงา 6 · ชลบุรี 5 · อุบล 3 · นนทบุรี (AKKEE+Suan Thip ดาว + 5 Bib)
**+ Splice ป้ายรางวัลเข้า eat-ranking เดิม:** Bib 71 ร้านถูก mention อยู่แล้ว → เพิ่ม badge "🏅 Bib Gourmand 2026" บนการ์ด + ลิงก์เข้า hub (งาน splice ถูกและ SEO internal-link แรง)

### WAVE 3 — Angle pages (ช่องว่างที่ scan เจอตรง ๆ)
- **วิธีจองร้านมิชลิน** (แพลตฟอร์ม/lead time/มัดจำ/dress code/hack จองมื้อกลางวันถูกกว่า) — ไม่มีใครทำทั้ง 2 ภาษา
- **มิชลินทุกงบ** (<฿300 street / ฿1,000–3,000 / fine dining ฿5,000+)
- **Street-food Michelin + กลยุทธ์คิว** (เจ๊ไฝรอ 3 ชม. — ไม่มีเพจไหนบอกเวลาไปต่อคิว) + ชื่อไทยให้โชว์แท็กซี่ (จุดแข็ง bilingual เราเลียนแบบไม่ได้)
- **ย่าน crawl:** เยาวราช Bib เดินกิน 1 คืน (ผูก 24 ย่าน pages เดิม) · มิชลินใกล้ BTS
- **ทริปกิน 3 วัน กทม.** (ดาวมื้อค่ำ + Bib กลางวัน + street เช้า จัดตามโซน) — EN SERP มีแต่หน้าขายทัวร์ ไม่มี editorial
- **13 ร้านใหม่ 2026** · **Green Star 5 ร้าน** (มุม sustainability)

### WAVE 4 — Tools & moat (ตาม north-star)
- **Michelin finder** — filter ดาว/Bib/Selected × งบ × จังหวัด × ย่าน/BTS + แผนที่ (ไม่มีใครมี ทั้ง 2 ภาษา; Michelin เองต้อง login ถึง save ได้ — ของเรา 🔖 ไม่ต้อง)
- Selected 305 = ใช้เป็น data layer ใน finder (อย่าเขียน prose ทีละร้าน — thin content)
- **feeds/michelin.json** (AI-citation ตาม moat) + JSON-LD `award` บนการ์ดร้าน
- **จังหวะรายปี:** เตรียมหน้า pre-built ก่อนงานประกาศ ~พ.ย. 2026 → คืนประกาศอัปเดตได้ในชั่วโมง = ยึด SERP ช่วง spike ที่คู่แข่ง one-shot

## ⚠️ ทิศทางผลิตภัณฑ์ (owner 2026-07-02 — ดู memory `velalist-trip-handoff`)
**thailandaddict = รีวิว + ตะกร้าสิ่งที่สนใจ (🔖) เท่านั้น — ไม่จัดทริปบนเว็บนี้** การจัดทริปย้ายไป **Velalist.com** (กำลังพัฒนา: velalist.chatoccmed.workers.dev) ผลต่อแผนนี้:
- CTA ทุกหน้า Michelin = **"🔖 เพิ่มลงตะกร้า"** (บันทึกร้านที่สนใจ) — ไม่ใช่ "จัดทริปเลย"; ตะกร้าจะ hand off ไป Velalist เมื่อพร้อม
- finder = เครื่องมือฝั่ง discovery/review (อยู่ใน TA ได้) แต่อย่าพ่วงตัวจัด itinerary เพิ่ม
- "ทริปกิน 3 วัน" ใน W3 = **บทความ editorial** (คอนเทนต์รีวิว/แนะนำ) ไม่ใช่เครื่องมือ interactive
- feeds/michelin.json = data source ให้ Velalist ใช้ต่อได้โดยตรง (synergy)

## Monetization (SERP ยืนยัน: ชั้น affiliate ว่างทั้งกระดาน)
ทุกการ์ดร้าน → **"พักใกล้ร้าน"** stayHref (คลัสเตอร์ร้านตรงกับ hotel roundup ย่านเราพอดี: เจริญกรุง/เยาวราช/สาทร) + sticky rail รายจังหวัด + Klook food tour (aid=121442 — GYG tour ติด SERP organic = ดีมานด์มีจริง) + cross-link trip-budget

## กติกาความปลอดภัย
- ใช้ข้อเท็จจริงรางวัลแบบ editorial ได้ · **ห้าม**สื่อว่า affiliate กับ Michelin · เขียน desc เอง (ห้าม copy จาก guide) · โทน honesty-first ตามมาตรฐานเว็บ
- verify เปิด/ปิดจริงก่อนลงการ์ดทุกร้าน (gate เดิม audit-roundup)
- ข้อมูลราคา/วิธีจองต้อง research จริงต่อร้าน → ใช้ Workflow engine ต่อจังหวัดแบบ eat-ranking เดิม
- Selected = live count (305, โตรายเดือน) — ระบุ "ข้อมูล ณ เดือน X" เสมอ

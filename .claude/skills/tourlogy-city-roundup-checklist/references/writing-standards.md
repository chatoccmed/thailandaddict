# Writing Standards (mandatory · ทุก roundup ต้องผ่าน)

4 rules ที่ auditor (`tourlogy-quality-auditor`) จะตรวจ · ตกข้อใดข้อหนึ่ง = rewrite ก่อน commit

---

## Rule 1 — Tone: "เพื่อนเล่าให้เพื่อนฟัง" (friend-tone)

ทุกบทความเขียนเหมือนเพื่อนเล่าให้เพื่อนฟัง · เป็นกันเอง ตรงๆ ไม่ใช่ corporate brochure

> **🔒 โทน v2-clean (LOCKED · owner ยืนยัน 30 พ.ค. 2026 · ใช้กับทุกบทความทั้งเว็บ ของใหม่+ของเก่า):**
> เป็นกันเอง/บอกต่อ แบบ "คนคุยกัน" แต่ **สะอาด** —
> ✅ ใช้: เปิดแบบชวนคุย (บอกเลยว่า · เอาจริงๆ · ลองนึกภาพ · รู้ไหม · แอบกระซิบ) · คำลงท้าย **เลย/นะ** (พอดีๆ) · บอกต่อผ่านปากแขก ("คนไปมาพูดเป็นเสียงเดียวกันว่า..." · "หลายคนบอกว่า...")
> ❌ **ห้ามเด็ดขาด: คำลงท้ายสแลง อ่ะ · ปะ · แหละ · ล่ะ** + คำ AI (T1) + ทับศัพท์ + "ผมไป/ผมพัก" + กลิ่นรีวิวทางการ ("จุดเด่นคือ"/"สไตล์...ชัดเจน"/"สรุปสั้นๆ")
> ตัวอย่างผ่าน (live): `review-hard-rock-hotel-guadalajara` · `review-hyatt-regency-andares-guadalajara` · gate ก่อน publish: `grep -E "อ่ะ|ปะ|แหละ|ล่ะ"` = 0 (ยกเว้น false-match เช่น ปะการัง) · T1 = 0 · ดูเต็ม `_internal/WC-REVIEW-PAGE-CORRECTIONS.md`

**🎯 Reference (must match):** `https://wherebest.com/top10-hotels-taipei` — นี่คือมาตรฐาน tone ที่เว็บใช้ · ทุก roundup ใหม่ต้อง feel เหมือนนี้ ไม่ใช่ corporate · ไม่ใช่ AI-feeling

**🚨 Honesty rule (critical · added v2):** ห้ามอ้าง "ผมไป" "ผมพัก" "ครั้งล่าสุดที่ผมไป X" ถ้าไม่ได้ไปจริง · ใช้ editorial framing แทน — "เราคัดจากรีวิวจริง" · "บทความนี้รวม X" · "อ้างอิงคะแนนผู้พักจริง" · Doctor Chat author = curator/editor · ไม่ใช่ฮอเทล tester ที่บินไปทุกที่

**🚨 Transliteration ban (added v2):** อย่าทับศัพท์คำที่มี English term แพร่หลายและสั้นกว่า:
- ❌ "ลักชัวรี่" → ✅ "Luxury" หรือ "สุดหรู"
- ❌ "ออนเซน" → ✅ "Onsen" (ในบริบทญี่ปุ่น)
- ❌ "บูทีค" → ✅ "Boutique"
- ❌ "คอนซิเอจ" → ✅ "Concierge"
- ❌ "อัลตร้า ลักชัวรี่" → ✅ "Ultra Luxury"

### ✅ DO — Friend-tone patterns

- เปิดด้วยสถานการณ์/คำถาม: "ถ้าคุณกำลังมองหา..." · "เคยลองพักโรงแรมที่..."
- ใช้ "เรา/คุณ" ตรงๆ
- ภาษาตรงๆ: "บอกตรงๆ" · "เคยเจอไหม" · "พักแล้วไม่อยากกลับ"
- เปรียบเทียบเชิงปริมาณ: "ใหญ่กว่า 30-50%" · "เดิน 3 นาที (เร็วกว่ารถไฟ)"
- สรุปแบบเพื่อนเตือนเพื่อน: "บอกไว้ก่อน — ถ้าจะมา X ระวัง Y"
- ระบุ trade-off ตรงๆ: "ถูกแต่ห้องเล็ก" · "หรูแต่ไกลสถานี"

### ❌ DON'T — Corporate red flags (ห้ามใช้)

- "เปิดให้บริการ" → "เปิดปี"
- "ตอบโจทย์" → "ครบ / เหมาะ / ตรง"
- "ผสมผสาน" → ตัดทิ้ง / ใช้คำตรงๆ
- "โดยสรุป" → "สรุปสั้นๆ"
- "หนึ่งในตัวเลือกที่ทีม Wherebest แนะนำสำหรับนักเดินทาง" → "ถ้าคุณกำลังหาโรงแรมที่..."
- "ยอดนิยม" ลอยๆ ไม่มีหลักฐาน → ตัด หรือใส่หลักฐาน ("8,000 รีวิวเฉลี่ย 9.4")
- น้ำเสียงทางการสไตล์โบรชัวร์โรงแรม

### Before / After example

❌ "Aman Tokyo เป็นโรงแรมระดับ 5 ดาวที่ผสมผสานความหรูหราแบบญี่ปุ่นและตะวันตก ตอบโจทย์นักเดินทางที่มองหาประสบการณ์พักผ่อนระดับพรีเมียม"

✅ "Aman Tokyo คือโรงแรมที่พักครั้งเดียวแล้วลืมยาก — บัตเลอร์ส่วนตัว ห้องบนชั้น 33-38 วิวเมือง 360° สวนทรายญี่ปุ่นในล็อบบี้ที่กว้างกว่าทั้งฟลอร์โรงแรมอื่นรวมกัน · บอกตรงๆ ราคา ¥150,000+/คืน ไม่ใช่ทุกคนจะกล้าจ่าย แต่ถ้าจ่ายได้ครั้งหนึ่งในชีวิต — ที่นี่"

อ่านเต็มที่ `_internal/WRITING-STYLE.md` — friend-tone DO/DON'T table + Pattern A/B/C/D openers

---

## Rule 2 — Titles: สวยงาม · น่าสนใจ · น่าติดตาม · ไม่น่าเบื่อ

ห้ามใช้ "Top N + [type] + [city]" pattern แบบโบรชัวร์ · ทุก title ต้องมี **hook** ที่อยากให้คนคลิก

### ✅ DO — Scene-led / curiosity-led titles

- เปิดด้วย scene/feeling: "นอนตื่นมาเจอวิว Mt Fuji กับมื้อเช้า — 10 ryokan Hakone..."
- ใช้คำถาม: "นอนที่ไหนดีในไทเป? 10 โรงแรมที่รีวิวจริงนับหมื่นบอกต่อ"
- ใส่ตัวเลขที่ proof: "8,000 รีวิวเฉลี่ย 9.4 — 10 luxury Tokyo ที่แขกบอกต่อมากที่สุด"
- ใส่ specific benefit: "ลากกระเป๋าออกจากสถานี เดินไม่ถึง 5 นาทีก็ถึงห้อง — 10 โรงแรมรอบ Shinjuku"
- ใช้ active emotion: "พักแล้วไม่อยากกลับ" · "ฟินสุด" · "เผลอตื่นเช้า"

### ❌ DON'T — Boring template patterns

- "Top 10 Luxury Hotels in Tokyo" (ห้าม)
- "10 อันดับโรงแรมหรูในโตเกียว 2026" (template trap · boring)
- "โรงแรมไทเปยอดนิยม — 10 อันดับที่นักท่องเที่ยวจองมากที่สุด" (corporate)
- "[หมวด] + เมือง + ปี" pattern ลอยๆ
- "Best [type] in [city]" ภาษาอังกฤษ template

### Before / After examples

| ❌ Boring | ✅ Engaging |
|---|---|
| "Top 10 Luxury Hotels Tokyo 2026" | "Aman ถึง Bulgari — 10 ลักชัวรี่โตเกียวที่จ่ายแล้วได้คุ้ม" |
| "10 อันดับโรงแรมใกล้ Shinjuku Station" | "ลากกระเป๋าออกจากชินจูกุ เดินไม่ถึง 5 นาทีถึงห้อง — 10 โรงแรมจริง" |
| "8 ออนเซนโฮเทลเป่ยโถวที่ดีที่สุด" | "แช่น้ำแร่อุ่นๆ ในห้องส่วนตัว — 8 ออนเซนโฮเทลเป่ยโถวที่ฟินที่สุด" |
| "Top 5 Family Hotels Bangkok" | "10 โรงแรมกรุงเทพที่พ่อแม่ได้นอน ลูกได้เล่นทั้งวัน" |
| "Top 10 Tokyo Hotels with Mt Fuji View" | "นอนเปิดผ้าม่านมาเจอ Mt Fuji กลางห้อง — 10 โรงแรมที่ทำได้จริง" |

อ่านเต็มที่ `tourlogy-city-content` skill · Part 6 — Title writing patterns

---

## Rule 3 — Per-context unique descriptions

**โรงแรมเดียวกันที่ปรากฏใน roundup หลายอันต้องมีคำบรรยายต่างกันทุกครั้ง** · ปรับให้เข้ากับ angle ของบทความนั้นๆ — ห้าม copy-paste

### ทำไมเรื่องนี้สำคัญ

- **SEO:** Google penalty duplicate content · คำบรรยายซ้ำใน 5 หน้า = thin content flag
- **UX:** คนอ่าน roundup หลายอันเจอโรงแรมเดียวกัน · ต้องเห็น angle ใหม่ทุกครั้ง ไม่งั้นเบื่อ
- **Trust:** แสดงว่าเราคิดจริงๆ ว่าทำไมโรงแรมนี้เหมาะกับ category นั้นๆ ไม่ใช่ลอกแปะ

### Example: Aman Tokyo ใน 5 roundups · ต้อง 5 angles

| Roundup | Angle | คำบรรยาย (ตัวอย่าง) |
|---|---|---|
| **#1 Top 10 popular Tokyo** | Why iconic | "อันดับ 1 luxury Tokyo จากแขกหลายร้อยคน · บัตเลอร์ส่วนตัว · สวนทรายญี่ปุ่นใน lobby ที่ใหญ่ที่สุดในเมือง" |
| **#13 Top 5 luxury Tokyo** | The luxury experience | "Kerry Hill Architects ตีความ luxury แบบ minimalist Japanese · ห้องเริ่ม ¥150K · spa private cabana · breakfast in-suite ทุกเช้า" |
| **#14 Top 5 signature Tokyo** | The unique view/DNA | "วิว 360° Otemachi-Marunouchi จากชั้น 33-38 · กลางคืนเห็น Tokyo Tower เป็นจุดแสง · ไม่มีโรงแรมไหนทำได้แบบนี้" |
| **#17 Top 5 design Tokyo** | The architectural story | "Kerry Hill ดีไซน์ให้เป็น 'urban onsen' — ผนังหิน ไม้สนญี่ปุ่น แสง dim · ทุกห้องเหมือนอยู่ใน ryokan ยกตึก" |
| **#6 Top 5 couples Tokyo** | The romantic moment | "ห้องส่วนตัวที่สุดในโตเกียว · onsen spa คู่ตัดนุ่มที่สุด · ระเบียงมองเมืองทั้งคืน · บริการให้เก็บมุมเป็นความลับ" |

Each card = 30–80 words · all describe Aman Tokyo · all framed for the different roundup angle

### Implementation rules

- `tourlogy-roundup-builder` agent receives hotel pool + the **roundup angle** as context
- Agent writes hotel description **from scratch** for each roundup · ห้าม reuse จาก roundup อื่น
- Auditor checks: search หาโรงแรมในหลาย roundups · ถ้า description >70% similar = flag for rewrite

### Quick check (orchestrator before commit)

```bash
# For a hotel appearing in 5 roundups, compare description fields
grep -l "Aman Tokyo" astro/src/content/roundups/*.json
# Compare description fields across the matches manually
```

### Anti-pattern to flag

- ❌ "Aman Tokyo คือโรงแรมหรู 5 ดาวในย่าน Otemachi" — ใช้แบบเดียวกันใน 5 roundups
- ✅ 5 บรรทัดต่างกันสมบูรณ์ตามตัวอย่างข้างบน

---

## Rule 4 — Human Voice + Anti-AI Patterns

**Why this matters:** Google's algorithm + reader pattern-recognition can detect AI-generated content. Content ที่ "อ่านแล้วรู้ว่า AI เขียน" จะโดน:
- Google's Helpful Content Update ลด ranking
- Spam Brain ตรวจจับ AI-generated thin content
- ผู้อ่านเลื่อนผ่าน · เสีย conversion
- E-E-A-T signal ลด

ทุก roundup ต้องผ่าน **5 human voice markers** + **เลี่ยง 4 AI tells**

### 5 Human Voice Markers (ทุก hotel card ต้องมี ≥3 ใน 5)

#### M1 — Specificity = experience-details (ไม่ใช่ data dump!)

**บทเรียนจาก pilot:** Specificity ที่มากเกินไป (room numbers · concierge names · floor numbers · exact times · staff names) ทำให้บทความ feel เหมือน AI showing-off database · เพิ่ม credibility = false · ลด readability

**Specificity ที่ใช้ได้ (เน้น experience · ความรู้สึก · จุดต่าง):**

| ❌ Wrong (data dump · AI-feel) | ✅ Right (experience-led) |
|---|---|
| "ห้องเลขลงท้าย 02-04 ฝั่งใต้ ชั้น 35+ = วิว Tokyo Tower 1.2km" | "ขอห้องฝั่งใต้ชั้นสูง วิว Tokyo Tower กับ Tokyo Bay ในภาพเดียว" |
| "Concierge Yamada-san พูดอังกฤษคล่อง" | "พนักงาน concierge ช่วยจองร้านอาหารยากๆ ได้" |
| "Restaurant Hibiki ชั้น B1 · 7-10am · ไข่ Onsen Tamago + ปลาแซลมอน" | "บุฟเฟ่ต์เช้าญี่ปุ่นแท้ๆ · มี Onsen Tamago + ปลาแซลมอน" |
| "Aman Experience credit ¥10,000 ฟรี + early check-in 11:00" | (skip — ไม่ใช่ทิปที่ตรงกับการจอง affiliate) |

**กฎใหม่:** specificity ที่จำเป็นมีแค่ — ชื่อย่าน · ชั้นโรงแรม (เพื่อเข้าใจระดับ) · ประเภทห้อง · 1-2 จุดเด่นที่ unique · เวลาเดินทางจากสถานี (ระยะเท่านั้น · ไม่ต้องแจง exit number) · 1 ตัวเลขราคา (start price)

**ไม่ต้องระบุ:** room numbers · staff names · exact menu items · cookies-time tricks · check-in tricks · direct-booking hacks

#### M2 — Tip ที่ "ใช้ได้จริง · ไม่แข่งกับ affiliate" (1 ทิปสั้นๆ ต่อ hotel)

**บทเรียนจาก pilot:** Pro tip ที่บอก "จองตรงเว็บโรงแรม" หรือ "ขอ Aman credit" = แข่งกับ affiliate ของเรา (Agoda · Booking · Trip) · เสีย commission · ห้ามทำ

**ทิปที่ใช้ได้ (encourage user · ไม่แข่ง revenue):**

```
✅ "ขอห้องชั้นสูงฝั่งใต้ · วิว Tokyo Bay กับ Rainbow Bridge ในภาพเดียว"
✅ "Il Bar ชั้น 45 เปิดให้คนนอก · cocktail ¥3,000 = ลองสัมผัสบรรยากาศก่อนจอง"
✅ "Lobby Lounge เปิดให้คนนอก · matcha set คุ้มสำหรับชมวิวก่อนตัดสินใจ"
✅ "สั่ง Mt Fuji cocktail ที่ Old Imperial Bar — สูตรปี 1924 ที่ยังทำได้"
✅ "ขอห้องชั้น 30+ ฝั่ง garden · เงียบกว่าฝั่งถนนมาก"
```

**ห้าม:**
- ❌ "จองตรงเว็บโรงแรม X · ได้สิทธิพิเศษ Y"
- ❌ "Member XX program ได้ free breakfast"
- ❌ "ถ้าจอง Suite ขึ้นไป ขอ concierge Name-san"
- ❌ Room number tricks ที่ specific เกิน
- ❌ List ที่ยาว 5+ items

**1 ทิป · 1-2 บรรทัด · ใช้ "เคล็ดลับ" หรือ "💡 เคล็ดลับ" · ไม่ใช่ "Pro tip" (ทับศัพท์)**

#### M3 — Honest trade-off (ทุก hotel ต้องมี ≥1 จุดที่ "ไม่ใช่ทุกคนจะชอบ")

```
✅ "ราคา ¥150K+/คืน — ไม่ใช่ทุกคนจ่ายได้ · ถ้าไม่อยู่ใน budget นี้ skip ไปเลย"
✅ "ห้อง 26-30 sq.m เล็กตามมาตรฐาน Tokyo · ถ้าต้องการกว้างกว่า ลอง [hotel X]"
✅ "Wi-Fi 50-80 Mbps ในห้องเก่า ชั้น 5-15 · ชั้น 20+ เร็วกว่ามาก"
✅ "บุฟเฟ่ต์ดีแต่ raw bar ปิด 9:30am ส่วนใหญ่กิน sushi เช้าไม่ทัน"
✅ "ใกล้สถานีแต่ทางเข้าโรงแรมมุมเปลี่ยว 23:00+ ผู้หญิงเดี่ยวระวัง · ใช้ Exit B2 ดีกว่า"
✅ "Onsen ในห้องเล็กกว่าที่คาด · 1.2m × 1.5m พอแช่คนเดียวสบาย · 2 คนบีบ"
```

ห้าม "perfect for everyone" / "เหมาะสำหรับทุกคน" — = AI

#### M4 — Sensory detail (engage smell · sound · texture · taste · temperature)

```
✅ "Lobby กลิ่น cedar + matcha incense · เปลี่ยนกลิ่นทุก 2 ชม."
✅ "ผ้าปูเป็น crisp linen 400-thread · ห่มแล้วเย็นทันที"
✅ "Onsen น้ำร้อน 41°C · นั่งได้สบาย 10-15 นาที"
✅ "ห้องเงียบมาก · ฟัง Tokyo traffic อยู่ไกลๆ เหมือนเสียงคลื่น"
✅ "Coffee เช้าหอม Italian roast + crema หนา"
✅ "Carpet ใหม่ · เหยียบนุ่ม · ส้นเท้าไม่ปวด"
```

#### M5 — Source citation: 1 credible cite per hotel (ไม่ stack · added v2)

**บทเรียนจาก pilot:** Stack credentials ("Forbes 5★ 2025 · Michelin Key · World's 50 Best Hotels #28 · Travelers' Choice 2025") = AI showing off · feel insincere · long-form clutter

**กฎใหม่:** 1 hotel = **1 score line** (platform + count + score) · ใส่หลังเนื้อหาเด่น · ถ้ามีรางวัลใหญ่ ใส่ inline ใน story (max 1 award mention)

**Format:**

```
✅ "คะแนน 9.6 จาก 1,247 รีวิว Booking — สูงสุดในกลุ่ม Luxury โตเกียว"
✅ "คะแนน 9.3 จาก 2,538 รีวิว Booking · TripAdvisor #10 ในญี่ปุ่นทั้งประเทศ"
✅ "คะแนน 9.4 จาก 312 รีวิว Booking — โรงแรมใหม่ (เปิด ม.ค. 2023) แต่ขึ้น top อย่างรวดเร็ว"
```

**ห้าม stacking 4-5 credentials:**

```
❌ "Booking 9.4 จาก 2,847 · Agoda 9.3 จาก 1,520 · Trip 9.5 จาก 890 · Forbes 5★ 2025 · Michelin Key 2024 · World's 50 Best #28"
```

**Award mentions in story (max 1):**
- ✅ "Il Ristorante Niko Romito ชั้น 45 ได้ Michelin 2 ดาว 2025" (inline · เกี่ยวข้องกับ context)
- ❌ Forbes/Michelin/TripAdvisor list ติดกันใน 1 sentence

**Verification trail (audit JSON · ไม่แสดง user):** เก็บ full cross-platform scores + sources + Forbes/Michelin status ใน `verification` field สำหรับ orchestrator/auditor · แสดงในหน้า user แค่ 1 score line

### 4 AI Tells (ห้ามใช้ · zero tolerance)

#### T1 — AI Vocabulary

**Thai (ห้ามใช้):**
- "ผสมผสาน" · "อย่างลงตัว" · "อย่างไร้รอยต่อ"
- "ตอบโจทย์" · "ครอบคลุมทุกความต้องการ"
- "เอกลักษณ์ของ" · "บรรยากาศที่โดดเด่น"
- "นำเสนอ" · "มอบประสบการณ์"
- "เหมาะสมที่สุดสำหรับทุกคน"
- "เปิดให้บริการ" (→ "เปิดปี")
- "พรั่งพร้อม" · "ครบครัน"
- "หรูหรา" ลอยๆ (ต้องมีหลักฐาน · เช่น "Forbes 5 stars")
- "บริการระดับโลก" · "มาตรฐานสากล"
- "ตระการตา" · "น่าทึ่ง" · "ยิ่งใหญ่"
- "ไม่ว่าคุณจะเป็น... หรือ..." pattern
- "นอกจากนี้" · "อีกทั้ง" · "ทั้งนี้" (overuse = AI marker)
- "ในส่วนของ..." (filler · ตัดได้)
- "อย่างไรก็ตาม" overuse
- "ในขณะเดียวกัน" overuse

**English (ห้ามใช้):**
- "delve into" · "elevate" · "leverage" · "boast"
- "nestled" · "showcase" · "epitome of"
- "robust" · "seamless" · "vibrant"
- "perfect for" · "look no further than"
- "stunning" · "breathtaking" lazily
- "ultimate experience" · "world-class amenities"
- "whether you're [X] or [Y]"
- "in conclusion" · "in summary" · "moreover" · "furthermore"
- "a perfect blend of"
- "rich tapestry of"

#### T2 — Structural Tells

- ❌ ทุก hotel card เริ่มด้วย pattern เดียวกัน
- ❌ ทุก paragraph มี 3 sentences exactly
- ❌ Conclusion ทุก section restates intro
- ❌ Lists of 3 items "X, Y, and Z" everywhere
- ❌ Em-dash (—) overuse (>3 ใน paragraph เดียว = red flag)
- ❌ Triple parallelism ("A is X. B is Y. C is Z.")
- ❌ Generic intro "In this article, we will explore..."
- ❌ "Here's our top picks" closer · ใช้ ending แบบมนุษย์
- ❌ Hotel descriptions ยาวเท่ากันเป๊ะทุกตัว

#### T3 — Content Tells

- ❌ Round-numbered prices (¥20,000 · $200) — มนุษย์ใช้ตัวเลขจริง (¥18,400 · $187)
- ❌ ไม่มีชื่อพนักงาน · ไม่มีหมายเลขห้อง · ไม่มีเวลาเฉพาะ
- ❌ Generic transit times ("close to station") · มนุษย์ verify (4 min walk, 423m)
- ❌ ไม่มี trade-off / weakness ในทุก hotel = ad copy
- ❌ ไม่มี story / anecdote
- ❌ "Recently renovated" without year
- ❌ Award mentions without source

#### T4 — Voice Tells

- ❌ ไม่มี personal opinion ("we found..." / "เราพบว่า...")
- ❌ Everything positive · ไม่มีจุดที่ไม่ชอบ
- ❌ Same tone หรูสุดจรดถูกสุด · sound คล้ายกัน
- ❌ ไม่มี emotional reaction
- ❌ ไม่มี contradiction acknowledgment

### Quality Auditor Anti-AI Checks

**Quantitative (grep-able):**

```bash
# T1 vocabulary check — ห้ามมีคำ AI
grep -cE "(ผสมผสาน|ตอบโจทย์|อย่างลงตัว|นำเสนอ|เปิดให้บริการ|พรั่งพร้อม|ครบครัน|delve into|nestled|showcase|epitome|seamless|boast)" <file>
# Threshold: 0 instances

# Em-dash overuse
grep -cE "—" <file>
# Threshold: ≤2 per paragraph average

# Round-numbered prices
grep -cE "(¥|฿|\$)[0-9]+,?000\b"
# Threshold: ≤10% of total price mentions
```

**Qualitative (auditor reads):**

- M1 Specificity: random card · ≥3 specific data points?
- M2 Insider tip: ทุก card มี Pro tip ที่ไม่ generic?
- M3 Trade-off: ทุก card มี caveat honest?
- M4 Sensory: 3 random cards · ≥1 sensory each?
- M5 Source citation: scores มี platform + count + date?
- T4 Voice variation: luxury vs budget card · tone ต่างกัน?

**Pass criterion:**
- 0 T1 words (zero tolerance)
- Thresholds ผ่าน
- 5/5 qualitative checks
- ทุก hotel มี ≥3 ใน 5 voice markers
- ทุก hotel description **80-150 words** (max 200) · ไม่เกิน
- ทุก hotel มี 1 ทิป (ไม่ใช่ 3-5 ทิป list)
- ทุก hotel มี 1 score line cite (ไม่ stack 3-4 credentials)
- 0 first-person fabrication ("ผมไป" · "ครั้งล่าสุดที่ผมพัก" · "ผมทดลอง")
- 0 direct-booking-on-hotel-site recommendations (ทุก CTA ไป Agoda/Booking/Trip)
- 0 transliteration ของ "ลักชัวรี่" / "บูทีค" / "คอนซิเอจ" / "ออนเซน" (ใช้ Luxury/Boutique/Concierge/Onsen ภาษา English)

**Fail action:** rewrite ก่อน publish

### Voice Variation per Tier

แต่ละ tier ต้องมี distinct voice — ห้าม luxury card sound เหมือน budget card:

- **Luxury (Aman · Mandarin · Bulgari):** contemplative · craftsmanship · architect name · slower pace · sensory richness · world-context (Forbes · Michelin)
- **Mid-range (Niwa · Mitsui Garden):** Practical · value · efficient layouts · sensible details
- **Budget (APA · Gracery):** Honest · functional · time-saving · location-driven
- **Hostel (Nine Hours · Almond):** Social · backpacker tribe · short-stay design · community energy

ถ้าทุก tier sound เหมือนกัน = template generation = AI

---

## Practical example — Before / After complete rewrite

### ❌ Before (100% AI-vibe · 7 T1 words)

> Aman Tokyo เป็นโรงแรมหรู 5 ดาวที่ผสมผสานความหรูหราอย่างลงตัวกับสไตล์ญี่ปุ่นแบบดั้งเดิม นำเสนอประสบการณ์การพักผ่อนระดับโลกที่ตอบโจทย์นักเดินทางที่มองหาบรรยากาศที่โดดเด่น พรั่งพร้อมด้วยสิ่งอำนวยความสะดวกครบครัน เปิดให้บริการตั้งแต่ปี 2014 ในย่านโอเตมาจิอันเป็นใจกลางเมือง

**Diagnose:** T1 = 7 words (FAIL) · M1-M5 = 0/5 (FAIL) = total FAIL

### ✅ After (5/5 markers · 0 T1)

> Aman Tokyo อยู่ชั้น 33-38 ของตึก Otemachi Tower · ใจกลางย่าน financial district แต่พอออกจากลิฟต์ความ chaos ของ Tokyo หายไปทันที — กลิ่น cedar wood · กระจกบาน 12m เห็น Imperial Palace garden ฝั่งหนึ่ง · skyline ตะวันออกเฉียงเหนือฝั่งเดียวกัน
>
> Kerry Hill Architects ดีไซน์ให้เหมือน urban ryokan ยกตึก · ห้อง 71 sq.m ขั้นต่ำ (เริ่ม ¥150,000/คืน · suite ¥350K+) · onsen ในห้อง spa private cabana ทุกห้อง suite
>
> Booking 9.5 จาก 850 reviews · Agoda 9.4 · Trip 9.6 · Forbes Travel Guide 5 stars 2025
>
> **Pro tip:** จองตรง aman.com ขอ Aman Experience credit ¥10K ฟรี + early check-in 11am · 3rd party ไม่มี · request Yamada-san at concierge สำหรับ kaiseki reservation ที่ Hyotei
>
> **Trade-off ตรงๆ:** ¥150K+ ไม่ใช่ทุกคนจ่ายได้ · ถ้าอยากลองสัมผัส Aman แต่งบไม่ถึง ลอง Aman SPA day pass ¥45K (ผู้ไม่พักก็ใช้ได้ · 5 ชม.) คุ้มกว่าเยอะ

**Diagnose:** T1 = 0 (PASS) · M1 specific (✓) · M2 insider tip (✓) · M3 trade-off (✓) · M4 sensory cedar (✓) · M5 4-platform citations (✓) = 5/5 PASS

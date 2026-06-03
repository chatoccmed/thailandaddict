# EEAT Signals — Author + Trust Markers (mandatory · ทุก roundup)

**Why this matters:** Google's E-E-A-T framework (Experience · Expertise · Authoritativeness · Trustworthiness) ใช้คัด YMYL (Your Money Your Life) content · travel content คือ YMYL (เพราะคนใช้ตัดสินใจจ่ายเงิน · เดินทาง) · ถ้าไม่มี author + expertise + trust signals = Google ลด ranking + จัดเป็น low-quality content · ผู้อ่านก็ไม่เชื่อ

ทุก roundup ต้องมี author byline + bio + trust markers ครบทุกหน้า — non-negotiable

---

## A. The Author: Doctor Chat (หมอแชท)

**Persona ของเว็บ Wherebest:**

- **ชื่อ:** Doctor Chat (Dr Chat / หมอแชท)
- **อาชีพ:** หมอ
- **Passion:** การท่องเที่ยว · ค้นหาประสบการณ์ดีๆ จากทุกที่ที่ไป
- **Mission:** ต้องการให้ทุกคนได้รับประสบการณ์การเดินทางที่ดี · จึงสร้างเว็บนี้เพื่อแบ่งปันสิ่งที่ค้นพบ

### Author bio (Thai · canonical · ใช้เหมือนกันทุกหน้า)

> หมอผู้รักการเดินทาง · เชื่อว่าทุกคนสมควรได้รับประสบการณ์ท่องเที่ยวที่ดี · จึงสร้าง Wherebest เพื่อแบ่งปันโรงแรม · ร้านอาหาร · สถานที่ ที่ได้ค้นพบจริงจากการเดินทางหลายปี

### Author bio (English · canonical)

> A doctor with a passion for travel · believes everyone deserves great trip experiences · created Wherebest to share the hotels, restaurants, and places I've personally discovered over years on the road.

### Tagline สั้น

"Travel like a doctor — careful, curious, evidence-based"

---

## B. Author Byline — ตำแหน่งและรูปแบบ

ทุก roundup HTML ต้องมี byline ใน 3 จุด:

### B1. ใกล้ title (top of article · scannable)

```html
<div class="article-byline">
  <img src="/images/dr-chat-avatar.jpg" alt="Doctor Chat" class="author-avatar" width="40" height="40">
  <span class="author-name">เขียนโดย <strong>Doctor Chat</strong></span>
  <span class="article-meta">· อัปเดตล่าสุด 27 พ.ค. 2026 · อ่าน 8 นาที</span>
</div>
```

### B2. ⛔ Article meta box — **REMOVED in v2**

**Owner feedback:** "How we picked + Affiliate disclosure" box prominent ทำให้บทความ feel หนัก + corporate · ผู้อ่านไม่ต้องการ ToS ภาษากฎหมายในหน้า roundup

**v2 replacement:** 
- ❌ ไม่ใส่ box ที่ prominent กลางหน้า
- ✅ ใส่ Disclosure ขนาดเล็กใน footer หรือ "เกี่ยวกับเรา" page link
- ✅ Verification trail เก็บใน JSON `verification` field (internal audit · ไม่แสดง user)
- ✅ "อัปเดต 28 พ.ค. 2026 · อ่าน 12 นาที" บน byline strip ก็เพียงพอ trust signal

### B3. Author bio box (bottom of article · before footer)

```html
<aside class="author-bio">
  <img src="/images/dr-chat-avatar.jpg" alt="Doctor Chat" class="author-photo" width="80" height="80">
  <div>
    <h3>เกี่ยวกับผู้เขียน — Doctor Chat</h3>
    <p>หมอผู้รักการเดินทาง · เชื่อว่าทุกคนสมควรได้รับประสบการณ์ท่องเที่ยวที่ดี · จึงสร้าง Wherebest เพื่อแบ่งปันโรงแรม · ร้านอาหาร · สถานที่ ที่ได้ค้นพบจริงจากการเดินทางหลายปี</p>
    <p><strong>Read more by Doctor Chat:</strong> <a href="/about">about Wherebest</a> · <a href="/editorial-policy">วิธีการเขียนของเรา</a></p>
  </div>
</aside>
```

---

## C. JSON-LD Person Schema (mandatory · ใส่ใน head)

ทุก roundup ต้องมี `Person` schema ใน JSON-LD เพื่อให้ Google เข้าใจว่าใครเป็น author:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "[roundup title]",
      "author": {
        "@type": "Person",
        "@id": "https://wherebest.com/about#doctor-chat",
        "name": "Doctor Chat",
        "url": "https://wherebest.com/about",
        "image": "https://wherebest.com/images/dr-chat-avatar.jpg",
        "jobTitle": "Doctor · Travel Writer · Founder of Wherebest",
        "description": "A doctor with a passion for travel · created Wherebest to share trusted hotel and travel recommendations.",
        "sameAs": [
          "https://wherebest.com/about"
        ]
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://wherebest.com#publisher",
        "name": "Wherebest",
        "url": "https://wherebest.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wherebest.com/images/wherebest-logo.png"
        }
      },
      "datePublished": "2026-05-27",
      "dateModified": "2026-05-27"
    }
  ]
}
```

---

## D. Trust Markers ที่ต้องมีในทุก roundup

นอกจาก author bio · 5 trust markers อื่นที่ต้องใส่:

| Marker | ตำแหน่ง | ตัวอย่าง |
|---|---|---|
| **1. Last verified date** | top + bottom | "อัปเดตล่าสุด 27 พ.ค. 2026 · ราคา + availability เช็คใหม่ทุก quarter" |
| **2. How we picked methodology** | top (after intro) | "คัดจาก top 30 · drop score <8.0 · จัดอันดับตาม merit · verify 8-step ทุก hotel" |
| **3. Affiliate disclosure** | top + before each CTA | "ลิงก์จองด้านล่างเป็น affiliate · เราได้ commission เล็กน้อย · ราคาที่คุณจ่ายไม่เพิ่ม" |
| **4. Cross-platform scores cited** | per hotel card | "Booking 9.4/2,847 reviews · Agoda 9.3 · Trip 9.5" (Citation rule M5) |
| **5. Sources / further reading** | bottom of article | Links to: official hotel sites · Wikipedia (if applicable) · related Wherebest guides |

---

## E. Intro + Closing patterns (updated v2 · honest editorial framing)

**🚨 CRITICAL — Honesty rule (v2):** ห้ามอ้าง first-person "ผมไป" "ครั้งล่าสุดที่ผมพัก" ถ้า Doctor Chat ไม่ได้ไปจริง · Doctor Chat = curator/editor ไม่ใช่ฮอเทล tester · ใช้ editorial framing แทน

### Intro pattern (Thai · v2 · editorial framing)

```
[เมือง]มีโรงแรม [tier] ระดับ [pricing range] มากกว่า [N] แห่ง — แต่ละที่ต่างกันมาก
บางที่เน้น [angle A] บางที่เน้น [angle B] บางที่เน้น [angle C]
บทความนี้รวม **10 โรงแรม [tier] [เมือง]** ที่คะแนนสูงทุกแพลตฟอร์ม
คัดให้แล้วว่าใครเหมาะกับสายไหน · ทำเลครอบคลุม [ย่าน 1 · ย่าน 2 · ย่าน 3]
```

ตัวอย่าง (Tokyo luxury):
> โตเกียวมีโรงแรม Luxury 5 ดาวมากกว่า 20 แห่ง — แต่ละที่ต่างกันมาก บางที่เน้นวิว Skyline บางที่เน้น Spa บางที่เน้น Heritage บทความนี้รวม **10 โรงแรม Luxury โตเกียว** ที่คะแนนสูงทุกแพลตฟอร์ม คัดให้แล้วว่าใครเหมาะกับสายไหน ทำเลครอบคลุม Otemachi · Marunouchi · Shinjuku · Toranomon

### Intro pattern (English · v2)

```
[City] has more than [N] [tier] hotels — and they're not interchangeable.
Some lean [angle A], some lean [angle B], some lean [angle C].
This guide rounds up **10 [tier] hotels in [city]** that score consistently
across every major booking platform — curated by category so you can pick
the one that fits how you actually travel. Locations cover [zones].
```

### Closing pattern (Thai · v2 · soft heading)

**Heading:** `เลือกโรงแรม [tier] ใน [เมือง]ยังไงให้ตรงกับตัวเอง?`
(ไม่ใช่ "Doctor Chat แนะนำ" ที่เป็นทางการเกินไป)

```
🌃 อยาก [persona/need A] → [Hotel #X] ([1-line why])
🍷 อยาก [persona/need B] → [Hotel #Y]
🎍 อยาก [persona/need C] → [Hotel #Z]
🏯 อยาก [persona/need D] → [Hotel #W]

ไม่ว่าจะเลือกที่ไหน — แนะนำเทียบราคา **Agoda · Booking · Trip.com** ก่อนจองทุกครั้ง บางช่วงโปรโมชั่นต่างกันมาก
```

ตัวอย่าง (Tokyo luxury):
> ### เลือกโรงแรมสุดหรูในโตเกียวยังไงให้ตรงกับตัวเอง?
>
> 🌃 อยากนอนเงียบที่สุด ห่างจากความวุ่นวาย → Aman Tokyo (Otemachi · เงียบหลัง 19:00)
> 🍷 อยากบรรยากาศ Italian luxury → Bulgari Hotel (Yaesu · ติด Tokyo Station)
> 🎍 อยากนอนใน Heritage 130 ปี → Imperial Hotel
> 🏯 อยาก spa ระดับโลก → Mandarin Oriental
> 🌸 อยากอยู่ในสวน 7 ไร่กลางเมือง → Hotel Chinzanso
>
> ไม่ว่าจะเลือกที่ไหน — แนะนำเทียบราคา **Agoda · Booking · Trip.com** ก่อนจองทุกครั้ง

**ห้าม:**
- ❌ "Doctor Chat แนะนำ" prominent (เปลี่ยนเป็น soft heading)
- ❌ "ผมไป Tokyo 4 คืน" first-person fabrication
- ❌ "ครั้งล่าสุดที่ผมพัก [hotel]" claim
- ❌ "ขอให้ทริปคุณมีความสุขครับ · ติดต่อมาที่..." sign-off ที่ formal เกินไป
- ❌ Closing block ที่ยาว 200+ words

EN articles ใช้ same editorial pattern · translated naturally (ดู `_internal/WRITING-STYLE.md` + Dr Chat EN voice ใน 10 articles ที่ inject แล้ว)

---

## F. Visual identity — Dr Chat brand

- **Avatar:** `/images/dr-chat-avatar.jpg` (need to create · 80x80 minimum · 200x200 ideal · friendly portrait · medical/travel hybrid imagery)
- **Color associations:** stethoscope blue + travel orange (matches Wherebest brand palette)
- **Voice tone:** warm · expert but accessible · evidence-driven · "หมอที่อยากให้คุณได้สิ่งดีๆ" not "หมอที่ตัดสินคน"

**TODO (asset creation):** สร้าง `/images/dr-chat-avatar.jpg` + variants (16x16 favicon · 40x40 inline · 80x80 bio · 200x200 og:image fallback) ถ้ายังไม่มี

---

## G. Editorial Policy Page (ต้องมี · linked from author bio)

`/editorial-policy` page ต้องมีและ link จาก author bio · เนื้อหา:

1. Who we are (Doctor Chat + team)
2. How we pick hotels (methodology · 8-step verification · 8.0+ cutoff)
3. How we make money (affiliate · NOT paid placement · NEVER paid review)
4. How we handle errors (correction policy · contact)
5. Last updated date

This page is the deepest EEAT signal Google looks for · ต้องมีและ maintain

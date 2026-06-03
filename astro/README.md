# ThailandAddict — Astro

เว็บ ThailandAddict เวอร์ชัน Astro (static site generator) — แทนการเขียน HTML ทีละไฟล์
เป้าหมาย: เพิ่มบทความใหม่ = กรอกไฟล์ข้อมูล ไม่ต้อง copy โครงสร้างทั้งหน้า

## โครงสร้าง

```
astro/
  src/
    styles/review.css        ดีไซน์ระบบ (Design B) ของหน้า review — แก้ที่เดียวมีผลทุกหน้า
    layouts/ReviewLayout.astro  เทมเพลตหน้ารีวิวโรงแรม (clone จาก review-airline-inn)
    content.config.ts        schema ของข้อมูลโรงแรม (ตรวจความถูกต้องอัตโนมัติ)
    content/reviews/*.json   ข้อมูลโรงแรม 1 ไฟล์ = 1 หน้า
    pages/[slug].astro       สร้างหน้า review ทุกหน้าจาก content/reviews อัตโนมัติ
  public/                    ไฟล์ static ที่ยังไม่ย้าย (รูป, robots.txt, หน้า .html เดิม)
  dist/                      ผลลัพธ์ build (ไม่ commit)
```

## คำสั่ง

```
cd astro
npm install      # ครั้งแรก
npm run dev      # เปิด dev server ดูผลทันที (http://localhost:4321)
npm run build    # สร้างไฟล์ static ไปที่ dist/
```

> ⚠️ node_modules มีไฟล์เยอะมาก — ถ้าโฟลเดอร์อยู่บน Google Drive การ sync จะช้า/มีปัญหา
> แนะนำ clone repo ไปไว้ในเครื่อง (ไม่ใช่ Google Drive) แล้วค่อย `npm install`

## เพิ่มหน้ารีวิวโรงแรมใหม่

1. สร้างไฟล์ `src/content/reviews/<ชื่อ>.json`
2. กรอกข้อมูลตาม schema (ดู `star-hostel-taipei.json` เป็นตัวอย่าง · field อธิบายใน `content.config.ts`)
3. `npm run build` — หน้าใหม่ถูกสร้างที่ `dist/<slug>.html` อัตโนมัติ

## Deploy

build แล้ว `dist/` คือเว็บ static พร้อมขึ้น Cloudflare — ชี้ `wrangler.jsonc`
(`assets.directory`) มาที่ `astro/dist` เมื่อย้ายเสร็จสมบูรณ์

# Baan Chao Khun Onsen — Investor Website

> Private Yield Asset · Medical Wellness · Udon Thani, Thailand

## โครงสร้างโปรเจค

```
bck-onsen-website/
├── index.html              ← หน้าเว็บหลัก (ลิงก์ CSS + JS แยกไฟล์)
├── README.md
├── .gitignore
│
├── css/
│   └── style.css           ← Custom styles (layered on Tailwind CDN)
│
├── js/
│   └── main.js             ← JavaScript ทั้งหมด (calc, animations, form)
│
├── images/
│   ├── logo.png            ← โลโก้ / รูป Founder (ใช้ใน avatar)
│   ├── hero-bg.jpg         ← รูป Hero section (ถ้าไม่มีจะใช้ Unsplash fallback)
│   ├── gallery-1.jpg       ← Onsen Suite Concept
│   ├── gallery-2.jpg       ← Wellness Pool
│   ├── gallery-3.jpg       ← Medical Spa
│   ├── gallery-4.jpg       ← Premium Suite
│   └── gallery-5.jpg       ← Exterior Render
│
└── assets/
    ├── pitch-deck.pdf      ← Pitch Deck (ปุ่ม Download ซ้าย)
    └── investment-memo.pdf ← Investment Memo (ปุ่ม Download ขวา)
```

## Dependencies (CDN — ไม่ต้อง install)

| Library | URL |
|---------|-----|
| Tailwind CSS | `https://cdn.tailwindcss.com` |
| AOS (Animate on Scroll) | cdnjs.cloudflare.com |
| Google Fonts | Cormorant Garamond + Sarabun + Noto Serif Thai |

## การ Deploy บน GitHub Pages

```bash
# 1. Push โฟลเดอร์ทั้งหมดขึ้น GitHub
git add .
git commit -m "feat: initial investor site"
git push origin main

# 2. ไปที่ Settings → Pages → Source: main / root
# 3. เว็บจะอยู่ที่ https://username.github.io/bck-onsen-website/
```

## Features

- **Bilingual** Thai / English toggle (localStorage persistent)
- **ROI Calculator** — slider-driven, real-time calculation (EBITDA 55%)
- **Animated Donut Chart** — Use of Funds 8M/2M/2M
- **Visa & Legal Benefits** — 6-card panel
- **Lead Capture Form** — ready to wire to Google Apps Script webhook
- **PDF Downloads** — Pitch Deck + Investment Memo
- **AOS animations** — scroll-triggered on all sections
- **Mobile-first** responsive layout

## การเชื่อม Google Apps Script (Form)

เปิดไฟล์ `js/main.js` ค้นหา comment:
```js
// fetch('YOUR_GAS_WEBHOOK_URL', { ... })
```
แล้วแทนที่ด้วย URL จริงจาก Google Apps Script deployment

## สี Design System

| Token | Hex |
|-------|-----|
| Navy Deep | `#0f172a` |
| Navy Mid | `#1e293b` |
| Gold Primary | `#f59e0b` |
| Gold Light | `#fbbf24` |
| Gold Pale | `#fcd34d` |
| Stone Light | `#f5f5f4` |
| Stone Mid | `#78716c` |

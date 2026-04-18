/* ================================================================
   Baan Chao Khun Onsen — main.js
   All interactive behaviours
   ================================================================ */

/* ── Language Toggle ──────────────────────────────────────────── */
function toggleLang() {
  const body = document.body;
  const isEN = body.classList.toggle('lang-en-active');
  document.getElementById('langFlag').textContent  = isEN ? '🇹🇭' : '🇬🇧';
  document.getElementById('langLabel').textContent = isEN ? 'TH'  : 'EN';
  localStorage.setItem('bckonsen_lang', isEN ? 'en' : 'th');
}

// Restore saved language preference
(function restoreLang() {
  if (localStorage.getItem('bckonsen_lang') === 'en') {
    document.body.classList.add('lang-en-active');
    document.getElementById('langFlag').textContent  = '🇹🇭';
    document.getElementById('langLabel').textContent = 'TH';
  }
})();

/* ── AOS (Animate on Scroll) Init ────────────────────────────── */
AOS.init({
  duration: 900,
  easing:   'ease-out-cubic',
  once:     true,
  offset:   60,
});

/* ── Sticky Navigation ───────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Gold Particle System ────────────────────────────────────── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left   = Math.random() * 100 + '%';
    p.style.bottom = '-10px';
    const dur = 8  + Math.random() * 14;
    const del = Math.random() * 12;
    p.style.animation = `float-up ${dur}s ${del}s linear infinite`;
    p.style.opacity = '0';
    container.appendChild(p);
  }
})();

/* ── Progress Bars (scroll-triggered) ───────────────────────── */
const fills      = document.querySelectorAll('.progress-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
fills.forEach(f => barObserver.observe(f));

/* ── Count-up Animation ──────────────────────────────────────── */
function animateCount(el, target, duration) {
  let start = 0;
  const step  = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}
const counters     = document.querySelectorAll('.count-up');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target, parseInt(e.target.dataset.target), 1200);
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));

/* ── Funds Donut Arc Animation (scroll-triggered) ────────────── */
const fundsArcs  = document.querySelectorAll('.funds-arc');
const arcObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el   = e.target;
      const dash = el.dataset.dash;
      el.setAttribute('stroke-dasharray', dash + ' 364');
      arcObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });
fundsArcs.forEach(a => {
  a.style.transition = 'stroke-dasharray 1.2s ease';
  arcObserver.observe(a);
});

/* ── ROI Calculator ──────────────────────────────────────────── */
let shareType = 'preferred';

/**
 * Switch between Preferred / Common share type buttons.
 * @param {'preferred'|'common'} type
 */
function setShareType(type) {
  shareType = type;
  const btnP = document.getElementById('btn-preferred');
  const btnC = document.getElementById('btn-common');
  const lbl  = document.getElementById('calc-type-label');

  const activeStyle   = 'border:1px solid #f59e0b;background:rgba(245,158,11,0.15);color:#f59e0b;font-family:Sarabun,sans-serif;padding:0.5rem 1rem;';
  const inactiveStyle = 'border:1px solid rgba(245,158,11,0.2);color:#78716c;font-family:Sarabun,sans-serif;padding:0.5rem 1rem;';

  if (type === 'preferred') {
    btnP.style.cssText = activeStyle;
    btnC.style.cssText = inactiveStyle;
    lbl.textContent = 'PREFERRED';
  } else {
    btnC.style.cssText = activeStyle;
    btnP.style.cssText = inactiveStyle;
    lbl.textContent = 'COMMON';
  }
  calcROI();
}

/**
 * Recalculate and render ROI outputs.
 * Revenue model: base 3.5M THB/yr at 70% occupancy, EBITDA margin 55%.
 * Preferred: 18.7% flat (capped by EBITDA share).
 * Common:    14% base, scaled by occupancy.
 */
function calcROI() {
  const invest = parseInt(document.getElementById('calc-invest').value);
  const occ    = parseInt(document.getElementById('calc-occ').value) / 100;

  /* ── Update displayed slider values ── */
  const investDisp = document.getElementById('calc-invest-val');
  if (invest >= 1000000) {
    investDisp.textContent = (invest / 1000000).toFixed(invest % 1000000 === 0 ? 0 : 1) + 'M';
  } else {
    investDisp.textContent = (invest / 1000).toFixed(0) + 'K';
  }
  document.getElementById('calc-occ-val').textContent = Math.round(occ * 100) + '%';

  /* ── Colour the range track fills ── */
  const investRange = document.getElementById('calc-invest');
  const occRange    = document.getElementById('calc-occ');
  const iPct = ((invest - 500000) / (12000000 - 500000) * 100).toFixed(1);
  const oPct = ((occ * 100 - 40) / (95 - 40) * 100).toFixed(1);
  investRange.style.background = `linear-gradient(90deg, #f59e0b ${iPct}%, rgba(245,158,11,0.15) ${iPct}%)`;
  occRange.style.background    = `linear-gradient(90deg, #f59e0b ${oPct}%, rgba(245,158,11,0.15) ${oPct}%)`;

  /* ── Financial model ── */
  const baseRevenue    = 3_500_000;           // THB at 70% occ
  const revenue        = baseRevenue * (occ / 0.70);
  const ebitda         = revenue * 0.55;

  const preferredRate  = 0.187;
  const commonBaseRate = 0.14;

  let annualProfit;
  if (shareType === 'preferred') {
    annualProfit = invest * preferredRate;
    const ebitdaCap = ebitda * (invest / 12_000_000) * 2.5;
    annualProfit = Math.min(annualProfit, ebitdaCap);
  } else {
    annualProfit = invest * commonBaseRate * (occ / 0.70);
  }

  const roi     = (annualProfit / invest) * 100;
  const payback = invest / annualProfit;
  const fiveYr  = annualProfit * 5;

  /* ── Render outputs ── */
  document.getElementById('out-roi').innerHTML     = roi.toFixed(1) + '<span style="font-size:1.875rem">%</span>';
  document.getElementById('out-profit').innerHTML  = formatTHB(annualProfit) + ' <span style="color:#f59e0b;font-size:1.5rem">฿</span>';
  document.getElementById('out-payback').innerHTML = payback.toFixed(1) + ' <span style="color:#f59e0b;font-size:1.5rem">ปี</span>';
  document.getElementById('out-5yr').innerHTML     = formatTHB(fiveYr) + ' <span style="font-size:1.5rem">฿</span>';

  // ROI progress bar
  document.getElementById('out-roi-bar').style.width = Math.min(roi * 4, 100) + '%';
}

/** Format number as abbreviated THB string */
function formatTHB(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return Math.round(n).toLocaleString('th-TH');
  return Math.round(n).toString();
}

// Initialise calculator after DOM ready
window.addEventListener('DOMContentLoaded', () => {
  calcROI();
});

/* ── Lead Capture Form ───────────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const name  = document.getElementById('fname').value.trim();
  const line  = document.getElementById('fline').value.trim();
  const phone = document.getElementById('fphone').value.trim();

  if (!name || !line || !phone) {
    const isEN = document.body.classList.contains('lang-en-active');
    alert(isEN
      ? 'Please fill in required fields: Name, Line ID, and Phone'
      : 'กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, Line ID, และเบอร์โทร'
    );
    return;
  }

  // Show success state
  document.getElementById('leadForm').classList.add('hidden');
  document.getElementById('formSuccess').classList.remove('hidden');

  /* ── Wire to Google Apps Script webhook when ready: ──
  fetch('YOUR_GAS_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      line,
      phone,
      budget:  document.getElementById('fbudget').value,
      message: document.getElementById('fmessage').value,
    }),
  });
  ─────────────────────────────────────────────────────── */
}

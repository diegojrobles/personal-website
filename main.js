/* ================================================================
   main.js  — Neobrutalism Dark Portfolio
   Requires: GSAP 3 + ScrollTrigger (loaded before this via CDN)
================================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   1. CANVAS BACKGROUND — Sine Wave Field (dark mode)
   Fixed dark canvas. Subtle lighter wave lines give depth
   without stealing focus from the heavy border design.
================================================================ */
const cvs = document.createElement('canvas');
cvs.id    = 'bg-cvs';
document.body.prepend(cvs);
const ctx = cvs.getContext('2d');

const BG = [15, 15, 15]; // dark background

const WAVES = [
  { yPct: 0.06, freq: 0.0045, amp: 22, spd: 0.00018, ph: 0.00 },
  { yPct: 0.17, freq: 0.0062, amp: 16, spd: 0.00025, ph: 1.40 },
  { yPct: 0.28, freq: 0.0038, amp: 28, spd: 0.00014, ph: 2.80 },
  { yPct: 0.40, freq: 0.0071, amp: 13, spd: 0.00030, ph: 0.65 },
  { yPct: 0.52, freq: 0.0053, amp: 20, spd: 0.00021, ph: 3.50 },
  { yPct: 0.64, freq: 0.0066, amp: 15, spd: 0.00023, ph: 1.95 },
  { yPct: 0.76, freq: 0.0042, amp: 25, spd: 0.00016, ph: 4.20 },
  { yPct: 0.90, freq: 0.0058, amp: 18, spd: 0.00027, ph: 2.10 },
];

let ampMult = 1;
let prevY   = 0;
let prevT   = 0;

function resizeCvs() {
  cvs.width  = window.innerWidth;
  cvs.height = window.innerHeight;
}
window.addEventListener('resize', resizeCvs, { passive: true });
resizeCvs();

window.addEventListener('scroll', () => {
  const delta = Math.abs(window.scrollY - prevY);
  ampMult = Math.min(ampMult + delta * 0.045, 4.5);
  prevY   = window.scrollY;
}, { passive: true });

function frame(t) {
  const dt = Math.min(t - prevT, 50);
  prevT = t;

  ampMult = 1 + (ampMult - 1) * 0.93;

  const W = cvs.width;
  const H = cvs.height;

  ctx.fillStyle = `rgb(${BG.join(',')})`;
  ctx.fillRect(0, 0, W, H);

  /* Very subtle lighter waves on dark — low opacity */
  ctx.strokeStyle = 'rgba(240, 238, 230, 0.045)';
  ctx.lineWidth   = 0.9;

  WAVES.forEach((w) => {
    const baseY = H * w.yPct;
    const amp   = w.amp * ampMult;

    ctx.beginPath();
    for (let x = 0; x <= W; x += 3) {
      const y = baseY + Math.sin(x * w.freq + t * w.spd + w.ph) * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

/* ================================================================
   2. CUSTOM CURSOR — yellow dot
================================================================ */
const cursor = document.getElementById('cursor');
let mx = -40, my = -40;

function moveCursor(x, y, size) {
  const h = (size || cursor.offsetWidth) / 2;
  cursor.style.transform = `translate3d(${x - h}px,${y - h}px,0)`;
}

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  moveCursor(mx, my);
});

document.querySelectorAll('a, button, .skill-tag').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width      = '22px';
    cursor.style.height     = '22px';
    cursor.style.background = 'transparent';
    cursor.style.border     = '2px solid var(--accent)';
    moveCursor(mx, my, 22);
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width      = '8px';
    cursor.style.height     = '8px';
    cursor.style.background = 'var(--accent)';
    cursor.style.border     = 'none';
    moveCursor(mx, my, 8);
  });
});

/* ================================================================
   3. NAVBAR — fades in after 80px
================================================================ */
const nav = document.getElementById('nav');

ScrollTrigger.create({
  start:       80,
  onEnter:     () => nav.classList.add('is-visible'),
  onLeaveBack: () => nav.classList.remove('is-visible'),
});

/* ================================================================
   4. HERO ENTRANCE
================================================================ */
gsap.timeline({ defaults: { ease: 'power4.out' } })
  .from('.hero-badge',  { y: 20, opacity: 0, duration: 0.7 })
  .from('.hero-name',   { y: '105%', duration: 1.1 }, '-=0.4')
  .from('.hero-role',   { y: '105%', duration: 1.1 }, '-=0.85')
  .from('.hero-sub',    { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.55');

/* ================================================================
   5. PROJECT CARDS — SCROLL ZOOM
================================================================ */
document.querySelectorAll('.proj-card').forEach((card) => {

  gsap.fromTo(card,
    { scale: 0.84, opacity: 0.4 },
    {
      scale:   1,
      opacity: 1,
      ease:    'none',
      scrollTrigger: {
        trigger: card,
        start:   'top 92%',
        end:     'center 52%',
        scrub:   0.6,
      },
    }
  );

  gsap.fromTo(card,
    { scale: 1, opacity: 1 },
    {
      scale:   0.84,
      opacity: 0.4,
      ease:    'none',
      scrollTrigger: {
        trigger: card,
        start:   'center 48%',
        end:     'bottom 8%',
        scrub:   0.6,
      },
    }
  );
});

/* ================================================================
   6. SCROLL REVEALS
================================================================ */
gsap.timeline({
  scrollTrigger: { trigger: '#about', start: 'top 68%' },
  defaults:      { ease: 'power2.out' },
})
  .from('#about .sec-label',   { y: 18, opacity: 0, duration: 0.5 })
  .from('#about .about-p',     { y: 28, opacity: 0, duration: 0.8 }, '-=0.3')
  .from('.skill-tag',          { y: 14, opacity: 0, duration: 0.4, stagger: 0.04 }, '-=0.4');

gsap.timeline({
  scrollTrigger: { trigger: '#experience', start: 'top 70%' },
  defaults:      { ease: 'power2.out' },
})
  .from('#experience .sec-label', { y: 18, opacity: 0, duration: 0.5 })
  .from('.tl-item',               { y: 36, opacity: 0, duration: 0.65, stagger: 0.14 }, '-=0.3');

gsap.timeline({
  scrollTrigger: { trigger: '#contact', start: 'top 75%' },
  defaults:      { ease: 'power2.out' },
})
  .from('#contact .sec-label', { y: 18, opacity: 0, duration: 0.5 })
  .from('.contact-email',      { y: 30, opacity: 0, duration: 0.75 }, '-=0.3')
  .from('.contact-links',      { y: 16, opacity: 0, duration: 0.5  }, '-=0.4');

/* Ticker — pause on hover */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  tickerTrack.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });
  tickerTrack.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
}

/* ================================================================
   main.js
   Depends on: GSAP 3 + ScrollTrigger (loaded via CDN before this)
================================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   A single 8px dot that tracks the mouse with no lag.
   Expands to a hollow ring when hovering interactive elements.
────────────────────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
let mx = -40, my = -40;   // start offscreen

function setCursorPos(x, y, size) {
  const half = (size || cursor.offsetWidth) / 2;
  cursor.style.transform = `translate3d(${x - half}px, ${y - half}px, 0)`;
}

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  setCursorPos(mx, my);
});

// Expand into hollow ring over links / buttons
document.querySelectorAll('a, button').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width          = '22px';
    cursor.style.height         = '22px';
    cursor.style.background     = 'transparent';
    cursor.style.border         = '2px solid var(--accent)';
    setCursorPos(mx, my, 22);
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width          = '8px';
    cursor.style.height         = '8px';
    cursor.style.background     = 'var(--accent)';
    cursor.style.border         = 'none';
    setCursorPos(mx, my, 8);
  });
});

/* ──────────────────────────────────────────────────────────────
   2. NAVBAR — invisible until 80px of scroll, then fades in
────────────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');

ScrollTrigger.create({
  start:       80,
  onEnter:     () => nav.classList.add('is-visible'),
  onLeaveBack: () => nav.classList.remove('is-visible'),
});

/* ──────────────────────────────────────────────────────────────
   3. HERO ENTRANCE
   Both lines slide up from beneath their .line-clip containers.
   The clip creates the "text emerges from below" effect.
────────────────────────────────────────────────────────────── */
gsap.timeline({ defaults: { ease: 'power4.out' } })
  .from('.hero-name', { y: '105%', duration: 1.1 })
  .from('.hero-role', { y: '105%', duration: 1.1 }, '-=0.85')
  .from('.hero-sub',  { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.55');

/* ──────────────────────────────────────────────────────────────
   4. PROJECTS — GSAP HORIZONTAL PIN SCROLL
   Pins the #projects section and scrolls the card strip
   horizontally as the user scrolls down the page.
   Only active on screens wider than 640px (on mobile cards stack).
────────────────────────────────────────────────────────────── */
function initHorizScroll() {
  const section = document.getElementById('projects');
  const track   = document.getElementById('projTrack');
  const fill    = document.getElementById('projFill');

  if (!track || window.innerWidth <= 640) return;

  // Distance = total track width minus one viewport width
  const scrollDist = () => track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x:    () => -scrollDist(),
    ease: 'none',
    scrollTrigger: {
      trigger:             section,
      start:               'top top',
      end:                 () => `+=${scrollDist()}`,
      pin:                 true,
      scrub:               0.9,
      anticipatePin:       1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Drive the thin progress line
        if (fill) fill.style.transform = `scaleX(${self.progress})`;
      },
    },
  });
}

initHorizScroll();

/* ──────────────────────────────────────────────────────────────
   5. SCROLL REVEALS
   Elements slide up + fade in as their section enters the viewport.
   Stagger creates the "one line at a time" feel.
────────────────────────────────────────────────────────────── */

/* About */
gsap.timeline({
  scrollTrigger: { trigger: '#about', start: 'top 68%' },
  defaults:      { ease: 'power2.out' },
})
  .from('#about .sec-label',         { y: 18, opacity: 0, duration: 0.5 })
  .from('#about .about-p',           { y: 28, opacity: 0, duration: 0.75 }, '-=0.3')
  .from('#about .about-col-skills .sec-label',
                                     { y: 18, opacity: 0, duration: 0.5 }, '-=0.55')
  .from('#about .skill-list li',     { y: 14, opacity: 0, duration: 0.4, stagger: 0.055 }, '-=0.3');

/* Experience */
gsap.timeline({
  scrollTrigger: { trigger: '#experience', start: 'top 70%' },
  defaults:      { ease: 'power2.out' },
})
  .from('#experience .sec-label', { y: 18, opacity: 0, duration: 0.5 })
  .from('.tl-item',               { y: 36, opacity: 0, duration: 0.65, stagger: 0.14 }, '-=0.3');

/* Contact */
gsap.timeline({
  scrollTrigger: { trigger: '#contact', start: 'top 75%' },
  defaults:      { ease: 'power2.out' },
})
  .from('#contact .sec-label',   { y: 18, opacity: 0, duration: 0.5 })
  .from('.contact-email',        { y: 30, opacity: 0, duration: 0.75 }, '-=0.3')
  .from('.contact-links',        { y: 16, opacity: 0, duration: 0.5  }, '-=0.4');

/* ──────────────────────────────────────────────────────────────
   6. PROJECT CARD HOVER — handled entirely in CSS (style.css)
   transition: none + :hover { background / color } = instant flip.
   No JS needed here.
────────────────────────────────────────────────────────────── */

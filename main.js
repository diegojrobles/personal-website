/* ================================================================
   main.js — Diego Robles Costa portfolio
   Vanilla JS only. No dependencies.
================================================================ */

/* ── 1. Scroll reveals ─────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => io.observe(el));

/* ── 2. Nav border on scroll ───────────────────────────────── */
const nav = document.getElementById('nav');

function onScroll() {
  nav.classList.toggle('is-scrolled', window.scrollY > 12);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── 3. Footer year ────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

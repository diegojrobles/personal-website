/* ================================================================
   main.js — Diego Robles Costa portfolio
   Vanilla JS only. No dependencies.
================================================================ */

/* ── 1. Scroll reveals ─────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ── 2. Sidebar: highlight the section in view ─────────────── */
const navLinks = Array.from(document.querySelectorAll('.sb-nav a[data-section]'));
const sections = navLinks
  .map((a) => document.getElementById(a.dataset.section))
  .filter(Boolean);

function setActive(id) {
  navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.section === id));
}

function onScroll() {
  const marker = window.innerHeight * 0.35;
  let current = sections[0] ? sections[0].id : null;
  for (const sec of sections) {
    if (sec.getBoundingClientRect().top <= marker) current = sec.id;
  }
  // At the very bottom, the last section is the one being read.
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    current = sections[sections.length - 1].id;
  }
  setActive(current);
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* ── 3. Mobile menu ────────────────────────────────────────── */
const sidebar = document.getElementById('sidebar');
const menuBtn = document.querySelector('.menu-btn');

function closeMenu() {
  sidebar.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  const open = sidebar.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

navLinks.forEach((a) => a.addEventListener('click', closeMenu));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ── 4. Footer year ────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

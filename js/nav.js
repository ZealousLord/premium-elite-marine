/* ================================================================
   nav.js — Sticky Nav, Hamburger Menu, Active Link, Page Transitions
   ================================================================ */
(function () {
  'use strict';

  /* ── Elements ─────────────────────────────────────────────────── */
  const nav         = document.getElementById('nav');
  const hamburger   = document.getElementById('nav-hamburger');
  const navLinks    = document.getElementById('nav-links');
  const navOverlay  = document.getElementById('nav-overlay');
  const allNavLinks = document.querySelectorAll('.nav__link');

  /* ── Sticky on Scroll ─────────────────────────────────────────── */
  function handleScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Hamburger Toggle ─────────────────────────────────────────── */
  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  /* Close on link click (mobile) */
  allNavLinks.forEach(link => link.addEventListener('click', () => {
    if (window.innerWidth <= 960) closeMenu();
  }));

  /* ── Active Link Highlight ────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (href === 'index.html' && (currentPage === '' || currentPage === '/'))
    ) {
      link.classList.add('active');
    }
  });

  /* ── Page Transition on Outbound Links ───────────────────────── */
  const transition = document.getElementById('page-transition');
  if (transition) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('https://wa.me')) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        transition.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 400);
      });
    });
    /* Fade out on enter */
    window.addEventListener('pageshow', () => {
      transition.classList.remove('active');
    });
  }

  /* ── Reveal on Scroll (IntersectionObserver) ──────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ── Animated Counters ────────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        clearInterval(timer);
        el.textContent = target + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length > 0) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterIO.observe(el));
  }

})();

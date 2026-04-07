/* ================================================================
   animations.js — GSAP ScrollTrigger + scroll-reveal fallback
   ================================================================ */
(function () {
  'use strict';

  /* ── GSAP with ScrollTrigger ──────────────────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* Fade-up elements */
    gsap.utils.toArray('[data-gsap="fade-up"]').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    /* Stagger children */
    gsap.utils.toArray('[data-gsap="stagger"]').forEach(parent => {
      gsap.fromTo(Array.from(parent.children),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: parent, start: 'top 82%', toggleActions: 'play none none none' }
        }
      );
    });

    /* Scale-in */
    gsap.utils.toArray('[data-gsap="scale"]').forEach(el => {
      gsap.fromTo(el,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    });

    /* Parallax bg layers */
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      gsap.to(el, {
        yPercent: -25 * speed, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Horizontal line reveal */
    gsap.utils.toArray('.gold-line').forEach(el => {
      gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left' }, {
        scaleX: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
      });
    });
  }

  /* ── Hero Entrance (no scroll trigger) ───────────────────────── */
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero__badge',    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8 }, .4)
      .fromTo('.hero__title',    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1  }, .5)
      .fromTo('.hero__subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .9 }, .65)
      .fromTo('.hero__actions',  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8 }, .75)
      .fromTo('.hero__stats',    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8 }, .85)
      .fromTo('.hero__scroll',   { opacity: 0 },        { opacity: 1, duration: 1        }, 1.1);
  }

  /* ── Animated number counters ─────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target || el.textContent, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(p * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counterEls.forEach(el => io.observe(el));
  }

})();

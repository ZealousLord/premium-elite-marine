/* gallery.js — Filter, Lightbox, Before/After Slider */
(function () {
  'use strict';

  /* ── Filter ───────────────────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.gf-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity .25s, transform .25s';
        if (show) {
          item.style.display = 'block';
          requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; });
        } else {
          item.style.opacity = '0'; item.style.transform = 'scale(.95)';
          setTimeout(() => { item.style.display = 'none'; }, 260);
        }
      });
    });
  });

  /* ── Lightbox ─────────────────────────────────────────────────── */
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbCap   = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev  = document.getElementById('lb-prev');
  const lbNext  = document.getElementById('lb-next');
  let   cur     = 0;
  let   visible = [];

  function buildVisible() {
    return Array.from(galleryItems).filter(el => el.style.display !== 'none' && el.querySelector('img'));
  }
  function showLb(i) {
    visible = buildVisible();
    cur = Math.max(0, Math.min(i, visible.length - 1));
    const el = visible[cur];
    if (!el || !lb) return;
    lbImg.src = el.querySelector('img').src;
    if (lbCap) lbCap.textContent = el.dataset.caption || '';
    lbPrev.style.visibility = cur > 0 ? 'visible' : 'hidden';
    lbNext.style.visibility = cur < visible.length - 1 ? 'visible' : 'hidden';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    if (item.querySelector('img')) {
      item.addEventListener('click', () => showLb(i));
      item.style.cursor = 'zoom-in';
    }
  });
  lbClose?.addEventListener('click', closeLb);
  lbPrev?.addEventListener('click', () => showLb(cur - 1));
  lbNext?.addEventListener('click', () => showLb(cur + 1));
  lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  showLb(cur - 1);
    if (e.key === 'ArrowRight') showLb(cur + 1);
    if (e.key === 'Escape')     closeLb();
  });

  /* ── Before / After Slider ────────────────────────────────────── */
  document.querySelectorAll('.before-after').forEach(slider => {
    const after  = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    function setPos(clientX) {
      const r   = slider.getBoundingClientRect();
      const pct = Math.min(95, Math.max(5, ((clientX - r.left) / r.width) * 100));
      if (after)  after.style.clipPath  = `inset(0 ${100 - pct}% 0 0)`;
      if (handle) handle.style.left = pct + '%';
    }

    slider.addEventListener('mousedown',  e => { dragging = true; setPos(e.clientX); });
    slider.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('mousemove',  e => { if (dragging) setPos(e.clientX); });
    document.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('mouseup',   () => { dragging = false; });
    document.addEventListener('touchend',  () => { dragging = false; });
    setPos(slider.getBoundingClientRect().left + slider.offsetWidth * .5);
  });

})();

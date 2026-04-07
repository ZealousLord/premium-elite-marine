/* ================================================================
   contact.js — WhatsApp Form Integration
   ================================================================ */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '971525790009'; // ← Replace with actual number

  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const phoneInput = document.getElementById('c-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9+\-\s()]/g, '');
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = (document.getElementById('c-name')?.value    || '').trim();
    const phone   = (document.getElementById('c-phone')?.value   || '').trim();
    const email   = (document.getElementById('c-email')?.value   || '').trim();
    const service = (document.getElementById('c-service')?.value || '');
    const message = (document.getElementById('c-message')?.value || '').trim();

    if (!name || !email || !service) {
      showNote('Please fill in all required fields.', 'error');
      return;
    }

    const text = [
      'Hello, I would like to enquire about:',
      '',
      `Name: ${name}`,
      phone   ? `Phone: ${phone}` : '',
      `Email: ${email}`,
      `Service: ${service}`,
      message ? `Message: ${message}` : '',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    showNote('Redirecting to WhatsApp…', 'success');
    setTimeout(() => form.reset(), 500);
  });

  function showNote(msg, type) {
    document.getElementById('form-note')?.remove();
    const el = document.createElement('div');
    el.id = 'form-note';
    el.role = 'alert';
    el.style.cssText = `margin-top:1rem;padding:.8rem 1.2rem;border-radius:8px;font-size:.87rem;font-weight:500;
      background:${type==='success'?'rgba(37,211,102,.12)':'rgba(220,50,50,.12)'};
      border:1px solid ${type==='success'?'rgba(37,211,102,.4)':'rgba(220,50,50,.4)'};
      color:${type==='success'?'#25D366':'#e05050'};`;
    el.textContent = msg;
    form.insertAdjacentElement('afterend', el);
    setTimeout(() => el.remove(), 4500);
  }
})();

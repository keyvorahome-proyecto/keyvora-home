// Keyvora Home — main.js

// Leads go to the site's own API, which validates them and forwards them to n8n.
const LEAD_ENDPOINTS = {
  buyer: '/api/investor',
  investor: '/api/investor',
  seller: '/api/seller'
};

const SOURCE_KEY = 'keyvora_lead_source';

// Remember where the visitor came from (UTM tags or referrer) for this browser session.
function captureLeadSource() {
  try {
    if (sessionStorage.getItem(SOURCE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const utm = ['utm_source', 'utm_medium', 'utm_campaign']
      .map((k) => params.get(k))
      .filter(Boolean)
      .join(' / ');
    let source = utm;
    if (!source && document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.hostname !== window.location.hostname) source = 'referrer: ' + ref.hostname;
    }
    sessionStorage.setItem(SOURCE_KEY, source || 'direct');
  } catch (e) { /* storage unavailable */ }
}

function getLeadSource() {
  try { return sessionStorage.getItem(SOURCE_KEY) || ''; } catch (e) { return ''; }
}

function newSubmissionId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
}

const FORM_MESSAGES = {
  en: {
    sending: 'Sending…',
    success: "Thank you — we've received your information and will be in touch.",
    error: 'Something went wrong. Please try again or email us directly.'
  },
  es: {
    sending: 'Enviando…',
    success: '¡Gracias! Recibimos tus datos y nos vamos a contactar con vos.',
    error: 'Algo salió mal. Probá de nuevo o escribinos por email.'
  }
};

function getFormMessages() {
  const lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  return FORM_MESSAGES[lang] || FORM_MESSAGES.en;
}

document.addEventListener('DOMContentLoaded', () => {
  captureLeadSource();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    const setNavOpen = (isOpen) => {
      nav.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const label = isOpen ? navToggle.dataset.labelClose : navToggle.dataset.labelOpen;
      if (label) navToggle.setAttribute('aria-label', label);
    };
    navToggle.addEventListener('click', () => {
      setNavOpen(!nav.classList.contains('open'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setNavOpen(false);
        navToggle.focus();
      }
    });
  }

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((other) => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Lead form submission
  const forms = document.querySelectorAll('form[data-lead-form]');
  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = form.getAttribute('data-lead-form');
      const url = LEAD_ENDPOINTS[type];
      const statusEl = form.querySelector('.form-status');
      const submitBtn = form.querySelector('button[type="submit"]');
      const messages = getFormMessages();

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });

      // Honeypot filled: likely a bot. Show success without sending.
      if (String(data.website_url || '').trim() !== '') {
        if (statusEl) {
          statusEl.textContent = messages.success;
          statusEl.className = 'form-status success';
        }
        form.reset();
        return;
      }

      // One ID per submission attempt; a retry of the same attempt reuses it,
      // so n8n can drop duplicates.
      if (!form.dataset.submissionId) form.dataset.submissionId = newSubmissionId();

      const payload = {};
      Object.keys(data).forEach((key) => {
        const value = typeof data[key] === 'string' ? data[key].trim() : data[key];
        if (value !== '' && key !== 'website_url') payload[key] = value;
      });
      payload.submissionId = form.dataset.submissionId;
      payload.language = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase() === 'es' ? 'es' : 'en';
      payload.leadSource = getLeadSource();

      if (submitBtn) submitBtn.disabled = true;
      if (statusEl) {
        statusEl.textContent = messages.sending;
        statusEl.className = 'form-status';
      }

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Request failed');

        if (statusEl) {
          statusEl.textContent = messages.success;
          statusEl.className = 'form-status success';
        }
        form.reset();
        delete form.dataset.submissionId;
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = messages.error;
          statusEl.className = 'form-status error';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
});

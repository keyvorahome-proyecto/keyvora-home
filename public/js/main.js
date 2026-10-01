// Keyvora Home — main.js

const WEBHOOK_URLS = {
  buyer: 'https://n8n.keyvorahome.online/webhook/keyvora-buyer-lead',
  seller: 'https://n8n.keyvorahome.online/webhook/keyvora-seller-lead'
};

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
      const url = WEBHOOK_URLS[type];
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

      const payload = {
        source: type,
        submittedAt: new Date().toISOString(),
        ...data
      };

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

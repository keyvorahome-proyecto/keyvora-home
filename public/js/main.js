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

  // Home "Start with your property": pass the address to the seller form
  // through sessionStorage (not the URL, so it never shows up in analytics).
  const PREFILL_KEY = 'keyvora_prefill_address';
  document.querySelectorAll('form[data-quick-entry]').forEach((quick) => {
    quick.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = quick.querySelector('input');
      const value = input ? input.value.trim() : '';
      try { if (value) sessionStorage.setItem(PREFILL_KEY, value); } catch (err) { /* storage unavailable */ }
      window.location.href = quick.getAttribute('action') + '#offer';
    });
  });
  // Situation cards on the Home: remember the choice to preselect it in the seller form.
  const SITUATION_KEY = 'keyvora_prefill_situation';
  const TIMELINE_KEY = 'keyvora_prefill_timeline';
  document.querySelectorAll('a.situation-card').forEach((card) => {
    card.addEventListener('click', () => {
      try {
        const situation = card.getAttribute('data-situation');
        const timeline = card.getAttribute('data-timeline');
        if (situation) sessionStorage.setItem(SITUATION_KEY, situation);
        if (timeline) sessionStorage.setItem(TIMELINE_KEY, timeline);
      } catch (err) { /* storage unavailable */ }
    });
  });

  // Scroll reveal (enabled from <head> only when motion is allowed).
  if (document.documentElement.classList.contains('js-reveal')) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      observer.observe(el);
    });
  }

  document.querySelectorAll('form[data-multistep]').forEach((form) => initSellerForm(form, { PREFILL_KEY, SITUATION_KEY, TIMELINE_KEY }));

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
  const forms = document.querySelectorAll('form[data-lead-form]:not([data-multistep])');
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
      payload.landingPage = window.location.pathname;

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

// ------------------------------------------------------------------
// Seller multi-step form (spec 28–40)
// Form states: idle, active, submitting, success, error.
// Step states: unvisited, active, completed, error.
// ------------------------------------------------------------------
function initSellerForm(form, keys) {
  const steps = Array.from(form.querySelectorAll('.msf-step'));
  const dots = Array.from(form.querySelectorAll('.msf-dots li'));
  const total = steps.length;
  const countEl = form.querySelector('.msf-count');
  const barEl = form.querySelector('.msf-bar span');
  const backBtn = form.querySelector('[data-msf-back]');
  const nextBtn = form.querySelector('[data-msf-next]');
  const submitBtn = form.querySelector('[data-msf-submit]');
  const generalError = form.querySelector('.msf-general-error');
  const retryBtn = generalError ? generalError.querySelector('button') : null;
  const errors = JSON.parse(form.dataset.errors || '{}');
  const progressTpl = form.dataset.progress || 'Step {n} of {total}';
  const submitLabel = submitBtn ? submitBtn.textContent : '';
  let current = 1;

  form.classList.add('is-enhanced');

  const stepEl = (n) => steps[n - 1];
  const setStepState = (n, state) => {
    stepEl(n).dataset.stepState = state;
    if (dots[n - 1]) dots[n - 1].dataset.stepState = state;
  };

  function show(n, opts) {
    current = n;
    steps.forEach((el, i) => {
      const idx = i + 1;
      el.hidden = idx !== n;
      if (idx === n) setStepState(idx, el.dataset.stepState === 'error' ? 'error' : 'active');
      else if (el.dataset.stepState === 'active') setStepState(idx, 'unvisited');
    });
    if (countEl) countEl.textContent = progressTpl.replace('{n}', n).replace('{total}', total);
    if (barEl) barEl.style.width = (n / total) * 100 + '%';
    if (backBtn) backBtn.hidden = n === 1;
    if (nextBtn) nextBtn.hidden = n === total;
    if (submitBtn) submitBtn.hidden = n !== total;
    if (form.dataset.state === 'idle' && !(opts && opts.initial)) form.dataset.state = 'active';
    if (opts && opts.focus) {
      const top = form.getBoundingClientRect().top;
      if (top < 0) form.scrollIntoView({ block: 'start', behavior: 'smooth' });
      const first = stepEl(n).querySelector('input:checked, input');
      if (first) first.focus({ preventScroll: true });
    }
  }

  function setFieldError(id, message) {
    const input = form.querySelector('#' + id);
    const out = form.querySelector('#' + id + '-error');
    if (out) out.textContent = message || '';
    if (input && input.type !== 'radio' && input.type !== 'checkbox') {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }

  function validate(n) {
    const el = stepEl(n);
    let ok = true;
    if (n === 1) {
      const value = form.address.value.trim();
      ok = value.length >= 3;
      setFieldError('address', ok ? '' : errors.address);
    } else if (el.dataset.choice) {
      const name = el.querySelector('input').name;
      ok = Boolean(el.querySelector('input:checked'));
      setFieldError(name, ok ? '' : (el.dataset.choice === 'checkbox' ? errors.situation : errors.choice));
    } else {
      const first = form.firstName.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email.value.trim();
      const digits = phone.replace(/\D/g, '').length;
      const phoneBad = phone !== '' && (digits < 10 || digits > 15);
      const emailBad = email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      const missing = phone === '' && email === '';
      setFieldError('firstName', first ? '' : errors.firstName);
      setFieldError('phone', phoneBad ? errors.phone : (missing ? errors.contact : ''));
      setFieldError('email', emailBad ? errors.email : '');
      ok = Boolean(first) && !phoneBad && !emailBad && !missing;
    }
    setStepState(n, ok ? (n === current ? 'active' : 'completed') : 'error');
    if (!ok) {
      const bad = el.querySelector('[aria-invalid="true"]') || el.querySelector('input:not([type=hidden])');
      if (bad && n === current) bad.focus();
    }
    return ok;
  }

  function goNext() {
    if (!validate(current)) return;
    setStepState(current, 'completed');
    if (current < total) show(current + 1, { focus: true });
  }

  if (nextBtn) nextBtn.addEventListener('click', goNext);
  if (backBtn) backBtn.addEventListener('click', () => {
    if (current > 1) {
      if (stepEl(current).dataset.stepState !== 'error') setStepState(current, 'unvisited');
      show(current - 1, { focus: true });
    }
  });

  // Clear a step's error as soon as the visitor fixes it.
  form.addEventListener('input', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement) || target.name === 'website_url') return;
    const step = target.closest('.msf-step');
    if (!step || step.dataset.stepState !== 'error') return;
    const n = steps.indexOf(step) + 1;
    if (step.dataset.choice) {
      setFieldError(target.name, '');
      setStepState(n, n === current ? 'active' : 'completed');
    } else if (target.id) {
      setFieldError(target.id, '');
      if (target.id === 'phone' || target.id === 'email') { setFieldError('phone', ''); setFieldError('email', ''); }
    }
  });

  // Single-choice steps advance on click (keyboard users press Continue).
  form.querySelectorAll('.msf-step[data-choice="radio"] .choice').forEach((label) => {
    label.addEventListener('pointerup', () => {
      const n = steps.indexOf(label.closest('.msf-step')) + 1;
      setTimeout(() => { if (current === n && stepEl(n).querySelector('input:checked')) goNext(); }, 280);
    });
  });

  // Enter in a text field moves forward instead of submitting early.
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && current < total && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      goNext();
    }
  });

  // Prefill from the Home page (address box and situation cards).
  let prefilledAddress = false;
  try {
    const saved = sessionStorage.getItem(keys.PREFILL_KEY);
    if (saved && !form.address.value) { form.address.value = saved; prefilledAddress = true; }
    sessionStorage.removeItem(keys.PREFILL_KEY);
    const situation = sessionStorage.getItem(keys.SITUATION_KEY);
    if (situation) {
      form.querySelectorAll('input[name="situation"]').forEach((i) => { if (i.value === situation) i.checked = true; });
      sessionStorage.removeItem(keys.SITUATION_KEY);
    }
    const timeline = sessionStorage.getItem(keys.TIMELINE_KEY);
    if (timeline) {
      form.querySelectorAll('input[name="timeline"]').forEach((i) => { if (i.value === timeline) i.checked = true; });
      sessionStorage.removeItem(keys.TIMELINE_KEY);
    }
  } catch (err) { /* storage unavailable */ }

  // Coming back with the browser's Back button from the thank-you page.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && form.dataset.state !== 'idle') {
      form.dataset.state = 'active';
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
      if (retryBtn) retryBtn.disabled = false;
      if (backBtn) backBtn.disabled = false;
    }
  });

  show(1, { initial: true });
  if (prefilledAddress && validate(1)) {
    setStepState(1, 'completed');
    show(2);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.dataset.state === 'submitting') return;
    if (current < total) { goNext(); return; }

    // Validate every step; jump to the first one with a problem.
    for (let n = 1; n <= total; n++) {
      if (!validate(n)) {
        if (n !== current) { show(n, { focus: true }); validate(n); }
        return;
      }
      if (n !== current) setStepState(n, 'completed');
    }

    const thanksUrl = form.dataset.thanks || '/';
    if (String(form.website_url.value || '').trim() !== '') {
      window.location.href = thanksUrl;
      return;
    }

    if (!form.dataset.submissionId) form.dataset.submissionId = newSubmissionId();
    const value = (name) => (form[name] && form[name].value ? form[name].value.trim() : '');
    const checked = (name) => {
      const el = form.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : undefined;
    };
    const payload = {
      address: value('address'),
      propertyType: checked('propertyType'),
      condition: checked('condition'),
      situation: Array.from(form.querySelectorAll('input[name="situation"]:checked')).map((i) => i.value),
      timeline: checked('timeline'),
      firstName: value('firstName'),
      submissionId: form.dataset.submissionId,
      language: (document.documentElement.lang || 'en').slice(0, 2).toLowerCase() === 'es' ? 'es' : 'en',
      leadSource: getLeadSource(),
      landingPage: window.location.pathname
    };
    ['lastName', 'phone', 'email'].forEach((k) => { if (value(k)) payload[k] = value(k); });

    form.dataset.state = 'submitting';
    if (generalError) generalError.hidden = true;
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = form.dataset.submitting || submitLabel; }
    if (retryBtn) retryBtn.disabled = true;
    if (backBtn) backBtn.disabled = true;

    try {
      const res = await fetch(LEAD_ENDPOINTS.seller, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Request failed: ' + res.status);
      form.dataset.state = 'success';
      delete form.dataset.submissionId;
      window.location.href = thanksUrl;
    } catch (err) {
      // Keep everything the visitor typed so they can simply try again.
      form.dataset.state = 'error';
      if (generalError) { generalError.hidden = false; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
      if (retryBtn) { retryBtn.disabled = false; retryBtn.focus(); }
      if (backBtn) backBtn.disabled = false;
    }
  });
}

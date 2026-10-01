// Score Investor Lead — runs once per item. Input: webhook item ({ body }).
const b = $json.body || {};
const s = (v) => (typeof v === 'string' ? v.trim().slice(0, 500) : '');
const arr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim()) : []);
const num = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.round(v) : null);
const esc = (v) => String(v || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const fullName = s(b.fullName) || [s(b.firstName), s(b.lastName)].filter(Boolean).join(' ');
const email = s(b.email);
const phone = s(b.phone);
const legacyType = s(b.investorType);
let funding = s(b.funding);
if (!funding && legacyType === 'cash_buyer') funding = 'Cash';
let strategies = arr(b.strategies);
const legacyStrategy = { fix_and_flip: 'Fix & Flip', buy_and_hold: 'Buy & Hold' }[s(b.strategy)] || '';
if (!strategies.length && legacyStrategy) strategies = [legacyStrategy];
const propertyTypes = arr(b.propertyTypes);
const conditionAccepted = arr(b.conditionAccepted);
const zips = arr(b.zips).filter((z) => /^\d{5}$/.test(z));
const minPrice = num(b.minPrice);
const maxPrice = num(b.maxPrice);
const inArea = zips.some((zip) => { const z = parseInt(zip, 10); return (z >= 44101 && z <= 44199) || [44017, 44022, 44040, 44070].includes(z); });

// Scoring weights — adjust here.
const W = {
  profileComplete: 40,
  phone: 20,
  funding: { 'Cash': 20, 'Hard money / private lender': 10, 'Conventional / DSCR loan': 5, 'Other': 0 },
  inArea: 10,
  hasStrategy: 10
};
const HOT = 70;
const WARM = 40;

const profileComplete = propertyTypes.length > 0 && strategies.length > 0 && minPrice !== null && zips.length > 0 && Boolean(funding);
const qualified = propertyTypes.length > 0 || zips.length > 0 || minPrice !== null;
let score = (profileComplete ? W.profileComplete : 0) + (phone ? W.phone : 0) + (W.funding[funding] || 0)
  + (inArea ? W.inArea : 0) + (strategies.length ? W.hasStrategy : 0);
score = Math.min(100, score);
const temperature = qualified ? (score >= HOT ? 'Hot' : score >= WARM ? 'Warm' : 'Cold') : '';
const notifyTelegram = !qualified || temperature !== 'Cold';

const money = (v) => (v === null ? '' : '$' + v.toLocaleString('en-US'));
const range = minPrice !== null || maxPrice !== null ? `${money(minPrice) || '$0'} – ${maxPrice === null ? 'sin máximo' : money(maxPrice)}` : s(b.budgetRange);
const badge = qualified ? `${temperature === 'Hot' ? '🔥' : temperature === 'Warm' ? '🌤️' : '❄️'} ${temperature} (${score})` : '⚪ Sin calificar (formulario anterior)';
const rows = [
  ['Nombre', fullName], ['Email', email], ['Teléfono', phone], ['Tipos', propertyTypes.join(', ')],
  ['Estrategias', strategies.join(', ')], ['Rango', range], ['ZIPs', zips.join(', ')],
  ['Estado aceptado', conditionAccepted.join(', ')], ['Financiación', funding || legacyType],
  ['Perfil completo', profileComplete ? 'Sí' : ''], ['Idioma', s(b.language).toUpperCase()]
].filter(([, v]) => v);

return {
  json: {
    submissionId: s(b.submissionId).replace(/[^A-Za-z0-9-]/g, '').slice(0, 64),
    submittedAt: s(b.submittedAt) || new Date().toISOString(),
    language: s(b.language) === 'es' ? 'ES' : 'EN',
    leadSource: s(b.leadSource),
    fullName, email, phone, legacyType, legacyStrategy, budgetRange: s(b.budgetRange),
    propertyTypes, strategies, minPrice, maxPrice, zips, conditionAccepted, funding,
    profileComplete, qualified, score: qualified ? score : null, temperature, notifyTelegram,
    notify: {
      subject: `Nuevo lead investor ${qualified ? temperature.toUpperCase() : ''}: ${fullName || email}`.replace(/\s+/g, ' '),
      telegram: `💼 <b>Nuevo lead INVESTOR</b> — ${badge}\n\n` + rows.map(([k, v]) => `<b>${k}:</b> ${esc(v)}`).join('\n') + '\n\nGuardado en Airtable → Investors',
      html: `<h2>Nuevo lead investor — ${esc(badge)}</h2><p>` + rows.map(([k, v]) => `<b>${k}:</b> ${esc(v)}`).join('<br>') + '</p><p><a href="https://airtable.com/appBu7ZYswZGwSazH/tblfEE4hppEu32yqm">Abrir Investors en Airtable</a></p>'
    }
  }
};

// Score Seller Lead — runs once per item. Input: webhook item ({ body }).
const b = $json.body || {};
const s = (v) => (typeof v === 'string' ? v.trim().slice(0, 500) : '');
const arr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim()) : []);
const esc = (v) => String(v || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const address = s(b.address);
let zip = s(b.zip);
if (!zip) {
  const all = address.match(/\b\d{5}\b/g);
  if (all) zip = all[all.length - 1];
}
let phone = s(b.phone);
let email = s(b.email);
const contactRaw = s(b.contact);
if (contactRaw && !phone && !email) {
  if (contactRaw.includes('@')) email = contactRaw; else phone = contactRaw;
}
const situation = arr(b.situation);
const timeline = s(b.timeline);
const condition = s(b.condition);
const propertyType = s(b.propertyType);

// Cuyahoga County ZIPs (approximate): 44101-44199 plus suburbs outside that range.
const z = parseInt(zip, 10);
const inServiceArea = /^\d{5}$/.test(zip) && ((z >= 44101 && z <= 44199) || [44017, 44022, 44040, 44070].includes(z));

// Scoring weights (spec 79) — adjust here.
const W = {
  timeline: { 'As soon as possible': 20, 'Within 30 days': 15 },
  situation: { 'Vacant property': 15, 'Inherited property': 10 },
  condition: { 'Needs significant repairs': 10, 'Major renovation': 10 },
  phone: 10,
  askingPrice: 5 // field filled manually after the call; not scored at intake
};
// Temperature thresholds (spec 80) — adjust here.
const HOT = 50;
const WARM = 25;

const qualified = Boolean(timeline || condition || situation.length);
let score = (W.timeline[timeline] || 0)
  + situation.reduce((sum, x) => sum + (W.situation[x] || 0), 0)
  + (W.condition[condition] || 0)
  + (phone ? W.phone : 0);
score = Math.min(100, score);
const temperature = qualified ? (score >= HOT ? 'Hot' : score >= WARM ? 'Warm' : 'Nurture') : '';
const notifyTelegram = !qualified || temperature !== 'Nurture';

const name = [s(b.firstName), s(b.lastName)].filter(Boolean).join(' ');
const badge = qualified ? `${temperature === 'Hot' ? '🔥' : temperature === 'Warm' ? '🌤️' : '🌱'} ${temperature} (${score})` : '⚪ Sin calificar (formulario anterior)';
const areaText = zip ? (inServiceArea ? `${zip} (Cuyahoga)` : `${zip} (fuera de zona)`) : '-';
const rows = [
  ['Nombre', name], ['Dirección', address], ['ZIP', areaText], ['Teléfono', phone], ['Email', email],
  ['Tipo', propertyType], ['Estado', condition], ['Situación', situation.join(', ')], ['Plazo', timeline],
  ['Comentario', s(b.reason)], ['Idioma', s(b.language).toUpperCase()]
].filter(([, v]) => v);

return {
  json: {
    submissionId: s(b.submissionId).replace(/[^A-Za-z0-9-]/g, '').slice(0, 64),
    submittedAt: s(b.submittedAt) || new Date().toISOString(),
    language: s(b.language) === 'es' ? 'ES' : 'EN',
    leadSource: s(b.leadSource),
    landingPage: s(b.landingPage),
    firstName: s(b.firstName), lastName: s(b.lastName), phone, email, address, zip,
    propertyType, condition, situation, timeline, reason: s(b.reason), contactRaw,
    inServiceArea, qualified, score: qualified ? score : null, temperature, notifyTelegram,
    notify: {
      subject: `Nuevo lead seller ${qualified ? temperature.toUpperCase() : ''}: ${address || name || 'sin dirección'}`.replace(/\s+/g, ' '),
      telegram: `🏠 <b>Nuevo lead SELLER</b> — ${badge}\n\n` + rows.map(([k, v]) => `<b>${k}:</b> ${esc(v)}`).join('\n') + '\n\nGuardado en Airtable → Sellers',
      html: `<h2>Nuevo lead seller — ${esc(badge)}</h2><p>` + rows.map(([k, v]) => `<b>${k}:</b> ${esc(v)}`).join('<br>') + '</p><p><a href="https://airtable.com/appBu7ZYswZGwSazH/tblxfyuD7xcn41HN3">Abrir Sellers en Airtable</a></p>'
    }
  }
};

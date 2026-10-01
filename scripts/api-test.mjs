// API tests for /api/seller and /api/investor against a running server.
// Expects the server to forward to the mock n8n started by this script on MOCK_PORT.
// Usage: node scripts/api-test.mjs http://127.0.0.1:4321
import http from 'node:http';

const BASE = process.argv[2] || 'http://127.0.0.1:4321';
const MOCK_PORT = Number(process.env.MOCK_PORT || 4999);
const SECRET = process.env.N8N_WEBHOOK_SECRET || 'test-secret';

const received = [];
const mock = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    received.push({ url: req.url, secret: req.headers['x-keyvora-secret'], body: JSON.parse(body || '{}') });
    res.writeHead(req.headers['x-keyvora-secret'] === SECRET ? 200 : 401, { 'Content-Type': 'application/json' });
    res.end('{"ok":true}');
  });
});
await new Promise((r) => mock.listen(MOCK_PORT, '127.0.0.1', r));

let failures = 0;
let ipCounter = 1;
const check = (name, cond, detail = '') => {
  if (cond) console.log(`ok   ${name}`);
  else { failures++; console.log(`::error::FAIL ${name} ${detail}`); }
};
const post = async (path, body, headers = {}) => {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': `10.0.0.${ipCounter++}`, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
  let json = {};
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
};

// Method and payload errors
const get = await fetch(BASE + '/api/seller');
check('GET /api/seller -> 405', get.status === 405, `got ${get.status}`);
let r = await post('/api/seller', '{not json');
check('invalid JSON -> 400', r.status === 400, `got ${r.status}`);
r = await post('/api/seller', { contact: 'a@b.com' });
check('seller without address -> 400 with field error', r.status === 400 && r.json.fields?.address, JSON.stringify(r.json));
r = await post('/api/seller', { address: '123 Main St' });
check('seller without contact -> 400', r.status === 400 && r.json.fields?.contact, JSON.stringify(r.json));
r = await post('/api/seller', { address: '123 Main St', contact: 'a@b.com', timeline: 'Tomorrow' });
check('seller with unknown timeline -> 400', r.status === 400 && r.json.fields?.timeline, JSON.stringify(r.json));
r = await post('/api/investor', { fullName: 'Bo', email: 'not-an-email' });
check('investor with bad email -> 400', r.status === 400 && r.json.fields?.email, JSON.stringify(r.json));
r = await post('/api/investor', { fullName: 'Bo', email: 'b@c.com', minPrice: 300000, maxPrice: 100000 });
check('investor with min > max -> 400', r.status === 400 && r.json.fields?.maxPrice, JSON.stringify(r.json));

// Origin
r = await post('/api/seller', { address: '123 Main St', contact: 'a@b.com' }, { Origin: 'https://evil.example' });
check('foreign origin -> 403', r.status === 403, `got ${r.status}`);

// Honeypot: success response, nothing forwarded
const before = received.length;
r = await post('/api/seller', { address: '123 Main St', contact: 'a@b.com', website_url: 'http://spam' });
check('honeypot -> 200', r.status === 200 && r.json.ok === true, JSON.stringify(r.json));
check('honeypot -> not forwarded', received.length === before, `forwarded ${received.length - before}`);

// Valid legacy seller (current form)
r = await post('/api/seller', { address: '123 Main St, Cleveland, OH 44102', contact: 'a@b.com', reason: 'Moving', submissionId: 'abcdef12-3456', language: 'es', leadSource: 'direct' }, { Origin: 'https://keyvorahome.online' });
check('valid legacy seller -> 200', r.status === 200 && r.json.ok === true, JSON.stringify(r.json));
let last = received[received.length - 1];
check('seller forwarded to seller webhook with secret', last && last.url.endsWith('/seller') && last.secret === SECRET, JSON.stringify(last));
check('seller payload has server timestamp and submission ID', last && last.body.submittedAt && last.body.submissionId === 'abcdef12-3456' && !('website_url' in last.body), JSON.stringify(last?.body));

// Valid new-format seller
r = await post('/api/seller', { address: '1 Elm St', zip: '44105', firstName: 'Ann', phone: '(216) 555-1234', propertyType: 'Single-family', condition: 'Needs major repairs', situation: ['Inherited property'], timeline: 'Within 30 days' });
check('valid structured seller -> 200', r.status === 200, JSON.stringify(r.json));
check('generated submission ID when missing', received[received.length - 1]?.body.submissionId?.length >= 8);

// Valid investors
r = await post('/api/investor', { fullName: 'Old Form', email: 'o@c.com', investorType: 'cash_buyer', strategy: 'fix_and_flip', budgetRange: '100k-200k' });
check('valid legacy investor -> 200', r.status === 200, JSON.stringify(r.json));
check('investor forwarded to investor webhook', received[received.length - 1]?.url.endsWith('/investor'));
r = await post('/api/investor', { firstName: 'New', email: 'n@c.com', phone: '2165550000', propertyTypes: ['Single-family'], strategies: ['BRRRR'], minPrice: 50000, maxPrice: null, zips: ['44105'], funding: 'Cash' });
check('valid structured investor -> 200', r.status === 200, JSON.stringify(r.json));

// Rate limit: same IP, 6th request is blocked
const ip = '10.9.9.9';
const statuses = [];
for (let i = 0; i < 6; i++) {
  statuses.push((await post('/api/seller', { address: '123 Main St', contact: 'a@b.com' }, { 'X-Forwarded-For': ip })).status);
}
check('rate limit after 5 requests', statuses.slice(0, 5).every((s) => s === 200) && statuses[5] === 429, statuses.join(','));

mock.close();
console.log(failures ? `${failures} failure(s)` : 'all API tests passed');
process.exit(failures ? 1 : 0);

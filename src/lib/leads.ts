import { z } from 'astro/zod';

/* ------------------------------------------------------------------ */
/* Allowed values — must match the Airtable select options exactly.    */
/* ------------------------------------------------------------------ */

export const PROPERTY_TYPES = [
  'Single-family',
  'Multi-family (2-4 units)',
  'Condo / Townhouse',
  'Mobile home',
  'Vacant land',
  'Other'
] as const;

export const CONDITIONS = [
  'Move-in ready',
  'Needs minor repairs',
  'Needs major repairs',
  'Needs full rehab'
] as const;

export const SITUATIONS = [
  'Inherited property',
  'Vacant property',
  'Behind on payments / foreclosure',
  'Tired landlord / tenant issues',
  'Divorce / separation',
  'Relocating',
  'Too many repairs',
  'Downsizing',
  'Other'
] as const;

export const TIMELINES = [
  'As soon as possible',
  'Within 30 days',
  '1-3 months',
  '3-6 months',
  'Just exploring'
] as const;

export const STRATEGIES = [
  'Fix & Flip',
  'Buy & Hold',
  'BRRRR',
  'Wholetail',
  'Wholesale / JV',
  'Creative / owner finance'
] as const;

export const FUNDING = [
  'Cash',
  'Hard money / private lender',
  'Conventional / DSCR loan',
  'Other'
] as const;

/* ------------------------------------------------------------------ */
/* Schemas                                                             */
/* ------------------------------------------------------------------ */

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => text(max).optional().default('');
const phone = z
  .string()
  .trim()
  .max(40)
  .refine((v) => v === '' || (v.replace(/\D/g, '').length >= 10 && v.replace(/\D/g, '').length <= 15), {
    message: 'invalid_phone'
  })
  .optional()
  .default('');
const email = z
  .string()
  .trim()
  .max(254)
  .refine((v) => v === '' || z.string().email().safeParse(v).success, { message: 'invalid_email' })
  .optional()
  .default('');

const common = {
  submissionId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{8,64}$/)
    .optional(),
  language: z.enum(['en', 'es']).optional().default('en'),
  leadSource: optionalText(300),
  // Honeypot: must stay empty. Checked before validation.
  website_url: z.string().optional()
};

export const sellerSchema = z
  .object({
    ...common,
    address: text(300).min(3, 'required'),
    zip: z
      .string()
      .trim()
      .regex(/^\d{5}$/, 'invalid_zip')
      .optional()
      .or(z.literal(''))
      .default(''),
    firstName: optionalText(80),
    lastName: optionalText(80),
    phone,
    email,
    // Legacy single field from the current form: "phone or email".
    contact: optionalText(200),
    reason: optionalText(2000),
    propertyType: z.enum(PROPERTY_TYPES).optional(),
    condition: z.enum(CONDITIONS).optional(),
    situation: z.array(z.enum(SITUATIONS)).max(SITUATIONS.length).optional().default([]),
    timeline: z.enum(TIMELINES).optional()
  })
  .refine((d) => Boolean(d.phone || d.email || d.contact), {
    message: 'contact_required',
    path: ['contact']
  });

export const investorSchema = z
  .object({
    ...common,
    fullName: optionalText(160),
    firstName: optionalText(80),
    lastName: optionalText(80),
    email: z.string().trim().max(254).email('invalid_email'),
    phone,
    // Legacy fields from the current form.
    investorType: z.enum(['cash_buyer', 'llc', 'individual']).optional(),
    strategy: z.enum(['fix_and_flip', 'buy_and_hold']).optional(),
    budgetRange: optionalText(200),
    // Structured criteria (new investor profile builder).
    propertyTypes: z.array(z.enum(PROPERTY_TYPES)).max(PROPERTY_TYPES.length).optional().default([]),
    strategies: z.array(z.enum(STRATEGIES)).max(STRATEGIES.length).optional().default([]),
    minPrice: z.number().int().min(0).max(100_000_000).nullable().optional(),
    maxPrice: z.number().int().min(0).max(100_000_000).nullable().optional(),
    zips: z.array(z.string().regex(/^\d{5}$/)).max(50).optional().default([]),
    conditionAccepted: z.array(z.enum(CONDITIONS)).max(CONDITIONS.length).optional().default([]),
    funding: z.enum(FUNDING).optional()
  })
  .refine((d) => Boolean(d.fullName || d.firstName), { message: 'required', path: ['fullName'] })
  .refine((d) => d.minPrice == null || d.maxPrice == null || d.minPrice <= d.maxPrice, {
    message: 'invalid_range',
    path: ['maxPrice']
  });

/* ------------------------------------------------------------------ */
/* Rate limiting (in memory, per IP)                                   */
/* ------------------------------------------------------------------ */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

export function isRateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_REQUESTS;
}

export function clientIp(request: Request, fallback?: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? fallback ?? 'unknown';
}

/* ------------------------------------------------------------------ */
/* Origin check                                                        */
/* ------------------------------------------------------------------ */

const ALLOWED_ORIGINS = new Set([
  'https://keyvorahome.online',
  'https://www.keyvorahome.online',
  'https://staging.keyvorahome.online'
]);

export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // same-origin requests from some browsers omit it
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

/* ------------------------------------------------------------------ */
/* Responses                                                           */
/* ------------------------------------------------------------------ */

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

/* ------------------------------------------------------------------ */
/* Handler shared by /api/seller and /api/investor                     */
/* ------------------------------------------------------------------ */

type Kind = 'seller' | 'investor';

const DEFAULT_URLS: Record<Kind, string> = {
  seller: 'https://n8n.keyvorahome.online/webhook/keyvora/seller',
  investor: 'https://n8n.keyvorahome.online/webhook/keyvora/investor'
};

const ENV_URL_KEYS: Record<Kind, string> = {
  seller: 'N8N_SELLER_WEBHOOK_URL',
  investor: 'N8N_INVESTOR_WEBHOOK_URL'
};

const MAX_BODY_BYTES = 20_000;

export async function handleLead(kind: Kind, request: Request, clientAddress?: string): Promise<Response> {
  if (!isAllowedOrigin(request)) return json({ ok: false, error: 'forbidden' }, 403);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413);

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('not an object');
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  // Honeypot filled: pretend success, store nothing.
  if (typeof data.website_url === 'string' && data.website_url.trim() !== '') {
    return json({ ok: true });
  }

  if (isRateLimited(clientIp(request, clientAddress))) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  const schema = kind === 'seller' ? sellerSchema : investorSchema;
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || '_';
      if (!fields[key]) fields[key] = issue.message;
    }
    return json({ ok: false, error: 'validation', fields }, 400);
  }

  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[leads] N8N_WEBHOOK_SECRET is not set');
    return json({ ok: false, error: 'server_config' }, 500);
  }
  const url = process.env[ENV_URL_KEYS[kind]] || DEFAULT_URLS[kind];

  const { website_url: _honeypot, ...lead } = parsed.data as Record<string, unknown>;
  const payload = {
    ...lead,
    submissionId: (lead.submissionId as string | undefined) ?? crypto.randomUUID(),
    submittedAt: new Date().toISOString()
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Keyvora-Secret': secret },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000)
    });
    if (!res.ok) {
      console.error(`[leads] n8n responded ${res.status} for ${kind}`);
      return json({ ok: false, error: 'upstream' }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error(`[leads] n8n request failed for ${kind}:`, err);
    return json({ ok: false, error: 'upstream' }, 502);
  }
}

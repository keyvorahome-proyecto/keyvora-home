import type { APIRoute } from 'astro';
import { handleLead, json } from '../../lib/leads';

export const prerender = false;

export const POST: APIRoute = ({ request, clientAddress }) => handleLead('investor', request, clientAddress);

export const ALL: APIRoute = () => json({ ok: false, error: 'method_not_allowed' }, 405);

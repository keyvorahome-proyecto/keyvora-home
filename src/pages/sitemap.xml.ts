import { legacyRedirect } from '../lib/redirect';

export const prerender = false;
export const GET = legacyRedirect('/sitemap-index.xml');

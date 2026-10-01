import type { APIRoute } from 'astro';

/** Permanent (301) redirect from a legacy `.html` URL to its clean URL. */
export function legacyRedirect(target: string): APIRoute {
  return ({ url }) =>
    new Response(null, {
      status: 301,
      headers: { Location: target + url.search + url.hash }
    });
}

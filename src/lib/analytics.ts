// Google Analytics 4 (spec 86). The measurement ID is public (it appears in
// every page's HTML), so it lives here rather than in a secret env var.
// Leave it empty to disable GA entirely.
export const GA_MEASUREMENT_ID = '';

// GA only loads on the production domain, so staging and local tests never
// pollute the reports. Elsewhere events are still recorded in
// window.__kvEvents for debugging.
export const ANALYTICS_HOSTS = ['keyvorahome.online', 'www.keyvorahome.online'];

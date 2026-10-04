// Final QA audit (spec 89): accessibility (axe-core), mobile layout, SEO
// basics, page weight, console errors and internal links, on every page at
// phone and desktop width. Findings are GitHub annotations; this step never
// fails the build.
// Usage: node scripts/qa-audit.mjs <base>
import { chromium } from 'playwright';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const base = process.argv[2];
const pages = [
  '/', '/es/', '/sell-your-house', '/es/sell-your-house', '/investors', '/es/investors',
  '/sell-your-house/thank-you', '/es/sell-your-house/thank-you', '/investors/thank-you', '/es/investors/thank-you',
  '/privacy', '/es/privacy'
];
const widths = [375, 1280];
// GitHub shows at most 10 warnings per step, so findings are grouped by
// problem and listed with the pages where they occur.
const groups = new Map();
const warn = (msg, page) => {
  const key = msg;
  if (!groups.has(key)) groups.set(key, new Set());
  groups.get(key).add(page || '');
};
const note = (msg) => console.log('::notice::' + msg.replace(/\n/g, ' '));

const browser = await chromium.launch();
const links = new Set();
for (const path of pages) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    let bytes = 0;
    page.on('response', async (r) => { try { if (r.url().startsWith(base)) bytes += (await r.body()).length; } catch {} });
    await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 });
    // Reveal everything so axe sees final colors.
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible')));
    await page.waitForTimeout(700);
    const tag = `${path} @${width}px`;

    errors.filter((e) => !/fonts\.g|googletagmanager/.test(e)).forEach((e) => warn(`console error: ${e.slice(0, 160)}`, tag));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) warn(`horizontal scroll (${overflow}px wider than the screen)`, tag);

    await page.addScriptTag({ content: axeSource });
    const axe = await page.evaluate(async () => {
      const r = await window.axe.run({ exclude: [['.brand-name .accent']] }, { runOnly: ['wcag2a', 'wcag2aa', 'best-practice'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, target: v.nodes.slice(0, 3).map((x) => x.target.join(' ')).join(' | ') }));
    });
    axe.forEach((v) => warn(`a11y [${v.impact}] ${v.id}: ${v.target}`, tag));

    if (width === 1280) {
      const seo = await page.evaluate(() => ({
        title: document.title,
        desc: document.querySelector('meta[name="description"]')?.content || '',
        h1: document.querySelectorAll('h1').length,
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        lang: document.documentElement.lang,
        noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
        links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split('#')[0]).filter(Boolean)
      }));
      if (!seo.title || seo.title.length > 65) warn(`title longer than 65 chars`, `${path} (${seo.title.length})`);
      if (seo.desc.length < 70 || seo.desc.length > 160) warn(`meta description outside 70-160 chars`, `${path} (${seo.desc.length})`);
      if (seo.h1 !== 1) warn(`page does not have exactly one h1`, `${path} (${seo.h1})`);
      if (!seo.canonical) warn(`missing canonical`, path);
      if (seo.noAlt) warn(`images without alt`, path);
      seo.links.forEach((l) => links.add(l));
      note(`${path} transfer ${(bytes / 1024).toFixed(0)} KB, title ${seo.title.length} chars, description ${seo.desc.length} chars`);
    }
    await page.close();
  }
}
for (const l of links) {
  const res = await fetch(base + l, { redirect: 'manual' });
  if (res.status >= 400) warn(`broken internal link`, `${l} (${res.status})`);
}
await browser.close();
const sorted = [...groups.entries()];
sorted.slice(0, 9).forEach(([msg, where]) => console.log(`::warning::${msg} — on: ${[...where].join(', ')}`));
if (sorted.length > 9) console.log(`::warning::+${sorted.length - 9} more: ` + sorted.slice(9).map(([m, w]) => `${m} [${[...w].join(', ')}]`).join(' || '));
note(`QA audit finished: ${sorted.length} distinct finding(s) on ${pages.length} pages x ${widths.length} widths`);

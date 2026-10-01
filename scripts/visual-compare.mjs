// Compare the new build against the live site, page by page and width by width.
// Usage: node scripts/visual-compare.mjs <newBase> <oldBase>
// Reports differences as GitHub annotations; it never fails the build.
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const [newBase, oldBase] = process.argv.slice(2);
const pairs = [
  ['/', '/index.html'],
  ['/sell-your-house', '/sell-your-house.html'],
  ['/investors', '/for-investors.html'],
  ['/es/', '/es/index.html'],
  ['/es/sell-your-house', '/es/sell-your-house.html'],
  ['/es/investors', '/es/for-investors.html']
];
const widths = [375, 768, 1280];

const browser = await chromium.launch();
async function shot(url, width) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ fullPage: true });
  await page.close();
  return PNG.sync.read(buf);
}

for (const [newPath, oldPath] of pairs) {
  for (const width of widths) {
    try {
      const a = await shot(newBase + newPath, width);
      const b = await shot(oldBase + oldPath, width);
      const h = Math.min(a.height, b.height);
      const crop = (img) => {
        const out = new PNG({ width, height: h });
        PNG.bitblt(img, out, 0, 0, width, h, 0, 0);
        return out;
      };
      const diff = new PNG({ width, height: h });
      const n = pixelmatch(crop(a).data, crop(b).data, diff.data, width, h, { threshold: 0.1 });
      // Rows that differ, grouped into bands
      const rows = [];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          if (diff.data[i] === 255 && diff.data[i + 1] === 0) { rows.push(y); break; }
        }
      }
      const bands = [];
      for (const y of rows) {
        const last = bands[bands.length - 1];
        if (last && y - last[1] <= 4) last[1] = y; else bands.push([y, y]);
      }
      const pct = ((n / (width * h)) * 100).toFixed(2);
      const msg = `visual ${newPath} @${width}px: ${pct}% pixels differ; height new=${a.height} old=${b.height}; bands=${bands.slice(0, 8).map(([s, e]) => `${s}-${e}`).join(',')}`;
      console.log(`::notice::${msg}`);
    } catch (err) {
      console.log(`::warning::visual ${newPath} @${width}px failed: ${err.message}`);
    }
  }
}
await browser.close();

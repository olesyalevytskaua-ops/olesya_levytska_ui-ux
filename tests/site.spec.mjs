import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { pages } from './pages.mjs';

// Errors caused by third-party hosts (fonts, LinkedIn, etc.) are outside the site's control.
const isExternalNoise = text => /Failed to load resource|fonts\.(googleapis|gstatic)\.com/.test(text);

async function open(page, path, theme) {
  await page.addInitScript(t => { try { localStorage.setItem('theme', t); } catch {} }, theme);
  const problems = [];
  page.on('pageerror', e => problems.push(`JS error: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error' && !isExternalNoise(m.text())) problems.push(`console: ${m.text()}`); });
  page.on('response', r => { if (r.url().startsWith('http://localhost') && r.status() >= 400) problems.push(`${r.status()} ${new URL(r.url()).pathname}`); });
  page.on('requestfailed', r => {
    const reason = r.failure()?.errorText || '';
    if (r.url().startsWith('http://localhost') && !reason.includes('ERR_ABORTED')) problems.push(`request failed ${new URL(r.url()).pathname} ${reason}`);
  });
  await page.goto(path, { waitUntil: 'networkidle' });
  // Scroll through the page so lazy images and scroll-reveal content load.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
  return problems;
}

for (const path of pages) {
  for (const theme of ['light', 'dark']) {
    test.describe(`${path} · ${theme}`, () => {
      test('loads without errors, broken assets or horizontal scroll', async ({ page }) => {
        const problems = await open(page, path, theme);
        const brokenImages = await page.$$eval('img', imgs => imgs
          .filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src') && !i.src.startsWith('data:'))
          .map(i => `broken image ${i.getAttribute('src')}`));
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect([...problems, ...brokenImages]).toEqual([]);
        expect(overflow, 'page should not scroll sideways').toBeLessThanOrEqual(0);
      });

      test('has no serious accessibility violations', async ({ page }) => {
        await open(page, path, theme);
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .exclude('[aria-hidden="true"]') // decorative numerals and cover art
          .analyze();
        const serious = violations
          .filter(v => v.impact === 'serious' || v.impact === 'critical')
          .map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`);
        expect(serious).toEqual([]);
      });
    });
  }
}

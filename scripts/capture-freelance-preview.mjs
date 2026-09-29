import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => document.fonts.ready);
    for (const id of ['websites', 'quote']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.locator(`#${id}`).screenshot({ path: `artifacts/${id}-${width}.png` });
    }
    await page.getByRole('button', { name: 'Mobile', exact: true }).click();
    await page.locator('.mobile-screen img').evaluateAll(imgs => imgs.forEach(img => { img.loading = 'eager'; }));
    await Promise.all(await page.locator('.mobile-screen img').all().then(imgs => imgs.map(img => img.evaluate(el => el.decode()))));
    await page.locator('#websites').screenshot({ path: `artifacts/three-mobile-screens-${width}.png` });
    await page.goto('http://127.0.0.1:4173/projects/mahila-mitr');
    await page.locator('.case-art img').evaluate(img => img.decode());
    await page.screenshot({ path: `artifacts/mahila-${width}.png`, fullPage: true });
    await page.close();
  }
} finally { await browser.close(); }

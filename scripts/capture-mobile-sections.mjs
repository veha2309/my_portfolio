import { chromium } from '@playwright/test';
import sharp from 'sharp';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [slug, url, sections] of [
    ['malamen', 'https://malamen.vercel.app/', [['home', '#top'], ['experience', '#discover'], ['dining', 'section:has(h2:text("Come for the food."))']]],
    ['signature-cafe', 'https://signature-cafe-brown.vercel.app/', [['home', '#top'], ['menu', '#menu'], ['visit', '#visit']]],
  ]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    for (const [name, selector] of sections) {
      await page.locator(selector).first().evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForTimeout(1600);
      const path = `public/images/websites/${slug}-mobile-${name}.webp`;
      await sharp(await page.screenshot()).webp({ quality: 82 }).toFile(path);
      console.log(path);
    }
    await page.close();
  }
} finally { await browser.close(); }

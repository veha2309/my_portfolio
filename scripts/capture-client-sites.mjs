import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('public/images/websites', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [slug, url] of [
    ['malamen', 'https://malamen.vercel.app/'],
    ['signature-cafe', 'https://signature-cafe-brown.vercel.app/'],
    ['mahila-mitr', 'https://mahila-mitr-web.vercel.app/'],
  ]) {
    for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      const buffer = await page.screenshot();
      const path = `public/images/websites/${slug}-${device}.webp`;
      await sharp(buffer).webp({ quality: 82 }).toFile(path);
      console.log(path);
      await page.close();
    }
  }
} finally { await browser.close(); }

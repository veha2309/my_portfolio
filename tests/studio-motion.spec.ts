import { test, expect } from '@playwright/test';

test('overlapping hero cards remain stable while hovered', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.reel-entrance')).toHaveCSS('transform', 'none');
  const cards = page.locator('.scene-plate');
  const stack = () => cards.evaluateAll(elements => elements.map(element => getComputedStyle(element).zIndex));
  expect(await stack()).toEqual(['1', '2', '3']);
  const front = page.locator('.scene-plate--front');
  const bounds = await front.boundingBox();
  expect(bounds).not.toBeNull();
  // Move into the floating card as a real pointer would, without waiting for idle motion to stop.
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await expect(front.locator('img')).toHaveCSS('scale', '1.025');
  await expect(front.locator('img')).toHaveCSS('transform', 'none');
  expect(await stack()).toEqual(['1', '2', '3']);
  const samples = await front.evaluate(async element => {
    const hovered: boolean[] = [];
    for (let frame = 0; frame < 60; frame++) {
      await new Promise(requestAnimationFrame);
      hovered.push(element.matches(':hover'));
    }
    return hovered;
  });
  expect(samples.every(Boolean)).toBe(true);
  await page.locator('.scene-plate--back').focus();
  await expect(page.locator('.scene-plate--back')).toHaveCSS('z-index', '5');
});

test('studio motion resets across navigation, touch layouts, and preference changes', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.studio-hero');
  const depth = page.locator('.reel-depth');
  await expect(hero).toHaveAttribute('data-motion-active', 'true');
  await page.locator('.scene-plate--back').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/projects\/financeflow$/);
  await page.goBack();
  await expect(hero).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(hero).not.toHaveAttribute('data-motion-active');
  await expect(depth).toHaveCSS('transform', 'none');
  await expect(page.locator('.reel-entrance')).toHaveCSS('transform', 'none');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(hero).toHaveAttribute('data-motion-active', 'true');
  const bounds = await depth.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width * .8, bounds!.y + bounds!.height * .7);
  await expect(depth).not.toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(depth).toHaveCSS('transform', 'none');
  await expect(page.locator('.scene-plate--front')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-motion-active', 'false');
  await expect(page.locator('.scene-plate--front')).toHaveCSS('animation-play-state', 'paused');
});

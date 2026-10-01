import { test, expect } from '@playwright/test';

test('wizard validates steps and keeps a brief when adding website references', async ({ page }) => {
  await page.goto('/quote');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByLabel('A little about your idea')).toBeFocused();
  await page.getByLabel('A little about your idea').fill('Keep my original idea.');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('radio', { name: 'Mobile app', exact: true }).check();
  await page.getByRole('link', { name: 'BACK TO THE STUDIO' }).click();
  await page.getByRole('link', { name: 'Build something like this' }).click();
  await expect(page.getByLabel('A little about your idea')).toHaveValue('Keep my original idea.\n\nDesign reference: Malamen.');
  await page.getByRole('link', { name: 'BACK TO THE STUDIO' }).click();
  await page.getByRole('button', { name: 'Signature Cafe', exact: false }).click();
  await page.getByRole('link', { name: 'Build something like this' }).click();
  await expect(page.getByLabel('A little about your idea')).toContainText('Signature Cafe');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.quote-summary')).toContainText('Website');
  await page.getByLabel('Your email').fill('client@example.com');
  await page.getByRole('button', { name: 'Edit brief' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByLabel('Your email')).toHaveValue('client@example.com');
  await page.locator('#quote').screenshot({ path: 'artifacts/editorial-quote-desktop.png' });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.locator('.quote-wizard').screenshot({ path: 'artifacts/editorial-quote-mobile.png' });
});

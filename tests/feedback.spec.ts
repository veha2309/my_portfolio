import { test, expect } from '@playwright/test';

test('private feedback supports portfolio, person and every project without public results', async ({ page }) => {
  let payload: Record<string, unknown> = {};
  await page.route('**/api/feedback', route => { payload = route.request().postDataJSON(); return route.fulfill({ status: 201, json: { id: 'test-id' } }); });
  await page.goto('/feedback');
  const section = page.locator('#feedback');
  await section.locator('summary').click();
  await expect(section.getByLabel('Feedback about').locator('option')).toHaveCount(9);
  for (const target of ['portfolio', 'vedant', 'signature-cafe']) {
    await section.getByLabel('Feedback about').selectOption(target);
    await section.getByRole('radio', { name: '4 stars', exact: true }).check();
    await section.getByLabel('Your feedback', { exact: true }).fill('This is private feedback.');
    await section.getByRole('button', { name: 'Send private feedback' }).click();
    await expect(section.getByRole('status')).toContainText('sent privately');
    expect(payload.target).toBe(target);
    expect(payload.rating).toBe(4);
  }
  await page.goto('/projects/mahila-mitr');
  await page.locator('#feedback summary').click();
  await page.getByRole('radio', { name: '5 stars' }).check();
  await page.getByLabel('Your feedback', { exact: true }).fill('Useful app.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#feedback').screenshot({ path: 'artifacts/private-feedback-mobile.png' });
  await page.getByRole('button', { name: 'Send private feedback' }).click();
  await expect(page.locator('#feedback [role=status]')).toContainText('sent privately');
  expect(payload.target).toBe('mahila-mitr');
});

test('admin can read and filter private feedback', async ({ page }) => {
  await page.route('**/api/admin/session', route => route.fulfill({ json: { authenticated: true } }));
  await page.route('**/api/inquiries?*', route => route.fulfill({ json: { items: [], total: 0 } }));
  await page.route('**/api/feedback?*', route => route.fulfill({ json: { items: [{ id: '1', target: 'vedant', rating: 5, message: 'Great collaboration', name: 'Client', email: '', created_at: '2026-09-29' }], total: 1 } }));
  await page.goto('/admin');
  await page.getByRole('button', { name: 'Private feedback', exact: true }).click();
  await expect(page.getByText('Great collaboration')).toBeVisible();
  await page.getByLabel('Filter feedback').selectOption('vedant');
  await expect(page.getByText('5 / 5 stars')).toBeVisible();
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/admin-feedback-mobile-test-data.png', fullPage: true });
});

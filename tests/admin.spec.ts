import { test, expect } from '@playwright/test';

test('direct enquiry confirms server success', async ({ page }) => {
  let payload: Record<string, string> = {};
  await page.route('**/api/inquiries', async route => { payload = route.request().postDataJSON(); await route.fulfill({ status: 201, json: { id: 'test-inquiry' } }); });
  await page.goto('/#quote');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('A little about your idea').fill('A new cafe website');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('Your email').fill('client@example.com');
  await page.getByRole('button', { name: 'Send quote request' }).click();
  await expect(page.getByRole('status')).toContainText('Your enquiry has been received');
  expect(payload.email).toBe('client@example.com');
  expect(payload.message).toBe('A new cafe website');
  await expect(page.getByRole('link', { name: 'Open email draft' })).toHaveCount(0);
  await expect(page.getByLabel('Your email')).toHaveValue('');
});

test('a missing API never claims success and preserves the brief', async ({ page }) => {
  await page.route('**/api/inquiries', route => route.fulfill({ contentType: 'text/html', body: '<html>Static preview</html>' }));
  await page.goto('/#quote');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('A little about your idea').fill('Please keep this brief');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('Your email').fill('client@example.com');
  await page.getByRole('button', { name: 'Send quote request' }).click();
  await expect(page.getByRole('status')).toContainText('unavailable');
  await expect(page.getByLabel('A little about your idea')).toHaveValue('Please keep this brief');
  await expect(page.getByRole('link', { name: 'Open email draft' })).toBeVisible();
});

test('admin login, inbox status change, reply and logout', async ({ page }) => {
  let signedIn = false;
  let status = 'new';
  await page.route('**/api/admin/session', async route => {
    const method = route.request().method();
    if (method === 'POST') signedIn = route.request().postDataJSON().password === 'test-password';
    if (method === 'DELETE') { signedIn = false; await route.fulfill({ json: { ok: true } }); return; }
    await route.fulfill({ status: signedIn ? 200 : 401, json: { authenticated: signedIn } });
  });
  await page.route('**/api/inquiries?*', route => route.fulfill({ json: { total: 1, items: [{ _id: 'a'.repeat(24), name: 'Asha', email: 'asha@example.com', service: 'Website', timeline: '1–3 months', message: 'Build a cafe site', status, createdAt: '2026-09-29T10:00:00Z' }] } }));
  await page.route('**/api/inquiries', route => { status = route.request().postDataJSON().status; return route.fulfill({ json: { item: { _id: 'a'.repeat(24), name: 'Asha', email: 'asha@example.com', service: 'Website', timeline: '1–3 months', message: 'Build a cafe site', status, createdAt: '2026-09-29T10:00:00Z' } } }); });
  await page.goto('/admin');
  await expect(page).toHaveTitle('Project enquiries — Vedant Shukla');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.getByLabel('Admin password').fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Asha', exact: true })).toBeVisible();
  await page.getByLabel('Status').selectOption('contacted');
  await expect(page.getByLabel('Status')).toHaveValue('contacted');
  expect(status).toBe('contacted');
  await expect(page.getByRole('link', { name: /asha@example.com/ })).toHaveAttribute('href', /^mailto:/);
  await page.screenshot({ path: 'artifacts/admin-desktop-test-data.png', fullPage: true });
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/admin-mobile-test-data.png', fullPage: true });
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByLabel('Admin password')).toBeVisible();
  await expect(page.locator('.inquiry-card')).toHaveCount(0);
});

test('three mobile sections stay within the page and can be scrolled', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/#websites');
  await page.getByRole('button', { name: 'Mobile', exact: true }).click();
  const gallery = page.getByRole('region', { name: 'Malamen mobile section previews' });
  await expect(gallery.locator('figure')).toHaveCount(3);
  await gallery.evaluate(el => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }));
  await expect.poll(() => gallery.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

import { test, expect } from '@playwright/test';

const services = [
  { link: 'Plan your website', slug: 'website', value: 'Website', heading: 'Your brand online.', prompt: 'What does your business do?' },
  { link: 'Discuss your web app', slug: 'web-app', value: 'Web app', heading: 'A useful idea.', prompt: 'Who will use your app?' },
  { link: 'Explore your app idea', slug: 'mobile-app', value: 'Mobile app', heading: 'Closer to your customers.', prompt: 'What should your app help people do?' },
];

for (const service of services) {
  test(`${service.value} card carries its service into the quote and submission`, async ({ page }) => {
    let payload: Record<string, unknown> = {};
    await page.route('**/api/inquiries', route => {
      payload = route.request().postDataJSON();
      return route.fulfill({ status: 201, json: { id: 'quote-service-test' } });
    });
    await page.goto('/');
    await expect(page.locator('#quote')).toHaveCount(0);
    await page.locator('#capabilities').getByRole('link', { name: service.link }).click();
    await expect(page).toHaveURL(`/quote?service=${service.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(service.heading);
    await expect(page.getByRole('radio', { name: service.value, exact: true })).toBeChecked();
    await page.reload();
    await expect(page.getByRole('radio', { name: service.value, exact: true })).toBeChecked();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByLabel('A little about your idea')).toHaveAttribute('placeholder', new RegExp(service.prompt.replace('?', '\\?')));
    await page.getByLabel('A little about your idea').fill(`A ${service.value} for my business.`);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByLabel('Your email').fill('client@example.com');
    await page.getByRole('button', { name: 'Send quote request' }).click();
    await expect(page.getByRole('status')).toContainText('received');
    expect(payload.service).toBe(service.value);
    expect(payload.message).toBe(`A ${service.value} for my business.`);
  });
}

test('old quote links redirect and unsupported query values use safe defaults', async ({ page }) => {
  await page.goto('/#quote');
  await expect(page).toHaveURL('/quote');
  await page.goto('/quote?service=unknown&reference=constructor');
  await expect(page.getByRole('radio', { name: 'Website', exact: true })).toBeChecked();
  await expect(page.locator('.quote-reference')).toHaveCount(0);
  await page.getByRole('radio', { name: 'Redesign', exact: true }).check();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A fresh perspective.');
});

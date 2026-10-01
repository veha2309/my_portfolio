import { test, expect } from '@playwright/test';

test('a customer can explore the process, get answers, and start an enquiry', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Process', exact: true }).click();
  await expect(page).toHaveURL('/#process');
  await expect(page.getByRole('heading', { name: 'Find the direction' })).toBeVisible();
  const question = page.locator('.faq-list summary').filter({ hasText: 'Who will I work with?' });
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.faq-list details[open]')).toContainText('Vedant Shukla');
  await page.getByRole('link', { name: 'Tell me about your business' }).click();
  await expect(page).toHaveURL('/quote');
  await expect(page.getByRole('heading', { name: 'What are we making?' })).toBeVisible();
  await page.getByRole('radio', { name: 'Web app', exact: true }).check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByLabel('A little about your idea')).toBeVisible();
});

test('the studio links to the full archive and preserves access to private feedback', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#resume, .skills-grid, .education, #feedback')).toHaveCount(0);
  await expect(page.locator('.project-stack')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explore all work' }).click();
  await expect(page).toHaveURL('/work');
  await expect(page).toHaveTitle('The work — Vedant Digital Studio');
  await page.reload();
  await expect(page.locator('.project-card')).toHaveCount(5);
  await page.getByRole('link', { name: 'Private feedback', exact: true }).click();
  await expect(page).toHaveURL('/feedback');
  await expect(page).toHaveTitle('Private feedback — Vedant Digital Studio');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('#feedback')).toBeVisible();
});

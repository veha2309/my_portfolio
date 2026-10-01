import { test, expect } from "@playwright/test";

test("email links prompt before opening a mail app and preserve the draft URL", async ({ page }) => {
  await page.goto("/");
  const link = page.locator('a[href^="mailto:"]').first();
  const href = await link.getAttribute("href");
  await link.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("default email app");
  const confirm = dialog.getByRole("link", { name: "Open email app" });
  await expect(confirm).toHaveAttribute("href", href!);
  await expect(confirm).not.toHaveAttribute("target", "_blank");
  await dialog.getByRole("button", { name: "Stay here" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(link).toBeFocused();
});

test("external destinations require confirmation and cancellation restores focus", async ({ page, context }) => {
  await page.goto("/#websites");
  const link = page.getByRole("link", { name: "Explore live site" });
  await link.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("malamen.vercel.app");
  await expect(dialog.getByRole("button", { name: "Stay here" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(link).toBeFocused();
  await link.click({ modifiers: ["Control"] });
  await dialog.getByRole("button", { name: "Stay here" }).click();
  await expect(page).toHaveURL(/#websites$/);
  await link.click();
  await context.route("https://malamen.vercel.app/**", route => route.fulfill({ body: "Destination verified" }));
  const popupPromise = page.waitForEvent("popup");
  await dialog.getByRole("link", { name: "Continue" }).click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL("https://malamen.vercel.app/");
  await expect(dialog).not.toBeVisible();
  await popup.close();
  await page.locator('.project-link').first().click();
  await expect(page).toHaveURL(/projects\/stockpulse$/);
  await expect(dialog).not.toBeVisible();
});

test("confirmation fits mobile and reduced motion keeps previews immediately readable", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#websites");
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await expect(page.locator('.mobile-screen').first()).toHaveCSS("opacity", "1");
  await page.getByRole("link", { name: "Explore live site" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveCSS("opacity", "1");
  const box = await dialog.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(360);
  await page.screenshot({ path: "artifacts/external-prompt-mobile.png" });
  await dialog.getByRole("button", { name: "Stay here" }).click();
});

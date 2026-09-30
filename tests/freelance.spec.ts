import { test, expect } from "@playwright/test";

test("Mahila Mitr leads with mobile and separates the supporting admin panel", async ({ page }) => {
  await page.goto("/projects/mahila-mitr");
  await expect(page.locator(".case-header")).toContainText("Mobile app + web companion");
  await expect(page.locator(".case-art img")).toHaveAttribute("src", "/images/projects/mahila-mitr.svg");
  await expect(page.locator(".case-overview")).toContainText("built with Flutter");
  await expect(page.locator(".case-overview")).toContainText("private chats with adjustable message expiry");
  await expect(page.getByRole("link", { name: "View admin panel" })).toHaveAttribute("href", "https://mahila-mitr-web.vercel.app/");
  await expect(page.locator(".companion-section img")).toHaveAttribute("src", /mahila-mitr-desktop.webp/);
});

test("Mahila Mitr is a regular project and web designs have their own section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".project-card").last()).toContainText("Mahila Mitr");
  expect(await page.locator(".project-card--rose").evaluate(el => getComputedStyle(el).gridColumn)).toBe("auto");
  await expect(page.locator("#work")).not.toContainText("Malamen");
  await expect(page.locator("#websites h2")).toHaveText("Web designs with character.");
});

test("website showcase switches real captures and keeps source links in sync", async ({ page }) => {
  await page.goto("/#websites");
  const section = page.locator("#websites");
  await expect(section.getByRole("link", { name: "Source", exact: true })).toHaveAttribute("href", "https://github.com/veha2309/malamen");
  await section.getByRole("button", { name: "Signature Cafe" }).click();
  await section.getByRole("button", { name: "Mobile", exact: true }).click();
  await expect(section.locator('.mobile-screen')).toHaveCount(3);
  const image = section.getByRole("img", { name: "Signature Cafe mobile first impression section snapshot" });
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBe(390);
  await expect(section.getByRole("link", { name: "Explore live site" })).toHaveAttribute("href", "https://signature-cafe-brown.vercel.app/");
  await section.getByRole("button", { name: "Malamen" }).focus();
  await page.keyboard.press("Enter");
  await expect(section.getByRole("button", { name: "Malamen" })).toHaveAttribute("aria-pressed", "true");
  await expect(section.getByRole("img").first()).toHaveAttribute("src", /malamen-mobile/);
});

test("quote prepares a correctly encoded email and clears stale drafts on edits", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.route('**/api/inquiries', route => route.fulfill({ status: 503, json: { error: 'Direct enquiries unavailable. Please email instead.' } }));
  await page.goto("/#quote");
  await page.getByRole("radio", { name: "Redesign", exact: true }).check();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByLabel("A little about your idea").fill("A cafe website & menu. Budget to discuss.");
  await page.getByLabel("Your timeline").selectOption("1–3 months");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.locator('#quote').getByLabel("Your name").fill("Asha & Co");
  await page.getByLabel("Your email").fill("asha@example.com");
  await page.getByRole("button", { name: "Send quote request" }).click();
  const draft = page.getByRole("link", { name: "Open email draft" });
  const href = await draft.getAttribute("href");
  const email = new URL(href!);
  expect(email.searchParams.get("subject")).toBe("Redesign project enquiry");
  expect(email.searchParams.get("body")).toContain("Asha & Co");
  expect(email.searchParams.get("body")).toContain("1–3 months");
  await page.getByRole("button", { name: "Copy brief" }).click();
  await expect(page.getByRole("status")).toContainText("Brief copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("A cafe website & menu.");
  await page.getByRole("button", { name: "Edit brief" }).click();
  await page.getByLabel("A little about your idea").fill("Changed brief");
  await expect(draft).toHaveCount(0);
});

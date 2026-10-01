import { test, expect } from "@playwright/test";

const cases = [
  ["financeflow", "FinanceFlow"],
  ["stockpulse", "StockPulse"],
  ["stockpulse-mobile", "StockPulse Mobile"],
  ["vision-assistant", "Vision Assistant"],
  ["mahila-mitr", "Mahila Mitr"],
];

test("direct section links land on their target after fonts and motion initialize", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [hash, target] of [
      ["about", "about"],
      ["work", "work"],
      ["projects", "work"],
    ]) {
      await page.goto(`/?section-check=${width}-${hash}#${hash}`);
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page
            .locator(`#${target}`)
            .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
        )
        .toBeLessThan(140);
      expect(
        await page
          .locator(`#${target}`)
          .evaluate((el) => el.getBoundingClientRect().top),
      ).toBeGreaterThanOrEqual(0);
    }
  }
});

test("homepage is usable, free of runtime errors, and contains valid project links", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "GREAT",
  );
  await expect(page).toHaveTitle("Vedant Digital Studio — Websites, Web & Mobile Apps");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".project-card")).toHaveCount(5);
  for (const [slug, title] of cases)
    await expect(
      page.locator(`.project-link[href="/projects/${slug}"]`),
    ).toContainText(title);
  await page.getByRole("link", { name: "View work", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await page.waitForTimeout(1000);
  const workTop = await page
    .locator("#work")
    .evaluate((el) => el.getBoundingClientRect().top);
  expect(workTop).toBeGreaterThanOrEqual(0);
  expect(workTop).toBeLessThan(130);
  await expect(
    page.locator('a[href="mailto:448vedantshukla@gmail.com"]').first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

for (const [slug, title] of cases) {
  test(`${title} supports direct loads, reloads, and case-study navigation`, async ({
    page,
  }) => {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(`${title} — Vedant Digital Studio`);
    await expect(page.locator(".decision")).toHaveCount(3);
    if (slug === "vision-assistant") {
      await expect(
        page.getByRole("link", { name: "Discuss this project" }),
      ).toHaveAttribute("href", /^mailto:/);
    } else {
      await expect(
        page.getByRole("link", { name: /source code/i }),
      ).toHaveAttribute("href", /^https:\/\/github.com\//);
    }
    expect(
      await page
        .locator(".case-art img")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    ).toBe(true);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await page.locator(".next-project").click();
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(title);
    await page.goBack();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await page.getByRole("link", { name: "ALL WORK" }).click();
    await expect(page).toHaveURL("/#work");
    await expect(
      page.getByRole("heading", { name: "Ideas made real." }),
    ).toBeVisible();
  });
}

test("browser Back restores portfolio scroll position", async ({ page }) => {
  await page.goto("/");
  await page.locator('.project-link[href="/projects/stockpulse-mobile"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const before = await page.evaluate(() => scrollY);
  await page
    .locator('.project-link[href="/projects/stockpulse-mobile"]')
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "StockPulse Mobile",
  );
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "GREAT",
  );
  await page.waitForTimeout(350);
  expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(
    8,
  );
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`no horizontal overflow and all media loads at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/projects/stockpulse-mobile"]) {
      await page.goto(path);
      await page.locator("main").waitFor();
      await page.evaluate(async () => {
        await document.fonts.ready;
        document.querySelectorAll("img").forEach((img) => {
          img.loading = "eager";
        });
      });
      await expect
        .poll(() =>
          page.evaluate(() =>
            [...document.images].every(
              (img) => img.complete && img.naturalWidth > 0,
            ),
          ),
        )
        .toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test("mobile menu supports focus containment, Escape, links, and breakpoint changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: /Services/ }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: /Contact/ }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(page.locator("main")).not.toHaveAttribute("inert");
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /About/ })
    .click();
  await expect(page).toHaveURL("/#about");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  await menu.click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

test("reduced motion shows content immediately, including after preference changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator("#hero-title")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.locator(".project-card").first()).toBeVisible();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".hero-copy")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
});

test("unknown paths and unknown projects have a useful recovery path", async ({
  page,
}) => {
  for (const path of ["/not-a-page", "/projects/not-a-project"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "This page",
    );
    await expect(page).toHaveTitle("Page not found — Vedant Digital Studio");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
    await page.getByRole("link", { name: "Back to the portfolio" }).click();
    await expect(page).toHaveURL("/");
  }
});

test("keyboard skip link reaches the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

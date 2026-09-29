import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

mkdirSync("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const root = "http://127.0.0.1:4173";
try {
  await page.goto(root);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1100);
  await page.screenshot({ path: "artifacts/rebuild-desktop.png" });
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "artifacts/rebuild-work.png" });
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "artifacts/rebuild-about.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() =>
    document.querySelectorAll("img").forEach((img) => {
      img.loading = "eager";
    }),
  );
  await page.waitForTimeout(250);
  await page.screenshot({ path: "artifacts/rebuild-full.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "artifacts/rebuild-mobile.png" });
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/rebuild-mobile-work.png" });
  await page.locator(".about-portrait").scrollIntoViewIfNeeded();
  await page.locator(".about-portrait img").evaluate((img) => img.decode());
  await page.screenshot({ path: "artifacts/portrait-mobile.png" });
  await page.goto(`${root}/projects/financeflow`);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.screenshot({
    path: "artifacts/rebuild-case-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${root}/projects/financeflow`);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.screenshot({ path: "artifacts/rebuild-case-desktop.png" });

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(root);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const performance = await page.evaluate(async () => {
    const tasks = [];
    const observer = new PerformanceObserver((list) =>
      tasks.push(
        ...list.getEntries().map((entry) => ({
          start: entry.startTime,
          duration: entry.duration,
        })),
      ),
    );
    observer.observe({ type: "longtask", buffered: false });
    const frames = [];
    const start = window.performance.now();
    let last = start;
    await new Promise((resolve) => {
      const frame = (now) => {
        frames.push(now - last);
        last = now;
        const elapsed = now - start;
        window.scrollTo({
          top:
            (document.documentElement.scrollHeight - innerHeight) *
            Math.min(elapsed / 8000, 1),
          behavior: "instant",
        });
        if (elapsed < 8000) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
    observer.disconnect();
    const steady = frames.slice(2).sort((a, b) => a - b);
    return {
      durationMs: window.performance.now() - start,
      frameCount: steady.length,
      frameP95Ms: steady[Math.floor(steady.length * 0.95)],
      framesOver50Ms: steady.filter((value) => value > 50).length,
      longTasks: tasks,
      devicePixelRatio,
    };
  });
  writeFileSync(
    "artifacts/scroll-profile.json",
    JSON.stringify(
      {
        environment:
          "Headless Chrome, desktop 1440x1000, no CPU throttling, 8-second scripted page scroll; lab evidence, not a physical-device guarantee.",
        ...performance,
        errors,
      },
      null,
      2,
    ),
  );

  await page.setViewportSize({ width: 1200, height: 630 });
  const svg = readFileSync("public/social-card.svg", "utf8");
  // SVG is authored here, rendered locally into a crawler-compatible PNG.
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: "public/social-card.png" });
  console.log(
    JSON.stringify({
      screenshots: "artifacts/rebuild-*.png",
      scroll: performance,
      errors,
    }),
  );
} finally {
  await browser.close();
}

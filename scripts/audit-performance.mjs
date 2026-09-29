import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync("artifacts", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--remote-debugging-port=9223"],
});
try {
  const result = await lighthouse("http://127.0.0.1:4173/", {
    port: 9223,
    output: ["json", "html"],
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });
  writeFileSync("artifacts/rebuild-lighthouse.json", result.report[0]);
  writeFileSync("artifacts/rebuild-lighthouse.html", result.report[1]);
  const { categories, audits } = result.lhr;
  const summary = {
    environment:
      "Lighthouse default simulated mobile throttling; local Vite production preview; headless Chrome; single lab run.",
    lighthouseVersion: result.lhr.lighthouseVersion,
    categories: Object.fromEntries(
      Object.entries(categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    ),
    lcpMs: audits["largest-contentful-paint"].numericValue,
    cls: audits["cumulative-layout-shift"].numericValue,
    tbtMs: audits["total-blocking-time"].numericValue,
    failedAudits: Object.entries(audits)
      .filter(([, audit]) => audit.score !== null && audit.score < 1)
      .map(([id, audit]) => ({
        id,
        title: audit.title,
        score: audit.score,
        displayValue: audit.displayValue,
      })),
  };
  writeFileSync(
    "artifacts/performance-summary.json",
    JSON.stringify(summary, null, 2),
  );
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}

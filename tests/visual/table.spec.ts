import { test, expect } from "@playwright/test";

test("Token table pixel-perfect", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Wait for skeleton + fetch
  await page.waitForTimeout(1500);

  const screenshot = await page.screenshot();
  expect(screenshot).toMatchSnapshot("token-table.png", { maxDiffPixels: 2 });
});

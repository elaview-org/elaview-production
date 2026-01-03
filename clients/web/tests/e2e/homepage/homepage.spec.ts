import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  
  test("should have correct metadata and elements", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page).toHaveTitle("Elaview - Advertising Marketplace");
  });
});



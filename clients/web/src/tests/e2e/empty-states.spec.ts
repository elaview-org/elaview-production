import { test, expect } from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";

test.describe("Empty States", () => {
  test.describe("Advertiser", () => {
    test.beforeEach(async ({ page, testUser }) => {
      await loginViaUi(page, testUser);
      // New users default to Advertiser
    });

    test("campaigns page shows empty state", async ({ page }) => {
      await page.goto("/campaigns");
      await expect(page.getByText("No campaigns yet")).toBeVisible();
    });

    test("bookings page shows empty state", async ({ page }) => {
      await page.goto("/bookings");
      await expect(page.getByText("No bookings yet")).toBeVisible();
    });

    test("spending page shows empty state", async ({ page }) => {
      await page.goto("/spending");
      await expect(page.getByText("No payments found")).toBeVisible();
    });
  });

  test.describe("Space Owner", () => {
    test.beforeEach(async ({ page, testUser }) => {
      await loginViaUi(page, testUser);
      // Switch to Space Owner
      await page
        .locator("[data-slot='sidebar-footer'] a[href='/profile']")
        .click();
      await page
        .getByRole("menuitem", { name: /Switch to Space Owner/ })
        .click();
      await page.waitForURL("**/overview");
    });

    test("listings page shows no spaces state", async ({ page }) => {
      const link = page
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Listings" })
        .locator("a");
      await link.waitFor({ state: "visible" });
      await link.click();
      await page.waitForLoadState("networkidle");
      // Listings page always renders toolbar; check for "New Space" button
      await expect(
        page.getByRole("button", { name: "New Space" })
      ).toBeVisible();
    });

    test("bookings page shows empty state", async ({ page }) => {
      const link = page
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Bookings" })
        .locator("a");
      await link.waitFor({ state: "visible" });
      await link.click();
      await expect(page.getByText("No bookings yet")).toBeVisible();
    });

    test("earnings page shows empty state", async ({ page }) => {
      const link = page
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Earnings" })
        .locator("a");
      await link.waitFor({ state: "visible" });
      await link.click();
      await expect(page.getByText("No payouts found")).toBeVisible();
    });
  });
});

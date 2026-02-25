import { test, expect } from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";

test.describe("Profile Switching", () => {
  test("user can switch between Space Owner and Advertiser profiles", async ({
    page,
    testUser,
  }) => {
    await loginViaUi(page, testUser);

    // Default profile lands on overview
    await expect(page).toHaveURL(/\/overview/);

    // ---- Switch to Space Owner ----
    await page
      .locator("[data-slot='sidebar-footer'] a[href='/profile']")
      .click();
    await page.getByRole("menuitem", { name: /Switch to Space Owner/ }).click();
    await page.waitForURL("**/overview");

    // Sidebar should show Space Owner nav items
    const sidebar = page.locator("[data-slot='sidebar']");
    await expect(
      sidebar
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Listings" })
    ).toBeVisible();
    await expect(
      sidebar
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Earnings" })
    ).toBeVisible();

    // Advertiser-only items should NOT be visible
    await expect(
      sidebar
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Discover" })
    ).not.toBeVisible();
    await expect(
      sidebar
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Campaigns" })
    ).not.toBeVisible();

    // ---- Switch to Advertiser ----
    await page
      .locator("[data-slot='sidebar-footer'] a[href='/profile']")
      .click();
    await page.getByRole("menuitem", { name: /Switch to Advertiser/ }).click();
    await page.waitForURL("**/overview");

    // Sidebar should show Advertiser nav items
    await expect(
      sidebar
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Discover" })
    ).toBeVisible();
    await expect(
      sidebar
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Campaigns" })
    ).toBeVisible();

    // Space Owner-only items should NOT be visible
    await expect(
      sidebar
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Listings" })
    ).not.toBeVisible();
    await expect(
      sidebar
        .locator("[data-slot='sidebar-menu-item']")
        .filter({ hasText: "Earnings" })
    ).not.toBeVisible();
  });
});

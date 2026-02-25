import { test, expect } from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";

test.describe("Settings — Notifications", () => {
  test.beforeEach(async ({ page, testUser }) => {
    await loginViaUi(page, testUser);
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
  });

  test("notification preferences section is accessible", async ({ page }) => {
    // Settings page uses accordion sections — click to expand Notification Preferences
    const accordion = page.getByRole("button", {
      name: /Notification Preferences/,
    });
    await expect(accordion).toBeVisible();
    await accordion.click();

    // After expanding, should show notification-related content
    await expect(
      page.getByText("Email, push, and in-app notifications")
    ).toBeVisible();
  });

  test("profile section is expanded by default with save button", async ({
    page,
  }) => {
    // Profile Information should be expanded by default
    await expect(page.getByText("Profile Information")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save Changes" })
    ).toBeVisible();
  });
});

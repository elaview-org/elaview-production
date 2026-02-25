import { test, expect } from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";

test.describe("Notifications", () => {
  test.beforeEach(async ({ page, testUser }) => {
    await loginViaUi(page, testUser);
  });

  test("notifications page shows empty state for new user", async ({
    page,
  }) => {
    await page.goto("/notifications");
    await page.waitForLoadState("networkidle");

    // Fresh user should see the empty state
    await expect(page.getByText("No notifications")).toBeVisible();
    await expect(page.getByText("You're all caught up!")).toBeVisible();
  });
});

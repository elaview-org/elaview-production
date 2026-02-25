import path from "node:path";
import { test, expect } from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";

const TEST_IMAGE_PATH = path.resolve(__dirname, "assets/test.png");
const MOCK_AVATAR_URL =
  "https://res.cloudinary.com/demo/image/upload/v1/elaview-e2e-avatar.jpg";

test.describe("Avatar Upload", () => {
  test.beforeEach(async ({ page }) => {
    // Mock Cloudinary upload for avatars
    await page.route("**/storage/upload-signature", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          signature: "dummy-sig",
          timestamp: 12345678,
          apiKey: "dummy-key",
          cloudName: "dummy-cloud",
          folder: "avatars",
        }),
      });
    });

    await page.route(
      "https://api.cloudinary.com/v1_1/**/image/upload",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ secure_url: MOCK_AVATAR_URL }),
        });
      }
    );
  });

  test("user can upload a profile avatar", async ({ page, testUser }) => {
    await loginViaUi(page, testUser);
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    // Verify "Change Photo" button exists
    await expect(
      page.getByRole("button", { name: "Change Photo" })
    ).toBeVisible();

    // Upload avatar via the hidden file input
    const fileInput = page.locator('input[type="file"][accept*="image"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);

    // Wait for upload to complete (button text changes during upload)
    await expect(
      page.getByRole("button", { name: "Change Photo" })
    ).toBeVisible({ timeout: 10000 });
  });
});

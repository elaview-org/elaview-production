import path from "node:path";
import { test, expect } from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";

const TEST_IMAGE_PATH = path.resolve(__dirname, "assets/test.png");
const MOCK_IMAGE_URL =
  "https://res.cloudinary.com/demo/image/upload/v1/elaview-e2e-campaign.jpg";

function formatDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

test.describe("Create Campaign", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page, testUser }) => {
    await page.route("**/storage/upload-signature", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          signature: "dummy-sig",
          timestamp: 12345678,
          apiKey: "dummy-key",
          cloudName: "dummy-cloud",
          folder: "campaigns",
        }),
      });
    });

    await page.route(
      "https://api.cloudinary.com/v1_1/**/image/upload",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ secure_url: MOCK_IMAGE_URL }),
        });
      }
    );

    await loginViaUi(page, testUser);
    await page.goto("/campaigns");
    await page.waitForLoadState("networkidle");
  });

  test("requires campaign name", async ({ page }) => {
    await page.getByRole("button", { name: "New Campaign" }).click();
    await page
      .getByRole("dialog", { name: "Create New Campaign" })
      .waitFor({ state: "visible" });

    // Name field starts undefined, so Zod shows a type error
    await page.getByRole("button", { name: "Continue" }).click();
    const nameError = page.locator(".text-destructive").first();
    await expect(nameError).toBeVisible();
  });

  test("requires minimum budget of $100", async ({ page }) => {
    await page.getByRole("button", { name: "New Campaign" }).click();
    await page
      .getByRole("dialog", { name: "Create New Campaign" })
      .waitFor({ state: "visible" });

    await page.getByPlaceholder("e.g., Spring Sale 2026").fill("Test Campaign");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByPlaceholder("5000").fill("50");
    const startInput = page.locator('input[type="date"]').first();
    const endInput = page.locator('input[type="date"]').last();
    await startInput.fill(formatDate(7));
    await endInput.fill(formatDate(37));
    await page.getByRole("button", { name: "Continue" }).click();

    const errors = page
      .locator(".text-destructive")
      .filter({ hasText: "Minimum budget is $100" });
    await expect(errors.first()).toBeVisible();
  });

  test("requires end date after start date", async ({ page }) => {
    await page.getByRole("button", { name: "New Campaign" }).click();
    await page
      .getByRole("dialog", { name: "Create New Campaign" })
      .waitFor({ state: "visible" });

    await page.getByPlaceholder("e.g., Spring Sale 2026").fill("Test Campaign");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByPlaceholder("5000").fill("500");
    const startInput = page.locator('input[type="date"]').first();
    const endInput = page.locator('input[type="date"]').last();
    await startInput.fill(formatDate(30));
    await endInput.fill(formatDate(10));
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(
      page.getByText("End date must be after start date")
    ).toBeVisible();
  });

  test("full campaign creation workflow", async ({ page }) => {
    await page.getByRole("button", { name: "New Campaign" }).click();
    await page
      .getByRole("dialog", { name: "Create New Campaign" })
      .waitFor({ state: "visible" });

    // Step 1: Campaign Details
    await page
      .getByPlaceholder("e.g., Spring Sale 2026")
      .fill("E2E Test Campaign");
    await page
      .getByPlaceholder("Describe what you want to achieve")
      .fill("E2E test description");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: Budget & Schedule
    await expect(page.getByText("Budget & Schedule")).toBeVisible();
    await page.getByPlaceholder("5000").fill("500");
    const startInput = page.locator('input[type="date"]').first();
    const endInput = page.locator('input[type="date"]').last();
    await startInput.fill(formatDate(7));
    await endInput.fill(formatDate(37));
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: Media
    await expect(page.getByText("Campaign Media")).toBeVisible();
    await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH);
    await page
      .locator('img[alt="Campaign creative"]')
      .waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 4: Review
    await expect(page.getByText("Review Campaign")).toBeVisible();
    await expect(page.getByText("E2E Test Campaign")).toBeVisible();
    await expect(page.getByText("$500")).toBeVisible();

    await page.getByRole("button", { name: "Create Campaign" }).click();
  });

  test("cancel closes the campaign modal", async ({ page }) => {
    await page.getByRole("button", { name: "New Campaign" }).click();
    await page
      .getByRole("dialog", { name: "Create New Campaign" })
      .waitFor({ state: "visible" });

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("back button returns to previous step", async ({ page }) => {
    await page.getByRole("button", { name: "New Campaign" }).click();
    await page
      .getByRole("dialog", { name: "Create New Campaign" })
      .waitFor({ state: "visible" });

    await page.getByPlaceholder("e.g., Spring Sale 2026").fill("Test");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Budget & Schedule")).toBeVisible();

    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByText("Campaign Details")).toBeVisible();
  });
});

import path from "node:path";
import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures/two-users";
import {
  test as registeredTest,
  expect as registeredExpect,
} from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";
import { runId } from "./helpers/constants";
import { register } from "./helpers/cleanup-registry";

const TEST_IMAGE_PATH = path.resolve(__dirname, "assets/test.png");
const MOCK_UPLOADED_IMAGE_URL =
  "https://res.cloudinary.com/demo/image/upload/v1/elaview-e2e-space.jpg";

async function uploadTestImage(page: Page) {
  await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH);
  await page.getByText("Cover").waitFor({ state: "visible", timeout: 10000 });
  await page
    .locator('img[alt="Photo 1"]')
    .waitFor({ state: "visible", timeout: 10000 });
}

async function mockImageUploadEndpoints(page: Page) {
  await page.route("**/storage/upload-signature", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        signature: "dummy-sig",
        timestamp: 12345678,
        apiKey: "dummy-key",
        cloudName: "dummy-cloud",
        folder: "spaces",
      }),
    });
  });

  await page.route(
    "https://api.cloudinary.com/v1_1/**/image/upload",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          secure_url: MOCK_UPLOADED_IMAGE_URL,
        }),
      });
    }
  );
}

async function navigateViaSidebar(page: Page, linkName: string) {
  await page.waitForLoadState("domcontentloaded");
  const item = page
    .locator("[data-slot='sidebar-menu-item']")
    .filter({ hasText: linkName })
    .locator("a");
  await item.waitFor({ state: "visible", timeout: 10000 });
  await item.click();
}

async function switchToSpaceOwner(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.locator("[data-slot='sidebar-footer'] a[href='/profile']").click();
  await page.getByRole("menuitem", { name: /Switch to Space Owner/ }).click();
  await page.waitForURL("**/overview");
}

async function switchToAdvertiser(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.locator("[data-slot='sidebar-footer'] a[href='/profile']").click();
  await page.getByRole("menuitem", { name: /Switch to Advertiser/ }).click();
  await page.waitForURL("**/overview");
}

test.describe("Create Space", () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await mockImageUploadEndpoints(page);
  });

  test("space owner can create and publish a space", async ({
    page,
    userA,
  }) => {
    const spaceTitle = `E2E Space ${runId}-${Date.now()}`;

    await loginViaUi(page, userA);
    await switchToSpaceOwner(page);
    await navigateViaSidebar(page, "Listings");

    await page.getByRole("button", { name: "New Space" }).click();

    // Step 1: Photos
    await uploadTestImage(page);
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: Details
    await page.getByRole("button", { name: "Window Display" }).click();
    await page
      .getByPlaceholder("e.g., Downtown Coffee Shop Window")
      .fill(spaceTitle);
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: Location
    await page.getByPlaceholder("123 Main Street").fill("350 5th Ave");
    await page.getByPlaceholder("San Francisco").fill("New York");
    await page.getByPlaceholder("CA").fill("NY");
    await page.getByPlaceholder("94102").fill("10118");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 4: Pricing
    await page.getByPlaceholder("25").fill("25");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 5: Review
    await expect(page.getByText(spaceTitle)).toBeVisible();

    // Publish
    await page.getByRole("button", { name: "Publish Listing" }).click();
    await page.waitForURL(/\/listings\/.+/, { timeout: 60000 });
    const spaceId = page.url().split("/listings/")[1].split(/[?#]/)[0];

    register({
      type: "space",
      id: spaceId,
      email: userA.email,
      password: userA.password,
    });

    // Verify space appears in listings
    await navigateViaSidebar(page, "Listings");
    await expect(page.getByText(spaceTitle)).toBeVisible();
  });

  test("created space is discoverable by another user", async ({
    page,
    userA,
    userB,
  }) => {
    const spaceTitle = `E2E Discover ${runId}-${Date.now()}`;

    // User A creates a space
    await loginViaUi(page, userA);
    await switchToSpaceOwner(page);
    await navigateViaSidebar(page, "Listings");

    await page.getByRole("button", { name: "New Space" }).click();
    await uploadTestImage(page);
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Window Display" }).click();
    await page
      .getByPlaceholder("e.g., Downtown Coffee Shop Window")
      .fill(spaceTitle);
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByPlaceholder("123 Main Street").fill("350 5th Ave");
    await page.getByPlaceholder("San Francisco").fill("New York");
    await page.getByPlaceholder("CA").fill("NY");
    await page.getByPlaceholder("94102").fill("10118");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByPlaceholder("25").fill("25");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Publish Listing" }).click();
    await page.waitForURL(/\/listings\/.+/, { timeout: 60000 });
    const spaceId = page.url().split("/listings/")[1].split(/[?#]/)[0];

    register({
      type: "space",
      id: spaceId,
      email: userA.email,
      password: userA.password,
    });

    // Logout user A, login as user B
    await page.goto("/logout");
    await page.waitForURL(/\/login/, { timeout: 30000 });
    await loginViaUi(page, userB);

    // User B is already an Advertiser by default — go to Discover
    await page.goto("/discover");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Search spaces...").fill(spaceTitle);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(spaceTitle)).toBeVisible({ timeout: 30000 });
  });
});
//
registeredTest.describe("Create Space Validation", () => {
  registeredTest.setTimeout(120000);
  //

  //
  registeredTest.beforeEach(async ({ page, testUser }) => {
    await mockImageUploadEndpoints(page);
    await loginViaUi(page, testUser);
    await switchToSpaceOwner(page);
    await navigateViaSidebar(page, "Listings");
    await page
      .getByRole("button", { name: "New Space" })
      .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "New Space" }).click();
    await page
      .getByRole("dialog", { name: "Create New Space" })
      .waitFor({ state: "visible" });
    await page
      .getByRole("button", { name: "Continue" })
      .waitFor({ state: "visible" });
    await page.waitForTimeout(500); // Let dialog animations and signature fetch settle
  });
  //
  registeredTest("requires at least one photo", async ({ page }) => {
    await page.getByRole("button", { name: "Continue" }).click();
    await registeredExpect(
      page.getByText("At least one photo is required")
    ).toBeVisible();
  });
  //
  registeredTest("requires space type and title", async ({ page }) => {
    await uploadTestImage(page);
    await page.getByRole("button", { name: "Continue" }).click();
    //
    await page.getByRole("button", { name: "Continue" }).click();
    await registeredExpect(
      page.getByText("Space type is required")
    ).toBeVisible();
    await registeredExpect(page.getByText("Title is required")).toBeVisible();
  });
  //
  registeredTest("requires location fields", async ({ page }) => {
    await uploadTestImage(page);
    await page.getByRole("button", { name: "Continue" }).click();
    //
    await page.getByRole("button", { name: "Window Display" }).click();
    await page
      .getByPlaceholder("e.g., Downtown Coffee Shop Window")
      .fill("Test");
    await page.getByRole("button", { name: "Continue" }).click();
    //
    await page.getByRole("button", { name: "Continue" }).click();
    await registeredExpect(page.getByText("Address is required")).toBeVisible();
    await registeredExpect(page.getByText("City is required")).toBeVisible();
    await registeredExpect(
      page.getByText("State must be 2 characters")
    ).toBeVisible();
  });
  //
  registeredTest("requires daily rate", async ({ page }) => {
    await uploadTestImage(page);
    await page.getByRole("button", { name: "Continue" }).click();
    //
    await page.getByRole("button", { name: "Window Display" }).click();
    await page
      .getByPlaceholder("e.g., Downtown Coffee Shop Window")
      .fill("Test");
    await page.getByRole("button", { name: "Continue" }).click();
    //
    await page.getByPlaceholder("123 Main Street").fill("123 Test St");
    await page.getByPlaceholder("San Francisco").fill("Test City");
    await page.getByPlaceholder("CA").fill("TX");
    await page.getByRole("button", { name: "Continue" }).click();
    //
    await page.getByRole("button", { name: "Continue" }).click();
    await registeredExpect(
      page.getByText("Daily rate must be at least $1")
    ).toBeVisible();
  });
  //
  registeredTest("title enforces max length", async ({ page }) => {
    await uploadTestImage(page);
    await page.getByRole("button", { name: "Continue" }).click();
    //
    const titleInput = page.getByPlaceholder(
      "e.g., Downtown Coffee Shop Window"
    );
    await titleInput.fill("a".repeat(101));
    //
    const value = await titleInput.inputValue();
    registeredExpect(value.length).toBe(100);
    await registeredExpect(page.getByText("100/100")).toBeVisible();
  });
  //
  registeredTest("cancel closes the modal", async ({ page }) => {
    await page.getByRole("button", { name: "Cancel" }).click();
    await registeredExpect(page.getByRole("dialog")).not.toBeVisible();
  });
  //
  registeredTest("back button returns to previous step", async ({ page }) => {
    await uploadTestImage(page);
    await page.getByRole("button", { name: "Continue" }).click();
    await registeredExpect(
      page.getByText("What type of space is this?")
    ).toBeVisible();
    //
    await page.getByRole("button", { name: "Back" }).click();
    await registeredExpect(
      page.getByText("Add photos of your space")
    ).toBeVisible();
  });
  //
  registeredTest("uploaded images have valid URLs", async ({ page }) => {
    await uploadTestImage(page);
    const img = page.locator('img[alt="Photo 1"]');
    const src = await img.getAttribute("src");
    registeredExpect(src).toBeTruthy();
    const originalUrl =
      new URL(src!, "http://localhost:3000").searchParams.get("url") ?? src!;
    registeredExpect(originalUrl).toContain("https://");
  });
});

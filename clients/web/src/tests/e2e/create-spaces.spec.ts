import fs from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

const workerIdx = process.env.TEST_WORKER_INDEX ?? "0";
const TEST_IMAGE_PATH = path.resolve(
  __dirname,
  `assets/test-space-${workerIdx}.jpg`
);

async function downloadTestImage() {
  fs.mkdirSync(path.dirname(TEST_IMAGE_PATH), { recursive: true });
  const res = await fetch("https://picsum.photos/200/200.jpg");
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(TEST_IMAGE_PATH, buffer);
}

function cleanupTestImage() {
  if (fs.existsSync(TEST_IMAGE_PATH)) fs.unlinkSync(TEST_IMAGE_PATH);
}

async function uploadTestImage(page: Page) {
  await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE_PATH);
  await page
    .locator('img[alt="Photo 1"]')
    .waitFor({ state: "visible", timeout: 100000 });
}

async function navigateViaSidebar(page: Page, linkName: string) {
  await page
    .locator("[data-slot='sidebar-menu-item']")
    .filter({ hasText: linkName })
    .locator("a")
    .click();
}

async function switchToSpaceOwner(page: Page) {
  await page.locator("[data-slot='sidebar-footer'] a[href='/profile']").click();
  await page.getByRole("menuitem", { name: /Switch to Space Owner/ }).click();
  await page.waitForURL("**/overview");
}

async function switchToAdvertiser(page: Page) {
  await page.locator("[data-slot='sidebar-footer'] a[href='/profile']").click();
  await page.getByRole("menuitem", { name: /Switch to Advertiser/ }).click();
  await page.waitForURL("**/overview");
}

// test.describe.serial("Create Space", () => {
//   test.setTimeout(120000);
//
//   let spaceTitle: string;
//   let spaceId: string;
//
//   test.beforeAll(async () => {
//     await downloadTestImage();
//   });
//
//   test.afterAll(() => {
//     cleanupTestImage();
//   });
//
//   test("space owner creates a new space", async ({ page, userA }) => {
//     spaceTitle = `E2E Space ${runId}`;
//     await loginViaUi(page, userA);
//     await switchToSpaceOwner(page);
//     await navigateViaSidebar(page, "Listings");
//
//     await page.getByRole("button", { name: "New Space" }).click();
//
//     await uploadTestImage(page);
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await page.getByRole("button", { name: "Window Display" }).click();
//     await page
//       .getByPlaceholder("e.g., Downtown Coffee Shop Window")
//       .fill(spaceTitle);
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await page.getByPlaceholder("123 Main Street").fill("100 E2E Test Ave");
//     await page.getByPlaceholder("San Francisco").fill("Testville");
//     await page.getByPlaceholder("CA").fill("TX");
//     await page.getByPlaceholder("94102").fill("75001");
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await page.getByPlaceholder("25").fill("25");
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await expect(page.getByText(spaceTitle)).toBeVisible();
//
//     await page.getByRole("button", { name: "Publish Listing" }).click();
//     await page.waitForURL(/\/listings\/.+/, { timeout: 60000 });
//     spaceId = page.url().split("/listings/")[1].split(/[?#]/)[0];
//
//     register({
//       type: "space",
//       id: spaceId,
//       email: userA.email,
//       password: userA.password,
//     });
//   });
//
//   test("space appears in owner's listings", async ({ page, userA }) => {
//     await loginViaUi(page, userA);
//     await switchToSpaceOwner(page);
//     await navigateViaSidebar(page, "Listings");
//     await expect(page.getByText(spaceTitle)).toBeVisible();
//   });
//
//   test("owner cannot see own space as advertiser", async ({ page, userA }) => {
//     await loginViaUi(page, userA);
//     await switchToAdvertiser(page);
//     await navigateViaSidebar(page, "Discover");
//
//     await page.getByPlaceholder("Search spaces...").fill(spaceTitle);
//     await page.waitForLoadState("networkidle");
//
//     await expect(page.getByText(spaceTitle)).not.toBeVisible();
//   });
//
//   test("different user sees the space in discover", async ({ page, userB }) => {
//     await loginViaUi(page, userB);
//     await switchToAdvertiser(page);
//     await navigateViaSidebar(page, "Discover");
//
//     await page.getByPlaceholder("Search spaces...").fill(spaceTitle);
//     await page.waitForLoadState("networkidle");
//
//     await expect(page.getByText(spaceTitle)).toBeVisible();
//   });
// });
//
// registeredTest.describe("Create Space Validation", () => {
//   registeredTest.setTimeout(120000);
//
//   registeredTest.beforeAll(async () => {
//     await downloadTestImage();
//   });
//
//   registeredTest.afterAll(() => {
//     cleanupTestImage();
//   });
//
//   registeredTest.beforeEach(async ({ page, testUser }) => {
//     await loginViaUi(page, testUser);
//     await switchToSpaceOwner(page);
//     await navigateViaSidebar(page, "Listings");
//     await page.getByRole("button", { name: "New Space" }).waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "New Space" }).click();
//     await page.getByRole("dialog", { name: "Create New Space" }).waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Continue" }).waitFor({ state: "visible" });
//   });
//
//   registeredTest("requires at least one photo", async ({ page }) => {
//     await page.getByRole("button", { name: "Continue" }).click();
//     await registeredExpect(
//       page.getByText("At least one photo is required")
//     ).toBeVisible();
//   });
//
//   registeredTest("requires space type and title", async ({ page }) => {
//     await uploadTestImage(page);
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await page.getByRole("button", { name: "Continue" }).click();
//     await registeredExpect(
//       page.getByText("Space type is required")
//     ).toBeVisible();
//     await registeredExpect(page.getByText("Title is required")).toBeVisible();
//   });
//
//   registeredTest("requires location fields", async ({ page }) => {
//     await uploadTestImage(page);
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await page.getByRole("button", { name: "Window Display" }).click();
//     await page
//       .getByPlaceholder("e.g., Downtown Coffee Shop Window")
//       .fill("Test");
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await page.getByRole("button", { name: "Continue" }).click();
//     await registeredExpect(page.getByText("Address is required")).toBeVisible();
//     await registeredExpect(page.getByText("City is required")).toBeVisible();
//     await registeredExpect(
//       page.getByText("State must be 2 characters")
//     ).toBeVisible();
//   });
//
//   registeredTest("requires daily rate", async ({ page }) => {
//     await uploadTestImage(page);
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await page.getByRole("button", { name: "Window Display" }).click();
//     await page
//       .getByPlaceholder("e.g., Downtown Coffee Shop Window")
//       .fill("Test");
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await page.getByPlaceholder("123 Main Street").fill("123 Test St");
//     await page.getByPlaceholder("San Francisco").fill("Test City");
//     await page.getByPlaceholder("CA").fill("TX");
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     await page.getByRole("button", { name: "Continue" }).click();
//     await registeredExpect(
//       page.getByText("Daily rate must be at least $1")
//     ).toBeVisible();
//   });
//
//   registeredTest("title enforces max length", async ({ page }) => {
//     await uploadTestImage(page);
//     await page.getByRole("button", { name: "Continue" }).click();
//
//     const titleInput = page.getByPlaceholder(
//       "e.g., Downtown Coffee Shop Window"
//     );
//     await titleInput.fill("a".repeat(101));
//
//     const value = await titleInput.inputValue();
//     registeredExpect(value.length).toBe(100);
//     await registeredExpect(page.getByText("100/100")).toBeVisible();
//   });
//
//   registeredTest("cancel closes the modal", async ({ page }) => {
//     await page.getByRole("button", { name: "Cancel" }).click();
//     await registeredExpect(page.getByRole("dialog")).not.toBeVisible();
//   });
//
//   registeredTest("back button returns to previous step", async ({ page }) => {
//     await uploadTestImage(page);
//     await page.getByRole("button", { name: "Continue" }).click();
//     await registeredExpect(
//       page.getByText("What type of space is this?")
//     ).toBeVisible();
//
//     await page.getByRole("button", { name: "Back" }).click();
//     await registeredExpect(
//       page.getByText("Add photos of your space")
//     ).toBeVisible();
//   });
//
//   registeredTest("uploaded images have valid URLs", async ({ page }) => {
//     await uploadTestImage(page);
//     const img = page.locator('img[alt="Photo 1"]');
//     const src = await img.getAttribute("src");
//     registeredExpect(src).toBeTruthy();
//     const originalUrl =
//       new URL(src!, "http://localhost:3000").searchParams.get("url") ?? src!;
//     registeredExpect(originalUrl).toContain("https://");
//   });
// });

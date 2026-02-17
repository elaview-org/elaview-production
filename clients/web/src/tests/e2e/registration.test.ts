import { expect, test } from "./fixtures/test-user";

test.describe("Registration", () => {
  test("successful signup redirects to dashboard", async ({
    page,
    testUser,
  }) => {
    await page.goto("/signup");

    await page.getByLabel("Full Name").fill(testUser.name);
    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password", { exact: true }).fill(testUser.password);
    await page.getByLabel("Confirm Password").fill(testUser.password);
    await page.getByRole("button", { name: "Create Account" }).click();

    await page.waitForURL("**/overview");
    await expect(page.locator("[data-slot='sidebar']")).toBeVisible();
  });

  test("mismatched passwords shows validation error", async ({
    page,
    testUser,
  }) => {
    await page.goto("/signup");

    await page.getByLabel("Full Name").fill(testUser.name);
    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password", { exact: true }).fill(testUser.password);
    await page.getByLabel("Confirm Password").fill("DifferentPassword!999");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("duplicate email shows registration error", async ({
    page,
    testUser,
  }) => {
    await page.goto("/signup");
    await page.getByLabel("Full Name").fill(testUser.name);
    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password", { exact: true }).fill(testUser.password);
    await page.getByLabel("Confirm Password").fill(testUser.password);
    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL("**/overview");

    await page.goto("/logout");
    await page.waitForURL("**/login");

    await page.goto("/signup");
    await page.getByLabel("Full Name").fill(testUser.name);
    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password", { exact: true }).fill(testUser.password);
    await page.getByLabel("Confirm Password").fill(testUser.password);
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByText("Registration failed")).toBeVisible();
  });
});

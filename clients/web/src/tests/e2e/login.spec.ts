import { expect, test } from "./fixtures/registered-user";

test.describe("Login", () => {
  test("successful login redirects to dashboard", async ({
    page,
    testUser,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password").fill(testUser.password);
    await page.getByRole("button", { name: "Login", exact: true }).click();

    await page.waitForURL("**/overview");
    await expect(page.locator("[data-slot='sidebar']")).toBeVisible();
  });

  test("wrong password shows error", async ({ page, testUser }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password").fill("WrongPassword!999");
    await page.getByRole("button", { name: "Login", exact: true }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Authentication failed")).toBeVisible();
  });

  test("non-existent account shows error", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("nonexistent@test.elaview.local");
    await page.getByLabel("Password").fill("SomePassword!999");
    await page.getByRole("button", { name: "Login", exact: true }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Authentication failed")).toBeVisible();
  });
});

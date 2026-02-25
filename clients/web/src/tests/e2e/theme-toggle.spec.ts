import { test, expect } from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";

test.describe("Theme Toggling", () => {
  test("user can switch between light and dark themes", async ({
    page,
    testUser,
  }) => {
    await loginViaUi(page, testUser);

    // Open theme dropdown and switch to Dark
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Dark" }).click();

    // next-themes sets a `data-theme` or `style` attribute — check via colorScheme
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Open dropdown again and switch to Light
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Light" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("theme persists after page reload", async ({ page, testUser }) => {
    await loginViaUi(page, testUser);

    // Switch to Dark
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Reload and verify persistence
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

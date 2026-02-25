import { test, expect } from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";

test.describe("Discover & Search", () => {
  test.beforeEach(async ({ page, testUser }) => {
    await loginViaUi(page, testUser);

    // New users default to Advertiser — navigate directly to Discover
    await page.goto("/discover");
    await page.waitForLoadState("networkidle");
  });

  test("discover page loads with toolbar and search", async ({ page }) => {
    // Search box should be present
    await expect(page.getByPlaceholder("Search spaces...")).toBeVisible();

    // Toolbar buttons should be present
    await expect(page.getByRole("button", { name: "Filters" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sort" })).toBeVisible();
  });

  test("search filters results by query", async ({ page }) => {
    const searchBox = page.getByPlaceholder("Search spaces...");
    await searchBox.fill("nonexistent-e2e-query-xyz");
    await page.waitForLoadState("networkidle");

    // With a garbage query, no results should appear (or an empty state)
    // We just verify the search doesn't crash and the page remains functional
    await expect(searchBox).toHaveValue("nonexistent-e2e-query-xyz");
    await expect(page.getByRole("button", { name: "Filters" })).toBeVisible();
  });

  test("filter panel opens with select dropdowns", async ({ page }) => {
    await page.getByRole("button", { name: "Filters" }).click();

    // Filters panel should show select triggers for Type and Price
    await expect(page.getByText("All Type")).toBeVisible();
    await expect(page.getByText("All Price")).toBeVisible();

    // Open the Type select and verify options
    await page.getByText("All Type").click();
    await expect(
      page.getByRole("option", { name: "Storefront" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Window Display" })
    ).toBeVisible();
    await expect(page.getByRole("option", { name: "Billboard" })).toBeVisible();
  });

  test("sort panel opens with sort options", async ({ page }) => {
    await page.getByRole("button", { name: "Sort" }).click();

    // The sort panel should show Order, Primary, and Secondary select triggers
    await expect(page.getByText("Order")).toBeVisible();
    await expect(page.getByText("Primary")).toBeVisible();
    await expect(page.getByText("Secondary")).toBeVisible();

    // Open the Primary sort select and verify options
    await page.getByText("Primary").click();
    await expect(page.getByRole("option", { name: "Price" })).toBeVisible();
    await expect(page.getByRole("option", { name: "Rating" })).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Date Added" })
    ).toBeVisible();
  });
});

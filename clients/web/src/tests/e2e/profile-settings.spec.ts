import { test, expect } from "./fixtures/registered-user";
import { loginViaUi } from "./helpers/auth";

test.describe("Profile Settings", () => {
  test("user can update their profile information", async ({
    page,
    testUser,
  }) => {
    // 1. Login
    await loginViaUi(page, testUser);

    // 2. Navigate to Settings
    await page.goto("/settings");

    // 3. Verify initial state
    await expect(page.getByLabel("Full Name")).toHaveValue(testUser.name);
    await expect(page.getByLabel("Email Address")).toHaveValue(testUser.email);

    // 4. Update data
    const newName = `Updated ${testUser.name}`;
    const newPhone = "5551234567";

    await page.getByLabel("Full Name").fill(newName);
    await page.getByLabel("Phone Number").fill(newPhone);

    // 5. Save changes
    await page.getByRole("button", { name: "Save Changes" }).click();

    // 6. Verify success toast
    await expect(page.getByText("Profile updated successfully")).toBeVisible();

    // 7. Verify persistence after reload
    await page.reload();
    await expect(page.getByLabel("Full Name")).toHaveValue(newName);
    await expect(page.getByLabel("Phone Number")).toHaveValue(newPhone);
  });
});

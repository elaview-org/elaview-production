import type { Page } from "@playwright/test";

export async function loginViaUi(
  page: Page,
  user: { email: string; password: string }
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await page.waitForURL("**/overview");
}

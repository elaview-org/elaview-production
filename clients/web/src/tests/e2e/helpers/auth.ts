import type { Page } from "@playwright/test";

export async function loginViaUi(
  page: Page,
  user: { email: string; password: string }
) {
  await page.goto("/login");
  await page.waitForURL(/\/login/, { timeout: 30000 });

  const emailInput = page.getByLabel("Email");
  await emailInput.waitFor({ state: "visible", timeout: 15000 });
  await emailInput.fill(user.email);

  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await page.waitForURL("**/overview", { timeout: 30000 });
}

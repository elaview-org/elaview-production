import { expect, test as base } from "./base";

type Fixtures = {
  signup: (credentials: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  setup: async ({ page }, use) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign Up", exact: true }).click();
    await use();
  },
  signup: async ({ page }, use) => {
    await use(async ({ name, email, password }) => {
      await page.getByLabel("Full Name").fill(name);
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password", { exact: true }).fill(password);
      await page.getByLabel("Confirm Password", { exact: true }).fill(password);
      await page.getByRole("button", { name: "Create Account" }).click();
    });
  },
});

export { expect };

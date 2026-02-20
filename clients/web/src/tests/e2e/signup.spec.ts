import { expect, test } from "./fixtures/signup";

test.describe("Sign up", () => {
  test("Successfully register a new user", async ({ page, seed, signup }) => {
    await signup({
      name: "Test User",
      email: `e2e_${seed}@elaview.local.test`,
      password: seed,
    });

    await expect(page).toHaveURL("/overview");
  });
});

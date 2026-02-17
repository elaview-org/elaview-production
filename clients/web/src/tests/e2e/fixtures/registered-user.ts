import { test as base } from "./test-user";
import { registerViaApi } from "../helpers/api";

export const test = base.extend<{}>({
  testUser: async ({ testUser }, use) => {
    await registerViaApi(testUser);
    await use(testUser);
  },
});

export { expect } from "@playwright/test";

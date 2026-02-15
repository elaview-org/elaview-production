import { test as base } from "@playwright/test";
import { e2eDefaultPassword, e2eDomain, runId } from "../helpers/constants";
import { register } from "../helpers/cleanup-registry";

type TestUser = {
  name: string;
  email: string;
  password: string;
};

export const test = base.extend<{ testUser: TestUser }>({
  testUser: async ({}, use) => {
    const suffix = Math.random().toString(36).slice(2, 8);
    const user: TestUser = {
      name: `E2E Test ${runId}-${suffix}`,
      email: `e2e-${runId}-${suffix}@${e2eDomain}`,
      password: e2eDefaultPassword,
    };
    register({ type: "account", email: user.email, password: user.password });
    await use(user);
  },
});

export { expect } from "@playwright/test";

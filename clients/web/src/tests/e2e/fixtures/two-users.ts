import { test as base } from "@playwright/test";
import { e2eDefaultPassword, e2eDomain, runId } from "../helpers/constants";
import { register } from "../helpers/cleanup-registry";
import { registerViaApi } from "../helpers/api";

type TestUser = {
  name: string;
  email: string;
  password: string;
};

type TwoUsersFixture = {
  userA: TestUser;
  userB: TestUser;
};

export const test = base.extend<TwoUsersFixture>({
  userA: async ({}, use) => {
    const suffix = Math.random().toString(36).slice(2, 8);
    const user: TestUser = {
      name: `E2E UserA ${runId}-${suffix}`,
      email: `e2e-a-${runId}-${suffix}@${e2eDomain}`,
      password: e2eDefaultPassword,
    };
    register({ type: "account", email: user.email, password: user.password });
    await registerViaApi(user);
    await use(user);
  },

  userB: async ({}, use) => {
    const suffix = Math.random().toString(36).slice(2, 8);
    const user: TestUser = {
      name: `E2E UserB ${runId}-${suffix}`,
      email: `e2e-b-${runId}-${suffix}@${e2eDomain}`,
      password: e2eDefaultPassword,
    };
    register({ type: "account", email: user.email, password: user.password });
    await registerViaApi(user);
    await use(user);
  },
});

export { expect } from "@playwright/test";

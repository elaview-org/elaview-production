import { expect, test as base } from "@playwright/test";
import assert from "node:assert";

type Fixtures = {
  seed: string;
};

export const test = base.extend<Fixtures>({
  seed: async ({}, use) => {
    assert(!!process.env.ELAVIEW_E2E_GLOBAL_SEED);
    await use(process.env.ELAVIEW_E2E_GLOBAL_SEED);
  },
});

export { expect };

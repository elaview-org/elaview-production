import { expect, test as base } from "@playwright/test";

type Fixtures = {
  seed: string;
};

export const test = base.extend<Fixtures>({
  seed: async ({}, use) => {
    await use(Math.random().toString(36).slice(2, 10));
  },
});

export { expect };

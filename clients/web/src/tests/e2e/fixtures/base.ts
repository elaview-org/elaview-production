import type { TestType } from "@playwright/test";
import { expect, test as playwright } from "@playwright/test";
import assert from "node:assert";

const _base = playwright.extend<{ seed: string }>({
  seed: async ({}, use) => {
    assert(!!process.env.ELAVIEW_E2E_GLOBAL_SEED);
    await use(process.env.ELAVIEW_E2E_GLOBAL_SEED);
  },
});

type TestArgs = typeof _base extends TestType<infer F, any> ? F : never;
type WorkerArgs = typeof _base extends TestType<any, infer W> ? W : never;
type SetupFn = (args: TestArgs, use: () => Promise<void>) => Promise<void>;
type FixtureDefs<T> = {
  [K in keyof T]: (
    args: TestArgs & T,
    use: (value: T[K]) => Promise<void>
  ) => Promise<void>;
};

const _extend = _base.extend.bind(_base);

function extend<T extends Record<string, any>>(
  fixtures: { setup?: SetupFn } & FixtureDefs<T>
): TestType<TestArgs & T, WorkerArgs> {
  const { setup, ...rest } = fixtures as any;
  if (setup) {
    rest.setup = [setup, { auto: true }];
  }
  return _extend(rest);
}

export const test = Object.assign(_base, { extend }) as Omit<
  typeof _base,
  "extend"
> & {
  extend: typeof extend;
};

export { expect };

import { randomUUID } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";

process.env.ELAVIEW_E2E_GLOBAL_SEED ??= randomUUID()
  .replace(/-/g, "")
  .slice(0, 12);

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./tests/e2e/results",
  globalSetup: "./tests/e2e/utils/global-setup.ts",
  globalTeardown: "./tests/e2e/utils/global-teardown.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : "100%",
  reporter: [["html", { outputFolder: "./tests/e2e/reports" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});

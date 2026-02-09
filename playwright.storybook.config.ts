import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/storybook",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",

  webServer: {
    command: "npm run storybook -- --port 6006 --no-open",
    url: "http://localhost:6006",
    reuseExistingServer: true,
    timeout: 120000,
  },

  use: {
    baseURL: process.env.PW_STORYBOOK_BASE_URL || "http://localhost:6006",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

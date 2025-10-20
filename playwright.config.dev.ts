import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for local development
 * Assumes dev server is already running on port 3002
 *
 * Usage:
 *   Terminal 1: npm start
 *   Terminal 2: npm run test:e2e
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",

  use: {
    baseURL: process.env.PW_BASE_URL || "http://localhost:3002",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile/tablet testing
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "tablet",
      use: { ...devices["iPad Pro"] },
    },
  ],
});

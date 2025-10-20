import { defineConfig, devices } from "@playwright/test";

/**
 * Main Playwright config - delegates to dev or CI config
 *
 * Development: Uses playwright.config.dev.ts (requires manual server)
 * CI/CD: Use playwright.config.ci.ts (auto-starts server)
 *
 * For most cases, use the specific configs directly:
 *   npm run test:e2e       (dev config)
 *   npm run test:e2e:ci    (ci config)
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",

  // No webServer - requires manual start for fast development
  // Start with: npm start

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

import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for CI/CD environments
 * Auto-starts and manages dev server
 *
 * Usage:
 *   npm run test:e2e:ci
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false, // Sequential in CI for stability
  forbidOnly: true,
  retries: 2, // Retry flaky tests in CI
  workers: 1, // Single worker in CI to reduce resource usage
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results.json" }],
  ],

  webServer: {
    command: "npm start",
    url: "http://localhost:3002",
    reuseExistingServer: false, // Always start fresh in CI
    timeout: 120000, // 2 minutes for initial build
    stdout: "pipe", // Capture output
    stderr: "pipe",
  },

  use: {
    baseURL: "http://localhost:3002",
    trace: "on-first-retry",
    screenshot: "on",
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
  ],
});

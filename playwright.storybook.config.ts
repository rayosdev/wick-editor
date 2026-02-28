import { defineConfig, devices } from "@playwright/test";

const storybookHost = process.env.PW_STORYBOOK_HOST || "127.0.0.1";
const storybookPort = Number(process.env.PW_STORYBOOK_PORT ?? "6006");
const storybookBaseUrl =
  process.env.PW_STORYBOOK_BASE_URL || `http://${storybookHost}:${storybookPort}`;
const useStaticStorybook = process.env.PW_STORYBOOK_STATIC === "1";

export default defineConfig({
  testDir: "./tests/storybook",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: Number(process.env.PW_STORYBOOK_WORKERS ?? "1"),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",

  webServer: {
    command: useStaticStorybook
      ? `npm run build-storybook && python3 -m http.server ${storybookPort} --bind ${storybookHost} --directory storybook-static`
      : `npm run storybook -- --host ${storybookHost} --port ${storybookPort} --no-open`,
    url: storybookBaseUrl,
    reuseExistingServer: true,
    timeout: useStaticStorybook ? 10 * 60 * 1000 : 120000,
  },

  use: {
    baseURL: storybookBaseUrl,
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

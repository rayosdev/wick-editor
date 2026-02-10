// @ts-nocheck - TODO: Remove when properly typing test files
import { test, expect } from "@playwright/test";

test("Check for console errors", async ({ page }) => {
  const errors = [];
  const logs = [];
  // Console error messages that are known, benign warnings we can ignore for E2E
  const ignoredErrorPatterns = [
    /Support for defaultProps will be removed/, // reactstrap warning about defaultProps
    /findDOMNode is deprecated/, // react-sizeme / legacy refs warning
    /Failed %s type: %s%s prop/, // prop-type formatted warning from reactstrap
  ];

  // Patterns to treat as errors even if they appear as warnings or request failures
  const promotedWarningPatterns = [
    /aria-hidden/i,
    /Blocked aria-hidden/i,
    /Ignoring Event/i,
    /plausible/i,
  ];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      // If the error matches an ignored pattern, skip adding it to errors
      const isIgnored = ignoredErrorPatterns.some((rx) => rx.test(text));
      if (!isIgnored) {
        errors.push(text);
      }
    }
    // Promote specific warnings to errors during debugging runs
    if (msg.type() === "warning" || msg.type() === "log") {
      const text = msg.text();
      const isPromoted = promotedWarningPatterns.some((rx) => rx.test(text));
      if (isPromoted) errors.push(`promoted:${text}`);
    }
    logs.push(`${msg.type()}: ${msg.text()}`);
  });

  // Capture network request failures (e.g., blocked analytics requests)
  page.on("requestfailed", (req) => {
    const failure = req.failure();
    const text = failure?.errorText ?? JSON.stringify(failure) ?? "unknown";
    errors.push(`requestfailed: ${req.url()} -> ${text}`);
    logs.push(`requestfailed: ${req.url()} -> ${JSON.stringify(failure)}`);
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  await page.goto("/");

  // Wait a bit for the page to load
  await page.waitForTimeout(5000);

  console.log("Console logs:");
  logs.forEach((log) => console.log(log));

  console.log("\nErrors:");
  errors.forEach((error) => console.log(error));

  // Check if the canvas container exists
  const canvasContainer = page.locator("#canvas-container-wrapper");
  const isVisible = await canvasContainer.isVisible().catch(() => false);

  console.log(`\nCanvas container visible: ${isVisible}`);

  if (errors.length > 0) {
    throw new Error(
      `Found ${errors.length} console errors: ${errors.join(", ")}`
    );
  }
});

import { test, expect } from '@playwright/test';

// Smoke test: navigate to the dev server and ensure the editor UI mounts.
// Adjust the URL if your dev server runs on a different port.
const DEV_URL = process.env.DEV_URL || 'http://localhost:5173';

test('editor loads and main selector appears', async ({ page }) => {
  await page.goto(DEV_URL, { waitUntil: 'networkidle' });

  // Try several common selectors used by the editor to detect that UI mounted.
  const selectors = [
    '#root',
    '#app',
    '.App',
    '.editor',
    '#editor',
    'canvas',
    '.wick-canvas',
  ];

  let found = false;
  for (const sel of selectors) {
    try {
      await page.waitForSelector(sel, { timeout: 5000 });
      found = true;
      break;
    } catch (_) {
      // ignore and try next
    }
  }

  // Save a screenshot for inspection regardless of pass/fail
  await page.screenshot({ path: 'tests/smoke-screenshot.png', fullPage: true });

  expect(found).toBe(true);
});

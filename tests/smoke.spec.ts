import { test, expect } from '@playwright/test';

test.describe('Wick Editor smoke', () => {
  test('loads editor and shows key panels', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('skipWelcomeMessage', 'true');
      } catch {}
    });
    await page.goto('/');
    
    // Wait for editor to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Give React time to render

    // Root element exists
    await expect(page.locator('#root')).toBeVisible();

    // Canvas area renders
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();

    // Timeline area renders
    await expect(page.locator('#animation-timeline-container')).toBeVisible();
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    // Verify Wick engine is loaded
    const wickLoaded = await page.evaluate(() => typeof window.Wick !== 'undefined');
    expect(wickLoaded).toBe(true);
  });
});

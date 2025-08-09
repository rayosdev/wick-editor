import { test, expect } from '@playwright/test';

test.describe('Wick Editor smoke', () => {
  test('loads editor and shows key panels', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('skipWelcomeMessage', 'true');
      } catch {}
    });
    await page.goto('/');

    // Root element exists
    await expect(page.locator('#root')).toBeVisible();

    // Canvas area renders
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();

    // Timeline area renders
    await expect(page.locator('#animation-timeline-container')).toBeVisible();

    // Menu bar has project settings button
    await expect(page.locator('#editor-settings-button')).toBeVisible();

    // Outliner toggle present
    await expect(page.locator('#outliner-toggle')).toBeVisible();
  });
});


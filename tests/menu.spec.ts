import { test, expect } from '@playwright/test';

test('open project settings modal from menu bar', async ({ page }) => {
  await page.addInitScript(() => {
    try { window.localStorage.setItem('skipWelcomeMessage', 'true'); } catch {}
  });
  await page.goto('/');
  await page.locator('#editor-settings-button').click();
  // The settings modal mounts; verify a known control exists
  await expect(page.locator('[class*="settings-modal"], [id*="settings"], text=Settings')).toBeVisible({ timeout: 5000 });
});


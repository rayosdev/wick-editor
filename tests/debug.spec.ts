import { test, expect } from '@playwright/test';

test('Check for console errors', async ({ page }) => {
  const errors = [];
  const logs = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
    logs.push(`${msg.type()}: ${msg.text()}`);
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  await page.goto('http://localhost:3000');

  // Wait a bit for the page to load
  await page.waitForTimeout(5000);

  console.log('Console logs:');
  logs.forEach(log => console.log(log));

  console.log('\nErrors:');
  errors.forEach(error => console.log(error));

  // Check if the canvas container exists
  const canvasContainer = page.locator('#canvas-container-wrapper');
  const isVisible = await canvasContainer.isVisible().catch(() => false);

  console.log(`\nCanvas container visible: ${isVisible}`);

  if (errors.length > 0) {
    throw new Error(`Found ${errors.length} console errors: ${errors.join(', ')}`);
  }
});
import { test, expect } from '@playwright/test';

test.describe('Cache Menu Buttons', () => {
  test('cache save and load buttons appear and work @headed', async ({ page }) => {
    // Capture console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(`${msg.type().toUpperCase()}: ${text}`);
    });

    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Wait for editor to be ready
    await page.waitForFunction(() => {
      return window.Wick && window.Wick.Project && window.editor && window.editor.project;
    }, { timeout: 10000 });
    
    console.log('✅ Editor loaded');

    // Check if buttons exist
    const buttons = await page.locator('.menu-bar-actions-container button, .menu-bar-actions-container [role="button"]').all();
    const buttonTexts = await Promise.all(buttons.map(btn => btn.textContent()));
    console.log('Menu buttons found:', buttonTexts);

    // Check for cache save and load buttons
    const cacheSaveButton = page.locator('.menu-bar-actions-container').filter({ hasText: 'cache save' });
    const cacheLoadButton = page.locator('.menu-bar-actions-container').filter({ hasText: 'cache load' });

    const saveExists = await cacheSaveButton.count() > 0;
    const loadExists = await cacheLoadButton.count() > 0;

    console.log('Cache save button exists:', saveExists);
    console.log('Cache load button exists:', loadExists);

    expect(saveExists).toBe(true);
    expect(loadExists).toBe(true);

    // Test save button
    console.log('\nTesting cache save button...');
    const projectNameBefore = await page.evaluate(() => window.project?.name || window.editor?.project?.name);
    console.log('Project name before save:', projectNameBefore);

    await cacheSaveButton.first().click();
    
    // Wait for save to complete
    await page.waitForTimeout(2000);

    // Check if it was saved
    const savedToCache = await page.evaluate(() => {
      return !!localStorage.getItem('wick_cached_project');
    });
    console.log('Project saved to cache:', savedToCache);
    expect(savedToCache).toBe(true);

    // Modify project to verify load works
    console.log('\nModifying project...');
    await page.evaluate(() => {
      if (window.project) {
        window.project.name = 'Modified Project';
      }
    });

    // Test load button
    console.log('Testing cache load button...');
    await cacheLoadButton.first().click();
    
    // Wait for load to complete
    await page.waitForTimeout(3000);

    // Check if project was loaded
    const projectNameAfter = await page.evaluate(() => {
      return window.project?.name || window.editor?.project?.name;
    });
    console.log('Project name after load:', projectNameAfter);

    // Should be back to original name
    expect(projectNameAfter).toBe(projectNameBefore);

    // Check console for [ProjectLoad] logs
    const projectLoadLogs = consoleMessages.filter(msg => msg.includes('[ProjectLoad]'));
    console.log('\n=== [ProjectLoad] LOGS ===');
    projectLoadLogs.forEach((log, i) => console.log(`${i + 1}. ${log}`));

    expect(projectLoadLogs.length).toBeGreaterThan(0);

    // Keep browser open for inspection
    await page.waitForTimeout(3000);
  });
});


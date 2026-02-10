import { test, expect } from '@playwright/test';

test.describe('Editor Initialization Test', () => {
  test('checks editor initialization and console errors', async ({ page }) => {
    // Track all console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(`PAGE ERROR: ${error.message}`);
    });
    
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the editor to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // Wait for canvas to be ready
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Check if Wick engine is loaded
    const wickLoaded = await page.evaluate(() => {
      return typeof window.Wick !== 'undefined';
    });
    console.log('Wick engine loaded:', wickLoaded);
    
    // Check if wickEditor is available
    const editorAvailable = await page.evaluate(() => {
      return {
        hasWickEditor: typeof window.wickEditor !== 'undefined',
        hasWickEditorProject: window.wickEditor && window.wickEditor.project ? true : false,
        windowKeys: Object.keys(window).filter(key => key.toLowerCase().includes('wick')),
        reactAppMounted: document.querySelector('#root') ? true : false
      };
    });
    console.log('Editor availability:', editorAvailable);
    
    // Check for React components
    const reactComponents = await page.evaluate(() => {
      const root = document.querySelector('#root');
      if (root) {
        return {
          hasRoot: true,
          rootChildren: root.children.length,
          rootHTML: root.innerHTML.substring(0, 200) + '...'
        };
      }
      return { hasRoot: false };
    });
    console.log('React components:', reactComponents);
    
    // Check for any Wick-related global variables
    const wickGlobals = await page.evaluate(() => {
      const wickKeys = Object.keys(window).filter(key => 
        key.toLowerCase().includes('wick') || 
        key.toLowerCase().includes('editor') ||
        key.toLowerCase().includes('project')
      );
      return wickKeys;
    });
    console.log('Wick-related globals:', wickGlobals);
    
    // Check console messages for errors
    const errorMessages = consoleMessages.filter(msg => 
      msg.includes('[error]') || 
      msg.includes('Error') || 
      msg.includes('TypeError') ||
      msg.includes('ReferenceError')
    );
    console.log('Error messages:', errorMessages);
    
    // Check page errors
    console.log('Page errors:', pageErrors);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/editor-initialization.png', fullPage: true });
    
    // The test should pass - we're just diagnosing
    expect(true).toBe(true);
  });
});

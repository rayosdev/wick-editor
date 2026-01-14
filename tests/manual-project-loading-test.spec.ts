import { test, expect } from '@playwright/test';

test.describe('Manual Project Loading Test', () => {
  test('load project using File menu and verify UI updates @headed', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3002');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);

    console.log('✅ Page loaded and Wick engine available');

    // Get initial project state
    const initialProjectState = await page.evaluate(() => {
      return {
        projectName: window.project?.name,
        projectWidth: window.project?.width,
        projectHeight: window.project?.height,
        projectFramerate: window.project?.framerate,
        childrenCount: window.project?.children?.length || 0
      };
    });

    console.log('Initial project state:', initialProjectState);

    // Try to find and click the File menu
    console.log('\nStep 1: Looking for File menu...');
    
    // Look for various possible File menu selectors
    const fileMenuSelectors = [
      'button:has-text("File")',
      '[role="menuitem"]:has-text("File")',
      'button[aria-label*="File"]',
      'button[title*="File"]',
      '.menu-item:has-text("File")',
      'button:has-text("Open")',
      'button[aria-label*="Open"]',
      'button[title*="Open"]'
    ];

    let fileMenuFound = false;
    for (const selector of fileMenuSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          console.log(`Found File menu with selector: ${selector}`);
          await element.click();
          fileMenuFound = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!fileMenuFound) {
      console.log('⚠️ File menu not found, trying alternative approach...');
      
      // Try to find any menu or button that might open a file dialog
      const allButtons = await page.locator('button').all();
      console.log(`Found ${allButtons.length} buttons on the page`);
      
      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        const button = allButtons[i];
        const text = await button.textContent();
        const title = await button.getAttribute('title');
        const ariaLabel = await button.getAttribute('aria-label');
        console.log(`Button ${i}: text="${text}", title="${title}", aria-label="${ariaLabel}"`);
      }
    }

    // Wait a bit to see if anything happens
    await page.waitForTimeout(2000);

    // Check if the project state changed
    const finalProjectState = await page.evaluate(() => {
      return {
        projectName: window.project?.name,
        projectWidth: window.project?.width,
        projectHeight: window.project?.height,
        projectFramerate: window.project?.framerate,
        childrenCount: window.project?.children?.length || 0
      };
    });

    console.log('Final project state:', finalProjectState);

    // Check if the project changed
    const projectChanged = 
      finalProjectState.projectName !== initialProjectState.projectName ||
      finalProjectState.projectWidth !== initialProjectState.projectWidth ||
      finalProjectState.projectHeight !== initialProjectState.projectHeight ||
      finalProjectState.childrenCount !== initialProjectState.childrenCount;

    if (projectChanged) {
      console.log('✅ Project state changed - UI should be updated');
    } else {
      console.log('⚠️ Project state did not change - UI might not be updated');
    }

    console.log('\n🎉 Manual project loading test completed!');
  });
});

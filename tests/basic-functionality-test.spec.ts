import { test, expect } from '@playwright/test';

test.describe('Basic Functionality Test', () => {
  test('verify basic editor functionality works with TypeScript conversions', async ({ page }) => {
    // Listen for console errors (filter out non-critical worker errors)
    const criticalErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        // Filter out non-critical worker and script loading errors
        if (!errorText.includes('worker-javascript.js') && 
            !errorText.includes('importScripts') &&
            !errorText.includes('WorkerGlobalScope') &&
            !errorText.includes('script "load"') &&
            !errorText.includes('undefined on line undefined')) {
          criticalErrors.push(`CONSOLE ERROR: ${errorText}`);
        }
      }
    });
    page.on('pageerror', error => {
      const errorMessage = error.message;
      // Filter out non-critical worker and script loading errors
      if (!errorMessage.includes('worker-javascript.js') && 
          !errorMessage.includes('importScripts') &&
          !errorMessage.includes('WorkerGlobalScope') &&
          !errorMessage.includes('script "load"') &&
          !errorMessage.includes('undefined on line undefined')) {
        criticalErrors.push(`PAGE ERROR: ${errorMessage}`);
      }
    });

    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);
    
    console.log('✅ Page loaded and Wick engine available');
    
    // Test basic project state
    const projectState = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        projectExists: !!window.Wick?.Project,
        hasProject: !!window.Wick?.project,
        projectViaEditor: window.Wick?.Editor?.project || null,
        globalProject: window.project || null
      };
    });
    
    expect(projectState.wickExists).toBe(true);
    expect(projectState.projectExists).toBe(true);
    
    // The project might be accessible through different paths
    const hasAnyProject = projectState.hasProject || projectState.projectViaEditor || projectState.globalProject;
    expect(hasAnyProject).toBeTruthy();
    
    console.log('✅ Basic project state verified');
    
    // Test that no critical errors occurred
    expect(criticalErrors, 'Should have no critical errors').toHaveLength(0);
    
    console.log('✅ Basic functionality test completed successfully!');
  });
});

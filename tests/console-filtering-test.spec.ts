import { test, expect } from '@playwright/test';

test.describe('Console Filtering Test', () => {
  test('verify React warnings are filtered from console output @headed', async ({ page }) => {
    // Capture console messages
    const consoleMessages: string[] = [];
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];

    page.on('console', msg => {
      const message = `${msg.type().toUpperCase()}: ${msg.text()}`;
      consoleMessages.push(message);
      
      if (msg.type() === 'error') {
        consoleErrors.push(message);
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(message);
      }
    });

    page.on('pageerror', error => {
      const errorMessage = `PAGE ERROR: ${error.message}`;
      consoleErrors.push(errorMessage);
      consoleMessages.push(errorMessage);
    });

    // Navigate to the editor
    await page.goto('http://localhost:3002');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);

    console.log('✅ Page loaded and Wick engine available');

    // Wait a bit for all components to mount and potentially generate warnings
    await page.waitForTimeout(3000);

    // Report console output
    console.log('\n=== CONSOLE OUTPUT ANALYSIS ===');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Total errors: ${consoleErrors.length}`);
    console.log(`Total warnings: ${consoleWarnings.length}`);

    if (consoleErrors.length > 0) {
      console.log('\n=== ERRORS FOUND ===');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (consoleWarnings.length > 0) {
      console.log('\n=== WARNINGS FOUND ===');
      consoleWarnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    // Check for React warnings specifically
    const reactWarnings = consoleWarnings.filter(warning => 
      warning.includes('defaultProps') || 
      warning.includes('findDOMNode') || 
      warning.includes('transition.timeout')
    );

    if (reactWarnings.length > 0) {
      console.log('\n=== REACT WARNINGS FOUND ===');
      reactWarnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
      console.log('\n❌ React warnings are NOT being filtered!');
    } else {
      console.log('\n✅ No React warnings found in console!');
      console.log('✅ Console filtering is working correctly!');
    }

    // Check for other types of warnings that should be filtered
    const otherFilteredWarnings = consoleWarnings.filter(warning => 
      warning.includes('Support for defaultProps will be removed') ||
      warning.includes('findDOMNode is deprecated') ||
      warning.includes('Failed .* type:.*prop')
    );

    if (otherFilteredWarnings.length > 0) {
      console.log('\n=== OTHER FILTERED WARNINGS FOUND ===');
      otherFilteredWarnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
      console.log('\n❌ Some warnings are NOT being filtered!');
    } else {
      console.log('\n✅ All expected warnings are being filtered!');
    }

    console.log('\n=== ALL CONSOLE MESSAGES ===');
    consoleMessages.forEach((message, index) => {
      console.log(`${index + 1}. ${message}`);
    });

    // The test should pass if no React warnings are found
    expect(reactWarnings.length).toBe(0);
    expect(otherFilteredWarnings.length).toBe(0);

    console.log('\n🎉 Console filtering test completed successfully!');
  });
});

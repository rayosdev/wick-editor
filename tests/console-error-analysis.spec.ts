import { test, expect } from '@playwright/test';

test.describe('Console Error Analysis', () => {
  test('analyze console errors in script workflow @headed', async ({ page }) => {
    // Capture all console messages and errors
    const allConsoleMessages: string[] = [];
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    
    page.on('console', msg => {
      const message = `${msg.type().toUpperCase()}: ${msg.text()}`;
      allConsoleMessages.push(message);
      
      if (msg.type() === 'error') {
        allErrors.push(message);
      } else if (msg.type() === 'warning') {
        allWarnings.push(message);
      }
    });
    
    page.on('pageerror', error => {
      const errorMessage = `PAGE ERROR: ${error.message}`;
      allErrors.push(errorMessage);
      allConsoleMessages.push(errorMessage);
    });

    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);
    
    console.log('✅ Page loaded and Wick engine available');
    
    // Step 1: Click show outliner
    console.log('\nStep 1: Clicking show outliner...');
    const outlinerButton = page.locator('#action-button-tooltip-outliner-toggle > button');
    await outlinerButton.click();
    console.log('✅ Outliner button clicked');
    await page.waitForTimeout(1000);

    // Step 2: Click on the frame
    console.log('\nStep 2: Clicking on frame...');
    const frameButton = page.locator('#flexible-container > div > div:nth-child(1) > div.editor-canvas-timeline-panel > div > div:nth-child(1) > div > div:nth-child(3) > div > div.outliner-body > div:nth-child(2) > div > div.indentation > div > div > button');
    await frameButton.click();
    console.log('✅ Frame button clicked');
    await page.waitForTimeout(1000);

    // Step 3: Click script window edit button
    console.log('\nStep 3: Clicking script window edit button...');
    const scriptEditButton = page.locator('#action-button-tooltip-inspector-script-window-row-editdefault > button');
    await scriptEditButton.click();
    console.log('✅ Script edit button clicked');
    await page.waitForTimeout(1000);

    // Step 4: Click timeline reference
    console.log('\nStep 4: Clicking timeline reference...');
    const timelineRefButton = page.locator('#wick-code-editor-resizeable > div.wick-code-editor-body > div.wick-code-editor-reference > div > div.we-code-reference-body > button.reference-button.we-code.Timeline');
    await timelineRefButton.click();
    console.log('✅ Timeline reference clicked');
    await page.waitForTimeout(1000);

    // Step 5: Click stop button
    console.log('\nStep 5: Clicking stop button...');
    const stopButton = page.locator('#action-button-tooltip-code-reference-button-stop > button');
    await stopButton.click();
    console.log('✅ Stop button clicked');
    await page.waitForTimeout(1000);

    // Step 6: Click close button
    console.log('\nStep 6: Clicking close button...');
    const closeButton = page.locator('#wick-code-editor-resizeable > div.wick-code-editor-drag-handle > button');
    await closeButton.click();
    console.log('✅ Close button clicked');
    await page.waitForTimeout(1000);

    // Step 7: Click play button
    console.log('\nStep 7: Clicking play button...');
    const playButton = page.locator('input[type="image"][id="play-button-object"]');
    await playButton.click();
    console.log('✅ Play button clicked');
    await page.waitForTimeout(2000);

    // Analyze and report console messages
    console.log('\n=== CONSOLE ANALYSIS ===');
    console.log(`Total console messages: ${allConsoleMessages.length}`);
    console.log(`Total errors: ${allErrors.length}`);
    console.log(`Total warnings: ${allWarnings.length}`);
    
    if (allErrors.length > 0) {
      console.log('\n=== ERRORS FOUND ===');
      allErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (allWarnings.length > 0) {
      console.log('\n=== WARNINGS FOUND ===');
      allWarnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }
    
    // Log all console messages for analysis
    console.log('\n=== ALL CONSOLE MESSAGES ===');
    allConsoleMessages.forEach((message, index) => {
      console.log(`${index + 1}. ${message}`);
    });

    // The test passes regardless of errors - we're just analyzing
    expect(true).toBe(true);
  });
});

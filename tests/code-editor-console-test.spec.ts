import { test, expect } from '@playwright/test';

test.describe('Code Editor Console Test', () => {
  test('add script to first frame and check code editor console for errors @headed', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3002');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);

    console.log('✅ Page loaded and Wick engine available');

    // Step 1: Click show outliner
    console.log('\nStep 1: Clicking show outliner...');
    const expandButton = page.locator('#action-button-tooltip-outliner-toggle > button');
    await expandButton.click();
    console.log('✅ Outliner button clicked');
    await page.waitForTimeout(500);

    // Step 2: Click on frame
    console.log('\nStep 2: Clicking on frame...');
    const keyframeButton = page.locator('#flexible-container > div > div:nth-child(1) > div.editor-canvas-timeline-panel > div > div:nth-child(1) > div > div:nth-child(3) > div > div.outliner-body > div:nth-child(2) > div > div.indentation > div > div > button');
    await keyframeButton.click();
    console.log('✅ Frame button clicked');
    await page.waitForTimeout(500);

    // Step 3: Click script window edit button
    console.log('\nStep 3: Clicking script window edit button...');
    const scriptEditButton = page.locator('#action-button-tooltip-inspector-script-window-row-editdefault > button');
    await scriptEditButton.click();
    console.log('✅ Script edit button clicked');
    await page.waitForTimeout(1000);

    // Step 4: Click timeline reference
    console.log('\nStep 4: Clicking timeline reference...');
    const timelineReferenceButton = page.locator('#wick-code-editor-resizeable > div.wick-code-editor-body > div.wick-code-editor-reference > div > div.we-code-reference-body > button.reference-button.we-code.Timeline');
    await timelineReferenceButton.click();
    console.log('✅ Timeline reference clicked');
    await page.waitForTimeout(500);

    // Step 5: Click stop button
    console.log('\nStep 5: Clicking stop button...');
    const stopButton = page.locator('#action-button-tooltip-code-reference-button-stop > button');
    await stopButton.click();
    console.log('✅ Stop button clicked');
    await page.waitForTimeout(500);

    // Step 6: Check for errors in the code editor console
    console.log('\nStep 6: Checking code editor console for errors...');
    
    // Wait for the console to be visible
    await page.waitForSelector('#wick-code-editor-resizeable > div.wick-code-editor-body > div.wick-code-editor-content > div.horizontal.reflex-container > div:nth-child(3) > div > div.we-code-console', { timeout: 5000 });
    
    // Get the console element
    const consoleElement = page.locator('#wick-code-editor-resizeable > div.wick-code-editor-body > div.wick-code-editor-content > div.horizontal.reflex-container > div:nth-child(3) > div > div.we-code-console');
    
    // Check if console is visible
    const isConsoleVisible = await consoleElement.isVisible();
    console.log(`Console visible: ${isConsoleVisible}`);
    
    if (isConsoleVisible) {
      // Get console content
      const consoleContent = await consoleElement.textContent();
      console.log('Console content:', consoleContent);
      
      // Check for error indicators in the console
      const hasErrors = consoleContent && (
        consoleContent.includes('Error') ||
        consoleContent.includes('error') ||
        consoleContent.includes('undefined') ||
        consoleContent.includes('Exception') ||
        consoleContent.includes('exception')
      );
      
      console.log(`Has errors in console: ${hasErrors}`);
      
      if (hasErrors) {
        console.log('❌ Errors found in code editor console:');
        console.log(consoleContent);
      } else {
        console.log('✅ No errors found in code editor console');
      }
      
      // Also check for any child elements that might contain error messages
      const errorElements = await consoleElement.locator('[class*="error"], [class*="Error"], [class*="console-error"], [class*="console-warning"]').all();
      console.log(`Found ${errorElements.length} potential error elements`);
      
      for (let i = 0; i < errorElements.length; i++) {
        const errorText = await errorElements[i].textContent();
        console.log(`Error element ${i + 1}: ${errorText}`);
      }
    } else {
      console.log('❌ Code editor console not visible');
    }

    // Step 7: Click close button
    console.log('\nStep 7: Clicking close button...');
    const closeButton = page.locator('#wick-code-editor-resizeable > div.wick-code-editor-drag-handle > button');
    await closeButton.click();
    console.log('✅ Close button clicked');
    await page.waitForTimeout(500);

    console.log('\n🎉 Code editor console test completed!');
  });
});

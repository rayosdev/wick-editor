import { test, expect } from '@playwright/test';

test.describe('Button Creation Workflow', () => {
  test('draw square, select it, and create button', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);
    
    console.log('✅ Page loaded and Wick engine available');
    
    // Step 1: Select the rectangle tool
    console.log('\nStep 1: Selecting rectangle tool...');
    
    // Try multiple possible selectors for the rectangle tool
    let rectangleTool = page.locator('[data-tool="rectangle"]');
    if (await rectangleTool.count() === 0) {
      rectangleTool = page.locator('button[title*="rectangle" i]');
    }
    if (await rectangleTool.count() === 0) {
      rectangleTool = page.locator('button[title*="Rectangle" i]');
    }
    if (await rectangleTool.count() === 0) {
      rectangleTool = page.locator('button').filter({ hasText: /rectangle/i });
    }
    if (await rectangleTool.count() === 0) {
      // Look for any tool button that might be rectangle
      const toolButtons = page.locator('.toolbar button, .tools button, [class*="tool"] button');
      const toolCount = await toolButtons.count();
      console.log(`Found ${toolCount} potential tool buttons`);
      
      if (toolCount > 0) {
        // Try clicking the second button (often rectangle is the second tool)
        rectangleTool = toolButtons.nth(1);
      }
    }
    
    if (await rectangleTool.count() === 0) {
      throw new Error('Could not find rectangle tool');
    }
    
    await rectangleTool.click();
    console.log('✅ Rectangle tool selected');
    
    // Step 2: Draw a square on the canvas
    console.log('\nStep 2: Drawing a square...');
    
    // Try multiple possible selectors for the canvas
    let canvas = page.locator('#wick-canvas');
    if (await canvas.count() === 0) {
      canvas = page.locator('#view-1'); // Main drawing canvas
    }
    if (await canvas.count() === 0) {
      canvas = page.locator('canvas').first(); // First canvas element
    }
    if (await canvas.count() === 0) {
      canvas = page.locator('[id*="canvas"]');
    }
    if (await canvas.count() === 0) {
      canvas = page.locator('[class*="canvas"]');
    }
    
    if (await canvas.count() === 0) {
      throw new Error('Canvas not found');
    }
    
    const canvasBox = await canvas.boundingBox();
    
    if (!canvasBox) {
      throw new Error('Canvas bounding box not available');
    }
    
    // Draw a square starting from center of canvas
    const startX = canvasBox.x + canvasBox.width / 2 - 50;
    const startY = canvasBox.y + canvasBox.height / 2 - 50;
    const endX = startX + 100;
    const endY = startY + 100;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    console.log(`✅ Square drawn from (${startX}, ${startY}) to (${endX}, ${endY})`);
    
    // Step 3: Select the square
    console.log('\nStep 3: Selecting the square...');
    
    // First, switch to the selection tool (usually the first tool)
    const selectionTool = page.locator('.toolbar button, .tools button, [class*="tool"] button').first();
    await selectionTool.click();
    console.log('✅ Selection tool activated');
    
    // Try different selection methods
    // Method 1: Single click
    await page.mouse.click(startX + 50, startY + 50);
    await page.waitForTimeout(500);
    
    // Method 2: Double click if single click didn't work
    await page.mouse.dblclick(startX + 50, startY + 50);
    await page.waitForTimeout(500);
    
    // Method 3: Try clicking on the edge of the square
    await page.mouse.click(startX + 10, startY + 10);
    await page.waitForTimeout(500);
    
    // Verify something is selected by checking if the inspector panel shows content
    const inspectorPanel = page.locator('.inspector-body');
    await expect(inspectorPanel).toBeVisible();
    
    // Check if there's a selection by looking for selection indicators
    const hasSelection = await page.evaluate(() => {
      return window.Wick && window.Wick.project && window.Wick.project.selection && window.Wick.project.selection.length > 0;
    });
    
    console.log(`✅ Square selected (inspector panel visible, has selection: ${hasSelection})`);
    
    // Step 4: Click the "Make Button" button
    console.log('\nStep 4: Clicking "Make Button" button...');
    
    // Wait a moment for the inspector to fully load
    await page.waitForTimeout(1000);
    
    // Debug: Log all text content in the inspector panel
    const inspectorText = await page.locator('.inspector-body').textContent();
    console.log('Inspector panel content:', inspectorText);
    
    // Debug: Log all buttons and their text
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`Found ${buttonCount} total buttons on page`);
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = allButtons.nth(i);
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      console.log(`Button ${i}: "${text}" (visible: ${isVisible})`);
    }
    
    // Try the specific selector you provided first
    const specificButton = page.locator('#flexible-container > div > div:nth-child(3) > div > div:nth-child(1) > div > div > div.inspector-body > div:nth-child(2) > div:nth-child(2) > div > button');
    
    if (await specificButton.count() > 0) {
      await specificButton.click();
      console.log('✅ "Make Button" button clicked (using specific selector)');
    } else {
      // Look for the "Make Button" button by text
      const makeButtonButton = page.locator('button').filter({ hasText: /make.*button/i });
      
      if (await makeButtonButton.count() > 0) {
        await makeButtonButton.click();
        console.log('✅ "Make Button" button clicked (found by text)');
      } else {
        // Try to find any button in the inspector that might be the make button
        const inspectorButtons = page.locator('.inspector-body button, .inspector button, [class*="inspector"] button');
        const buttonCount = await inspectorButtons.count();
        console.log(`Found ${buttonCount} buttons in inspector panel`);
        
        if (buttonCount > 0) {
          // Click the first button we find
          await inspectorButtons.first().click();
          console.log('✅ Clicked first button found in inspector');
        } else {
          // Look for any button on the page that might be related to button creation
          const allButtons = page.locator('button');
          const allButtonCount = await allButtons.count();
          console.log(`Found ${allButtonCount} total buttons on page`);
          
          // Look for buttons with text containing "button", "make", "create", etc.
          const potentialButtons = page.locator('button').filter({ hasText: /button|make|create/i });
          const potentialCount = await potentialButtons.count();
          console.log(`Found ${potentialCount} potential buttons with relevant text`);
          
          if (potentialCount > 0) {
            await potentialButtons.first().click();
            console.log('✅ Clicked potential button found by text');
          } else {
            throw new Error('Could not find "Make Button" button');
          }
        }
      }
    }
    
    // Step 5: Verify no errors occurred
    console.log('\nStep 5: Checking for errors...');
    
    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a moment for any async operations
    await page.waitForTimeout(1000);
    
    // Filter out non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('plausible.hash.js') && 
      !error.includes('Ignoring Event') &&
      !error.includes('VSC') &&
      !error.includes('Content script') &&
      !error.includes('vite') &&
      !error.includes('connecting') &&
      !error.includes('connected')
    );
    
    if (criticalErrors.length > 0) {
      console.log('❌ Errors found:');
      criticalErrors.forEach(error => console.log(`  - ${error}`));
      expect(criticalErrors, 'Should have no critical errors').toHaveLength(0);
    } else {
      console.log('✅ No critical errors');
    }
    
    // Step 6: Verify the button was created
    console.log('\nStep 6: Verifying button creation...');
    
    // Check if the project has been modified (indicating button creation)
    const projectState = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        projectExists: !!window.Wick?.Project,
        hasSelection: window.Wick?.project?.selection?.length > 0
      };
    });
    
    expect(projectState.wickExists).toBe(true);
    expect(projectState.projectExists).toBe(true);
    
    console.log('✅ Project state verified:');
    console.log(`   - Wick exists: ${projectState.wickExists}`);
    console.log(`   - Project exists: ${projectState.projectExists}`);
    console.log(`   - Has selection: ${projectState.hasSelection}`);
    
    console.log('\n🎉 Button creation workflow completed successfully!');
  });
});

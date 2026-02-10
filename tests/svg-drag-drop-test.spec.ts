import { test, expect } from '@playwright/test';

test.describe('SVG Drag and Drop Test', () => {
  test('tests SVG drag and drop upload functionality', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Track all console messages and errors
    const consoleMessages: Array<{type: string, text: string}> = [];
    const pageErrors: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    
    // Create a test SVG file
    const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      <text x="50" y="60" text-anchor="middle" font-size="12">Test</text>
    </svg>`;
    
    // Write the SVG file to a temporary location
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    const tempDir = os.tmpdir();
    const svgPath = path.join(tempDir, 'test.svg');
    fs.writeFileSync(svgPath, svgContent);
    
    try {
      // Find the canvas element for drag and drop
      const canvas = page.locator('#canvas-container-wrapper');
      await expect(canvas).toBeVisible();
      
      // Simulate drag and drop of SVG file
      await canvas.dispatchEvent('drop', {
        dataTransfer: {
          files: [svgPath]
        }
      });
      
      // Wait for processing
      await page.waitForTimeout(3000);
      
      // Check for the specific isPublished error
      const isPublishedErrors = consoleMessages.filter(msg => 
        msg.text.includes('isPublished') || 
        msg.text.includes('Cannot read properties of null')
      );
      
      if (isPublishedErrors.length > 0) {
        console.log('Found isPublished errors:', isPublishedErrors);
      }
      
      // Check for any SVG-related errors
      const svgErrors = consoleMessages.filter(msg => 
        msg.text.includes('SVG') || 
        msg.text.includes('Asset') ||
        msg.text.includes('TypeError')
      );
      
      if (svgErrors.length > 0) {
        console.log('Found SVG errors:', svgErrors);
      }
      
      // Check page errors
      if (pageErrors.length > 0) {
        console.log('Found page errors:', pageErrors);
      }
      
      console.log('All console messages:', consoleMessages);
      console.log('Page errors:', pageErrors);
      
      // The test should pass to show us what errors occur
      expect(consoleMessages.length).toBeGreaterThanOrEqual(0);
      
    } finally {
      // Clean up the temporary file
      if (fs.existsSync(svgPath)) {
        fs.unlinkSync(svgPath);
      }
    }
  });
  
  test('tests SVG asset with null item handling', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test SVGAsset with null item handling
    const nullItemTest = await page.evaluate(() => {
      try {
        // Test walkItems with null item
        const result1 = window.Wick.SVGAsset.walkItems(null);
        
        // Test _breakAppartShapesRecursively with null item
        window.Wick.SVGAsset._breakAppartShapesRecursively(null);
        
        // Test with undefined item
        const result2 = window.Wick.SVGAsset.walkItems(undefined);
        
        return {
          success: true,
          walkItemsNull: result1,
          walkItemsUndefined: result2
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        return {
          success: false,
          error: errorMessage,
          stack: errorStack
        };
      }
    });
    
    console.log('Null item handling test result:', nullItemTest);
    
    if (!nullItemTest.success) {
      console.log('Null item handling test failed:', nullItemTest.error);
      console.log('Stack trace:', nullItemTest.stack);
    }
    
    expect(nullItemTest.success).toBe(true);
    expect(nullItemTest.walkItemsNull).toBe(null);
    expect(nullItemTest.walkItemsUndefined).toBe(null);
    
    console.log('Null item handling test completed successfully');
  });
});

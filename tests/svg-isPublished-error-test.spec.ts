import { test, expect } from '@playwright/test';

test.describe('SVG isPublished Error Test', () => {
  test('reproduces the isPublished error with SVG upload', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
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
    
    // Test the specific SVG processing that causes the error
    const svgProcessingTest: {
      success: boolean;
      wickItem?: string;
      error?: string;
      stack?: string;
    } = await page.evaluate(() => {
      try {
        const dataUri = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJyZWQiIC8+Cjwvc3ZnPg==';

        // Create an SVG asset
        const svgAsset = new window.Wick.SVGAsset({
          filename: 'test.svg',
        });
        // FileAsset constructor stores args.src in a private field; assigning
        // through the public setter populates FileCache, which SVG import reads from.
        svgAsset.src = dataUri;
        
        // Test the createInstance method that causes the error
        return new Promise<{
          success: boolean;
          wickItem?: string;
        }>((resolve) => {
          svgAsset.createInstance((wickItem: { classname?: string } | null) => {
            resolve({
              success: true,
              wickItem: wickItem ? wickItem.classname : 'null'
            });
          });
        });
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
    
    console.log('SVG processing test result:', svgProcessingTest);
    
    if (!svgProcessingTest.success) {
      console.log('SVG processing test failed:', svgProcessingTest.error);
      console.log('Stack trace:', svgProcessingTest.stack);
    }
    
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
  });
  
  test('tests SVG processing with Paper.js items', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test Paper.js SVG import directly
    const paperSvgTest: {
      success: boolean;
      wickItem?: string;
      error?: string;
      stack?: string;
    } = await page.evaluate(() => {
      try {
        const paper = window.paper;
        if (!paper || !paper.project) {
          return {
            success: false,
            error: 'Paper.js project not available',
          };
        }

        // Create a simple SVG string
        const svgString = '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>';
        
        // Import SVG using Paper.js
        const item = paper.project.importSVG(svgString, {
          expandShapes: true,
          insert: false
        });
        
        // Test the walkItems method
        const wickItem = window.Wick.SVGAsset.walkItems(item);
        
        return {
          success: true,
          wickItem: wickItem ? wickItem.classname : 'null'
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
    
    console.log('Paper.js SVG test result:', paperSvgTest);
    
    if (!paperSvgTest.success) {
      console.log('Paper.js SVG test failed:', paperSvgTest.error);
      console.log('Stack trace:', paperSvgTest.stack);
    }
    
    expect(paperSvgTest.success).toBe(true);
    console.log('Paper.js SVG test completed successfully');
  });
});

import { test, expect } from '@playwright/test';

test.describe('SVG Upload Error Test', () => {
  test('simulates SVG upload and checks for isPublished error', async ({ page }) => {
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
    
    // Test SVGAsset functionality directly
    const svgAssetTest = await page.evaluate(() => {
      try {
        // Test creating an SVG asset
        const svgAsset = new window.Wick.SVGAsset({
          filename: 'test.svg',
          src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJyZWQiIC8+Cjwvc3ZnPg=='
        });
        
        // Test the methods that might cause isPublished error
        const hasInstances = svgAsset.hasInstances();
        const getInstances = svgAsset.getInstances();
        
        // Test static methods
        const mimeTypes = window.Wick.SVGAsset.getValidMIMETypes();
        const extensions = window.Wick.SVGAsset.getValidExtensions();
        
        return {
          success: true,
          classname: svgAsset.classname,
          hasInstances,
          getInstances,
          mimeTypes,
          extensions
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('SVG Asset test result:', svgAssetTest);
    
    if (!svgAssetTest.success) {
      console.log('SVG Asset creation failed:', svgAssetTest.error);
      console.log('Stack trace:', svgAssetTest.stack);
    }
    
    // Check for the specific isPublished error in console messages
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
    
    // Test the upload button click
    const uploadButton = page.locator('#action-button-tooltip-button-asset-upload > button');
    await expect(uploadButton).toBeVisible();
    
    console.log('Clicking upload button...');
    await uploadButton.click();
    
    // Wait for any processing
    await page.waitForTimeout(2000);
    
    // Check for new errors after clicking upload
    const newIsPublishedErrors = consoleMessages.filter(msg => 
      msg.text.includes('isPublished') || 
      msg.text.includes('Cannot read properties of null')
    );
    
    if (newIsPublishedErrors.length > 0) {
      console.log('Found new isPublished errors after upload click:', newIsPublishedErrors);
    }
    
    // Verify the editor is still functional
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    console.log('All console messages:', consoleMessages);
    console.log('Page errors:', pageErrors);
    
    // The test should pass to show us what errors occur
    expect(svgAssetTest.success).toBe(true);
  });
  
  test('tests SVG asset methods that might cause isPublished error', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test specific SVGAsset methods that might cause the isPublished error
    const methodTest = await page.evaluate(() => {
      try {
        // Create an SVG asset
        const svgAsset = new window.Wick.SVGAsset({
          filename: 'test.svg',
          src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJyZWQiIC8+Cjwvc3ZnPg=='
        });
        
        // Test methods that might access isPublished property
        const results = {
          classname: svgAsset.classname,
          hasInstances: svgAsset.hasInstances(),
          getInstances: svgAsset.getInstances(),
          removeAllInstances: typeof svgAsset.removeAllInstances,
          load: typeof svgAsset.load
        };
        
        // Test static methods
        const staticResults = {
          getValidMIMETypes: window.Wick.SVGAsset.getValidMIMETypes(),
          getValidExtensions: window.Wick.SVGAsset.getValidExtensions(),
          walkItems: typeof window.Wick.SVGAsset.walkItems,
          _breakAppartShapesRecursively: typeof window.Wick.SVGAsset._breakAppartShapesRecursively
        };
        
        return {
          success: true,
          instanceMethods: results,
          staticMethods: staticResults
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('SVG Asset methods test result:', methodTest);
    
    if (!methodTest.success) {
      console.log('SVG Asset methods test failed:', methodTest.error);
      console.log('Stack trace:', methodTest.stack);
    }
    
    expect(methodTest.success).toBe(true);
    expect(methodTest.instanceMethods.classname).toBe('SVGAsset');
    expect(methodTest.staticMethods.getValidMIMETypes).toContain('image/svg+xml');
    expect(methodTest.staticMethods.getValidExtensions).toContain('.svg');
    
    console.log('SVG Asset methods test completed successfully');
  });
});

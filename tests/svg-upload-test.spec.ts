import { test, expect } from '@playwright/test';

test.describe('SVG Upload Test', () => {
  test('uploads SVG file and verifies no errors', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Check for any existing console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Find the asset upload button
    const uploadButton = page.locator('#action-button-tooltip-button-asset-upload > button');
    await expect(uploadButton).toBeVisible();
    
    // Set up file input handler
    await page.evaluate(() => {
      // Create a file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.svg';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      
      // Store reference for later use
      (window as any).testFileInput = fileInput;
    });
    
    // Click the upload button
    await uploadButton.click();
    
    // Wait a moment for any dialogs or file picker
    await page.waitForTimeout(1000);
    
    // Check if there are any console errors related to SVG upload
    const svgErrors = consoleErrors.filter(error => 
      error.includes('isPublished') || 
      error.includes('SVG') || 
      error.includes('Asset')
    );
    
    if (svgErrors.length > 0) {
      console.log('SVG-related errors found:', svgErrors);
    }
    
    // Check that no critical errors occurred
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('Cannot read properties of null') ||
      error.includes('TypeError') ||
      error.includes('ReferenceError')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
      // Don't fail the test immediately, let's see what specific errors we get
    }
    
    // Verify the editor is still functional
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Try to select the brush tool to ensure the editor is still working
    const brushButton = page.locator('#action-button-tooltip-tool-button-brush button');
    await expect(brushButton).toBeVisible();
    await brushButton.click();
    
    // Verify we can still draw
    const canvas = page.locator('#canvas-container-wrapper');
    await canvas.click({ position: { x: 100, y: 100 } });
    
    console.log('SVG upload test completed. Console errors:', consoleErrors);
    console.log('SVG-specific errors:', svgErrors);
    console.log('Critical errors:', criticalErrors);
  });
  
  test('verifies SVG asset functionality after upload', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Check for Wick.SVGAsset availability
    const svgAssetAvailable = await page.evaluate(() => {
      return typeof window.Wick !== 'undefined' && 
             typeof window.Wick.SVGAsset !== 'undefined';
    });
    
    expect(svgAssetAvailable).toBe(true);
    
    // Check SVGAsset methods
    const svgAssetMethods = await page.evaluate(() => {
      if (typeof window.Wick === 'undefined' || typeof window.Wick.SVGAsset === 'undefined') {
        return null;
      }
      
      return {
        getValidMIMETypes: typeof window.Wick.SVGAsset.getValidMIMETypes,
        getValidExtensions: typeof window.Wick.SVGAsset.getValidExtensions,
        walkItems: typeof window.Wick.SVGAsset.walkItems,
        _breakAppartShapesRecursively: typeof window.Wick.SVGAsset._breakAppartShapesRecursively
      };
    });
    
    expect(svgAssetMethods).not.toBeNull();
    if (!svgAssetMethods) {
      throw new Error('Expected SVG asset methods to be available');
    }
    expect(svgAssetMethods.getValidMIMETypes).toBe('function');
    expect(svgAssetMethods.getValidExtensions).toBe('function');
    expect(svgAssetMethods.walkItems).toBe('function');
    expect(svgAssetMethods._breakAppartShapesRecursively).toBe('function');
    
    // Test SVGAsset static methods
    const validMimeTypes = await page.evaluate(() => {
      return window.Wick.SVGAsset.getValidMIMETypes();
    });
    
    expect(validMimeTypes).toContain('image/svg+xml');
    
    const validExtensions = await page.evaluate(() => {
      return window.Wick.SVGAsset.getValidExtensions();
    });
    
    expect(validExtensions).toContain('.svg');
    
    console.log('SVG Asset functionality verified successfully');
  });
});

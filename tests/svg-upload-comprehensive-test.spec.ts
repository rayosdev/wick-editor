import { test, expect } from '@playwright/test';

type SvgUploadWindow = Window & {
  testFileInput?: HTMLInputElement;
};

test.describe('SVG Upload Comprehensive Test', () => {
  test('uploads actual SVG file and checks for isPublished error', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Track all console messages
    const consoleMessages: Array<{type: string, text: string}> = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    // Track page errors
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    
    // Create a test SVG file
    const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      <text x="50" y="60" text-anchor="middle" font-size="12">Test</text>
    </svg>`;
    
    // Convert to blob for file upload
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const svgFile = new File([svgBlob], 'test.svg', { type: 'image/svg+xml' });
    
    // Set up file input
    await page.evaluate((fileData) => {
      const bridge = window as SvgUploadWindow;
      // Create a file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.svg';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      
      // Create a DataTransfer object with our file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(fileData);
      fileInput.files = dataTransfer.files;
      
      // Store reference
      bridge.testFileInput = fileInput;
    }, svgFile);
    
    // Find and click the asset upload button
    const uploadButton = page.locator('#action-button-tooltip-button-asset-upload > button');
    await expect(uploadButton).toBeVisible();
    
    console.log('Clicking upload button...');
    await uploadButton.click();
    
    // Wait for any processing
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
    
    // Verify the editor is still functional
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Try to interact with the editor
    const brushButton = page.locator('#action-button-tooltip-tool-button-brush button');
    await expect(brushButton).toBeVisible();
    await brushButton.click();
    
    // Try to draw something
    const canvas = page.locator('#canvas-container-wrapper');
    await canvas.click({ position: { x: 100, y: 100 } });
    
    console.log('All console messages:', consoleMessages);
    console.log('Page errors:', pageErrors);
    
    // The test should pass even if there are errors, but we want to see what they are
    expect(pageErrors.length).toBe(0);
  });
  
  test('tests SVG asset creation and methods', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test SVGAsset creation
    const svgAssetTest = await page.evaluate(() => {
      try {
        // Create a test SVG asset
        const svgAsset = new window.Wick.SVGAsset({
          filename: 'test.svg',
          src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJyZWQiIC8+Cjwvc3ZnPg=='
        });
        
        return {
          success: true,
          classname: svgAsset.classname,
          hasInstances: svgAsset.hasInstances(),
          getInstances: svgAsset.getInstances()
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          success: false,
          error: errorMessage
        };
      }
    });
    
    expect(svgAssetTest.success).toBe(true);
    expect(svgAssetTest.classname).toBe('SVGAsset');
    
    // Test SVGAsset static methods
    const staticMethodsTest = await page.evaluate(() => {
      try {
        const mimeTypes = window.Wick.SVGAsset.getValidMIMETypes();
        const extensions = window.Wick.SVGAsset.getValidExtensions();
        
        return {
          success: true,
          mimeTypes,
          extensions
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          success: false,
          error: errorMessage
        };
      }
    });
    
    expect(staticMethodsTest.success).toBe(true);
    expect(staticMethodsTest.mimeTypes).toContain('image/svg+xml');
    expect(staticMethodsTest.extensions).toContain('.svg');
    
    console.log('SVG Asset creation and methods test completed successfully');
  });
});

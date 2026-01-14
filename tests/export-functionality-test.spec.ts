import { test, expect } from '@playwright/test';

test.describe('Export Functionality Test', () => {
  test('tests export utilities functionality', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test ExportUtils functionality
    const exportUtilsTest = await page.evaluate(() => {
      try {
        // Test dataURItoBlob function
        const testDataURI = 'data:text/plain;base64,SGVsbG8gV29ybGQ=';
        const blob = window.Wick.ExportUtils.dataURItoBlob(testDataURI);
        
        return {
          success: true,
          blobType: blob.type,
          blobSize: blob.size,
          hasExportUtils: typeof window.Wick.ExportUtils !== 'undefined'
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('ExportUtils test result:', exportUtilsTest);
    
    expect(exportUtilsTest.success).toBe(true);
    expect(exportUtilsTest.hasExportUtils).toBe(true);
    expect(exportUtilsTest.blobType).toBe('text/plain');
    expect(exportUtilsTest.blobSize).toBeGreaterThan(0);
    
    console.log('ExportUtils functionality test completed successfully');
  });
  
  test('tests HTML export functionality', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test HTMLExport functionality
    const htmlExportTest = await page.evaluate(() => {
      try {
        // Check if HTMLExport is available
        const hasHTMLExport = typeof window.Wick.HTMLExport !== 'undefined';
        const hasBundleProject = typeof window.Wick.HTMLExport?.bundleProject === 'function';
        
        return {
          success: true,
          hasHTMLExport,
          hasBundleProject
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('HTMLExport test result:', htmlExportTest);
    
    expect(htmlExportTest.success).toBe(true);
    expect(htmlExportTest.hasHTMLExport).toBe(true);
    expect(htmlExportTest.hasBundleProject).toBe(true);
    
    console.log('HTMLExport functionality test completed successfully');
  });
  
  test('tests ZIP export functionality', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test ZIPExport functionality
    const zipExportTest = await page.evaluate(() => {
      try {
        // Check if ZIPExport is available
        const hasZIPExport = typeof window.Wick.ZIPExport !== 'undefined';
        const hasBundleProject = typeof window.Wick.ZIPExport?.bundleProject === 'function';
        
        return {
          success: true,
          hasZIPExport,
          hasBundleProject
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('ZIPExport test result:', zipExportTest);
    
    expect(zipExportTest.success).toBe(true);
    expect(zipExportTest.hasZIPExport).toBe(true);
    expect(zipExportTest.hasBundleProject).toBe(true);
    
    console.log('ZIPExport functionality test completed successfully');
  });
  
  test('tests asset functionality after export conversion', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test asset functionality
    const assetTest = await page.evaluate(() => {
      try {
        // Test Asset class
        const asset = new window.Wick.Asset({ name: 'test-asset' });
        
        // Test FileAsset class
        const fileAsset = new window.Wick.FileAsset({
          filename: 'test.txt',
          src: 'data:text/plain;base64,SGVsbG8gV29ybGQ='
        });
        
        // Test ClipAsset class
        const clipAsset = new window.Wick.ClipAsset({
          filename: 'test.wickobj',
          src: 'data:application/json;base64,e30='
        });
        
        // Test GIFAsset class
        const gifAsset = new window.Wick.GIFAsset({
          filename: 'test.gif',
          src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        });
        
        return {
          success: true,
          assetClassname: asset.classname,
          fileAssetClassname: fileAsset.classname,
          clipAssetClassname: clipAsset.classname,
          gifAssetClassname: gifAsset.classname,
          hasValidMimeTypes: typeof fileAsset.constructor.getValidMIMETypes === 'function',
          hasValidExtensions: typeof fileAsset.constructor.getValidExtensions === 'function'
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('Asset functionality test result:', assetTest);
    
    expect(assetTest.success).toBe(true);
    expect(assetTest.assetClassname).toBe('Asset');
    expect(assetTest.fileAssetClassname).toBe('FileAsset');
    expect(assetTest.clipAssetClassname).toBe('ClipAsset');
    expect(assetTest.gifAssetClassname).toBe('GIFAsset');
    expect(assetTest.hasValidMimeTypes).toBe(true);
    expect(assetTest.hasValidExtensions).toBe(true);
    
    console.log('Asset functionality test completed successfully');
  });
  
  test('tests drawing and selection after export conversion', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test drawing functionality
    const brushButton = page.locator('#action-button-tooltip-tool-button-brush button');
    await expect(brushButton).toBeVisible();
    await brushButton.click();
    
    // Draw some lines
    const canvas = page.locator('#canvas-container-wrapper');
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 200, y: 200 } });
    await canvas.click({ position: { x: 300, y: 100 } });
    
    // Wait for drawing to complete
    await page.waitForTimeout(1000);
    
    // Test selection functionality
    const cursorButton = page.locator('#action-button-tooltip-tool-button-cursor button');
    await expect(cursorButton).toBeVisible();
    await cursorButton.click();
    
    // Try to select the drawn lines
    await canvas.click({ position: { x: 150, y: 150 } });
    
    // Wait for selection to complete
    await page.waitForTimeout(500);
    
    // Verify the editor is still functional
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    console.log('Drawing and selection test completed successfully');
  });
});

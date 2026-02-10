import { test, expect } from '@playwright/test';

test.describe('Export Simple Test', () => {
  test('tests export utilities in browser context', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        return {
          success: false,
          error: errorMessage,
          stack: errorStack
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
  
  test('tests HTML and ZIP export availability', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test export classes availability
    const exportClassesTest = await page.evaluate(() => {
      try {
        return {
          success: true,
          hasHTMLExport: typeof window.Wick.HTMLExport !== 'undefined',
          hasZIPExport: typeof window.Wick.ZIPExport !== 'undefined',
          hasBundleProjectHTML: typeof window.Wick.HTMLExport?.bundleProject === 'function',
          hasBundleProjectZIP: typeof window.Wick.ZIPExport?.bundleProject === 'function'
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
    
    console.log('Export classes test result:', exportClassesTest);
    
    expect(exportClassesTest.success).toBe(true);
    expect(exportClassesTest.hasHTMLExport).toBe(true);
    expect(exportClassesTest.hasZIPExport).toBe(true);
    expect(exportClassesTest.hasBundleProjectHTML).toBe(true);
    expect(exportClassesTest.hasBundleProjectZIP).toBe(true);
    
    console.log('Export classes test completed successfully');
  });
});

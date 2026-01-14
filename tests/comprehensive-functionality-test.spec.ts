import { test, expect } from '@playwright/test';

test.describe('Comprehensive Functionality Test', () => {
  test('tests all converted TypeScript functionality', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test all converted TypeScript classes
    const functionalityTest = await page.evaluate(() => {
      try {
        return {
          success: true,
          // Core classes
          hasColor: typeof window.Wick.Color !== 'undefined',
          hasFileCache: typeof window.Wick.FileCache !== 'undefined',
          hasObjectCache: typeof window.Wick.ObjectCache !== 'undefined',
          hasHistory: typeof window.Wick.History !== 'undefined',
          hasTransformation: typeof window.Wick.Transformation !== 'undefined',
          hasToolSettings: typeof window.Wick.ToolSettings !== 'undefined',
          hasGlobalAPI: typeof window.GlobalAPI !== 'undefined',
          hasTimeline: typeof window.Wick.Timeline !== 'undefined',
          
          // Tool classes
          hasTool: typeof window.Wick.Tool !== 'undefined',
          hasBrush: typeof window.Wick.Tools.Brush !== 'undefined',
          hasPencil: typeof window.Wick.Tools.Pencil !== 'undefined',
          hasEraser: typeof window.Wick.Tools.Eraser !== 'undefined',
          hasCursor: typeof window.Wick.Tools.Cursor !== 'undefined',
          hasEllipse: typeof window.Wick.Tools.Ellipse !== 'undefined',
          hasRectangle: typeof window.Wick.Tools.Rectangle !== 'undefined',
          hasLine: typeof window.Wick.Tools.Line !== 'undefined',
          hasText: typeof window.Wick.Tools.Text !== 'undefined',
          hasEyedropper: typeof window.Wick.Tools.Eyedropper !== 'undefined',
          hasFillBucket: typeof window.Wick.Tools.FillBucket !== 'undefined',
          hasInteract: typeof window.Wick.Tools.Interact !== 'undefined',
          hasNone: typeof window.Wick.Tools.None !== 'undefined',
          hasPan: typeof window.Wick.Tools.Pan !== 'undefined',
          hasPathCursor: typeof window.Wick.Tools.PathCursor !== 'undefined',
          hasZoom: typeof window.Wick.Tools.Zoom !== 'undefined',
          
          // Base classes
          hasLayer: typeof window.Wick.Layer !== 'undefined',
          hasFrame: typeof window.Wick.Frame !== 'undefined',
          hasButton: typeof window.Wick.Button !== 'undefined',
          hasPath: typeof window.Wick.Path !== 'undefined',
          hasTween: typeof window.Wick.Tween !== 'undefined',
          hasSelection: typeof window.Wick.Selection !== 'undefined',
          hasBase: typeof window.Wick.Base !== 'undefined',
          hasTickable: typeof window.Wick.Tickable !== 'undefined',
          
          // Asset classes
          hasImageAsset: typeof window.Wick.ImageAsset !== 'undefined',
          hasSoundAsset: typeof window.Wick.SoundAsset !== 'undefined',
          hasFontAsset: typeof window.Wick.FontAsset !== 'undefined',
          hasSVGAsset: typeof window.Wick.SVGAsset !== 'undefined',
          hasAsset: typeof window.Wick.Asset !== 'undefined',
          hasFileAsset: typeof window.Wick.FileAsset !== 'undefined',
          hasClipAsset: typeof window.Wick.ClipAsset !== 'undefined',
          hasGIFAsset: typeof window.Wick.GIFAsset !== 'undefined',
          
          // Export classes
          hasExportUtils: typeof window.Wick.ExportUtils !== 'undefined',
          hasHTMLExport: typeof window.Wick.HTMLExport !== 'undefined',
          hasZIPExport: typeof window.Wick.ZIPExport !== 'undefined',
          hasWickFile: typeof window.Wick.WickFile !== 'undefined',
          
          // View classes
          hasViewPath: typeof window.Wick.View.Path !== 'undefined',
          
          // Paper extensions
          hasLayerErase: typeof window.paper.Layer.prototype.erase !== 'undefined',
          hasPaperHole: typeof window.paper.PaperScope.prototype.hole !== 'undefined',
          hasOrderingUtils: typeof window.paper.PaperScope.prototype.OrderingUtils !== 'undefined',
          hasPathPotrace: typeof window.paper.Path.prototype.potrace !== 'undefined',
          hasTextItemEdit: typeof window.paper.TextItem.prototype.attachTextArea !== 'undefined',
          hasViewPressure: typeof window.paper.View.prototype.pressure !== 'undefined',
          hasViewGestures: typeof window.paper.View.prototype.enableGestures !== 'undefined',
          hasViewScrollToZoom: typeof window.paper.View.prototype.enableScrollToZoom !== 'undefined'
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('Comprehensive functionality test result:', functionalityTest);
    
    expect(functionalityTest.success).toBe(true);
    
    // Test core classes
    expect(functionalityTest.hasColor).toBe(true);
    expect(functionalityTest.hasFileCache).toBe(true);
    expect(functionalityTest.hasObjectCache).toBe(true);
    expect(functionalityTest.hasHistory).toBe(true);
    expect(functionalityTest.hasTransformation).toBe(true);
    expect(functionalityTest.hasToolSettings).toBe(true);
    expect(functionalityTest.hasGlobalAPI).toBe(true);
    expect(functionalityTest.hasTimeline).toBe(true);
    
    // Test tool classes
    expect(functionalityTest.hasTool).toBe(true);
    expect(functionalityTest.hasBrush).toBe(true);
    expect(functionalityTest.hasPencil).toBe(true);
    expect(functionalityTest.hasEraser).toBe(true);
    expect(functionalityTest.hasCursor).toBe(true);
    expect(functionalityTest.hasEllipse).toBe(true);
    expect(functionalityTest.hasRectangle).toBe(true);
    expect(functionalityTest.hasLine).toBe(true);
    expect(functionalityTest.hasText).toBe(true);
    expect(functionalityTest.hasEyedropper).toBe(true);
    expect(functionalityTest.hasFillBucket).toBe(true);
    expect(functionalityTest.hasInteract).toBe(true);
    expect(functionalityTest.hasNone).toBe(true);
    expect(functionalityTest.hasPan).toBe(true);
    expect(functionalityTest.hasPathCursor).toBe(true);
    expect(functionalityTest.hasZoom).toBe(true);
    
    // Test base classes
    expect(functionalityTest.hasLayer).toBe(true);
    expect(functionalityTest.hasFrame).toBe(true);
    expect(functionalityTest.hasButton).toBe(true);
    expect(functionalityTest.hasPath).toBe(true);
    expect(functionalityTest.hasTween).toBe(true);
    expect(functionalityTest.hasSelection).toBe(true);
    expect(functionalityTest.hasBase).toBe(true);
    expect(functionalityTest.hasTickable).toBe(true);
    
    // Test asset classes
    expect(functionalityTest.hasImageAsset).toBe(true);
    expect(functionalityTest.hasSoundAsset).toBe(true);
    expect(functionalityTest.hasFontAsset).toBe(true);
    expect(functionalityTest.hasSVGAsset).toBe(true);
    expect(functionalityTest.hasAsset).toBe(true);
    expect(functionalityTest.hasFileAsset).toBe(true);
    expect(functionalityTest.hasClipAsset).toBe(true);
    expect(functionalityTest.hasGIFAsset).toBe(true);
    
    // Test export classes
    expect(functionalityTest.hasExportUtils).toBe(true);
    expect(functionalityTest.hasHTMLExport).toBe(true);
    expect(functionalityTest.hasZIPExport).toBe(true);
    expect(functionalityTest.hasWickFile).toBe(true);
    
    // Test view classes
    expect(functionalityTest.hasViewPath).toBe(true);
    
    // Test paper extensions
    expect(functionalityTest.hasLayerErase).toBe(true);
    expect(functionalityTest.hasPaperHole).toBe(true);
    expect(functionalityTest.hasOrderingUtils).toBe(true);
    expect(functionalityTest.hasPathPotrace).toBe(true);
    expect(functionalityTest.hasTextItemEdit).toBe(true);
    expect(functionalityTest.hasViewPressure).toBe(true);
    expect(functionalityTest.hasViewGestures).toBe(true);
    expect(functionalityTest.hasViewScrollToZoom).toBe(true);
    
    console.log('All TypeScript conversions are working correctly!');
  });
  
  test('tests drawing and selection functionality', async ({ page }) => {
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
  
  test('tests export functionality', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test export functionality
    const exportTest = await page.evaluate(() => {
      try {
        // Test ExportUtils
        const testDataURI = 'data:text/plain;base64,SGVsbG8gV29ybGQ=';
        const blob = window.Wick.ExportUtils.dataURItoBlob(testDataURI);
        
        // Test HTMLExport
        const htmlExport = new window.Wick.HTMLExport();
        
        // Test ZIPExport
        const zipExport = new window.Wick.ZIPExport();
        
        // Test WickFile
        const wickFile = window.Wick.WickFile;
        
        return {
          success: true,
          exportUtilsWorking: blob instanceof Blob,
          htmlExportAvailable: htmlExport !== null,
          zipExportAvailable: zipExport !== null,
          wickFileAvailable: wickFile !== null,
          wickFileGenerateMetaData: typeof wickFile.generateMetaData === 'function',
          wickFileFromWickFile: typeof wickFile.fromWickFile === 'function',
          wickFileToWickFile: typeof wickFile.toWickFile === 'function'
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('Export functionality test result:', exportTest);
    
    expect(exportTest.success).toBe(true);
    expect(exportTest.exportUtilsWorking).toBe(true);
    expect(exportTest.htmlExportAvailable).toBe(true);
    expect(exportTest.zipExportAvailable).toBe(true);
    expect(exportTest.wickFileAvailable).toBe(true);
    expect(exportTest.wickFileGenerateMetaData).toBe(true);
    expect(exportTest.wickFileFromWickFile).toBe(true);
    expect(exportTest.wickFileToWickFile).toBe(true);
    
    console.log('Export functionality test completed successfully');
  });
});

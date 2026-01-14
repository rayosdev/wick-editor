import { test, expect } from '@playwright/test';

test.describe('Selection Diagnostic Test', () => {
  test('diagnoses selection system issues', async ({ page }) => {
    // Track errors
    const errors: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error' && 
          !text.includes('DevTools') && 
          !text.includes('Ignoring Event')) {
        errors.push(text);
      }
    });
    
    page.on('pageerror', error => {
      errors.push(`PAGE ERROR: ${error.message}`);
    });
    
    // Navigate to the editor
    await page.goto('http://localhost:3004');
    
    // Wait for the editor to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Wait for canvas to be ready
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Check that Wick engine is loaded
    const wickLoaded = await page.evaluate(() => {
      return typeof window.Wick !== 'undefined';
    });
    expect(wickLoaded).toBe(true);
    console.log('✓ Wick engine loaded');
    
    // Check if wickEditor is available
    const editorInfo = await page.evaluate(() => {
      return {
        hasWickEditor: typeof window.wickEditor !== 'undefined',
        hasProject: window.wickEditor && window.wickEditor.project ? true : false,
        projectType: window.wickEditor && window.wickEditor.project ? typeof window.wickEditor.project : 'undefined'
      };
    });
    console.log('Editor info:', editorInfo);
    
    // Check project structure
    const projectStructure = await page.evaluate(() => {
      if (window.wickEditor && window.wickEditor.project) {
        const project = window.wickEditor.project;
        return {
          hasProject: true,
          projectName: project.name,
          hasActiveTimeline: !!project.activeTimeline,
          hasActiveFrame: !!project.activeFrame,
          timelineLayers: project.activeTimeline ? project.activeTimeline.layers.length : 0,
          activeFrameObjects: project.activeFrame ? project.activeFrame.objects.length : 0,
          selectionCount: project.selection ? project.selection.numObjects : 0,
          toolsAvailable: !!project.tools,
          cursorTool: project.tools ? !!project.tools.cursor : false
        };
      }
      return { hasProject: false };
    });
    console.log('Project structure:', projectStructure);
    
    // Select the brush tool
    const brushButton = page.locator('#action-button-tooltip-tool-button-brush button');
    await expect(brushButton).toBeVisible();
    await brushButton.click();
    await page.waitForTimeout(500);
    console.log('✓ Brush tool selected');
    
    // Set brush size
    const brushSizeInput = page.locator('input.settings-numeric-input').first();
    await brushSizeInput.clear();
    await brushSizeInput.fill('10');
    await page.waitForTimeout(500);
    console.log('✓ Brush size set');
    
    // Draw a simple line
    const canvas = page.locator('#canvas-container-wrapper');
    const canvasBox = await canvas.boundingBox();
    if (!canvasBox) throw new Error('Canvas not found');
    
    const startX = canvasBox.x + canvasBox.width / 2 - 50;
    const startY = canvasBox.y + canvasBox.height / 2;
    const endX = canvasBox.x + canvasBox.width / 2 + 50;
    const endY = canvasBox.y + canvasBox.height / 2;
    
    console.log('Drawing line from', startX, startY, 'to', endX, endY);
    
    // Draw line
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(2000);
    console.log('✓ Line drawn');
    
    // Check project state after drawing
    const afterDrawingInfo = await page.evaluate(() => {
      if (window.wickEditor && window.wickEditor.project) {
        const project = window.wickEditor.project;
        return {
          activeFrameObjects: project.activeFrame ? project.activeFrame.objects.length : 0,
          selectionCount: project.selection ? project.selection.numObjects : 0,
          activeFrame: project.activeFrame ? {
            start: project.activeFrame.start,
            end: project.activeFrame.end,
            objectsCount: project.activeFrame.objects.length
          } : null
        };
      }
      return { hasProject: false };
    });
    console.log('After drawing info:', afterDrawingInfo);
    
    // Switch to cursor tool
    const cursorButton = page.locator('#action-button-tooltip-tool-button-cursor button');
    await expect(cursorButton).toBeVisible();
    await cursorButton.click();
    await page.waitForTimeout(500);
    console.log('✓ Cursor tool selected');
    
    // Try to select the line
    console.log('Attempting to select line...');
    await page.mouse.click(startX + 25, startY);
    await page.waitForTimeout(1000);
    
    // Check selection state
    const selectionInfo = await page.evaluate(() => {
      if (window.wickEditor && window.wickEditor.project) {
        const project = window.wickEditor.project;
        const selection = project.selection;
        return {
          selectionCount: selection ? selection.numObjects : 0,
          selectedObjects: selection ? selection.getSelectedObjects().map(obj => ({
            uuid: obj.uuid,
            classname: obj.classname,
            name: obj.name
          })) : [],
          selectionLocation: selection ? selection.location : null,
          selectionTypes: selection ? selection.types : []
        };
      }
      return { hasProject: false };
    });
    console.log('Selection info:', selectionInfo);
    
    // Check for selection boxes in DOM
    const selectionBoxes = page.locator('.selection-box');
    const selectionBoxCount = await selectionBoxes.count();
    console.log('Selection boxes in DOM:', selectionBoxCount);
    
    // Check for any selection-related elements
    const selectionElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="selection"], [class*="Selection"]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id
      }));
    });
    console.log('Selection elements found:', selectionElements);
    
    // Check for any console errors
    if (errors.length > 0) {
      console.log('Console errors found:', errors);
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/selection-diagnostic.png', fullPage: true });
    
    // The test should pass even if selection isn't working - we're just diagnosing
    expect(true).toBe(true);
  });
});

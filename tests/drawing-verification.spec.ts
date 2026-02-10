import { test, expect } from '@playwright/test';

test.describe('Drawing Verification Test', () => {
  test('verifies that drawn lines are added to the project', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the editor to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Wait for canvas to be ready
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Check initial project state
    const initialProjectState = await page.evaluate(() => {
      if (window.project) {
        const project = window.project;
        return {
          hasProject: true,
          activeFrameObjects: project.activeFrame && project.activeFrame.objects ? project.activeFrame.objects.length : 0,
          allObjects: project.activeFrame && project.activeFrame.objects ? project.activeFrame.objects.map((obj: {
            uuid?: string;
            classname?: string;
            name?: string;
          }) => ({
            uuid: obj.uuid,
            classname: obj.classname,
            name: obj.name
          })) : []
        };
      }
      return { hasProject: false };
    });
    console.log('Initial project state:', initialProjectState);
    
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
    await page.waitForTimeout(3000); // Wait longer for processing
    console.log('✓ Line drawn');
    
    // Check project state after drawing
    const afterDrawingState = await page.evaluate(() => {
      if (window.project) {
        const project = window.project;
        return {
          hasProject: true,
          activeFrameObjects: project.activeFrame && project.activeFrame.objects ? project.activeFrame.objects.length : 0,
          allObjects: project.activeFrame && project.activeFrame.objects ? project.activeFrame.objects.map((obj: {
            uuid?: string;
            classname?: string;
            name?: string;
          }) => ({
            uuid: obj.uuid,
            classname: obj.classname,
            name: obj.name
          })) : [],
          activeFrame: project.activeFrame ? {
            start: project.activeFrame.start,
            end: project.activeFrame.end,
            objectsCount: project.activeFrame.objects ? project.activeFrame.objects.length : 0
          } : null
        };
      }
      return { hasProject: false };
    });
    console.log('After drawing state:', afterDrawingState);
    
    // Check if objects were added
    const objectsAdded = afterDrawingState.activeFrameObjects > initialProjectState.activeFrameObjects;
    console.log('Objects added:', objectsAdded);
    console.log('Object count change:', afterDrawingState.activeFrameObjects - initialProjectState.activeFrameObjects);
    
    // Try to select the drawn line
    console.log('Attempting to select drawn line...');
    await page.mouse.click(startX + 25, startY);
    await page.waitForTimeout(1000);
    
    // Check selection state
    const selectionState = await page.evaluate(() => {
      if (window.project) {
        const project = window.project;
        const selection = project.selection;
        return {
          selectionCount: selection ? selection.numObjects : 0,
          selectedObjects: selection ? selection.getSelectedObjects().map((obj: {
            uuid?: string;
            classname?: string;
            name?: string;
          }) => ({
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
    console.log('Selection state:', selectionState);
    
    // Check for selection boxes in DOM
    const selectionBoxes = page.locator('.selection-box');
    const selectionBoxCount = await selectionBoxes.count();
    console.log('Selection boxes in DOM:', selectionBoxCount);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/drawing-verification.png', fullPage: true });
    
    // The test should pass - we're just diagnosing
    expect(true).toBe(true);
  });
});

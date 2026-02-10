import { test, expect } from '@playwright/test';

test.describe('Apply Changes Debug Test', () => {
  test('debugs applyChanges method', async ({ page }) => {
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
          paperProject: window.paper && window.paper.project ? {
            hasActiveLayer: !!window.paper.project.activeLayer,
            activeLayerChildren: window.paper.project.activeLayer ? window.paper.project.activeLayer.children.length : 0
          } : null
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
    await page.waitForTimeout(5000); // Wait longer for processing
    console.log('✓ Line drawn');
    
    // Check project state after drawing
    const afterDrawingState = await page.evaluate(() => {
      if (window.project) {
        const project = window.project;
        return {
          hasProject: true,
          activeFrameObjects: project.activeFrame && project.activeFrame.objects ? project.activeFrame.objects.length : 0,
          paperProject: window.paper && window.paper.project ? {
            hasActiveLayer: !!window.paper.project.activeLayer,
            activeLayerChildren: window.paper.project.activeLayer ? window.paper.project.activeLayer.children.length : 0,
            allChildren: window.paper.project.activeLayer ? window.paper.project.activeLayer.children.map((child: {
              constructor?: { name?: string };
              name?: string;
              data?: unknown;
            }) => ({
              className: child.constructor?.name ?? 'Unknown',
              name: child.name,
              data: child.data
            })) : []
          } : null
        };
      }
      return { hasProject: false };
    });
    console.log('After drawing state:', afterDrawingState);
    
    // Manually call applyChanges to see if it works
    console.log('Manually calling applyChanges...');
    const manualApplyResult = await page.evaluate(() => {
      if (window.project && window.project.view) {
        try {
          window.project.view.applyChanges();
          return {
            success: true,
            activeFrameObjects: window.project.activeFrame && window.project.activeFrame.objects ? window.project.activeFrame.objects.length : 0
          };
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          return {
            success: false,
            error: errorMessage
          };
        }
      }
      return { success: false, error: 'No project or view' };
    });
    console.log('Manual applyChanges result:', manualApplyResult);
    
    // Check final project state
    const finalProjectState = await page.evaluate(() => {
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
    console.log('Final project state:', finalProjectState);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/apply-changes-debug.png', fullPage: true });
    
    // The test should pass - we're just debugging
    expect(true).toBe(true);
  });
});

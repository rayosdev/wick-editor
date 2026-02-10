import { test, expect } from '@playwright/test';

test.describe('GUI Functionality Test', () => {
  test('tests GUI elements availability and functionality', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test GUI elements availability
    const guiElementsTest = await page.evaluate(() => {
      try {
        return {
          success: true,
          hasGUIElement: typeof window.Wick.GUIElement !== 'undefined',
          hasButton: typeof window.Wick.GUIElement?.Button !== 'undefined',
          hasTimeline: typeof window.Wick.GUIElement?.Timeline !== 'undefined',
          hasTooltip: typeof window.Wick.GUIElement?.Tooltip !== 'undefined',
          hasBreadcrumbs: typeof window.Wick.GUIElement?.Breadcrumbs !== 'undefined',
          hasActionButtonsContainer: typeof window.Wick.GUIElement?.ActionButtonsContainer !== 'undefined',
          hasLayersContainer: typeof window.Wick.GUIElement?.LayersContainer !== 'undefined',
          hasFramesContainer: typeof window.Wick.GUIElement?.FramesContainer !== 'undefined',
          hasNumberLine: typeof window.Wick.GUIElement?.NumberLine !== 'undefined',
          hasScrollbar: typeof window.Wick.GUIElement?.Scrollbar !== 'undefined'
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
    
    console.log('GUI Elements test result:', guiElementsTest);
    
    expect(guiElementsTest.success).toBe(true);
    expect(guiElementsTest.hasGUIElement).toBe(true);
    expect(guiElementsTest.hasButton).toBe(true);
    expect(guiElementsTest.hasTimeline).toBe(true);
    
    console.log('GUI Elements functionality test completed successfully');
  });
  
  test('tests GUI element creation and basic functionality', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test GUI element creation
    const guiCreationTest = await page.evaluate(() => {
      try {
        // Test creating a button
        const mockModel = {
          project: {
            guiElement: {
              _canvas: document.createElement('canvas'),
              _ctx: document.createElement('canvas').getContext('2d')
            }
          }
        };
        
        const button = new window.Wick.GUIElement.Button(mockModel, {
          clickFn: () => console.log('Button clicked'),
          tooltip: 'Test button'
        });
        
        // Test creating a timeline
        const timeline = new window.Wick.GUIElement.Timeline(mockModel);
        
        return {
          success: true,
          buttonCreated: button !== null,
          timelineCreated: timeline !== null,
          buttonCursor: button.cursor,
          timelineHasBreadcrumbs: timeline.breadcrumbs !== null,
          timelineHasLayersContainer: timeline.layersContainer !== null,
          timelineHasFramesContainer: timeline.framesContainer !== null
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
    
    console.log('GUI Creation test result:', guiCreationTest);
    
    expect(guiCreationTest.success).toBe(true);
    expect(guiCreationTest.buttonCreated).toBe(true);
    expect(guiCreationTest.timelineCreated).toBe(true);
    expect(guiCreationTest.buttonCursor).toBe('pointer');
    expect(guiCreationTest.timelineHasBreadcrumbs).toBe(true);
    expect(guiCreationTest.timelineHasLayersContainer).toBe(true);
    expect(guiCreationTest.timelineHasFramesContainer).toBe(true);
    
    console.log('GUI Creation functionality test completed successfully');
  });
  
  test('tests GUI element methods and properties', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Wait for the canvas to be visible
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Test GUI element methods
    const guiMethodsTest = await page.evaluate(() => {
      try {
        const mockModel = {
          project: {
            guiElement: {
              _canvas: document.createElement('canvas'),
              _ctx: document.createElement('canvas').getContext('2d')
            }
          }
        };
        
        const button = new window.Wick.GUIElement.Button(mockModel, {
          clickFn: () => console.log('Button clicked'),
          tooltip: 'Test button'
        });
        
        const timeline = new window.Wick.GUIElement.Timeline(mockModel);
        
        return {
          success: true,
          buttonHasDraw: typeof button.draw === 'function',
          buttonHasOnMouseDown: typeof button.onMouseDown === 'function',
          buttonHasGetCursor: typeof button.getCursor === 'function',
          buttonHasSetCursor: typeof button.setCursor === 'function',
          timelineHasDraw: typeof timeline.draw === 'function',
          timelineHasUpdate: typeof timeline.update === 'function',
          timelineHasGetBounds: typeof timeline.getBounds === 'function',
          buttonCursor: button.getCursor(),
          buttonCanAutoScroll: button.canAutoScrollY === false
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
    
    console.log('GUI Methods test result:', guiMethodsTest);
    
    expect(guiMethodsTest.success).toBe(true);
    expect(guiMethodsTest.buttonHasDraw).toBe(true);
    expect(guiMethodsTest.buttonHasOnMouseDown).toBe(true);
    expect(guiMethodsTest.buttonHasGetCursor).toBe(true);
    expect(guiMethodsTest.buttonHasSetCursor).toBe(true);
    expect(guiMethodsTest.timelineHasDraw).toBe(true);
    expect(guiMethodsTest.timelineHasUpdate).toBe(true);
    expect(guiMethodsTest.timelineHasGetBounds).toBe(true);
    expect(guiMethodsTest.buttonCursor).toBe('pointer');
    expect(guiMethodsTest.buttonCanAutoScroll).toBe(true);
    
    console.log('GUI Methods functionality test completed successfully');
  });
  
  test('tests drawing and selection after GUI conversion', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
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
    
    console.log('Drawing and selection test completed successfully after GUI conversion');
  });
});

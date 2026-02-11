import { test, expect } from '@playwright/test';

type DrawingWindow = Window & {
  Howler?: unknown;
  JSZip?: unknown;
};

test.describe('Drawing Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('skipWelcomeMessage', 'true');
      } catch {}
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('can draw with brush tool without errors', async ({ page }) => {
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
    
    // Click brush tool
    const brushButton = page.locator('#action-button-tooltip-tool-button-brush button');
    await expect(brushButton).toBeVisible();
    await brushButton.click();
    await page.waitForTimeout(500);
    
    // Get canvas
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    // Draw a stroke
    const box = await canvas.boundingBox();
    if (box) {
      // Mouse down
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      
      // Draw a stroke
      for (let i = 0; i < 10; i++) {
        await page.mouse.move(
          box.x + box.width / 2 + i * 10,
          box.y + box.height / 2 + Math.sin(i) * 20
        );
        await page.waitForTimeout(10);
      }
      
      // Mouse up
      await page.mouse.up();
      
      // Wait for potrace processing if any
      await page.waitForTimeout(1000);
    }
    
    // Check for critical errors
    const criticalErrors = errors.filter(e => 
      e.includes('ReferenceError') || 
      e.includes('TypeError') ||
      e.includes('is not defined')
    );
    
    if (criticalErrors.length > 0) {
      console.log('ERRORS FOUND:');
      criticalErrors.forEach(e => console.log('  -', e));
    }
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('verify drawing libraries are loaded', async ({ page }) => {
    const libs = await page.evaluate(() => {
      const bridge = window as DrawingWindow;
      return {
        paper: typeof window.paper !== 'undefined',
        Croquis: typeof window.Croquis !== 'undefined',
        potrace: typeof window.potrace !== 'undefined',
        Howler: typeof bridge.Howler !== 'undefined',
        JSZip: typeof bridge.JSZip !== 'undefined'
      };
    });
    
    console.log('Library status:', libs);
    
    expect(libs.paper, 'paper should be loaded').toBe(true);
    expect(libs.Croquis, 'Croquis should be loaded').toBe(true);
    expect(libs.potrace, 'potrace should be loaded').toBe(true);
    expect(libs.Howler, 'Howler should be loaded').toBe(true);
    expect(libs.JSZip, 'JSZip should be loaded').toBe(true);
  });
});

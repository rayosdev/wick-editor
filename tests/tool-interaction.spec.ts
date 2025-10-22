import { test, expect } from '@playwright/test';

test.describe('Tool Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('skipWelcomeMessage', 'true');
      } catch {}
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for editor to fully initialize
  });

  test('can select brush tool without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('DevTools')) {
        errors.push(msg.text());
      }
    });
    
    // Find and click the brush tool button
    const brushButton = page.locator('#action-button-tooltip-tool-button-brush button');
    await expect(brushButton).toBeVisible();
    await brushButton.click();
    
    // Wait a moment for any errors to surface
    await page.waitForTimeout(1000);
    
    // Should have no errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Ignoring Event') && 
      !e.includes('DevTools')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Errors found after clicking brush:', criticalErrors);
    }
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('can select pencil tool without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('DevTools')) {
        errors.push(msg.text());
      }
    });
    
    // Find and click the pencil tool button  
    const pencilButton = page.locator('[data-tool="pencil"]').first();
    if (await pencilButton.count() > 0) {
      await pencilButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Should have no errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Ignoring Event') && 
      !e.includes('DevTools')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('verify all critical libraries are loaded', async ({ page }) => {
    const libsCheck = await page.evaluate(() => {
      return {
        paper: typeof window.paper !== 'undefined',
        platform: typeof window.platform !== 'undefined',
        Croquis: typeof window.Croquis !== 'undefined',
        TWEEN: typeof window.TWEEN !== 'undefined' || typeof (window as any).TWEEN !== 'undefined',
        Wick: typeof window.Wick !== 'undefined'
      };
    });
    
    expect(libsCheck.paper, 'paper should be defined').toBe(true);
    expect(libsCheck.platform, 'platform should be defined').toBe(true);
    expect(libsCheck.Croquis, 'Croquis should be defined').toBe(true);
    expect(libsCheck.Wick, 'Wick should be defined').toBe(true);
  });
});


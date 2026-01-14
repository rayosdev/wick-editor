import { test, expect } from '@playwright/test';

test.describe('Engine Integration - Build System', () => {
  test.beforeEach(async ({ page }) => {
    // Skip welcome message
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('skipWelcomeMessage', 'true');
      } catch {}
    });
  });

  test('engine loads without errors', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error' && !text.includes('DevTools')) {
        errors.push(text);
      }
      if (msg.type() === 'warning' && !text.includes('DevTools')) {
        warnings.push(text);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should have no critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('DevTools')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Errors found:', criticalErrors);
    }
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Wick global API is defined', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hasWick = await page.evaluate(() => typeof window.Wick !== 'undefined');
    expect(hasWick).toBe(true);
  });

  test('Wick API has expected structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const apiStructure = await page.evaluate(() => {
      return {
        hasWick: typeof window.Wick !== 'undefined',
        hasProject: typeof window.Wick?.Project !== 'undefined',
        hasTools: typeof window.Wick?.Tools !== 'undefined',
        hasVersion: typeof window.Wick?.version !== 'undefined',
        keysCount: window.Wick ? Object.keys(window.Wick).length : 0
      };
    });
    
    expect(apiStructure.hasWick).toBe(true);
    expect(apiStructure.hasProject).toBe(true);
    expect(apiStructure.hasTools).toBe(true);
    expect(apiStructure.hasVersion).toBe(true);
    expect(apiStructure.keysCount).toBeGreaterThan(10);
  });

  test('engine version is set', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const version = await page.evaluate(() => window.WICK_ENGINE_BUILD_VERSION);
    expect(version).toBeDefined();
    expect(version).toMatch(/\d+\.\d+\.\d+/);
  });

  test('can create a Wick project', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const projectCreated = await page.evaluate(() => {
      try {
        const project = new window.Wick.Project();
        return {
          success: true,
          hasName: typeof project.name !== 'undefined',
          hasWidth: typeof project.width !== 'undefined',
          hasHeight: typeof project.height !== 'undefined'
        };
      } catch (e) {
        return {
          success: false,
          error: e.message
        };
      }
    });
    
    expect(projectCreated.success).toBe(true);
    expect(projectCreated.hasName).toBe(true);
    expect(projectCreated.hasWidth).toBe(true);
    expect(projectCreated.hasHeight).toBe(true);
  });

  test('editor UI elements are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Root element exists
    await expect(page.locator('#root')).toBeVisible();

    // Canvas area renders
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();

    // Timeline area renders
    await expect(page.locator('#animation-timeline-container')).toBeVisible();
  });
});


import { test, expect } from '@playwright/test';

test.describe('Settings Panel', () => {
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

  test('check settings panel input functionality', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error' && !text.includes('DevTools') && !text.includes('Ignoring')) {
        errors.push(text);
      }
    });
    
    page.on('pageerror', error => {
      errors.push(`PAGE ERROR: ${error.message}`);
    });
    
    // Try to find the settings panel input
    const settingsInput = page.locator('#settings-panel-container input').first();
    
    const inputExists = await settingsInput.count() > 0;
    console.log('Settings input exists:', inputExists);
    
    if (inputExists) {
      const isVisible = await settingsInput.isVisible();
      console.log('Settings input visible:', isVisible);
      
      if (isVisible) {
        // Get current value
        const initialValue = await settingsInput.inputValue();
        console.log('Initial value:', initialValue);
        
        // Try to change the value
        await settingsInput.fill('50');
        await page.waitForTimeout(500);
        
        const newValue = await settingsInput.inputValue();
        console.log('New value:', newValue);
        
        // Check for errors
        if (errors.length > 0) {
          console.log('Errors during input change:');
          errors.forEach(e => console.log(' -', e));
        }
      } else {
        console.log('Settings input not visible - may need to select a tool first');
      }
    } else {
      console.log('Settings input not found - checking page state...');
      
      // Check what's on the page
      const pageState = await page.evaluate(() => {
        return {
          rootExists: !!document.querySelector('#root'),
          settingsPanel: !!document.querySelector('#settings-panel-container'),
          wickLoaded: typeof window.Wick !== 'undefined'
        };
      });
      console.log('Page state:', pageState);
    }
    
    // Log all errors
    console.log('\nTotal errors:', errors.length);
  });
  
  test('test settings panel with brush tool selected', async ({ page }) => {
    // Select brush tool first
    const brushButton = page.locator(
      '#action-button-tooltip-tool-button-brush-anchor button, #action-button-tooltip-tool-button-brush button'
    );
    await expect(brushButton).toBeVisible();
    await brushButton.click();
    await page.waitForTimeout(500);
    
    // Now try settings panel
    const settingsInput = page.locator('#settings-panel-container input').first();
    
    if (await settingsInput.count() > 0) {
      const isVisible = await settingsInput.isVisible();
      console.log('Settings input visible after selecting brush:', isVisible);
      
      if (isVisible) {
        const initialValue = await settingsInput.inputValue();
        console.log('Initial value:', initialValue);
        
        await settingsInput.fill('25');
        await page.waitForTimeout(500);
        
        const newValue = await settingsInput.inputValue();
        console.log('After fill:', newValue);
        
        // Check if the value actually changed
        const valueChanged = newValue === '25';
        console.log('Value changed successfully:', valueChanged);
        
        if (!valueChanged) {
          console.log('WARNING: Input value did not change!');
        }
      }
    } else {
      console.log('Settings input not found after selecting brush');
    }
  });
});

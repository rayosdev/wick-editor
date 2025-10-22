import { test, expect } from '@playwright/test';

test('debug - capture all console output', async ({ page }) => {
  const logs: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    logs.push(`[${type}] ${text}`);
    
    if (type === 'error') {
      errors.push(text);
    } else if (type === 'warning') {
      warnings.push(text);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`PAGE ERROR: ${error.message}\n${error.stack}`);
  });
  
  await page.addInitScript(() => {
    window.localStorage.setItem('skipWelcomeMessage', 'true');
  });
  
  console.log('Navigating to page...');
  await page.goto('/');
  
  console.log('Waiting for load...');
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  
  console.log('\n=== ALL CONSOLE LOGS ===');
  logs.forEach(log => console.log(log));
  
  console.log('\n=== ERRORS ===');
  errors.forEach(error => console.log(error));
  
  console.log('\n=== WARNINGS ===');
  warnings.forEach(warning => console.log(warning));
  
  console.log('\n=== CHECKING WINDOW.WICK ===');
  const wickCheck = await page.evaluate(() => {
    return {
      wickExists: typeof window.Wick !== 'undefined',
      wickKeys: window.Wick ? Object.keys(window.Wick) : [],
      buildVersion: (window as any).WICK_ENGINE_BUILD_VERSION,
      errors: (window as any).wickLoadErrors || []
    };
  });
  console.log(JSON.stringify(wickCheck, null, 2));
  
  // Just log, don't fail
  console.log('\nTest complete - check logs above');
});


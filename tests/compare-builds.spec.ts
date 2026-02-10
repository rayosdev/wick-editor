import { test } from '@playwright/test';

test('compare Gulp vs Vite - check for setFullySelected error', async ({ page }) => {
  const errors: string[] = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('DevTools')) {
      errors.push(text);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`PAGE ERROR: ${error.message}`);
  });
  
  await page.addInitScript(() => {
    window.localStorage.setItem('skipWelcomeMessage', 'true');
  });
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(6000);
  
  console.log('\n=== BUILD INFO ===');
  const buildInfo = await page.evaluate(() => {
    return {
      buildVersion: (window as any).WICK_ENGINE_BUILD_VERSION,
      engineMessage: document.body.innerText.includes('Vite') ? 'Vite' : 'Unknown'
    };
  });
  console.log('Build version:', buildInfo.buildVersion);
  console.log('Console log check:', buildInfo.engineMessage);
  
  console.log('\n=== ALL ERRORS ON LOAD ===');
  errors.forEach(e => console.log('-', e));
  
  const setFullySelectedErrors = errors.filter(e => e.includes('setFullySelected'));
  
  console.log('\n=== setFullySelected ERRORS ===');
  if (setFullySelectedErrors.length > 0) {
    console.log('FOUND setFullySelected errors:');
    setFullySelectedErrors.forEach(e => console.log('-', e));
  } else {
    console.log('No setFullySelected errors on page load');
  }
  
  // This test just logs - doesn't fail
  console.log('\nTest complete - check logs above');
});

import { test } from '@playwright/test';

test('find brush size input selector', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('skipWelcomeMessage', 'true');
  });
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Select brush tool
  const brushButton = page.locator('#action-button-tooltip-tool-button-brush button');
  await brushButton.click();
  await page.waitForTimeout(1000);
  
  // Find all inputs in settings panel
  const inputs = await page.evaluate(() => {
    const panel = document.querySelector('#settings-panel-container');
    if (!panel) return { panelExists: false };
    
    const allInputs = Array.from(panel.querySelectorAll('input'));
    return {
      panelExists: true,
      inputCount: allInputs.length,
      inputs: allInputs.map((input, idx) => ({
        index: idx,
        type: input.type,
        value: input.value,
        id: input.id,
        name: input.name,
        className: input.className,
        placeholder: input.placeholder,
        parentText: input.parentElement?.textContent?.trim().substring(0, 50)
      }))
    };
  });
  
  console.log('\n=== SETTINGS PANEL INPUTS ===');
  console.log('Panel exists:', inputs.panelExists);
  console.log('Input count:', inputs.inputCount);
  console.log('\nInputs found:');
  if (inputs.inputs) {
    inputs.inputs.forEach(input => {
      console.log(`\n[${input.index}] Type: ${input.type}`);
      console.log(`    Value: "${input.value}"`);
      console.log(`    ID: "${input.id}"`);
      console.log(`    Class: "${input.className}"`);
      console.log(`    Parent text: "${input.parentText}"`);
    });
  }
  
  // Also check for any text inputs or other controls
  const allControls = await page.evaluate(() => {
    const panel = document.querySelector('#settings-panel-container');
    if (!panel) return [];
    
    return {
      inputs: panel.querySelectorAll('input').length,
      selects: panel.querySelectorAll('select').length,
      buttons: panel.querySelectorAll('button').length,
      divs: panel.querySelectorAll('div').length
    };
  });
  
  console.log('\n=== PANEL CONTROLS ===');
  console.log(allControls);
});


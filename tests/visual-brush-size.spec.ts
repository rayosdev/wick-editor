import { test, expect } from '@playwright/test';

test('visual test - draw 3 strokes with sizes 5, 15, 25 (WATCH THE BROWSER)', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('skipWelcomeMessage', 'true');
  });
  
  console.log('\n🎨 VISUAL BRUSH SIZE TEST');
  console.log('=' .repeat(60));
  console.log('WATCH THE BROWSER - You should see 3 lines:');
  console.log('  Line 1 (top):    THIN (size 5)');
  console.log('  Line 2 (middle): MEDIUM (size 15)');
  console.log('  Line 3 (bottom): THICK (size 25)');
  console.log('=' .repeat(60));
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Select brush tool
  const brushButton = page.locator('#action-button-tooltip-tool-button-brush button');
  await brushButton.click();
  await page.waitForTimeout(1000);
  
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  
  const sizeInput = page.locator('#settings-panel-container input.settings-numeric-input').first();
  
  // Draw 3 horizontal lines with different sizes
  const testSizes = [
    { size: 5, label: 'THIN', y: 150 },
    { size: 15, label: 'MEDIUM', y: 250 },
    { size: 25, label: 'THICK', y: 350 }
  ];
  
  for (const { size, label, y } of testSizes) {
    console.log(`\nDrawing ${label} line (size ${size})...`);
    
    // Change size - try multiple methods to ensure it takes effect
    await sizeInput.click({ clickCount: 3 }); // Triple click to select all
    await page.waitForTimeout(100);
    await sizeInput.fill(String(size));
    await page.waitForTimeout(200);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500); // Wait for setting to apply
    
    // Verify input shows the value
    const inputValue = await sizeInput.inputValue();
    console.log(`  Input value: ${inputValue}`);
    
    // Click on canvas to ensure focus
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + y);
      await page.waitForTimeout(200);
      
      // Draw a straight horizontal line
      const startX = box.x + 100;
      const endX = box.x + box.width - 100;
      
      await page.mouse.move(startX, box.y + y);
      await page.mouse.down();
      
      // Draw slowly so stroke is smooth
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const x = startX + ((endX - startX) * i / steps);
        await page.mouse.move(x, box.y + y);
        await page.waitForTimeout(10);
      }
      
      await page.mouse.up();
      await page.waitForTimeout(1500); // Wait for processing
      
      console.log(`  ✓ ${label} line drawn`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 VISUAL VERIFICATION REQUIRED');
  console.log('=' .repeat(60));
  console.log('Look at the browser window:');
  console.log('  - Are there 3 horizontal lines visible?');
  console.log('  - Is the TOP line the THINNEST?');
  console.log('  - Is the MIDDLE line MEDIUM thickness?');
  console.log('  - Is the BOTTOM line the THICKEST?');
  console.log('');
  console.log('If all 3 lines are the SAME thickness:');
  console.log('  → This is a FRONTEND BUG (not Vite migration issue)');
  console.log('  → The settings panel is not updating the tool');
  console.log('');
  console.log('If the lines are DIFFERENT thicknesses:');
  console.log('  → Everything works correctly! ✅');
  console.log('=' .repeat(60));
  
  // Keep browser open for 5 seconds to inspect
  await page.waitForTimeout(5000);
  
  // Take a screenshot for reference
  await page.screenshot({ 
    path: 'test-results/brush-size-visual-test.png',
    fullPage: true 
  });
  console.log('\n📸 Screenshot saved to: test-results/brush-size-visual-test.png');
});


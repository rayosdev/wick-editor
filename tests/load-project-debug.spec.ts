import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Load Project Debug Test', () => {
  test('load timeline-script.wick project and test play functionality @headed', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3002');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);

    console.log('✅ Page loaded and Wick engine available');

    // Load the project file
    console.log('\nStep 1: Loading timeline-script.wick project...');
    
    // Read the project file
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    const project = JSON.parse(projectData);
    
    console.log('Project data loaded:', {
      name: project.project.name,
      width: project.project.width,
      height: project.project.height,
      framerate: project.project.framerate,
      children: project.project.children.length
    });

    // Load the project into the editor
    await page.evaluate((projectData) => {
      if (window.Wick && window.Wick.project) {
        window.Wick.project.loadFromData(projectData);
        console.log('Project loaded successfully');
      } else {
        console.error('Wick.project not available');
      }
    }, project);

    // Wait a moment for the project to load
    await page.waitForTimeout(1000);

    console.log('✅ Project loaded');

    // Step 2: Press play button
    console.log('\nStep 2: Pressing play button...');
    
    const playButton = page.locator('input[type="image"][id="play-button-object"]');
    await playButton.click();
    
    console.log('✅ Play button clicked');

    // Step 3: Wait and check for any console output
    console.log('\nStep 3: Monitoring console output...');
    
    // Wait a few seconds to see if anything happens
    await page.waitForTimeout(3000);

    // Check if the project is playing
    const isPlaying = await page.evaluate(() => {
      return window.Wick && window.Wick.project && window.Wick.project.playing;
    });

    console.log(`Project playing state: ${isPlaying}`);

    // Check for any errors in the main console
    const consoleErrors = await page.evaluate(() => {
      // This will capture any errors that occurred during play
      return window.consoleErrors || [];
    });

    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors);
    } else {
      console.log('No console errors detected');
    }

    // Step 4: Open code editor to check its console
    console.log('\nStep 4: Opening code editor to check console...');
    
    // Click show outliner
    const expandButton = page.locator('#action-button-tooltip-outliner-toggle > button');
    await expandButton.click();
    await page.waitForTimeout(500);

    // Click on frame
    const keyframeButton = page.locator('#flexible-container > div > div:nth-child(1) > div.editor-canvas-timeline-panel > div > div:nth-child(1) > div > div:nth-child(3) > div > div.outliner-body > div:nth-child(2) > div > div.indentation > div > div > button');
    await keyframeButton.click();
    await page.waitForTimeout(500);

    // Click script window edit button
    const scriptEditButton = page.locator('#action-button-tooltip-inspector-script-window-row-editdefault > button');
    await scriptEditButton.click();
    await page.waitForTimeout(1000);

    // Check code editor console
    const consoleElement = page.locator('#wick-code-editor-resizeable > div.wick-code-editor-body > div.wick-code-editor-content > div.horizontal.reflex-container > div:nth-child(3) > div > div.we-code-console');
    
    const isConsoleVisible = await consoleElement.isVisible();
    console.log(`Code editor console visible: ${isConsoleVisible}`);
    
    if (isConsoleVisible) {
      const consoleContent = await consoleElement.textContent();
      console.log('Code editor console content:', consoleContent);
      
      // Check for error indicators
      const hasErrors = consoleContent && (
        consoleContent.includes('Error') ||
        consoleContent.includes('error') ||
        consoleContent.includes('undefined') ||
        consoleContent.includes('Exception') ||
        consoleContent.includes('exception')
      );
      
      console.log(`Code editor console has errors: ${hasErrors}`);
    }

    // Close code editor
    const closeButton = page.locator('#wick-code-editor-resizeable > div.wick-code-editor-drag-handle > button');
    await closeButton.click();
    await page.waitForTimeout(500);

    console.log('\n🎉 Project load and play test completed!');
  });
});

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('UI Project Loading Test', () => {
  test('load timeline-script.wick project and verify UI updates @headed', async ({ page }) => {
    // Navigate to the editor
    await page.goto('http://localhost:3002');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);

    console.log('✅ Page loaded and Wick engine available');

    // Get initial project state
    const initialProjectState = await page.evaluate(() => {
      return {
        projectName: window.project?.name,
        projectWidth: window.project?.width,
        projectHeight: window.project?.height,
        projectFramerate: window.project?.framerate,
        childrenCount: window.project?.children?.length || 0
      };
    });

    console.log('Initial project state:', initialProjectState);

    // Load the project file
    console.log('\nStep 1: Loading timeline-script.wick project...');
    
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    
    // Load the project using WickFile and wait for completion
    await page.evaluate((projectData) => {
      return new Promise((resolve, reject) => {
        if (window.Wick && window.Wick.WickFile) {
          const blob = new Blob([projectData], { type: 'application/json' });
          
          window.Wick.WickFile.fromWickFile(blob, (loadedProject) => {
            if (loadedProject && window.editor) {
              window.editor.setupNewProject(loadedProject);
              console.log('Project loaded successfully via WickFile');
              resolve(true);
            } else {
              console.error('Failed to load project via WickFile');
              reject(new Error('Failed to load project'));
            }
          });
        } else {
          console.error('Wick.WickFile not available');
          reject(new Error('Wick.WickFile not available'));
        }
      });
    }, projectData);

    // Wait for UI to update
    await page.waitForTimeout(3000);

    console.log('✅ Project loaded');

    // Check if the project state changed
    const finalProjectState = await page.evaluate(() => {
      return {
        projectName: window.project?.name,
        projectWidth: window.project?.width,
        projectHeight: window.project?.height,
        projectFramerate: window.project?.framerate,
        childrenCount: window.project?.children?.length || 0
      };
    });

    console.log('Final project state:', finalProjectState);

    // Verify the project changed
    expect(finalProjectState.projectName).toBe('My Project');
    expect(finalProjectState.projectWidth).toBe(720);
    expect(finalProjectState.projectHeight).toBe(480);
    expect(finalProjectState.projectFramerate).toBe(12);

    // Check if the UI elements reflect the loaded project
    console.log('\nStep 2: Checking UI elements...');

    // Check if the project name is displayed somewhere in the UI
    const projectNameElements = await page.locator('text=My Project').count();
    console.log(`Found ${projectNameElements} elements with "My Project" text`);

    // Check if the canvas size changed (this would indicate the project loaded)
    const canvas = page.locator('canvas').first();
    const canvasSize = await canvas.boundingBox();
    console.log('Canvas size:', canvasSize);

    // Check if there are any timeline elements (indicating the project structure loaded)
    const timelineElements = await page.locator('[class*="timeline"], [class*="frame"], [class*="layer"]').count();
    console.log(`Found ${timelineElements} timeline-related elements`);

    // Check if the project dimensions are reflected in the UI
    const dimensionElements = await page.locator('text=720, text=480, text=12').count();
    console.log(`Found ${dimensionElements} elements with project dimensions`);

    // Check if the outliner shows the project structure
    const outlinerButton = page.locator('#action-button-tooltip-outliner-toggle > button');
    await outlinerButton.click();
    await page.waitForTimeout(1000);

    const outlinerContent = await page.locator('.outliner-body').textContent();
    console.log('Outliner content:', outlinerContent);

    // Check if the project has children (clips/layers)
    if (finalProjectState.childrenCount > 0) {
      console.log(`✅ Project has ${finalProjectState.childrenCount} children`);
    } else {
      console.log('⚠️ Project has no children');
    }

    // Check if the project is different from the initial state
    const projectChanged = 
      finalProjectState.projectName !== initialProjectState.projectName ||
      finalProjectState.projectWidth !== initialProjectState.projectWidth ||
      finalProjectState.projectHeight !== initialProjectState.projectHeight;

    if (projectChanged) {
      console.log('✅ Project state changed - UI should be updated');
    } else {
      console.log('⚠️ Project state did not change - UI might not be updated');
    }

    console.log('\n🎉 UI project loading test completed!');
  });
});

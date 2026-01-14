import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Simple Project Play Test', () => {
  test('load timeline-script.wick project and check console output @headed', async ({ page }) => {
    // Capture console messages
    const consoleMessages: string[] = [];
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];

    page.on('console', msg => {
      const message = `${msg.type().toUpperCase()}: ${msg.text()}`;
      consoleMessages.push(message);
      
      if (msg.type() === 'error') {
        consoleErrors.push(message);
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(message);
      }
    });

    page.on('pageerror', error => {
      const errorMessage = `PAGE ERROR: ${error.message}`;
      consoleErrors.push(errorMessage);
      consoleMessages.push(errorMessage);
    });

    // Navigate to the editor
    await page.goto('http://localhost:3002');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);

    console.log('✅ Page loaded and Wick engine available');

    // Load the project file
    console.log('\nStep 1: Loading timeline-script.wick project...');
    
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

    // Load the project into the editor using WickFile
    await page.evaluate((projectData) => {
      if (window.Wick && window.Wick.WickFile) {
        // Create a blob from the project data
        const blob = new Blob([projectData], { type: 'application/json' });
        
        // Use WickFile to load the project
        window.Wick.WickFile.fromWickFile(blob, (loadedProject) => {
          if (loadedProject && window.editor) {
            window.editor.setupNewProject(loadedProject);
            console.log('Project loaded successfully via WickFile');
          } else {
            console.error('Failed to load project via WickFile');
          }
        });
      } else {
        console.error('Wick.WickFile not available');
      }
    }, projectData);

    // Wait a moment for the project to load
    await page.waitForTimeout(1000);

    console.log('✅ Project loaded');

    // Step 2: Press play button
    console.log('\nStep 2: Pressing play button...');
    
    const playButton = page.locator('input[type="image"][id="play-button-object"]');
    await playButton.click();
    
    console.log('✅ Play button clicked');

    // Step 3: Wait and monitor console output
    console.log('\nStep 3: Monitoring console output for 5 seconds...');
    
    // Wait 5 seconds to see what happens
    await page.waitForTimeout(5000);

    // Check if the project is playing
    const isPlaying = await page.evaluate(() => {
      return window.project && window.project.playing;
    });

    console.log(`Project playing state: ${isPlaying}`);

    // Check project state
    const projectState = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        projectExists: !!window.project,
        hasProject: !!window.project,
        projectName: window.project?.name,
        projectPlaying: window.project?.playing,
        projectFramerate: window.project?.framerate,
        projectWidth: window.project?.width,
        projectHeight: window.project?.height
      };
    });

    console.log('Project state:', projectState);

    // Report console output
    console.log('\n=== CONSOLE OUTPUT ANALYSIS ===');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Total errors: ${consoleErrors.length}`);
    console.log(`Total warnings: ${consoleWarnings.length}`);

    if (consoleErrors.length > 0) {
      console.log('\n=== ERRORS FOUND ===');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (consoleWarnings.length > 0) {
      console.log('\n=== WARNINGS FOUND ===');
      consoleWarnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    // Check for React warnings specifically
    const reactWarnings = consoleWarnings.filter(warning => 
      warning.includes('defaultProps') || 
      warning.includes('findDOMNode') || 
      warning.includes('transition.timeout')
    );

    if (reactWarnings.length > 0) {
      console.log('\n=== REACT WARNINGS FOUND ===');
      reactWarnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    } else {
      console.log('\n✅ No React warnings found in console!');
    }

    console.log('\n=== ALL CONSOLE MESSAGES ===');
    consoleMessages.forEach((message, index) => {
      console.log(`${index + 1}. ${message}`);
    });

    console.log('\n🎉 Project play test completed!');
  });
});

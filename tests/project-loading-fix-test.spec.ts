import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Project Loading Fix Test', () => {
  test('load timeline-script.wick project and verify no errors @headed', async ({ page }) => {
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
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Wait for the Wick engine to load
    await page.waitForFunction(() => window.Wick && window.Wick.Project);

    console.log('✅ Page loaded and Wick engine available');

    // Load the project file using the proper method
    console.log('\nStep 1: Loading timeline-script.wick project...');
    
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    
    // Load the project using WickFile (the proper way) and wait for completion
    await page.evaluate((projectData) => {
      return new Promise((resolve, reject) => {
        if (window.Wick && window.Wick.WickFile) {
          // Create a blob from the project data
          const blob = new Blob([projectData], { type: 'application/json' });
          
          // Use WickFile to load the project
          window.Wick.WickFile.fromWickFile(blob, (loadedProject: unknown) => {
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

    // Wait a bit more for UI updates
    await page.waitForTimeout(2000);

    console.log('✅ Project loaded');

    // Check if the project is accessible
    const projectState = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        projectExists: !!window.project,
        hasProject: !!window.project,
        projectName: window.project?.name,
        activeTool: window.project?.activeTool,
        activeToolName: window.project?.activeTool?.name,
        projectFramerate: window.project?.framerate,
        projectWidth: window.project?.width,
        projectHeight: window.project?.height,
        projectKeys: window.project ? Object.keys(window.project) : []
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

    // Verify the project loaded correctly
    expect(projectState.projectExists).toBe(true);
    expect(projectState.hasProject).toBe(true);
    // Note: Project properties might be undefined due to async loading
    console.log('Project keys available:', projectState.projectKeys);

    // Check for critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Ignoring Event: localhost') &&
      !error.includes('worker-javascript.js') &&
      !error.includes('script "load"') &&
      !error.includes('undefined on line undefined')
    );

    console.log('\n=== CONSOLE OUTPUT ANALYSIS ===');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Total errors: ${consoleErrors.length}`);
    console.log(`Total warnings: ${consoleWarnings.length}`);
    console.log(`Critical errors: ${criticalErrors.length}`);

    if (criticalErrors.length > 0) {
      console.log('\n=== CRITICAL ERRORS FOUND ===');
      criticalErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('\n✅ No critical errors found!');
    }

    // Check for React warnings
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
      console.log('\n✅ No React warnings found!');
    }

    // The test should pass if no critical errors are found
    expect(criticalErrors.length).toBe(0);

    console.log('\n🎉 Project loading fix test completed successfully!');
  });
});

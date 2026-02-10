import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Debug Project Loading', () => {
  test('debug project loading with detailed console output @headed', async ({ page }) => {
    // Capture all console messages
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

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Step 1: Load the timeline-script.wick project with detailed debugging
    console.log('\nStep 1: Loading timeline-script.wick project with debugging...');
    
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    const projectJson = JSON.parse(projectData);
    
    console.log('Project file structure:', {
      hasProject: !!projectJson.project,
      hasMetadata: !!projectJson.metadata,
      hasExport: !!projectJson.export,
      projectKeys: projectJson.project ? Object.keys(projectJson.project) : [],
      projectChildren: projectJson.project?.children || [],
      projectClassname: projectJson.project?.classname
    });

    // Try to load the project and capture detailed error info
    try {
      await page.evaluate((projectData) => {
        return new Promise((resolve, reject) => {
          console.log('Starting WickFile.fromWickFile...');
          
          if (window.Wick && window.Wick.WickFile) {
            const blob = new Blob([projectData], { type: 'application/json' });
            
            window.Wick.WickFile.fromWickFile(blob, (result: unknown) => {
              console.log('WickFile.fromWickFile callback called with:', typeof result, result);
              
              if (result && window.editor) {
                try {
                  console.log('Calling editor.setupNewProject...');
                  window.editor.setupNewProject(result);
                  console.log('setupNewProject completed successfully');
                  resolve(true);
                } catch (setupError) {
                  console.error('setupNewProject failed:', setupError);
                  reject(setupError);
                }
              } else {
                console.error('Failed to load project via WickFile - result:', result);
                reject(new Error('Failed to load project'));
              }
            });
          } else {
            console.error('Wick.WickFile not available');
            reject(new Error('Wick.WickFile not available'));
          }
        });
      }, projectData);

      console.log('✅ Project loading completed');
    } catch (error) {
      console.error('❌ Project loading failed:', error);
    }

    // Wait for any async operations
    await page.waitForTimeout(2000);

    // Check project state
    const projectState = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        projectExists: !!window.project,
        hasProject: !!window.project,
        projectName: window.project?.name,
        projectChildren: window.project?.children?.length || 0,
        projectKeys: window.project ? Object.keys(window.project) : [],
        editorProject: !!window.editor?.project,
        editorProjectName: window.editor?.project?.name
      };
    });

    console.log('Final project state:', projectState);

    // Report all console output
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

    console.log('\n=== ALL CONSOLE MESSAGES ===');
    consoleMessages.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg}`);
    });

    // Check if the project actually loaded
    expect(projectState.projectExists).toBe(true);
    console.log('🎉 Debug test completed!');
  });
});








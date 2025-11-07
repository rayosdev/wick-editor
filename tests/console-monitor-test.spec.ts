import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Console Monitor Test', () => {
  test('monitor console output during project loading @headed', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Capture all console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      const message = `${msg.type().toUpperCase()}: ${msg.text()}`;
      consoleMessages.push(message);
      console.log(`[CONSOLE] ${message}`);
    });

    // Step 1: Load project
    console.log('\nStep 1: Loading project...');
    
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    
    try {
      await page.evaluate((projectData) => {
        return new Promise((resolve, reject) => {
          if (window.Wick && window.Wick.WickFile) {
            const blob = new Blob([projectData], { type: 'application/json' });
            window.Wick.WickFile.fromWickFile(blob, (loadedProject) => {
              if (loadedProject && window.editor) {
                console.log('About to call setupNewProject');
                window.editor.setupNewProject(loadedProject);
                console.log('setupNewProject completed');
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
    } catch (error) {
      console.log('Error during project loading:', error);
    }

    // Wait a bit to see console output
    await page.waitForTimeout(3000);

    console.log('\n=== CONSOLE OUTPUT ===');
    consoleMessages.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg}`);
    });
    console.log('======================');

    console.log('\n🎉 Console monitor test completed!');
  });
});




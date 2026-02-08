import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Direct WickFile Test', () => {
  test('test WickFile loader directly @headed', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Test the WickFile loader directly
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    const projectJson = JSON.parse(projectData);

    console.log('Project data:', {
      hasProject: !!projectJson.project,
      projectClassname: projectJson.project?.classname,
      projectChildren: projectJson.project?.children
    });

    // Test WickFile.fromWickFile directly
    const result = await page.evaluate((projectData) => {
      return new Promise((resolve) => {
        console.log('Testing WickFile.fromWickFile directly...');
        
        if (window.Wick && window.Wick.WickFile) {
          const blob = new Blob([projectData], { type: 'application/json' });
          
          window.Wick.WickFile.fromWickFile(blob, (result) => {
            console.log('Direct WickFile callback result:', typeof result, result);
            resolve({
              success: true,
              result: result,
              resultType: typeof result,
              isNull: result === null,
              isUndefined: result === undefined,
              hasClassname: result && result.classname,
              hasChildren: result && result.getChildren && result.getChildren().length
            });
          });
        } else {
          resolve({
            success: false,
            error: 'Wick.WickFile not available'
          });
        }
      });
    }, projectData);

    console.log('Direct WickFile test result:', result);

    // Test Wick.Base directly
    const baseTest = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        baseExists: !!window.Wick?.Base,
        baseImportExists: !!(window.Wick?.Base && window.Wick.Base.import),
        baseFromDataExists: !!(window.Wick?.Base && window.Wick.Base.fromData),
        projectClassExists: !!window.Wick?.Project
      };
    });

    console.log('Wick.Base availability test:', baseTest);

    // Test creating a project directly
    const directProjectTest = await page.evaluate(() => {
      try {
        const project = new window.Wick.Project();
        return {
          success: true,
          project: project,
          hasClassname: project.classname,
          hasChildren: project.getChildren().length
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    console.log('Direct project creation test:', directProjectTest);

    expect(result.success).toBe(true);
    console.log('🎉 Direct WickFile test completed!');
  });
});









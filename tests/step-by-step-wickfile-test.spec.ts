import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Step by Step WickFile Test', () => {
  test('test WickFile loader step by step @headed', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Test WickFile loader step by step
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');

    const result: {
      success: boolean;
      error?: string;
      stack?: string;
      hasClassname?: string;
      hasChildren?: number | null;
    } = await page.evaluate((projectData) => {
      return new Promise<{
        success: boolean;
        error?: string;
        stack?: string;
        hasClassname?: string;
        hasChildren?: number | null;
      }>((resolve) => {
        console.log('Testing WickFile.fromWickFile step by step...');
        
        // Step 1: Check if WickFile exists
        if (!window.Wick || !window.Wick.WickFile) {
          resolve({ success: false, error: 'Wick.WickFile not available' });
          return;
        }
        
        console.log('Step 1: Wick.WickFile is available');
        
        // Step 2: Create blob
        const blob = new Blob([projectData], { type: 'application/json' });
        console.log('Step 2: Blob created, size:', blob.size);
        
        // Step 3: Call WickFile.fromWickFile with detailed error handling
        try {
          window.Wick.WickFile.fromWickFile(blob, (result: unknown) => {
            const wickResult = result as {
              classname?: string;
              getChildren?: () => unknown[];
            } | null | undefined;
            console.log('Step 3: WickFile.fromWickFile callback called');
            console.log('Step 3: Result type:', typeof result);
            console.log('Step 3: Result is null:', result === null);
            console.log('Step 3: Result is undefined:', result === undefined);
            
            if (wickResult) {
              console.log('Step 3: Result has classname:', wickResult.classname);
              console.log('Step 3: Result has children:', wickResult.getChildren ? wickResult.getChildren().length : 'no getChildren method');
            }
            
            resolve({
              success: true,
              hasClassname: wickResult?.classname,
              hasChildren: wickResult && wickResult.getChildren ? wickResult.getChildren().length : null
            });
          });
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          const errorStack = e instanceof Error ? e.stack : undefined;
          console.log('Step 3: Error calling WickFile.fromWickFile:', e);
          resolve({
            success: false,
            error: errorMessage,
            stack: errorStack
          });
        }
      });
    }, projectData);

    console.log('Step by step WickFile test result:', result);

    // Also test Wick.Base.fromData directly
    const fromDataTest = await page.evaluate((projectData) => {
      try {
        const data = JSON.parse(projectData);
        console.log('Testing Wick.Base.fromData directly...');
        
        const project = window.Wick.Base.fromData(data.project, null);
        console.log('Wick.Base.fromData result:', {
          success: true,
          project: project,
          hasClassname: project.classname,
          hasChildren: project.getChildren().length
        });
        
        return {
          success: true,
          project: project,
          hasClassname: project.classname,
          hasChildren: project.getChildren().length
        };
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        const errorStack = e instanceof Error ? e.stack : undefined;
        console.log('Wick.Base.fromData error:', e);
        return {
          success: false,
          error: errorMessage,
          stack: errorStack
        };
      }
    }, projectData);

    console.log('Wick.Base.fromData test result:', fromDataTest);

    expect(result.success).toBe(true);
    console.log('🎉 Step by step WickFile test completed!');
  });
});







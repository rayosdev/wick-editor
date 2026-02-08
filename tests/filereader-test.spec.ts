import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('FileReader Test', () => {
  test('test FileReader directly @headed', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Test FileReader directly
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');

    const result = await page.evaluate((projectData) => {
      return new Promise((resolve) => {
        console.log('Testing FileReader directly...');
        
        const blob = new Blob([projectData], { type: 'application/json' });
        const fr = new FileReader();
        
        fr.onload = function() {
          console.log('FileReader onload called');
          console.log('FileReader result type:', typeof fr.result);
          console.log('FileReader result length:', fr.result ? fr.result.length : 'null');
          
          try {
            const data = JSON.parse(fr.result);
            console.log('Parsed data:', {
              hasProject: !!data.project,
              hasExport: !!data.export,
              projectClassname: data.project?.classname
            });
            
            resolve({
              success: true,
              result: fr.result,
              data: data,
              parsed: true
            });
          } catch (e) {
            console.log('JSON parse error:', e);
            resolve({
              success: false,
              error: e.message,
              result: fr.result
            });
          }
        };
        
        fr.onerror = function(e) {
          console.log('FileReader error:', e);
          resolve({
            success: false,
            error: 'FileReader error',
            event: e
          });
        };
        
        console.log('Starting FileReader.readAsText...');
        fr.readAsText(blob);
      });
    }, projectData);

    console.log('FileReader test result:', result);

    expect(result.success).toBe(true);
    console.log('🎉 FileReader test completed!');
  });
});









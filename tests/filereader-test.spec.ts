import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('FileReader Test', () => {
  test('test FileReader directly @headed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Test FileReader directly
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');

    const result: {
      success: boolean;
      error?: string;
      result?: string | ArrayBuffer | null;
      data?: unknown;
      parsed?: boolean;
      event?: ProgressEvent<FileReader>;
    } = await page.evaluate((projectData) => {
      return new Promise<{
        success: boolean;
        error?: string;
        result?: string | ArrayBuffer | null;
        data?: unknown;
        parsed?: boolean;
        event?: ProgressEvent<FileReader>;
      }>((resolve) => {
        console.log('Testing FileReader directly...');
        
        const blob = new Blob([projectData], { type: 'application/json' });
        const fr = new FileReader();
        
        fr.onload = function() {
          console.log('FileReader onload called');
          const resultValue = fr.result;
          const resultLength =
            typeof resultValue === 'string'
              ? resultValue.length
              : resultValue
                ? resultValue.byteLength
                : 'null';
          console.log('FileReader result type:', typeof resultValue);
          console.log('FileReader result length:', resultLength);
          
          try {
            if (typeof resultValue !== 'string') {
              resolve({
                success: false,
                error: 'Expected FileReader.readAsText() to return a string'
              });
              return;
            }
            const data = JSON.parse(resultValue);
            console.log('Parsed data:', {
              hasProject: !!data.project,
              hasExport: !!data.export,
              projectClassname: data.project?.classname
            });
            
            resolve({
              success: true,
              result: resultValue,
              data: data,
              parsed: true
            });
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.log('JSON parse error:', e);
            resolve({
              success: false,
              error: errorMessage,
              result: resultValue
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







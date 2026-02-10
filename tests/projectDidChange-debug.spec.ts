import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('ProjectDidChange Debug', () => {
  test('debug projectDidChange method calls @headed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Step 1: Monitor projectDidChange calls
    console.log('\nStep 1: Setting up monitoring...');
    
    await page.evaluate(() => {
      if (window.editor && window.editor.projectDidChange) {
        const originalProjectDidChange = window.editor.projectDidChange;
        window.editor.projectDidChange = function(options: unknown) {
          console.log('🔍 projectDidChange called with:', options);
          window.projectDidChangeCallCount = (window.projectDidChangeCallCount || 0) + 1;
          const result = originalProjectDidChange.call(this, options);
          console.log('🔍 projectDidChange completed');
          return result;
        };
      }
      
      if (window.editor && window.editor.setState) {
        const originalSetState = window.editor.setState;
        window.editor.setState = function(newState: unknown, callback?: () => void) {
          console.log('🔍 setState called with:', newState);
          window.setStateCallCount = (window.setStateCallCount || 0) + 1;
          const result = originalSetState.call(this, newState, callback);
          console.log('🔍 setState completed');
          return result;
        };
      }
    });

    // Step 2: Load project
    console.log('\nStep 2: Loading project...');
    
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    
    await page.evaluate((projectData) => {
      return new Promise((resolve, reject) => {
        if (window.Wick && window.Wick.WickFile) {
          const blob = new Blob([projectData], { type: 'application/json' });
          window.Wick.WickFile.fromWickFile(blob, (loadedProject: unknown) => {
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

    // Wait for calls to complete
    await page.waitForTimeout(2000);

    // Step 3: Check call counts
    console.log('\nStep 3: Checking call counts...');
    
    const callCounts = await page.evaluate(() => {
      return {
        projectDidChangeCalls: window.projectDidChangeCallCount || 0,
        setStateCalls: window.setStateCallCount || 0
      };
    });
    
    console.log('Call counts:', callCounts);

    // Step 4: Check if projectDidChange is working
    console.log('\nStep 4: Testing projectDidChange manually...');
    
    const manualTest = await page.evaluate(() => {
      if (window.editor && window.editor.projectDidChange) {
        try {
          console.log('Testing projectDidChange manually...');
          window.editor.projectDidChange({ actionName: "Manual Test" });
          console.log('Manual projectDidChange completed');
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('Manual projectDidChange failed:', error);
          return { success: false, error: errorMessage };
        }
      }
      return { success: false, error: 'No projectDidChange method' };
    });
    
    console.log('Manual test result:', manualTest);

    // Step 5: Check React state after manual call
    console.log('\nStep 5: Checking React state after manual call...');
    
    const reactState = await page.evaluate(() => {
      if (window.editor && window.editor.state) {
        return {
          projectName: window.editor.state.project?.name || 'N/A',
          projectWidth: window.editor.state.project?.width || 'N/A',
          projectHeight: window.editor.state.project?.height || 'N/A',
          projectFramerate: window.editor.state.project?.framerate || 'N/A',
          childrenCount: window.editor.state.project?.children?.length || 0
        };
      }
      return null;
    });
    
    console.log('React state after manual call:', reactState);

    // Step 6: Check if the issue is with project.serialize()
    console.log('\nStep 6: Testing project.serialize()...');
    
    const serializeTest = await page.evaluate(() => {
      if (window.editor && window.editor.project && window.editor.project.serialize) {
        try {
          const serialized = window.editor.project.serialize();
          return {
            success: true,
            name: serialized.name || 'N/A',
            width: serialized.width || 'N/A',
            height: serialized.height || 'N/A',
            framerate: serialized.framerate || 'N/A',
            childrenCount: serialized.children?.length || 0
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          return {
            success: false,
            error: errorMessage
          };
        }
      }
      return { success: false, error: 'No project or serialize method' };
    });
    
    console.log('Serialize test:', serializeTest);

    console.log('\n🎉 ProjectDidChange debug completed!');
  });
});








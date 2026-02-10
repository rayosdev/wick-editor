import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Simple Project Load Debug', () => {
  test('debug project loading step by step @headed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Step 1: Check initial state
    console.log('\nStep 1: Checking initial state...');
    const initialState = await page.evaluate(() => {
      return {
        hasEditor: !!window.editor,
        hasProject: !!window.editor?.project,
        projectName: window.editor?.project?.name || 'N/A',
        projectDidChangeExists: !!window.editor?.projectDidChange,
        setupNewProjectExists: !!window.editor?.setupNewProject
      };
    });
    console.log('Initial state:', initialState);

    // Step 2: Load project and monitor calls
    console.log('\nStep 2: Loading project with monitoring...');
    
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    
    // Add monitoring for projectDidChange calls
    await page.evaluate(() => {
      if (window.editor && window.editor.projectDidChange) {
        const originalProjectDidChange = window.editor.projectDidChange;
        window.editor.projectDidChange = function(options: unknown) {
          console.log('🔍 projectDidChange called with:', options);
          const result = originalProjectDidChange.call(this, options);
          console.log('🔍 projectDidChange completed');
          return result;
        };
      }
    });

    // Add monitoring for setState calls
    await page.evaluate(() => {
      if (window.editor && window.editor.setState) {
        const originalSetState = window.editor.setState;
        window.editor.setState = function(newState: unknown, callback?: () => void) {
          console.log('🔍 setState called with:', newState);
          const result = originalSetState.call(this, newState, callback);
          console.log('🔍 setState completed');
          return result;
        };
      }
    });

    // Load the project
    await page.evaluate((projectData) => {
      return new Promise((resolve, reject) => {
        if (window.Wick && window.Wick.WickFile) {
          const blob = new Blob([projectData], { type: 'application/json' });
          window.Wick.WickFile.fromWickFile(blob, (loadedProject: unknown) => {
            if (loadedProject && window.editor) {
              console.log('🔍 About to call setupNewProject');
              window.editor.setupNewProject(loadedProject);
              console.log('🔍 setupNewProject completed');
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

    // Wait a moment for all calls to complete
    await page.waitForTimeout(2000);

    // Step 3: Check final state
    console.log('\nStep 3: Checking final state...');
    const finalState = await page.evaluate(() => {
      return {
        hasEditor: !!window.editor,
        hasProject: !!window.editor?.project,
        projectName: window.editor?.project?.name || 'N/A',
        projectWidth: window.editor?.project?.width || 'N/A',
        projectHeight: window.editor?.project?.height || 'N/A',
        projectFramerate: window.editor?.project?.framerate || 'N/A',
        childrenCount: window.editor?.project?.children?.length || 0
      };
    });
    console.log('Final state:', finalState);

    // Step 4: Check React state
    console.log('\nStep 4: Checking React state...');
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
    console.log('React state:', reactState);

    // Step 5: Check if project.serialize() works
    console.log('\nStep 5: Testing project.serialize()...');
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

    console.log('\n🎉 Simple project load debug completed!');
  });
});








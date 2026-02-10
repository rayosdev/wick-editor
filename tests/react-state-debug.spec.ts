import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('React State Debug', () => {
  test('debug React state updates when loading project @headed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Get initial React state
    const getReactState = async () => {
      return await page.evaluate(() => {
        // Access the React component state through the editor instance
        if (window.editor && window.editor.state) {
          return {
            projectName: window.editor.state.project?.name || 'N/A',
            projectWidth: window.editor.state.project?.width || 'N/A',
            projectHeight: window.editor.state.project?.height || 'N/A',
            projectFramerate: window.editor.state.project?.framerate || 'N/A',
            childrenCount: window.editor.state.project?.children?.length || 0,
            hasProject: !!window.editor.state.project,
            stateKeys: window.editor.state ? Object.keys(window.editor.state) : []
          };
        }
        return null;
      });
    };

    const initialReactState = await getReactState();
    console.log('Initial React state:', initialReactState);

    // Step 1: Load the timeline-script.wick project
    console.log('\nStep 1: Loading timeline-script.wick project...');
    
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    
    await page.evaluate((projectData) => {
      return new Promise((resolve, reject) => {
        if (window.Wick && window.Wick.WickFile) {
          const blob = new Blob([projectData], { type: 'application/json' });
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

    // Wait for React state to update
    await page.waitForTimeout(2000);

    console.log('✅ Project loaded');

    const finalReactState = await getReactState();
    console.log('Final React state:', finalReactState);

    // Step 2: Check if React state changed
    console.log('\nStep 2: Checking React state changes...');
    
    if (initialReactState && finalReactState) {
      const stateChanged = 
        initialReactState.projectName !== finalReactState.projectName ||
        initialReactState.projectWidth !== finalReactState.projectWidth ||
        initialReactState.projectHeight !== finalReactState.projectHeight ||
        initialReactState.projectFramerate !== finalReactState.projectFramerate ||
        initialReactState.childrenCount !== finalReactState.childrenCount;

      console.log('React state changed:', stateChanged);
      
      if (stateChanged) {
        console.log('✅ React state updated correctly');
      } else {
        console.log('⚠️ React state did not change - this is the problem!');
      }
    }

    // Step 3: Check if the UI elements reflect the React state
    console.log('\nStep 3: Checking UI elements...');
    
    const projectNameElement = page.locator('#project-name-text');
    const isProjectNameVisible = await projectNameElement.isVisible();
    const projectNameText = await projectNameElement.textContent();
    
    console.log('Project name element visible:', isProjectNameVisible);
    console.log('Project name element text:', projectNameText);
    
    // Step 4: Force a React re-render by triggering a state change
    console.log('\nStep 4: Attempting to force React re-render...');
    
    await page.evaluate(() => {
      if (window.editor && window.editor.projectDidChange) {
        // Call projectDidChange to force a re-render
        window.editor.projectDidChange({ actionName: "Force Re-render" });
        console.log('Called projectDidChange to force re-render');
      }
    });

    // Wait for re-render
    await page.waitForTimeout(1000);

    const afterRerenderState = await getReactState();
    console.log('After re-render React state:', afterRerenderState);

    const projectNameAfterRerender = await projectNameElement.textContent();
    console.log('Project name after re-render:', projectNameAfterRerender);

    // Step 5: Check if the issue is with the projectDidChange method
    console.log('\nStep 5: Checking projectDidChange method...');
    
    const projectDidChangeInfo = await page.evaluate(() => {
      if (window.editor && window.editor.projectDidChange) {
        return {
          exists: true,
          isFunction: typeof window.editor.projectDidChange === 'function',
          projectExists: !!window.editor.project,
          projectName: window.editor.project?.name || 'N/A'
        };
      }
      return { exists: false };
    });

    console.log('projectDidChange info:', projectDidChangeInfo);

    // Step 6: Check if the issue is with the setState call
    console.log('\nStep 6: Checking setState call...');
    
    const setStateInfo = await page.evaluate(() => {
      if (window.editor && window.editor.setState) {
        return {
          exists: true,
          isFunction: typeof window.editor.setState === 'function',
          currentState: window.editor.state ? Object.keys(window.editor.state) : []
        };
      }
      return { exists: false };
    });

    console.log('setState info:', setStateInfo);

    // Step 7: Check if the issue is with the project.serialize() call
    console.log('\nStep 7: Checking project.serialize() call...');
    
    const serializeInfo = await page.evaluate(() => {
      if (window.editor && window.editor.project && window.editor.project.serialize) {
        try {
          const serialized = window.editor.project.serialize();
          return {
            exists: true,
            isFunction: typeof window.editor.project.serialize === 'function',
            serializedKeys: Object.keys(serialized),
            serializedName: serialized.name || 'N/A'
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          return {
            exists: true,
            isFunction: typeof window.editor.project.serialize === 'function',
            error: errorMessage
          };
        }
      }
      return { exists: false };
    });

    console.log('serialize info:', serializeInfo);

    console.log('\n🎉 React state debug test completed!');
  });
});








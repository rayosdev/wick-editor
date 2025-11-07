import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('UI Update Debug', () => {
  test('check if UI updates when project is loaded @headed', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Get initial UI state
    const getUIState = async () => {
      return await page.evaluate(() => {
        return {
          projectName: document.querySelector('#project-name-text')?.textContent || 'N/A',
          canvasWidth: document.querySelector('#wick-canvas')?.getAttribute('width') || 'N/A',
          canvasHeight: document.querySelector('#wick-canvas')?.getAttribute('height') || 'N/A',
          timelineVisible: document.querySelector('.editor-canvas-timeline-panel') ? true : false,
          outlinerVisible: document.querySelector('.outliner-body') ? true : false,
          projectTitle: document.title
        };
      });
    };

    const initialUIState = await getUIState();
    console.log('Initial UI state:', initialUIState);

    // Load the project
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');

    console.log('\n=== LOADING PROJECT ===');
    await page.evaluate((projectData) => {
      return new Promise((resolve) => {
        const blob = new Blob([projectData], { type: 'application/json' });
        window.Wick.WickFile.fromWickFile(blob, (project) => {
          if (project && window.editor) {
            window.editor.setupNewProject(project);
            console.log('Project loaded successfully');
            resolve(true);
          } else {
            console.log('Failed to load project');
            resolve(false);
          }
        });
      });
    }, projectData);

    // Wait for UI to update
    await page.waitForTimeout(2000);

    const finalUIState = await getUIState();
    console.log('Final UI state:', finalUIState);

    // Check if UI changed
    const uiChanged = (
      initialUIState.projectName !== finalUIState.projectName ||
      initialUIState.projectTitle !== finalUIState.projectTitle
    );

    console.log('\n=== UI CHANGE ANALYSIS ===');
    console.log('UI changed:', uiChanged);
    console.log('Project name changed:', initialUIState.projectName !== finalUIState.projectName);
    console.log('Title changed:', initialUIState.projectTitle !== finalUIState.projectTitle);

    // Check project state
    const projectState = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        projectExists: !!window.project,
        hasProject: !!window.project,
        projectName: window.project?.name,
        projectWidth: window.project?.width,
        projectHeight: window.project?.height,
        projectFramerate: window.project?.framerate,
        projectChildren: window.project?.getChildren ? window.project.getChildren().length : 0
      };
    });

    console.log('Project state:', projectState);

    // Take a screenshot to see the current state
    await page.screenshot({ path: 'test-results/ui-state-after-load.png' });
    console.log('Screenshot saved to test-results/ui-state-after-load.png');

    // Assertions
    expect(projectState.hasProject).toBe(true);
    expect(projectState.projectName).toBe('My Project');
    expect(projectState.projectWidth).toBe(720);
    expect(projectState.projectHeight).toBe(480);

    console.log('\n🎉 UI update debug test completed!');
  });
});




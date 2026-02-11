import { test, expect } from '@playwright/test';

test.describe('Global Variables Test', () => {
  test('checks global variables and editor state', async ({ page }) => {
    // Navigate to the editor
    await page.goto('/');
    
    // Wait for the editor to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Wait for canvas to be ready
    await expect(page.locator('#canvas-container-wrapper')).toBeVisible();
    
    // Check global variables
    const globalInfo = await page.evaluate(() => {
      return {
        hasWick: typeof window.Wick !== 'undefined',
        hasWickObjectCache: typeof window.WickObjectCache !== 'undefined',
        hasProject: typeof window.project !== 'undefined',
        hasEditor: typeof window.editor !== 'undefined',
        hasWickEditor: typeof window.wickEditor !== 'undefined',
        projectType: typeof window.project,
        editorType: typeof window.editor,
        wickEditorType: typeof window.wickEditor
      };
    });
    console.log('Global variables:', globalInfo);
    
    // Check project details if available
    const projectInfo = await page.evaluate(() => {
      if (window.project) {
        return {
          hasProject: true,
          projectName: window.project.name,
          projectType: typeof window.project,
          hasActiveTimeline: !!window.project.activeTimeline,
          hasActiveFrame: !!window.project.activeFrame,
          hasSelection: !!window.project.selection,
          selectionCount: window.project.selection ? window.project.selection.numObjects : 0,
          activeFrameObjects: window.project.activeFrame ? window.project.activeFrame.objects.length : 0
        };
      }
      return { hasProject: false };
    });
    console.log('Project info:', projectInfo);
    
    // Check editor details if available
    const editorInfo = await page.evaluate(() => {
      if (window.editor) {
        return {
          hasEditor: true,
          editorType: typeof window.editor,
          editorKeys: Object.keys(window.editor),
          hasProject: !!window.editor.project,
          projectFromEditor: window.editor.project ? {
            name: window.editor.project.name,
            hasActiveTimeline: !!window.editor.project.activeTimeline,
            hasActiveFrame: !!window.editor.project.activeFrame
          } : null
        };
      }
      return { hasEditor: false };
    });
    console.log('Editor info:', editorInfo);
    
    // Try to access wickEditor through different paths
    const wickEditorPaths = await page.evaluate(() => {
      const paths = [
        'window.wickEditor',
        'window.editor',
        'window.project',
        'window.editor?.project',
        'window.editor?.wickEditor',
        'window.editor?.editor'
      ];
      
      const results: Record<
        string,
        { exists?: boolean; type?: string; hasProject?: boolean; error?: string }
      > = {};
      paths.forEach(path => {
        try {
          const value = eval(path);
          results[path] = {
            exists: value !== undefined && value !== null,
            type: typeof value,
            hasProject: value && value.project ? true : false
          };
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          results[path] = { error: errorMessage };
        }
      });
      return results;
    });
    console.log('WickEditor paths:', wickEditorPaths);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/global-variables.png', fullPage: true });
    
    expect(true).toBe(true);
  });
});

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Serialize Debug', () => {
  test('debug project serialization @headed', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Load the project
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');

    const result = await page.evaluate((projectData) => {
      return new Promise<{
        success: boolean;
        projectState?: {
          wickExists: boolean;
          projectExists: boolean;
          hasProject: boolean;
          projectName?: string;
          projectWidth?: number;
          projectHeight?: number;
          projectFramerate?: number;
        };
        serializedProject?: {
          name?: string;
          width?: number;
          height?: number;
        } | null;
        reactState?: {
          projectAccessible: boolean;
          projectName?: string;
        };
        error?: string;
      }>((resolve) => {
        const blob = new Blob([projectData], { type: 'application/json' });
        window.Wick.WickFile.fromWickFile(blob, (project: unknown) => {
          if (project && window.editor) {
            console.log('Project loaded, calling setupNewProject...');
            window.editor.setupNewProject(project);
            
            // Wait a bit for the setup to complete
            setTimeout(() => {
              console.log('Checking project state...');
              
              const projectState = {
                wickExists: !!window.Wick,
                projectExists: !!window.project,
                hasProject: !!window.project,
                projectName: window.project?.name,
                projectWidth: window.project?.width,
                projectHeight: window.project?.height,
                projectFramerate: window.project?.framerate
              };
              
              console.log('Project state:', projectState);
              
              // Test serialize method
              let serializedProject = null;
              try {
                serializedProject = window.project.serialize();
                console.log('Serialize successful');
                console.log('Serialized project keys:', Object.keys(serializedProject));
                console.log('Serialized project name:', serializedProject.name);
                console.log('Serialized project width:', serializedProject.width);
                console.log('Serialized project height:', serializedProject.height);
              } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                console.log('Serialize failed:', errorMessage);
              }
              
              // Check React state
              const reactState = {
                // We can't directly access React state from here, but we can check if the project is accessible
                projectAccessible: !!window.project,
                projectName: window.project?.name
              };
              
              console.log('React state check:', reactState);
              
              resolve({
                success: true,
                projectState: projectState,
                serializedProject: serializedProject,
                reactState: reactState
              });
            }, 1000);
          } else {
            resolve({ success: false, error: 'Failed to load project' });
          }
        });
      });
    }, projectData);

    console.log('Serialize debug result:', result);

    // Check if the project name is displayed in the UI
    const uiProjectName = await page.evaluate(() => {
      return document.querySelector('#project-name-text')?.textContent || 'N/A';
    });

    console.log('UI project name:', uiProjectName);

    // Check if the project title is updated
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    // Check if there are any elements that should show the project name
    const projectNameElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const projectNameElements = [];
      
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (!element) {
          continue;
        }
        const text = element.textContent || '';
        if (text.includes('My Project')) {
          projectNameElements.push({
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            textContent: text
          });
        }
      }
      
      return projectNameElements;
    });

    console.log('Elements containing "My Project":', projectNameElements);

    expect(result.success).toBe(true);
    if (!result.projectState) {
      throw new Error('Expected projectState in serialize debug result');
    }
    expect(result.projectState.hasProject).toBe(true);
    expect(result.projectState.projectName).toBe('My Project');

    console.log('\n🎉 Serialize debug test completed!');
  });
});







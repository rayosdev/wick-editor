import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Project State Debug', () => {
  test('debug project state after loading @headed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Step 1: Load project and check state immediately
    console.log('\n=== STEP 1: Loading project and checking state ===');
    
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    
    const projectState = await page.evaluate((projectData) => {
      return new Promise((resolve) => {
        if (window.Wick && window.Wick.WickFile) {
          const blob = new Blob([projectData], { type: 'application/json' });
          window.Wick.WickFile.fromWickFile(blob, (loadedProject: {
            name?: string;
            width?: number;
            height?: number;
            framerate?: number;
            classname?: string;
            uuid?: string;
            children?: unknown[];
          } | null) => {
            if (loadedProject) {
              console.log('🔍 Loaded project state:');
              console.log('- name:', loadedProject.name);
              console.log('- width:', loadedProject.width);
              console.log('- height:', loadedProject.height);
              console.log('- framerate:', loadedProject.framerate);
              console.log('- classname:', loadedProject.classname);
              console.log('- uuid:', loadedProject.uuid);
              console.log('- children count:', loadedProject.children?.length);
              
              // Check if the project has the necessary properties
              console.log('- has name property:', 'name' in loadedProject);
              console.log('- name value:', loadedProject.name);
              console.log('- name type:', typeof loadedProject.name);
              console.log('- name === undefined:', loadedProject.name === undefined);
              console.log('- name === null:', loadedProject.name === null);
              console.log('- name === "":', loadedProject.name === '');
              
              // Check the raw data that was passed to deserialize
              console.log('🔍 Raw project data:');
              const rawData = JSON.parse(projectData);
              console.log('- raw name:', rawData.project.name);
              console.log('- raw width:', rawData.project.width);
              console.log('- raw height:', rawData.project.height);
              console.log('- raw framerate:', rawData.project.framerate);
              
              resolve({
                success: true,
                loadedProject: {
                  name: loadedProject.name,
                  width: loadedProject.width,
                  height: loadedProject.height,
                  framerate: loadedProject.framerate,
                  classname: loadedProject.classname,
                  uuid: loadedProject.uuid,
                  childrenCount: loadedProject.children?.length,
                  hasNameProperty: 'name' in loadedProject,
                  nameType: typeof loadedProject.name,
                  nameIsUndefined: loadedProject.name === undefined,
                  nameIsNull: loadedProject.name === null,
                  nameIsEmpty: loadedProject.name === ''
                },
                rawData: {
                  name: rawData.project.name,
                  width: rawData.project.width,
                  height: rawData.project.height,
                  framerate: rawData.project.framerate
                }
              });
            } else {
              resolve({ success: false, error: 'Failed to load project' });
            }
          });
        } else {
          resolve({ success: false, error: 'Wick.WickFile not available' });
        }
      });
    }, projectData);

    console.log('Project state result:', projectState);

    // Step 2: Check what happens when we call setupNewProject
    console.log('\n=== STEP 2: Testing setupNewProject ===');
    
    const setupResult = await page.evaluate((projectData) => {
      return new Promise((resolve) => {
        if (window.Wick && window.Wick.WickFile) {
          const blob = new Blob([projectData], { type: 'application/json' });
          window.Wick.WickFile.fromWickFile(blob, (loadedProject: {
            name?: string;
            width?: number;
            height?: number;
            framerate?: number;
          } | null) => {
            if (loadedProject && window.editor) {
              console.log('🔍 Before setupNewProject:');
              console.log('- editor.project.name:', window.editor.project?.name);
              console.log('- loadedProject.name:', loadedProject.name);
              
              // Call setupNewProject
              window.editor.setupNewProject(loadedProject);
              
              console.log('🔍 After setupNewProject:');
              console.log('- editor.project.name:', window.editor.project?.name);
              console.log('- editor.project.width:', window.editor.project?.width);
              console.log('- editor.project.height:', window.editor.project?.height);
              console.log('- editor.project.framerate:', window.editor.project?.framerate);
              
              // Test serialize
              try {
                const serialized = window.editor.project.serialize();
                console.log('🔍 Serialized project:');
                console.log('- name:', serialized.name);
                console.log('- width:', serialized.width);
                console.log('- height:', serialized.height);
                console.log('- framerate:', serialized.framerate);
                
                resolve({
                  success: true,
                  beforeSetup: {
                    editorProjectName: window.editor.project?.name,
                    loadedProjectName: loadedProject.name
                  },
                  afterSetup: {
                    editorProjectName: window.editor.project?.name,
                    editorProjectWidth: window.editor.project?.width,
                    editorProjectHeight: window.editor.project?.height,
                    editorProjectFramerate: window.editor.project?.framerate
                  },
                  serialized: {
                    name: serialized.name,
                    width: serialized.width,
                    height: serialized.height,
                    framerate: serialized.framerate
                  }
                });
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error('❌ Error serializing project:', error);
                resolve({ success: false, error: errorMessage });
              }
            } else {
              resolve({ success: false, error: 'Failed to load project or editor not available' });
            }
          });
        } else {
          resolve({ success: false, error: 'Wick.WickFile not available' });
        }
      });
    }, projectData);

    console.log('Setup result:', setupResult);

    console.log('\n🎉 Project state debug completed!');
  });
});







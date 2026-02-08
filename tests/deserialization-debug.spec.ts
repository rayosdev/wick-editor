import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Deserialization Debug', () => {
  test('debug deserialization step by step with detailed logging @headed', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Capture all console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      const message = `${msg.type().toUpperCase()}: ${msg.text()}`;
      consoleMessages.push(message);
      console.log(`[CONSOLE] ${message}`);
    });

    // Step 1: Load and examine the raw project data
    console.log('\n=== STEP 1: Examining raw project data ===');
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    const projectJson = JSON.parse(projectData);
    
    console.log('Raw project data structure:');
    console.log('- project.name:', projectJson.project.name);
    console.log('- project.width:', projectJson.project.width);
    console.log('- project.height:', projectJson.project.height);
    console.log('- project.framerate:', projectJson.project.framerate);
    console.log('- project.children count:', projectJson.project.children?.length);
    console.log('- project.focus:', projectJson.project.focus);
    console.log('- project.classname:', projectJson.project.classname);

    // Step 2: Test WickFile.fromWickFile step by step
    console.log('\n=== STEP 2: Testing WickFile.fromWickFile ===');
    
    const wickFileTest = await page.evaluate((projectData) => {
      console.log('🔍 Starting WickFile.fromWickFile test...');
      
      if (!window.Wick || !window.Wick.WickFile) {
        console.error('❌ Wick.WickFile not available');
        return { success: false, error: 'Wick.WickFile not available' };
      }

      console.log('✅ Wick.WickFile is available');
      
      try {
        const blob = new Blob([projectData], { type: 'application/json' });
        console.log('✅ Blob created, size:', blob.size);
        
        return new Promise((resolve) => {
          console.log('🔍 Calling WickFile.fromWickFile...');
          const startTime = Date.now();
          
          window.Wick.WickFile.fromWickFile(blob, (loadedProject) => {
            const endTime = Date.now();
            console.log(`✅ WickFile.fromWickFile completed in ${endTime - startTime}ms`);
            
            if (loadedProject) {
              console.log('✅ Project loaded successfully');
              console.log('- loadedProject.classname:', loadedProject.classname);
              console.log('- loadedProject.name:', loadedProject.name);
              console.log('- loadedProject.width:', loadedProject.width);
              console.log('- loadedProject.height:', loadedProject.height);
              console.log('- loadedProject.framerate:', loadedProject.framerate);
              console.log('- loadedProject.children count:', loadedProject.children?.length);
              console.log('- loadedProject.focus:', loadedProject.focus);
              console.log('- loadedProject.uuid:', loadedProject.uuid);
              
              // Test if the project has the necessary methods
              console.log('- loadedProject.serialize exists:', typeof loadedProject.serialize === 'function');
              console.log('- loadedProject.view exists:', !!loadedProject.view);
              console.log('- loadedProject.guiElement exists:', !!loadedProject.guiElement);
              
              resolve({
                success: true,
                project: {
                  classname: loadedProject.classname,
                  name: loadedProject.name,
                  width: loadedProject.width,
                  height: loadedProject.height,
                  framerate: loadedProject.framerate,
                  childrenCount: loadedProject.children?.length,
                  focus: loadedProject.focus,
                  uuid: loadedProject.uuid,
                  hasSerialize: typeof loadedProject.serialize === 'function',
                  hasView: !!loadedProject.view,
                  hasGuiElement: !!loadedProject.guiElement
                },
                duration: endTime - startTime
              });
            } else {
              console.error('❌ Project loading failed - loadedProject is null/undefined');
              resolve({ success: false, error: 'Project loading failed' });
            }
          });
        });
      } catch (error) {
        console.error('❌ Error in WickFile.fromWickFile:', error);
        return { success: false, error: error.message };
      }
    }, projectData);

    console.log('WickFile test result:', wickFileTest);

    // Step 3: Test setupNewProject step by step
    console.log('\n=== STEP 3: Testing setupNewProject ===');
    
    const setupNewProjectTest = await page.evaluate((projectData) => {
      console.log('🔍 Starting setupNewProject test...');
      
      if (!window.Wick || !window.Wick.WickFile || !window.editor) {
        console.error('❌ Required objects not available');
        return { success: false, error: 'Required objects not available' };
      }

      return new Promise((resolve) => {
        console.log('🔍 Loading project first...');
        const blob = new Blob([projectData], { type: 'application/json' });
        
        window.Wick.WickFile.fromWickFile(blob, (loadedProject) => {
          if (!loadedProject) {
            console.error('❌ Failed to load project for setupNewProject test');
            resolve({ success: false, error: 'Failed to load project' });
            return;
          }

          console.log('✅ Project loaded, now testing setupNewProject...');
          
          // Store original project for comparison
          const originalProject = window.editor.project;
          console.log('Original project name:', originalProject?.name);
          
          // Monitor projectDidChange calls
          let projectDidChangeCalled = false;
          let setStateCalled = false;
          
          if (window.editor.projectDidChange) {
            const originalProjectDidChange = window.editor.projectDidChange;
            window.editor.projectDidChange = function(options) {
              console.log('🔍 projectDidChange called with:', options);
              projectDidChangeCalled = true;
              const result = originalProjectDidChange.call(this, options);
              console.log('🔍 projectDidChange completed');
              return result;
            };
          }
          
          if (window.editor.setState) {
            const originalSetState = window.editor.setState;
            window.editor.setState = function(newState, callback) {
              console.log('🔍 setState called with project name:', newState?.project?.name);
              setStateCalled = true;
              const result = originalSetState.call(this, newState, callback);
              console.log('🔍 setState completed');
              return result;
            };
          }

          try {
            console.log('🔍 Calling setupNewProject...');
            const startTime = Date.now();
            
            window.editor.setupNewProject(loadedProject);
            
            const endTime = Date.now();
            console.log(`✅ setupNewProject completed in ${endTime - startTime}ms`);
            
            // Check the new project
            const newProject = window.editor.project;
            console.log('New project name:', newProject?.name);
            console.log('New project width:', newProject?.width);
            console.log('New project height:', newProject?.height);
            console.log('New project framerate:', newProject?.framerate);
            console.log('New project children count:', newProject?.children?.length);
            
            // Check React state
            const reactState = window.editor.state;
            console.log('React state project name:', reactState?.project?.name);
            console.log('React state project width:', reactState?.project?.width);
            console.log('React state project height:', reactState?.project?.height);
            console.log('React state project framerate:', reactState?.project?.framerate);
            console.log('React state project children count:', reactState?.project?.children?.length);
            
            resolve({
              success: true,
              projectDidChangeCalled,
              setStateCalled,
              duration: endTime - startTime,
              newProject: {
                name: newProject?.name,
                width: newProject?.width,
                height: newProject?.height,
                framerate: newProject?.framerate,
                childrenCount: newProject?.children?.length
              },
              reactState: {
                name: reactState?.project?.name,
                width: reactState?.project?.width,
                height: reactState?.project?.height,
                framerate: reactState?.project?.framerate,
                childrenCount: reactState?.project?.children?.length
              }
            });
          } catch (error) {
            console.error('❌ Error in setupNewProject:', error);
            resolve({ success: false, error: error.message });
          }
        });
      });
    }, projectData);

    console.log('setupNewProject test result:', setupNewProjectTest);

    // Step 4: Test project.serialize() specifically
    console.log('\n=== STEP 4: Testing project.serialize() ===');
    
    const serializeTest = await page.evaluate(() => {
      console.log('🔍 Testing project.serialize()...');
      
      if (!window.editor || !window.editor.project) {
        console.error('❌ No editor or project available');
        return { success: false, error: 'No editor or project available' };
      }

      if (typeof window.editor.project.serialize !== 'function') {
        console.error('❌ project.serialize is not a function');
        return { success: false, error: 'project.serialize is not a function' };
      }

      try {
        console.log('🔍 Calling project.serialize()...');
        const startTime = Date.now();
        
        const serialized = window.editor.project.serialize();
        
        const endTime = Date.now();
        console.log(`✅ project.serialize() completed in ${endTime - startTime}ms`);
        
        console.log('Serialized project:');
        console.log('- name:', serialized.name);
        console.log('- width:', serialized.width);
        console.log('- height:', serialized.height);
        console.log('- framerate:', serialized.framerate);
        console.log('- children count:', serialized.children?.length);
        console.log('- classname:', serialized.classname);
        console.log('- uuid:', serialized.uuid);
        
        return {
          success: true,
          duration: endTime - startTime,
          serialized: {
            name: serialized.name,
            width: serialized.width,
            height: serialized.height,
            framerate: serialized.framerate,
            childrenCount: serialized.children?.length,
            classname: serialized.classname,
            uuid: serialized.uuid
          }
        };
      } catch (error) {
        console.error('❌ Error in project.serialize():', error);
        return { success: false, error: error.message };
      }
    });

    console.log('Serialize test result:', serializeTest);

    // Step 5: Check UI elements
    console.log('\n=== STEP 5: Checking UI elements ===');
    
    const uiCheck = await page.evaluate(() => {
      console.log('🔍 Checking UI elements...');
      
      const projectNameElement = document.querySelector('#project-name-text');
      const projectNameText = projectNameElement?.textContent;
      
      console.log('Project name element found:', !!projectNameElement);
      console.log('Project name element text:', projectNameText);
      
      return {
        projectNameElementExists: !!projectNameElement,
        projectNameText: projectNameText
      };
    });

    console.log('UI check result:', uiCheck);

    // Step 6: Summary
    console.log('\n=== SUMMARY ===');
    console.log('WickFile loading:', wickFileTest.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('setupNewProject:', setupNewProjectTest.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('projectDidChange called:', setupNewProjectTest.projectDidChangeCalled ? '✅ YES' : '❌ NO');
    console.log('setState called:', setupNewProjectTest.setStateCalled ? '✅ YES' : '❌ NO');
    console.log('project.serialize():', serializeTest.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('UI project name:', uiCheck.projectNameText);

    console.log('\n🎉 Deserialization debug completed!');
  });
});









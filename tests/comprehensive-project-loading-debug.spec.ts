import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Comprehensive Project Loading Debug', () => {
  test('debug project loading with extensive logging @headed', async ({ page }) => {
    // Capture ALL console messages with detailed logging
    const allConsoleMessages: string[] = [];
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const allLogs: string[] = [];

    page.on('console', msg => {
      const timestamp = new Date().toISOString();
      const message = `[${timestamp}] ${msg.type().toUpperCase()}: ${msg.text()}`;
      allConsoleMessages.push(message);
      allLogs.push(message);
      
      if (msg.type() === 'error') {
        allErrors.push(message);
      } else if (msg.type() === 'warning') {
        allWarnings.push(message);
      }
    });

    page.on('pageerror', error => {
      const timestamp = new Date().toISOString();
      const errorMessage = `[${timestamp}] PAGE ERROR: ${error.message}`;
      allErrors.push(errorMessage);
      allConsoleMessages.push(errorMessage);
      allLogs.push(errorMessage);
    });

    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.Wick && window.Wick.Project && window.editor);
    console.log('✅ Page loaded and Wick engine available');

    // Step 1: Analyze the project file
    console.log('\n=== STEP 1: ANALYZING PROJECT FILE ===');
    const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
    const projectData = fs.readFileSync(projectPath, 'utf8');
    const projectJson = JSON.parse(projectData);
    
    console.log('Project file analysis:', {
      fileSize: projectData.length,
      hasProject: !!projectJson.project,
      hasMetadata: !!projectJson.metadata,
      hasExport: !!projectJson.export,
      projectKeys: projectJson.project ? Object.keys(projectJson.project) : [],
      projectChildren: projectJson.project?.children || [],
      projectClassname: projectJson.project?.classname,
      projectName: projectJson.project?.name,
      projectDimensions: projectJson.project ? `${projectJson.project.width}x${projectJson.project.height}` : 'N/A',
      projectFramerate: projectJson.project?.framerate
    });

    // Step 2: Test Wick engine availability
    console.log('\n=== STEP 2: TESTING WICK ENGINE AVAILABILITY ===');
    const wickAvailability = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        wickFileExists: !!(window.Wick && window.Wick.WickFile),
        wickBaseExists: !!(window.Wick && window.Wick.Base),
        wickProjectExists: !!(window.Wick && window.Wick.Project),
        wickColorExists: !!(window.Wick && window.Wick.Color),
        editorExists: !!window.editor,
        editorSetupNewProjectExists: !!(window.editor && window.editor.setupNewProject),
        objectCacheExists: !!(window.Wick && window.Wick.ObjectCache)
      };
    });
    console.log('Wick engine availability:', wickAvailability);

    // Step 3: Test FileReader directly
    console.log('\n=== STEP 3: TESTING FILEREADER ===');
    const fileReaderTest = await page.evaluate((projectData) => {
      return new Promise((resolve) => {
        console.log('Testing FileReader...');
        const blob = new Blob([projectData], { type: 'application/json' });
        const fr = new FileReader();
        
        fr.onload = function() {
          console.log('FileReader onload triggered');
          console.log('FileReader result type:', typeof fr.result);
          console.log('FileReader result length:', fr.result ? fr.result.length : 'null');
          
          try {
            const data = JSON.parse(fr.result);
            console.log('FileReader JSON parse successful');
            resolve({
              success: true,
              resultType: typeof fr.result,
              resultLength: fr.result ? fr.result.length : 0,
              parsedData: {
                hasProject: !!data.project,
                hasExport: !!data.export,
                projectKeys: data.project ? Object.keys(data.project) : []
              }
            });
          } catch (e) {
            console.log('FileReader JSON parse failed:', e.message);
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
    console.log('FileReader test result:', fileReaderTest);

    // Step 4: Test WickFile.fromWickFile with detailed debugging
    console.log('\n=== STEP 4: TESTING WICKFILE.FROMWICKFILE ===');
    const wickFileTest = await page.evaluate((projectData) => {
      return new Promise((resolve) => {
        console.log('Starting WickFile.fromWickFile test...');
        
        if (!window.Wick || !window.Wick.WickFile) {
          console.log('Wick.WickFile not available');
          resolve({ success: false, error: 'Wick.WickFile not available' });
          return;
        }
        
        console.log('Wick.WickFile is available');
        const blob = new Blob([projectData], { type: 'application/json' });
        console.log('Blob created, size:', blob.size);
        
        try {
          window.Wick.WickFile.fromWickFile(blob, (result) => {
            console.log('WickFile.fromWickFile callback executed');
            console.log('Callback result type:', typeof result);
            console.log('Callback result is null:', result === null);
            console.log('Callback result is undefined:', result === undefined);
            
            if (result) {
              console.log('Result has classname:', result.classname);
              console.log('Result has name:', result.name);
              console.log('Result has width:', result.width);
              console.log('Result has height:', result.height);
              console.log('Result has framerate:', result.framerate);
              console.log('Result has children:', result.getChildren ? result.getChildren().length : 'no getChildren method');
              console.log('Result has focus:', result._focus);
              console.log('Result focus type:', typeof result._focus);
            }
            
            resolve({
              success: true,
              result: result,
              resultType: typeof result,
              isNull: result === null,
              isUndefined: result === undefined,
              hasClassname: result && result.classname,
              hasName: result && result.name,
              hasWidth: result && result.width,
              hasHeight: result && result.height,
              hasFramerate: result && result.framerate,
              hasChildren: result && result.getChildren ? result.getChildren().length : null,
              focus: result && result._focus
            });
          });
        } catch (e) {
          console.log('Error calling WickFile.fromWickFile:', e.message);
          resolve({
            success: false,
            error: e.message,
            stack: e.stack
          });
        }
      });
    }, projectData);
    console.log('WickFile test result:', wickFileTest);

    // Step 5: Test editor.setupNewProject with detailed debugging
    console.log('\n=== STEP 5: TESTING EDITOR.SETUPNEWPROJECT ===');
    const setupNewProjectTest = await page.evaluate((projectData) => {
      return new Promise((resolve) => {
        console.log('Starting editor.setupNewProject test...');
        
        if (!window.Wick || !window.Wick.WickFile || !window.editor) {
          console.log('Required objects not available');
          resolve({ success: false, error: 'Required objects not available' });
          return;
        }
        
        const blob = new Blob([projectData], { type: 'application/json' });
        
        window.Wick.WickFile.fromWickFile(blob, (project) => {
          console.log('WickFile callback received project:', project);
          
          if (!project) {
            console.log('No project received from WickFile');
            resolve({ success: false, error: 'No project received from WickFile' });
            return;
          }
          
          try {
            console.log('Calling editor.setupNewProject...');
            console.log('Project before setup:', {
              name: project.name,
              width: project.width,
              height: project.height,
              framerate: project.framerate,
              focus: project._focus,
              children: project.getChildren ? project.getChildren().length : 'no getChildren'
            });
            
            window.editor.setupNewProject(project);
            
            console.log('setupNewProject completed successfully');
            
            // Check project state after setup
            const projectState = {
              wickExists: !!window.Wick,
              projectExists: !!window.project,
              hasProject: !!window.project,
              projectName: window.project?.name,
              projectWidth: window.project?.width,
              projectHeight: window.project?.height,
              projectFramerate: window.project?.framerate,
              projectChildren: window.project?.getChildren ? window.project.getChildren().length : 0,
              projectFocus: window.project?._focus,
              editorProject: !!window.editor?.project,
              editorProjectName: window.editor?.project?.name
            };
            
            console.log('Project state after setup:', projectState);
            
            resolve({
              success: true,
              projectState: projectState
            });
          } catch (setupError) {
            console.log('setupNewProject failed:', setupError.message);
            console.log('setupNewProject error stack:', setupError.stack);
            resolve({
              success: false,
              error: setupError.message,
              stack: setupError.stack
            });
          }
        });
      });
    }, projectData);
    console.log('setupNewProject test result:', setupNewProjectTest);

    // Step 6: Check final project state
    console.log('\n=== STEP 6: FINAL PROJECT STATE ===');
    const finalProjectState = await page.evaluate(() => {
      return {
        wickExists: !!window.Wick,
        projectExists: !!window.project,
        hasProject: !!window.project,
        projectName: window.project?.name,
        projectWidth: window.project?.width,
        projectHeight: window.project?.height,
        projectFramerate: window.project?.framerate,
        projectChildren: window.project?.getChildren ? window.project.getChildren().length : 0,
        projectFocus: window.project?._focus,
        editorProject: !!window.editor?.project,
        editorProjectName: window.editor?.project?.name,
        projectKeys: window.project ? Object.keys(window.project) : []
      };
    });
    console.log('Final project state:', finalProjectState);

    // Step 7: Report all console output
    console.log('\n=== STEP 7: CONSOLE OUTPUT ANALYSIS ===');
    console.log(`Total console messages: ${allConsoleMessages.length}`);
    console.log(`Total errors: ${allErrors.length}`);
    console.log(`Total warnings: ${allWarnings.length}`);
    console.log(`Total logs: ${allLogs.length}`);

    if (allErrors.length > 0) {
      console.log('\n=== ALL ERRORS ===');
      allErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (allWarnings.length > 0) {
      console.log('\n=== ALL WARNINGS ===');
      allWarnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    console.log('\n=== ALL CONSOLE MESSAGES ===');
    allConsoleMessages.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg}`);
    });

    // Step 8: Check for critical errors
    console.log('\n=== STEP 8: ERROR ANALYSIS ===');
    const criticalErrors = allErrors.filter(error => 
      !error.includes('Ignoring Event: localhost') &&
      !error.includes('worker-javascript.js') &&
      !error.includes('undefined on line undefined')
    );
    
    console.log(`Critical errors found: ${criticalErrors.length}`);
    if (criticalErrors.length > 0) {
      console.log('Critical errors:');
      criticalErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // Assertions
    expect(wickAvailability.wickExists).toBe(true);
    expect(wickAvailability.wickFileExists).toBe(true);
    expect(wickAvailability.editorExists).toBe(true);
    
    if (setupNewProjectTest.success) {
      expect(setupNewProjectTest.projectState.hasProject).toBe(true);
      expect(setupNewProjectTest.projectState.projectName).toBe('My Project');
    }

    console.log('\n🎉 Comprehensive project loading debug test completed!');
  });
});



